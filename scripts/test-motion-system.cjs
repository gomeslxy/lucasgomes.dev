/* Tests actual choreography and director lifecycle; no browser benchmark implied. */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const assert = require("node:assert/strict");

function load(relative, scope = {}) {
  const filename = path.join(__dirname, "..", relative);
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    fileName: filename,
  });
  const moduleObject = { exports: {} };
  vm.runInNewContext(output.outputText, { ...scope, module: moduleObject, exports: moduleObject.exports }, { filename });
  return moduleObject.exports;
}

const curves = load("src/lib/motion-curves.ts");
const { unit, quintic, sceneProgress, revealPose, bidirectionalSceneProgress } = curves;
const patterns = ["heading", "meta", "body", "depth", "row"];
const near = (a, b, tolerance = 1e-9) => assert.ok(Math.abs(a - b) <= tolerance, `${a} differs from ${b}`);

assert.equal(unit(-1), 0);
assert.equal(unit(2), 1);
assert.equal(unit(NaN), 0);
near(quintic(0), 0);
near(quintic(1), 1);
near(quintic(0.5), 0.5);
assert.ok(quintic(0.0001) < 1e-10, "the curve must enter with near-zero velocity");
assert.ok(1 - quintic(0.9999) < 1e-10, "the curve must settle with near-zero velocity");
for (const viewport of [640, 720, 900, 1440]) {
  const top = 2000;
  near(sceneProgress(top - viewport * 0.94, top, viewport), 0);
  near(sceneProgress(top - viewport * 0.5, top, viewport), 1);
  let previous = -1;
  for (let scroll = 0; scroll <= 2500; scroll += 5) {
    const progress = sceneProgress(scroll, top, viewport);
    assert.ok(progress >= previous && progress >= 0 && progress <= 1);
    previous = progress;
  }
}
for (const pattern of patterns) {
  for (const delay of [0, 0.12, 0.3]) {
    let previousOpacity = -1;
    for (let index = 0; index <= 1000; index++) {
      const progress = index / 1000;
      const pose = revealPose(progress, pattern, delay);
      assert.equal(Object.keys(pose).sort().join(","), "opacity,transform");
      assert.ok(pose.opacity >= -1e-12 && pose.opacity <= 1 + 1e-12 && pose.opacity >= previousOpacity - 1e-12);
      assert.ok(!/NaN|Infinity|blur|filter|clip-path|width|height|margin/.test(pose.transform));
      assert.equal(pose.transform, revealPose(progress, pattern, delay).transform, "scrub must have no accumulated state");
      previousOpacity = pose.opacity;
    }
    near(revealPose(1, pattern, delay).opacity, 1);
  }
}
assert.notEqual(revealPose(0.4, "heading").transform, revealPose(0.4, "row").transform);
assert.notEqual(revealPose(0.4, "body").transform, revealPose(0.4, "depth").transform);

function events() {
  const listeners = new Map();
  return {
    addEventListener(name, callback) {
      const callbacks = listeners.get(name) ?? new Set();
      callbacks.add(callback); listeners.set(name, callbacks);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    emit(name) { for (const callback of listeners.get(name) ?? []) callback(); },
    count(name) { return listeners.get(name)?.size ?? 0; },
    total() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
  };
}
const page = { ...events(), scrollY: 0, innerHeight: 1000 };
const documentMock = { ...events(), hidden: false, body: {}, fonts: { ready: Promise.resolve() } };
const readQueue = new Set();
const updateQueue = new Set();
const frame = { read: (callback) => readQueue.add(callback), update: (callback) => updateQueue.add(callback) };
function cancelFrame(callback) { readQueue.delete(callback); updateQueue.delete(callback); }
function drain() {
  for (const queue of [readQueue, updateQueue]) {
    const callbacks = [...queue]; queue.clear(); callbacks.forEach((callback) => callback());
  }
}
const intersections = [];
const resizes = [];
class IntersectionMock {
  constructor(callback) { this.callback = callback; this.targets = new Set(); intersections.push(this); }
  observe(target) { this.targets.add(target); }
  unobserve(target) { this.targets.delete(target); }
  disconnect() { this.targets.clear(); this.disconnected = true; }
  emit(target, visible) { this.callback([{ target, isIntersecting: visible }]); }
}
class ResizeMock {
  constructor(callback) { this.callback = callback; this.targets = new Set(); resizes.push(this); }
  observe(target) { this.targets.add(target); }
  unobserve(target) { this.targets.delete(target); }
  disconnect() { this.targets.clear(); this.disconnected = true; }
}
const directorModule = load("src/components/motion/scroll-director.tsx", {
  window: page,
  document: documentMock,
  IntersectionObserver: IntersectionMock,
  ResizeObserver: ResizeMock,
  require(id) {
    if (id === "@/lib/motion-curves") return curves;
    if (id === "motion/react") return { frame, cancelFrame };
    if (id === "react") return { createContext: () => ({}) };
    if (id === "react/jsx-runtime" || id === "lenis/react" || id === "@/lib/use-animation-policy") return {};
    throw new Error(`Unexpected import: ${id}`);
  },
});
const { ScrollDirector } = directorModule;
function value() { return { current: 1, writes: 0, set(next) { this.current = next; this.writes++; } }; }
function element(top, height = 100) {
  return { reads: 0, getBoundingClientRect() { this.reads++; return { top: top - page.scrollY, bottom: top - page.scrollY + height }; } };
}

const director = new ScrollDirector();
const target = element(1400);
const first = value();
const unregisterFirst = director.register(target, first, {});
let stop = director.start();
drain();
assert.equal(first.current, 0, "below-fold content may be prepared after hydration");
page.scrollY = 400;
page.emit("scroll");
intersections.at(-1).emit(target, true);
drain();
// Register another consumer while the anchor is inside the observer margin,
// but still below the visible viewport (so the SSR visibility latch is clear).
const second = value();
const unregisterSecond = director.register(target, second, {});
drain();
const measuredReads = target.reads;
page.scrollY = 700;
page.emit("scroll");
drain();
near(first.current, sceneProgress(700, 1400, 1000));
near(second.current, first.current);
assert.equal(target.reads, measuredReads, "normal scroll must use cached geometry");

// Multiple consumers sharing one stationary anchor must all receive the scrub.
page.scrollY = 760;
page.emit("scroll");
drain();
near(second.current, first.current);
unregisterFirst();
assert.ok(intersections.at(-1).targets.has(target), "one consumer must not detach another consumer's observer");

intersections.at(-1).emit(target, false);
const inactiveValue = second.current;
page.scrollY = 800;
page.emit("scroll");
drain();
assert.equal(second.current, inactiveValue, "offscreen scenes must not get continuous writes");

documentMock.hidden = true;
documentMock.emit("visibilitychange");
page.scrollY = 900;
page.emit("scroll");
drain();
assert.equal(second.current, inactiveValue, "hidden documents must suspend updates");
documentMock.hidden = false;
documentMock.emit("visibilitychange");
drain();
near(second.current, sceneProgress(900, 1400, 1000));

unregisterSecond();
assert.ok(!intersections.at(-1).targets.has(target));
stop();
assert.equal(page.total(), 0);
assert.equal(documentMock.total(), 0);
assert.equal(readQueue.size + updateQueue.size, 0);
assert.ok(intersections.every((observer) => observer.disconnected));
assert.ok(resizes.every((observer) => observer.disconnected));

// Switching to Lenis must leave one scroll source and clean that source on stop.
const scrollCallbacks = new Set();
const lenis = { scroll: 0, on: (_name, callback) => scrollCallbacks.add(callback), off: (_name, callback) => scrollCallbacks.delete(callback) };
stop = director.start(lenis);
drain();
assert.equal(page.count("scroll"), 0);
assert.equal(scrollCallbacks.size, 1);
stop();
assert.equal(scrollCallbacks.size, 0);
assert.equal(page.total() + documentMock.total(), 0);

// Content already visible in the server render must never hide during setup.
page.scrollY = 0;
const visibleDirector = new ScrollDirector();
const visibleValue = value();
const visibleTarget = element(300);
const unregisterVisible = visibleDirector.register(visibleTarget, visibleValue, {});
stop = visibleDirector.start();
drain();
assert.equal(visibleValue.current, 1);
intersections.at(-1).emit(visibleTarget, true);
page.scrollY = 20;
page.emit("scroll");
drain();
assert.equal(visibleValue.current, 1, "initially visible content must remain settled");
unregisterVisible();
stop();

// Bidirectional math lifecycle verification:
// Downward scroll: enters from bottom (0 -> 1), plateau in viewport (1), exits at top (1 -> 0).
const testTop = 2000;
const testHeight = 150;
const testVp = 1000;
// Below viewport (scroll = 500): 0
assert.equal(bidirectionalSceneProgress(500, testTop, testHeight, testVp), 0);
// Entering from bottom (scroll = 1200): between 0 and 1
const enterP = bidirectionalSceneProgress(1200, testTop, testHeight, testVp);
assert.ok(enterP > 0 && enterP < 1, "should be in enter phase");
// Reading zone (scroll = 1600): fully visible
assert.equal(bidirectionalSceneProgress(1600, testTop, testHeight, testVp), 1, "should be settled in reading zone");
// Exiting top (scroll = 2100): exiting
const exitP = bidirectionalSceneProgress(2100, testTop, testHeight, testVp);
assert.ok(exitP > 0 && exitP < 1, "should be in exit phase");
// Past top (scroll = 2300): 0
assert.equal(bidirectionalSceneProgress(2300, testTop, testHeight, testVp), 0, "should be fully exited above");

// Upward scroll reversal:
// Re-entering from top (scrolling up from 2300 to 2100): smoothly rises from 0 to exitP
near(bidirectionalSceneProgress(2100, testTop, testHeight, testVp), exitP);
// Reading zone on return (scroll = 1600): returns to 1
assert.equal(bidirectionalSceneProgress(1600, testTop, testHeight, testVp), 1, "re-entering reading zone must restore 1");
// Exiting bottom on return (scroll = 1200): smoothly returns to enterP
near(bidirectionalSceneProgress(1200, testTop, testHeight, testVp), enterP);
// Below viewport on return (scroll = 500): returns to 0
assert.equal(bidirectionalSceneProgress(500, testTop, testHeight, testVp), 0, "scrolling past bottom must return to 0");

// Director bidirectional re-entry test:
page.scrollY = 0;
const bidiDirector = new ScrollDirector();
const bidiValue = value();
const bidiTarget = element(1400, 100);
const unregisterBidi = bidiDirector.register(bidiTarget, bidiValue, {});
const bidiStop = bidiDirector.start();
drain();
assert.equal(bidiValue.current, 0, "initial below-fold is 0");
// Scroll down into view
page.scrollY = 900;
page.emit("scroll");
intersections.at(-1).emit(bidiTarget, true);
drain();
near(bidiValue.current, 1);
// Scroll down past it (leaves top)
page.scrollY = 1800;
page.emit("scroll");
drain();
near(bidiValue.current, 0);
// Scroll back up into view (re-enters from top!)
page.scrollY = 900;
page.emit("scroll");
drain();
near(bidiValue.current, 1);
// Scroll back up above it (leaves bottom)
page.scrollY = 0;
page.emit("scroll");
drain();
near(bidiValue.current, 0);
// Scroll down again (re-enters from bottom!)
page.scrollY = 900;
page.emit("scroll");
drain();
near(bidiValue.current, 1);
unregisterBidi();
bidiStop();

console.log("Motion system: bounded curves, contextual poses, SSR visibility, cached reads, offscreen suspension, shared anchors, bidirectional lifecycle, and source cleanup passed.");
