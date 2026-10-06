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
  assert.doesNotMatch(text,/Subscription dan layanan bulanan|minimum kontrak 6 bulan|invoice bulanan/i);
  assert.equal(await page.locator('.price-card').count(),8);
  await page.locator('.jump a[href="#pembayaran"]').click();
  assert.equal(await page.locator('.jump [aria-current="location"]').getAttribute('href'),'#pembayaran');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.ok(await page.locator('#pembayaran').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  await page.screenshot({path:`evidence/quotation-terms/payment-${width}.png`});
  if(width===1440)await page.pdf({path:'evidence/quotation-terms/quotation-mecosin.pdf',preferCSSPageSize:true,printBackground:true});
  await page.close();
 }
 console.log('PASS quotation: 40/40/20 milestones, progress 50%, subscription billing block absent, 390/1440px navigation/print and exact served bytes');
} finally { await browser.close(); }
