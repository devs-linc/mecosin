import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile, mkdir } from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'https://nuc.tailcf7779.ts.net:8465';
const source=await readFile('../presentation/quotation.html');
const served=Buffer.from(await(await fetch(base+'/quotation/')).arrayBuffer());
assert.deepEqual(served,source,'exact quotation source readback');
await mkdir('evidence/quotation-terms',{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
try {
 for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto(base+'/quotation/');await page.evaluate(()=>document.fonts.ready);
  assert.deepEqual(await page.locator('#pembayaran tbody tr td:nth-child(2)').allTextContents(),['40%','40%','20%']);
  const text=await page.locator('#pembayaran').innerText();
  assert.match(text,/progres pekerjaan mencapai 50%/);
  assert.doesNotMatch(text,/minimum kontrak 6 bulan|invoice bulanan/i);
  assert.match(text,/No initial investment/);
  assert.match(text,/kontrak 12 bulan, trial 3 bulan dibayar upfront Rp45 juta/);
  assert.equal(await page.locator('.price-card').count(),5);
  const offer=await page.locator('main').innerText();
  assert.doesNotMatch(offer,/Rp30\.000\.000|Rp3\.000\.000|AI agent internal|bootcamp/i);
  assert.match(await page.locator('[data-service="commerce"] .amount').innerText(),/Rp70\.000\.000/);
  assert.match(await page.locator('[data-service="maintenance"] .amount').innerText(),/Rp5\.000\.000/);
  assert.match(offer,/Pembayaran subscription yang sudah dilakukan tidak mengurangi biaya pembelian source code/);
  assert.match(offer,/Source code diserahkan setelah pembayaran Rp70\.000\.000 dilunasi/);
  assert.deepEqual(await page.locator('#ringkasan .price-grid').first().locator('[data-service]').evaluateAll(es=>es.map(e=>e.dataset.service)),['commerce','development']);
  assert.deepEqual(await page.locator('#ringkasan .price-grid').last().locator('[data-service]').evaluateAll(es=>es.map(e=>e.dataset.service)),['maintenance','seo','live-chat']);
  await page.locator('.jump a[href="#pembayaran"]').click();
  assert.equal(await page.locator('.jump [aria-current="location"]').getAttribute('href'),'#pembayaran');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.ok(await page.locator('#pembayaran').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  await page.screenshot({path:`evidence/quotation-terms/payment-${width}.png`});
  if(width===1440)await page.pdf({path:'evidence/quotation-terms/quotation-mecosin.pdf',preferCSSPageSize:true,printBackground:true});
  await page.close();
 }
 console.log('PASS quotation: two website options, no initial investment, 12-month subscription/45m trial, removed packages absent, 40/40/20 retained and exact served bytes');
} finally { await browser.close(); }
