import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
const base = process.env.PREVIEW_URL || 'https://nuc.tailcf7779.ts.net:8465';
const route = '/presentation/seo-revamped/';
const evidence = process.env.SEO_EVIDENCE || '/home/iqbal/.hermes/cache/scratch/mecosin-seo-web-check';
const total = 31;
await mkdir(evidence, {recursive:true});
const files = await readdir('public'+route);
for (const file of files) {
  const response = await fetch(base+route+file);
  assert.equal(response.status, 200, file);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile('public'+route+file), file);
}
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
let samples=0;
try {
  for (const [width,height] of [[1440,900],[390,844],[844,390]]) {
    const page = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(base+'/presentation/');
    const link=page.locator('a[href="'+route+'"]');
    await link.click();
    assert.equal(await page.locator('.slide').count(),total);
    for (let i=0;i<total;i++) {
      await page.selectOption('#jump',String(i));
      await page.locator('.slide:not([hidden]) img').evaluate(img=>img.decode());
      assert.equal(await page.locator('#count').textContent(),`${i+1} / ${total}`);
      assert.equal(await page.locator('.slide:not([hidden])').count(),1);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth && document.documentElement.scrollHeight<=innerHeight+1));
      samples++;
    }
    assert.ok(await page.locator('#next').isDisabled());
    await page.selectOption('#jump','0');
    assert.ok(await page.locator('#prev').isDisabled());
    await page.locator('#next').click();
    assert.equal(await page.locator('#count').textContent(),`2 / ${total}`);
    await page.locator('#next').evaluate(el=>el.blur());
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#count').textContent(),`3 / ${total}`);
    await page.locator('#notes').click();
    assert.ok(await page.locator('#speaker').isVisible());
    assert.match(await page.locator('#speaker').innerText(),/maintenance|Merawat website/);
    await page.keyboard.press('Escape');
    await page.locator('#full').click();
    await page.waitForFunction(()=>Boolean(document.fullscreenElement));
    await page.evaluate(()=>document.exitFullscreen());
    await page.goto(base+route+'#slide-21');
    assert.equal(await page.locator('#count').textContent(),`21 / ${total}`);
    await page.locator('.slide:not([hidden]) img').evaluate(img=>img.decode());
    await page.screenshot({path:`${evidence}/web-${width}.png`});
    assert.deepEqual(errors,[]);
    await page.close();
  }
  const nojs=await browser.newPage({javaScriptEnabled:false});
  await nojs.goto(base+route);
  assert.equal(await nojs.locator('.slide:visible').count(),total);
  await nojs.close();
  const result={slides:total,viewportSamples:samples,exactFiles:files.length,navigation:true,notes:true,fullscreen:true,hash:true,noJavaScript:true,errors:[]};
  await writeFile(`${evidence}/checks.json`,JSON.stringify(result,null,2));
  console.log('PASS',JSON.stringify(result));
} finally {await browser.close();}
