/* Guard the actual route dependency graph, including lazy imports and styles. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const postcss = require("postcss");
const root = path.resolve(__dirname, "..");
const visited = new Set();
const problems = [];
const composite = new Set(["transform", "opacity", "none"]);

function resolve(from, specifier) {
  const base = specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : specifier.startsWith(".") ? path.resolve(path.dirname(from), specifier) : null;
  if (!base) return null;
  return [base, `${base}.tsx`, `${base}.ts`, `${base}.css`, path.join(base, "index.tsx")].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}

function inspect(file) {
  if (visited.has(file)) return;
  visited.add(file);
  const source = fs.readFileSync(file, "utf8");
  const name = path.relative(root, file);
  if (file.endsWith(".css")) {
    const css = postcss.parse(source, { from: file });
    css.walkAtRules(rule => {
      if (!/keyframes$/i.test(rule.name)) return;
      rule.walkDecls(decl => {
        if (!composite.has(decl.prop) && decl.prop !== "animation-timing-function") problems.push(`${name}:${decl.source.start.line} keyframe animates ${decl.prop}`);
      });
    });
    css.walkDecls(decl => {
      if (decl.prop !== "transition" && decl.prop !== "transition-property") return;
      for (const entry of postcss.list.comma(decl.value)) {
        const property = entry.trim().split(/\s+/)[0];
        if (!composite.has(property)) problems.push(`${name}:${decl.source.start.line} transition includes ${property}`);
      }
    });
    return;
  }
  if (!/\.tsx?$/.test(file)) return;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function walk(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const target = resolve(file, node.moduleSpecifier.text);
      if (target) inspect(target);
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) {
      const target = resolve(file, node.arguments[0].text);
      if (target) inspect(target);
    }
    if (ts.isJsxAttribute(node) && node.name.getText(tree) === "className" && node.initializer) {
      if (/\btransition-(all|colors|shadow)\b|\bbackdrop-blur/.test(node.initializer.getText(tree))) {
        const line = tree.getLineAndCharacterOfPosition(node.pos).line + 1;
        problems.push(`${name}:${line} broad paint transition or backdrop filter in active component`);
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(tree);
}

inspect(path.join(root, "src/app/page.tsx"));
inspect(path.join(root, "src/app/layout.tsx"));
assert.deepEqual(problems, [], problems.join("\n"));
console.log(`Motion property guard passed: ${visited.size} route dependencies; CSS keyframes/transitions use transform/opacity. This is a source check, not a GPU/FPS measurement.`);
