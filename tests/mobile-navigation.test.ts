import assert from "node:assert/strict";
import test from "node:test";
import { createMobileNavigationHistory } from "../lib/mobile-navigation";

function setup(initialState: Record<string, unknown> | null = { __NA: true, tree: "next-router-state" }) {
  const entries: { state: Record<string, unknown> | null; url: string }[] = [{ state: initialState, url: "/#system" }];
  let index = 0;
  let backCalls = 0;
  let dismissals = 0;
  const history = {
    get state() { return entries[index].state; },
    pushState(state: Record<string, unknown>, _unused: string, url?: string | URL | null) {
      entries.splice(index + 1);
      entries.push({ state, url: String(url ?? entries[index].url) });
      index += 1;
    },
    replaceState(state: Record<string, unknown>, _unused: string, url?: string | URL | null) {
      entries[index] = { state, url: String(url ?? entries[index].url) };
    },
    back() { backCalls += 1; index = Math.max(0, index - 1); },
  };
  const menu = createMobileNavigationHistory(history, () => { dismissals += 1; });
  return { menu, history, entries, get backCalls() { return backCalls; }, get dismissals() { return dismissals; } };
}

test("opening the mobile menu preserves the current URL and Next router history state", () => {
  const app = setup();
  app.menu.open("/#system");
  app.menu.open("/#system");
  assert.equal(app.entries.length, 2);
  assert.equal(app.entries[1].url, "/#system");
  assert.equal(app.history.state?.__NA, true);
  assert.equal(app.history.state?.tree, "next-router-state");
  assert.equal(typeof app.history.state?.bavexaMobileMenu, "string");
});

test("browser Back dismisses an open menu without leaving the current page", () => {
  const app = setup();
  app.menu.open("/#system");
  app.history.back();
  app.menu.handlePopState();
  app.menu.handlePopState();
  assert.equal(app.dismissals, 1);
  assert.equal(app.entries[0].url, "/#system");
  assert.equal(app.backCalls, 1);
});

test("X, backdrop, Escape and desktop dismissal consume only the menu entry once", () => {
  const app = setup();
  app.menu.open("/#system");
  app.menu.close();
  app.menu.close();
  app.menu.handlePopState();
  assert.equal(app.backCalls, 1);
  assert.equal(app.dismissals, 0);
  assert.deepEqual(app.history.state, { __NA: true, tree: "next-router-state" });
});

test("mobile links replace the menu entry without leaving a duplicate or deleting router state", () => {
  const app = setup();
  app.menu.open("/#system");
  app.menu.prepareNavigation();
  assert.deepEqual(app.history.state, { __NA: true, tree: "next-router-state" });
  // Next Link's replace navigates using the existing menu entry.
  app.history.replaceState({ __NA: true, tree: "demo-router-state" }, "", "/demo");
  app.menu.handlePopState();
  app.menu.close();
  assert.equal(app.backCalls, 0);
  assert.equal(app.entries.length, 2);
  app.history.back();
  assert.equal(app.entries[0].url, "/#system");
});

test("closing never rewinds unrelated navigation, and null history state is supported", () => {
  const app = setup(null);
  app.menu.open("/");
  app.history.pushState({ __NA: true }, "", "/contact");
  app.menu.close();
  assert.equal(app.backCalls, 0);
  assert.deepEqual(app.history.state, { __NA: true });
});

test("repeated menu openings do not accumulate stale history entries", () => {
  const app = setup();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    app.menu.open("/#system");
    app.menu.close();
    app.menu.handlePopState();
    assert.equal(app.entries.length, 2);
  }
  assert.equal(app.backCalls, 5);
});
