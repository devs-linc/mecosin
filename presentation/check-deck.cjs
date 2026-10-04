const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('../site/node_modules/playwright-core');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/google/chrome/chrome',headless:true});
 const p=await b.newPage({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
 const errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^http/.test(r.url()))requests.push(r.url())});
 await p.goto('file://'+__dirname+'/linc-x-mecosin.html');
 assert.equal(await p.locator('.slide').count(),21);assert.equal(await p.locator('.seo').count(),0);assert.ok(!/SEO audit|135 URLs checked|error-content routes/.test(await p.locator('body').innerText()));
 assert.equal(await p.locator('html').getAttribute('lang'),'en');
 assert.equal(await p.locator('.slide .visual-art').count(),21);
 assert.ok(await p.locator('body').evaluate(e=>! /\b(Usulan|Pilih|Tutup|hubungan|kesehatan|pengembangan|Gunakan|tidak)\b/i.test(e.textContent)));
 await p.keyboard.press('ArrowRight');assert.equal(await p.locator('.active').getAttribute('id'),'slide-2');await p.keyboard.press('ArrowRight');assert.equal(await p.locator('.active').getAttribute('id'),'slide-3');await p.keyboard.press('ArrowLeft');assert.equal(await p.locator('.active').getAttribute('id'),'slide-2');
 await p.keyboard.press('g');assert.ok(await p.locator('dialog').evaluate(d=>d.open));await p.keyboard.press('Escape');await p.locator('#full').click();assert.ok(await p.evaluate(()=>!!document.fullscreenElement));await p.evaluate(()=>document.exitFullscreen());
 fs.mkdirSync(__dirname+'/evidence-v2',{recursive:true});let samples=0;
 for(const [width,height] of [[1600,1000],[1366,768],[390,844],[844,390]]){
 await p.setViewportSize({width,height});
 await p.waitForFunction(()=>Math.abs(Number(getComputedStyle(document.documentElement).getPropertyValue('--scale'))-Math.min(innerWidth/1600,(innerHeight-66)/900))<0.001);
 for(let i=0;i<21;i++){
 await p.locator('#jump').selectOption(String(i));
 assert.equal(await p.locator('.slide:visible').count(),1);
 assert.ok(await p.locator('.active img').evaluateAll(a=>a.every(x=>x.complete&&x.naturalWidth)));
 const bad=await p.locator('.active').evaluate(s=>{
 const a=[];for(const e of s.querySelectorAll('h2,h3,p,li'))if(e.scrollWidth>e.clientWidth+2)a.push(e.textContent.slice(0,70));
 const r=s.getBoundingClientRect(),f=s.querySelector('footer').getBoundingClientRect(),c=s.querySelector('.content').getBoundingClientRect();if(c.bottom>f.top)a.push('footer collision');if(r.top<0||r.bottom>innerHeight-60)a.push('outside viewport');if(document.documentElement.scrollHeight>innerHeight)a.push('vertical page scroll');return a;
 });assert.deepEqual(bad,[],`slide ${i+1} ${width}`);samples++;
 if(width===1600)await p.screenshot({path:__dirname+`/evidence-v2/slide-${String(i+1).padStart(2,'0')}.png`});
 }
 }
 await p.setViewportSize({width:1600,height:1000});await p.emulateMedia({reducedMotion:'no-preference'});
 for(let i=0;i<21;i++){
 await p.locator('#jump').selectOption(String((i+1)%21));await p.locator('#jump').selectOption(String(i));
 const anim=await p.locator('.active').evaluate(s=>s.getAnimations({subtree:true}).filter(a=>a.playState==='running').length);assert.ok(anim>=2,`animations slide ${i+1}`);
 await p.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
 assert.equal(await p.locator('.active').evaluate(s=>getComputedStyle(s).opacity),'1');
 }
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('#jump').selectOption('4');assert.equal(await p.evaluate(()=>document.getAnimations().length),0);
 await p.emulateMedia({media:'print'});assert.equal(await p.locator('.slide:visible').count(),21);await p.pdf({path:__dirname+'/evidence-v2/print-check.pdf',preferCSSPageSize:true,printBackground:true});
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 const report={slides:21,seoAuditSlides:0,viewportSamples:samples,animatedSlides:21,oneSlidePerScreen:true,errors,externalRequests:requests};fs.writeFileSync(__dirname+'/evidence-v2/checks.json',JSON.stringify(report,null,2));console.log(report);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
