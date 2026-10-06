import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4342';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
try {
  for (const [width, height] of [[1440, 1000], [390, 844], [360, 640], [844, 390]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(base + '/produk/');
    assert.equal(await page.locator('html').getAttribute('lang'), 'id');
    await page.locator('#language').selectOption('id');
    const add = page.locator('[data-add="laserin-dewasa"]');
    await add.click();
    const drawer = page.locator('#cart-drawer');
    assert.equal(await drawer.evaluate(e => e.open), true);
    const box = await drawer.boundingBox();
    assert.equal(Math.round(box.x + box.width), width);
    assert.equal(Math.round(box.height), height);
    assert.equal(await drawer.locator('.quantity span').innerText(), '1');
    await drawer.locator('[data-delta="1"]').click();
    assert.equal(await drawer.locator('[data-cart-subtotal]').innerText(), 'Rp50.000');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      assert.ok(await drawer.evaluate(e => e.contains(document.activeElement) || document.activeElement === document.body), 'no background control receives focus');
    }
    await page.keyboard.press('Escape');
    assert.equal(await drawer.evaluate(e => e.open), false);
    assert.ok(await add.evaluate(e => e === document.activeElement));
    await page.locator('[data-open-cart]').click();
    await drawer.locator('.remove').click();
    assert.ok(await drawer.locator('[data-drawer-empty]').isVisible());
    assert.equal(await drawer.locator('[data-drawer-filled]').isVisible(), false);
    await drawer.locator('.drawer-close').click();
    await add.click();
    assert.equal(await drawer.locator('.quantity span').innerText(), '1');
    await page.screenshot({ path: `evidence/frontend-demo/drawer-${width}.png` });
    if (width > 480) {
      await page.mouse.click(10, 150);
      assert.equal(await drawer.evaluate(e => e.open), false);
      await page.locator('[data-open-cart]').click();
    }
    await drawer.locator('a[href="/keranjang/"]').click();
    await page.waitForURL('**/keranjang/');
    assert.equal(await page.locator('#cart-items .quantity span').innerText(), '1');
    await page.reload();
    assert.equal(await page.locator('[data-cart-count]').innerText(), '1');
    await page.locator('#language').selectOption('en');
    await page.locator('[data-open-cart]').click();
    assert.equal(await drawer.locator('h2').innerText(), 'Your cart');
    await page.keyboard.press('Escape');
    for (const route of ['/', '/produk/', '/produk/laserin-dewasa/', '/keranjang/', '/checkout/', '/bantuan/', '/kemitraan/', '/loyalitas/']) {
      await page.goto(base + route);
      assert.doesNotMatch(await page.locator('main').innerText(), /frontend|\bdemo\b/i, route);
      assert.match(await page.locator('footer').innerText(), route==='/' ? /Design preview/ : /Frontend demo/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await context.close();
    console.log(`PASS drawer ${width}x${height}: right edge, add/edit/remove, focus, Escape, backdrop, persistence, EN, clean copy`);
  }
} finally { await browser.close(); }
