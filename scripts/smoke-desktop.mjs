import { _electron as electron } from "playwright";
import assert from "node:assert/strict";
import { mkdtemp, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
const profile = await mkdtemp(join(tmpdir(), "angel170-smoke-"));
const executablePath = process.env.ANGEL_EXECUTABLE;
const args = executablePath ? [] : ["."];
args.push(`--user-data-dir=${profile}`);
const errors = [];
let app;
async function launch() {
  app = await electron.launch({ executablePath, args, timeout: 60000 });
  const page = await app.firstWindow();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.getByRole("button", { name: "Skip intro", exact: true }).click();
  await page.getByRole("button", { name: "Focus room", exact: true }).waitFor();
  return page;
}
try {
  let page = await launch();
  await page.getByRole("button", { name: "Log study time", exact: true }).click();
  await page.getByLabel("Minutes", { exact: true }).fill("7");
  await page.getByLabel("A little context (optional)").fill("Packaged app persistence check");
  await page.getByRole("button", { name: "Save to my journey" }).click();
  await page.getByRole("button", { name: "Daily journal", exact: true }).click();
  await page.getByLabel("Free writing", { exact: true }).fill("My writing survives a full app restart.");
  await page.getByRole("button", { name: "Focus room", exact: true }).click();
  await page.getByLabel("Focus intention", { exact: true }).fill("One deliberate question.");
  await page.getByRole("button", { name: "Start focusing", exact: true }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("angel170-focus") || "{}").seconds >= 2);
  await app.close();
  app = null;
  page = await launch();
  await page.getByRole("button", { name: "Focus room", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).waitFor();
  assert.equal(await page.getByLabel("Focus intention", { exact: true }).inputValue(), "One deliberate question.");
  await page.getByText("Packaged app persistence check", { exact: false }).waitFor();
  await page.getByRole("button", { name: "Daily journal", exact: true }).click();
  assert.equal(await page.getByLabel("Free writing", { exact: true }).inputValue(), "My writing survives a full app restart.");
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await mkdir("release", { recursive: true });
  await page.screenshot({ path: resolve("release", `mac-preview-${process.arch}.png`) });
  assert.deepEqual(errors, []);
  console.log("PASS: renderer, study log, journal, focus intention and paused timer survive a full restart.");
} finally {
  await app?.close();
}
