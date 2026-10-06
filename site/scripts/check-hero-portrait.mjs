import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4343';
const out=new URL('../evidence/hero-portrait/',import.meta.url);
await mkdir(out,{recursive:true});
const desktop={
 'Laserin Sachet':[1168/1440,433/650,171/1440,182/650],
 'Laserin Madu Orange':[844/1440,464/650,306/1440,144/650],
 'MecoVit-D3 1000 IU':[994/1440,536/650,220/1440,89.375/650],
};
const mobile={
 'Laserin Sachet':[39/390,209.625/365,124/390,133/365],
 'Laserin Madu Orange':[159/390,256.625/365,197/390,83/365],
 'MecoVit-D3 1000 IU':[95/390,302.625/365,120/390,48.75/365],
};
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true});
const samples=[];
try{
 for(const [width,height] of [[1440,1000],[1024,900],[820,1180],[390,844],[360,640]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/design/consumer/');await page.evaluate(()=>document.fonts.ready);
  await page.locator('.ref-hero img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
  const geometry=await page.evaluate(()=>{
   const layer=document.querySelector('.consumer-hero-composition').getBoundingClientRect();
   const hero=document.querySelector('.ref-hero').getBoundingClientRect();
   const photo=document.querySelector('.consumer-full-bleed');
   return {layer:{x:layer.x,y:layer.y,w:layer.width,h:layer.height},hero:{x:hero.x,y:hero.y,w:hero.width,h:hero.height},photo:photo.currentSrc,images:[...document.querySelectorAll('.consumer-hero-composition .hero-pack')].map(e=>{const r=e.getBoundingClientRect();return {name:e.alt,x:(r.x-layer.x)/layer.width,y:(r.y-layer.y)/layer.height,w:r.width/layer.width,h:r.height/layer.height,fit:getComputedStyle(e).objectFit};})};
  });
  const expected=width<=760?mobile:desktop;
  assert.equal(geometry.images.length,3);
  assert.ok(geometry.photo.endsWith(width<=760?'consumer-hero-mobile.webp':'consumer-hero-desktop.webp'));
  for(const image of geometry.images){
   assert.equal(image.fit,'contain');
   for(const [i,key] of ['x','y','w','h'].entries())assert.ok(Math.abs(image[key]-expected[image.name][i])<.001,`${width} ${image.name} ${key}: ${image[key]}`);
   assert.ok(image.x>=0&&image.y>=0&&image.x+image.w<=1.001&&image.y+image.h<=1.001);
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);
  await page.locator('.ref-hero').screenshot({path:new URL(`hero-${width}.png`,out).pathname});
  samples.push({width,height,...geometry});await page.close();
 }
 await writeFile(new URL('checks.json',out),JSON.stringify({samples,source:'Live Penpot hero coordinates; three original product images'},null,2));
 console.log('PASS hero: five viewports, exact Penpot product geometry, genuine packshots, decoded portrait and no page overflow/errors');
}finally{await browser.close();}
