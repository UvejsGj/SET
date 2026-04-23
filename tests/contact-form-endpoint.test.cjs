"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const scriptPath = path.join(
  __dirname,
  "..",
  "Website",
  "Pages",
  "Homepage",
  "scripts",
  "contact-form-endpoint.js",
);
vm.runInThisContext(fs.readFileSync(scriptPath, "utf8"), { filename: scriptPath });

const resolve = globalThis.__SET_resolveFormSubmitAjax;
const DEFAULT = globalThis.__SET_defaultFormSubmitAction;

test("valid FormSubmit inbox URL becomes ajax URL", () => {
  const r = resolve("https://formsubmit.co/mykey123", DEFAULT);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.ajaxUrl, "https://formsubmit.co/ajax/mykey123");
});

test("reject non-FormSubmit host", () => {
  assert.strictEqual(resolve("https://evil.com/collect", DEFAULT).ok, false);
});

test("reject http scheme on FormSubmit host", () => {
  assert.strictEqual(resolve("http://formsubmit.co/mykey", DEFAULT).ok, false);
});

test("reject lookalike subdomain", () => {
  assert.strictEqual(resolve("https://evil.formsubmit.co/x", DEFAULT).ok, false);
});

test("missing data-fallback-action uses second-arg default", () => {
  const r = resolve(null, "https://formsubmit.co/backupid");
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.ajaxUrl, "https://formsubmit.co/ajax/backupid");
});

test("empty string attr falls through to default URL", () => {
  const r = resolve("", "https://formsubmit.co/zzz");
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.ajaxUrl, "https://formsubmit.co/ajax/zzz");
});

test("built-in default is valid FormSubmit https URL", () => {
  assert.ok(typeof DEFAULT === "string");
  const r = resolve(null, null);
  assert.strictEqual(r.ok, true);
  assert.ok(r.ajaxUrl.startsWith("https://formsubmit.co/ajax/"));
});
