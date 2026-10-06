import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4342';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
try {
 for(const width of [360,390,820,1024,1440]) {
  const c=await browser.newContext({viewport:{width,height:900}}),p=await c.newPage();
  await p.goto(base);
  assert.equal(await p.locator('body').getAttribute('class'),'reference-site consumer');
  assert.equal(await p.locator('.consumer-brand-feature').count(),2);
  assert.equal(await p.locator('.home-menu [aria-current="page"]').getAttribute('href'),'/design/consumer/');
  await p.goto(base+'/perusahaan/');
  assert.deepEqual(await p.locator('#language').evaluate(e=>{const s=getComputedStyle(e);return [s.backgroundRepeat,s.backgroundSize]}),['no-repeat','16px auto']);
  if(width<=760)await p.locator('.menu-toggle').click();
  await p.locator('.company-nav summary').click();
  assert.deepEqual(await p.locator('.company-menu a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),['/about/','/products/','/services/','/team/','/partners/']);
  assert.ok(await p.locator('.company-menu').isVisible());
  await p.screenshot({path:`evidence/frontend-demo/navigation-${width}.png`});
  await p.keyboard.press('Escape');
  await p.locator('#language').selectOption('id');assert.equal(await p.locator('html').getAttribute('lang'),'id');
  await p.locator('#language').selectOption('en');
  for(const route of ['team','partners','discoveries','career','presentation']) {
   await p.goto(`${base}/${route}/`);await p.evaluate(()=>document.fonts.ready);
   if(route==='presentation'){await p.frameLocator('iframe').locator('.slide.active').waitFor();await p.waitForTimeout(1700);}
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route);
   if(width===390||width===1440)await p.screenshot({path:`evidence/frontend-demo/new-${route}-${width}.png`});
  }
  await p.locator('iframe').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
  const frame=p.frameLocator('iframe');await frame.locator('.slide.active').waitFor();
  assert.equal(await frame.locator('.slide').count(),24);
  await frame.locator('#next').click();assert.equal(await frame.locator('#slide-2').getAttribute('aria-hidden'),'false');
  await c.close();console.log(`PASS menu, language, pages, presentation at ${width}px`);
 }
 assert.deepEqual(Buffer.from(await(await fetch(base+'/presentation/deck.html')).arrayBuffer()),await readFile('../presentation/linc-x-mecosin.html'));
 console.log('PASS deck source byte parity');
}finally{await browser.close();}
