/* Runs the actual TypeScript module in memory; no test runtime dependency needed. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const filename = path.join(__dirname, "../src/lib/scrollytelling.ts");
const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  fileName: filename,
});
const moduleObject = { exports: {} };
vm.runInNewContext(output.outputText, { exports: moduleObject.exports, module: moduleObject }, { filename });
const { STORY_SETTINGS, clamp, smootherstep, getStoryFrame, getActiveChapter, getMagneticChapter, getSettledChapter } = moduleObject.exports;

function near(actual, expected, epsilon = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} differs from ${expected}`);
}

assert.equal(clamp(-4), 0);
assert.equal(clamp(4), 1);
assert.equal(clamp(NaN), 0);
assert.equal(clamp(Infinity), 1);
assert.equal(clamp(-Infinity), 0);
assert.equal(clamp(18, 10, 20), 18);
near(smootherstep(0), 0);
near(smootherstep(1), 1);
near(smootherstep(0.5), 0.5);
assert.ok(smootherstep(1e-4) < 1e-10, "entry velocity should approach zero");
assert.ok(1 - smootherstep(1 - 1e-4) < 1e-10, "exit velocity should approach zero");

// Test multiple narrative lengths, fast/reverse scroll, and every transition.
for (const count of [1, 2, 3, 7]) {
  for (let sample = 0; sample <= 1000; sample++) {
    const progress = sample / 1000;
    let opacityTotal = 0;
    for (let index = 0; index < count; index++) {
      const frame = getStoryFrame(progress, index, count);
      for (const value of Object.values(frame)) assert.ok(Number.isFinite(value));
      assert.ok(frame.opacity >= 0 && frame.opacity <= 1);
      assert.ok(Math.abs(frame.y) <= 18);
      assert.ok(frame.z >= -100 && frame.z <= 0);
      assert.ok(Math.abs(frame.rotateX) <= 5);
      assert.ok(frame.scale >= 0.96 && frame.scale <= 1);
      opacityTotal += frame.opacity;
      const reversed = getStoryFrame(1 - progress, count - 1 - index, count);
      near(frame.opacity, reversed.opacity);
      near(frame.y, -reversed.y);
      near(frame.z, reversed.z);
      near(frame.rotateX, -reversed.rotateX);
      near(frame.scale, reversed.scale);
    }
    near(opacityTotal, 1, 1e-9);
    assert.ok(getActiveChapter(progress, count) >= 0);
    assert.ok(getActiveChapter(progress, count) < count);
  }
}

const count = 3;
const halfHold = STORY_SETTINGS.holdRatio / 2;
for (let index = 0; index < count; index++) {
  for (const delta of [-halfHold, 0, halfHold]) {
    const frame = getStoryFrame((index + delta) / (count - 1), index, count);
    near(frame.opacity, 1);
    near(frame.y, 0);
    near(frame.z, 0);
    near(frame.scale, 1);
  }
}

// Curves stay continuous at plateau edges, chapter midpoint, and transition end.
for (const position of [halfHold, 0.5, 1 - halfHold, 1, 1 + halfHold]) {
  const before = getStoryFrame((position - 1e-7) / 2, 1, 3);
  const after = getStoryFrame((position + 1e-7) / 2, 1, 3);
  for (const key of Object.keys(before)) near(before[key], after[key], 1e-4);
}

near(getStoryFrame(-1, 0, 3).opacity, 1);
near(getStoryFrame(2, 2, 3).opacity, 1);
assert.equal(getStoryFrame(0, -1, 3).opacity, 0);
assert.equal(getStoryFrame(0, 3, 3).opacity, 0);
assert.equal(getStoryFrame(0, 0, 0).opacity, 0);
assert.equal(getStoryFrame(0, 0, NaN).opacity, 0);
assert.equal(getStoryFrame(0, NaN, 3).opacity, 0);
assert.equal(getActiveChapter(0.24, 3), 0);
assert.equal(getActiveChapter(0.26, 3), 1);
assert.equal(getActiveChapter(NaN, 3), 0);
assert.equal(getMagneticChapter(0, 3), 0);
assert.equal(getMagneticChapter(0.5, 3), 1);
assert.equal(getMagneticChapter(1, 3), 2);
assert.equal(getMagneticChapter(0.1, 3), 0);
assert.equal(getMagneticChapter(0.25, 3), null);
assert.equal(getMagneticChapter(0.37, 3), null);
assert.equal(getMagneticChapter(0.39, 3), 1);
assert.equal(getMagneticChapter(0.45, 3, 0.05), null);
assert.equal(getMagneticChapter(0.5, 0), null);
assert.equal(getMagneticChapter(0.9, 1), 0);

// Deliberate gestures complete in their direction after leaving the plateau.
// A small overshoot past a chapter center must still settle on that chapter.
const totalTravel = STORY_SETTINGS.stepPx * 2;
for (const [pixels, expected] of [[100, 1], [310, 1], [400, 1], [450, 2]]) {
  assert.equal(getSettledChapter(pixels / totalTravel, 0, 3), expected, `down ${pixels}px`);
  assert.equal(getSettledChapter(1 - pixels / totalTravel, 1, 3), 2 - expected, `up ${pixels}px`);
}
for (const pixels of [0, 1, 35, 70, 71]) {
  assert.equal(getSettledChapter(pixels / totalTravel, 0, 3), 0, `start jitter ${pixels}px`);
  assert.equal(getSettledChapter(1 - pixels / totalTravel, 1, 3), 2, `end jitter ${pixels}px`);
  assert.equal(getSettledChapter(0.5 + pixels / totalTravel, 0.5, 3), 1, `middle jitter ${pixels}px`);
}
assert.equal(getSettledChapter(0.5 + 100 / totalTravel, 0.5, 3), 2);
assert.equal(getSettledChapter(0.5 - 100 / totalTravel, 0.5, 3), 0);
assert.equal(getSettledChapter(0.26, 0.25, 3), null, "jitter outside a local magnet stays put");
assert.equal(getSettledChapter(0, 0, 3), 0);
assert.equal(getSettledChapter(1, 1, 3), 2);
assert.equal(getSettledChapter(1, 0, 3), 2);
assert.equal(getSettledChapter(0, 1, 3), 0);
assert.equal(getSettledChapter(1, 0, 1), 0);
assert.equal(getSettledChapter(0, 1, 1), 0);
assert.equal(getSettledChapter(0.5, 0, 0), null);
assert.equal(getSettledChapter(NaN, NaN, 3), 0);
assert.equal(getSettledChapter(Infinity, -Infinity, 3), 2);

console.log("Scrollytelling math: bounds, continuity, plateaus, crossfade, reversal, magnets and directional settling passed.");
