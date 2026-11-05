// End-to-end checks for the conversion-critical paths. Run: npm test
import { chromium } from "playwright";
import { serve } from "./serve.mjs";

const server = await serve(0);
const BASE = `http://localhost:${server.address().port}/index.html`;
const browser = await chromium.launch();
let failed = 0;
const results = [];

async function page(width = 1280, clock) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();
  p.errors = [];
  p.on("pageerror", (e) => p.errors.push(e.message));
  await p.route("**/api.open-meteo.com/**", (r) => r.fulfill({ contentType: "application/json", body: '{"current":{"temperature_2m":17,"weather_code":2}}' }));
  await p.route("**/images.unsplash.com/**", (r) => r.fulfill({ status: 204 }));
  if (clock) await p.clock.install({ time: new Date(clock) });
  p.setDefaultTimeout(5000);
  await p.goto(BASE);
  return p;
}
async function test(name, fn) {
  try { await fn(); results.push(`✓ ${name}`); }
  catch (e) { failed++; results.push(`✗ ${name}\n    ${e.message.split("\n")[0]}`); }
}
const assert = (c, m) => { if (!c) throw new Error(m); };

for (const width of [390, 1280]) {
  await test(`loads cleanly without horizontal overflow @${width}px`, async () => {
    const p = await page(width);
    await p.waitForTimeout(500);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    assert(sw <= width, `scrollWidth ${sw} > ${width}`);
    assert(!p.errors.length, p.errors.join("; "));
    await p.context().close();
  });
}

await test("drink builder → cart → checkout → confirmation (weekday morning)", async () => {
  const p = await page(1280, "2026-11-04T09:00:00");
  await p.click('[data-add="latte"]');
  await p.click('.chip:has(input[value="Large"])');
  await p.click(".builder-add");
  await p.click(".cart-btn");
  assert((await p.textContent("#cart-total")) === "$5.50", "large latte should be $5.50");
  await p.click("#to-checkout");
  await p.fill("#cname", "Test");
  await p.click("#checkout-form button[type=submit]");
  const no = await p.textContent("#confirm-no");
  assert(/^EB-\d{4}$/.test(no), "order number shown");
  const ev = await p.evaluate(() => dataLayer.map((e) => e.event));
  assert(ev.includes("purchase"), "purchase event fired");
  assert(!p.errors.length, p.errors.join("; "));
  await p.context().close();
});

await test("pastry pairing discount applies once per drink", async () => {
  const p = await page();
  await p.evaluate(() => { Cart.add("espresso", { size: "Medium", temp: "Hot" }); Cart.add("croissant"); Cart.add("croissant"); });
  const d = await p.evaluate(() => Cart.discounts().find((x) => /Pastry/.test(x.label))?.amount);
  assert(d === 1, `expected $1 pairing, got ${d}`);
  await p.context().close();
});

await test("happy hour discounts iced drinks only, weekdays 2–4 pm", async () => {
  const p = await page(1280, "2026-11-04T14:30:00");
  await p.evaluate(() => { Cart.add("coldbrew", { temp: "Iced" }, 4.5); Cart.add("latte", { temp: "Hot" }, 4.75); });
  const d = await p.evaluate(() => Cart.discounts().find((x) => /Happy/.test(x.label))?.amount);
  assert(d === 0.9, `expected $0.90, got ${d}`);
  await p.context().close();
});

await test("voice parser understands quantities and modifiers", async () => {
  const p = await page();
  const r = await p.evaluate(() => parseOrder("two large iced oat lattes and a double flat white with almond milk"));
  assert(r.length === 2 && r[0].qty === 2 && r[0].opts.milk === "Oat" && r[0].opts.temp === "Iced", "lattes parsed");
  assert(r[1].opts.milk === "Almond" && r[1].opts.shots === "+1 shot", "flat white modifiers parsed");
  await p.context().close();
});

await test("Thanksgiving is closed and pre-orders skip it", async () => {
  const p = await page(1280, "2026-11-25T19:00:00");
  const info = await p.evaluate(() => [hoursFor(new Date(2026, 10, 26)).hours, nextOpening(new Date()).getDate()]);
  assert(info[0] === null, "closed on Thanksgiving");
  assert(info[1] === 27, `next opening should be the 27th, got ${info[1]}`);
  await p.context().close();
});

await test("shared order link round-trips into another cart", async () => {
  const p = await page();
  await p.evaluate(() => { Cart.add("muffin"); Cart.add("muffin"); });
  const payload = await p.evaluate(() => btoa(JSON.stringify({ by: "Sam", l: Cart.lines.map((l) => [l.id, l.qty, l.price, l.opts]) })).replace(/=+$/, ""));
  await p.evaluate(() => localStorage.clear());
  await p.goto(`${BASE}#order=${payload}`); await p.reload();
  await p.click("#sb-add");
  const n = await p.evaluate(() => Cart.count());
  assert(n === 2, `expected 2 items, got ${n}`);
  await p.context().close();
});

for (const scheme of ["light", "dark"]) {
  await test(`no WCAG 2 A/AA violations (axe-core, ${scheme})`, async () => {
    let axeSrc;
    try { axeSrc = await (await fetch("https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js")).text(); }
    catch { results.push("  (axe-core unavailable offline, skipped)"); return; }
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, reducedMotion: "reduce" });
    await ctx.addInitScript(() => { try { localStorage.setItem("eb-welcome", '{"state":"dismissed"}'); } catch {} });
    const p = await ctx.newPage();
    await p.route("**/api.open-meteo.com/**", (r) => r.abort());
    await p.route("**/images.unsplash.com/**", (r) => r.fulfill({ status: 204 }));
    await p.goto(BASE); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")));
    await p.addScriptTag({ content: axeSrc });
    const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa"] })).violations.map((x) => `${x.id} (${x.nodes.length}): ${x.nodes[0].target.join(" ")}`));
    assert(!v.length, v.join("; "));
    await ctx.close();
  });
}

await browser.close();
server.close();
console.log(results.join("\n"));
console.log(failed ? `\n${failed} failed` : `\nAll ${results.length} checks passed`);
process.exit(failed ? 1 : 0);
