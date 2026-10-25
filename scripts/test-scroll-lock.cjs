/* Exercises the real hook/coordinator in memory with a minimal effect runner. */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const assert = require("node:assert/strict");

const filename = path.join(__dirname, "../src/lib/use-scroll-lock.ts");
const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  fileName: filename,
});
const styles = new Map([["overflow", { value: "clip", priority: "important" }]]);
const style = {
  getPropertyValue: (name) => styles.get(name)?.value ?? "",
  getPropertyPriority: (name) => styles.get(name)?.priority ?? "",
  setProperty: (name, value, priority = "") => styles.set(name, { value, priority }),
  removeProperty: (name) => styles.delete(name),
};
const cleanups = [];
const moduleObject = { exports: {} };
vm.runInNewContext(output.outputText, {
  module: moduleObject,
  exports: moduleObject.exports,
  document: { documentElement: { style } },
  require(id) {
    assert.equal(id, "react");
    return { useRef: (value) => ({ current: value }), useEffect: (effect) => cleanups.push(effect()) };
  },
}, { filename });
const { useScrollLock, isPageScrollLocked, registerScrollLockRuntime } = moduleObject.exports;

function createLenis(stopped = false) {
  return {
    isStopped: stopped,
    starts: 0,
    start() { this.isStopped = false; this.starts++; },
    stop() { this.isStopped = true; },
  };
}

let lenis = createLenis();
let unregister = registerScrollLockRuntime(lenis);
useScrollLock(true);
const releaseFirst = cleanups.pop();
useScrollLock(true);
const releaseSecond = cleanups.pop();
assert.equal(isPageScrollLocked(), true);
assert.equal(style.getPropertyValue("overflow"), "hidden");
releaseFirst();
assert.equal(lenis.isStopped, true, "the second owner must keep Lenis stopped");
assert.equal(style.getPropertyValue("overflow"), "hidden");
releaseSecond();
assert.equal(lenis.starts, 1);
assert.equal(style.getPropertyValue("overflow"), "clip");
assert.equal(style.getPropertyPriority("overflow"), "important");
releaseSecond();
assert.equal(lenis.starts, 1, "repeated cleanup must be harmless");
unregister();

lenis = createLenis(true);
unregister = registerScrollLockRuntime(lenis);
useScrollLock(true);
cleanups.pop()();
assert.equal(lenis.starts, 0, "a pre-existing external stop must be preserved");
assert.equal(lenis.isStopped, true);
unregister();

useScrollLock(true);
const releaseLate = cleanups.pop();
lenis = createLenis();
unregister = registerScrollLockRuntime(lenis);
assert.equal(lenis.isStopped, true, "late hydration must respect an existing native lock");
unregister();
unregister = registerScrollLockRuntime(lenis);
releaseLate();
assert.equal(lenis.starts, 1, "registration replay must preserve ownership of the stop");
unregister();

useScrollLock(true);
const releaseBeforeRuntime = cleanups.pop();
lenis = createLenis();
unregister = registerScrollLockRuntime(lenis);
unregister();
releaseBeforeRuntime();
assert.equal(lenis.starts, 0, "an unregistered/destroyed runtime must not be restarted");
assert.equal(isPageScrollLocked(), false);

console.log("Scroll locks: nested owners, original overflow priority, external stop, late registration, replay and cleanup passed.");
