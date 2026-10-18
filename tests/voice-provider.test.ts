import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = ts.createSourceFile("MikeVoiceAgent.tsx", readFileSync(new URL("../components/demo/MikeVoiceAgent.tsx", import.meta.url), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function nodesMatching(predicate: (node: ts.Node) => boolean, root: ts.Node = source): ts.Node[] {
  const matches: ts.Node[] = [];
  function visit(node: ts.Node) { if (predicate(node)) matches.push(node); ts.forEachChild(node, visit); }
  visit(root);
  return matches;
}

// Structural regression tests: these prove ownership constraints, not a live audio connection.
test("the voice session/provider are not keyed for error-driven remounts", () => {
  const boundaries = nodesMatching(node => (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ["MikeVoiceSession", "ConversationProvider"].includes(node.tagName.getText(source)));
  assert.equal(boundaries.length, 2);
  for (const boundary of boundaries) {
    const element = boundary as ts.JsxOpeningElement | ts.JsxSelfClosingElement;
    assert.ok(!element.attributes.properties.some(attribute => ts.isJsxAttribute(attribute) && attribute.name.getText(source) === "key"));
  }
});

test("reporting an SDK error does not end or recreate the session", () => {
  const handlers = nodesMatching(node => ts.isVariableDeclaration(node) && node.name.getText(source) === "handleFailure");
  assert.equal(handlers.length, 1);
  const calls = nodesMatching(ts.isCallExpression, handlers[0]).map(node => (node as ts.CallExpression).expression.getText(source));
  assert.ok(calls.includes("connection.current.fail"));
  assert.ok(!calls.some(name => /endSession|startSession|setAttempt/.test(name)));
  assert.equal(nodesMatching(node => ts.isCallExpression(node) && node.expression.getText(source) === "setAttempt").length, 0);
});

test("microphone capture and track release belong to the SDK, not a second preflight", () => {
  const calls = nodesMatching(ts.isCallExpression).map(node => (node as ts.CallExpression).expression.getText(source));
  assert.ok(!calls.some(name => /getUserMedia|getTracks|\.stop$/.test(name)));
});

test("the SDK start uses the configured public-agent voice transport without credential overrides", () => {
  const starts = nodesMatching(node => ts.isCallExpression(node) && node.expression.getText(source) === "startSession") as ts.CallExpression[];
  assert.equal(starts.length, 1);
  const options = starts[0].arguments[0];
  assert.ok(ts.isObjectLiteralExpression(options));
  const properties = options.properties.filter(ts.isPropertyAssignment);
  assert.equal(properties.find(property => property.name.getText(source) === "connectionType")?.initializer.getText(source), "MIKE_CONNECTION_TYPE");
  assert.equal(properties.find(property => property.name.getText(source) === "agentId")?.initializer.getText(source), "MIKE_AGENT_ID");
  assert.ok(!properties.some(property => ["authorization", "conversationToken", "signedUrl", "textOnly", "overrides", "clientTools"].includes(property.name.getText(source))));
});
