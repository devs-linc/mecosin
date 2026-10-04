const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('../site/node_modules/playwright-core');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/google/chrome/chrome',headless:true});
 const p=await b.newPage({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
 const errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^http/.test(r.url()))requests.push(r.url())});
 await p.goto('file://'+__dirname+'/linc-x-mecosin.html');
 const total=24;
 assert.equal(await p.locator('.slide').count(),total);assert.equal(await p.locator('.seo').count(),0);assert.ok(!/SEO audit|135 URLs checked|error-content routes/.test(await p.locator('body').innerText()));
 assert.equal(await p.locator('html').getAttribute('lang'),'id');
 assert.ok(await p.locator('.slide[class*="art-"]').count()>=8);
 assert.equal(await p.locator('#slide-24 a').first().getAttribute('href'),'https://linc.id');
 assert.equal(await p.locator('#slide-24 a[href="mailto:George@linc.id"]').count(),1);
 assert.equal(await p.locator('#slide-24 a[href="https://wa.me/628111666218"]').count(),1);
 assert.ok(!(await p.locator('#slide-7').textContent()).includes('Mecosin pada sampel'));
 assert.equal(await p.locator('.art-panel').count(),0);
 const copy=await p.locator('body').textContent();assert.ok(!/90\s+WhatsApp|Alitura/i.test(copy));
 assert.ok(!/Cost dan operasional AI live chat|Intercom|billable outcome|US\$/i.test(copy));
 assert.ok(copy.includes('Linc mengonfigurasi AI'));
 for(const term of ['Wingoh','InsideVVIP','Truecare','DataForSEO','AI live chat','organic traffic'])assert.ok(copy.includes(term),term);
 await p.keyboard.press('ArrowRight');assert.equal(await p.locator('.active').getAttribute('id'),'slide-2');await p.keyboard.press('ArrowRight');assert.equal(await p.locator('.active').getAttribute('id'),'slide-3');await p.keyboard.press('ArrowLeft');assert.equal(await p.locator('.active').getAttribute('id'),'slide-2');
 await p.keyboard.press('g');assert.ok(await p.locator('dialog').evaluate(d=>d.open));await p.keyboard.press('Escape');await p.locator('#full').click();assert.ok(await p.evaluate(()=>!!document.fullscreenElement));await p.evaluate(()=>document.exitFullscreen());
 fs.mkdirSync(__dirname+'/evidence-v2',{recursive:true});let samples=0;
 for(const [width,height] of [[1600,1000],[1366,768],[390,844],[844,390]]){
 await p.setViewportSize({width,height});
 await p.waitForFunction(()=>{const s=document.querySelector('.shell');return Math.abs(Number(getComputedStyle(document.documentElement).getPropertyValue('--scale'))-Math.min(s.clientWidth/1600,s.clientHeight/900))<0.001});
 for(let i=0;i<total;i++){
 await p.locator('#jump').selectOption(String(i));
 assert.equal(await p.locator('.slide:visible').count(),1);
 assert.ok(await p.locator('.active img').evaluateAll(a=>a.every(x=>x.complete&&x.naturalWidth)));
 const bad=await p.locator('.active').evaluate(s=>{
 const panel=s.querySelector('.art-panel');if(panel){const bounds=panel.getBoundingClientRect();for(const e of panel.querySelectorAll('.topic-item strong,.topic-item span,.visual-label,figcaption')){const r=e.getBoundingClientRect();if(r.bottom>bounds.bottom+1||r.top<bounds.top-1||e.scrollWidth>e.clientWidth+2)throw Error('Visual clipping: '+e.textContent)}}
 const a=[];for(const e of s.querySelectorAll('h2,h3,p,li'))if(e.scrollWidth>e.clientWidth+2)a.push(e.textContent.slice(0,70));
 const r=s.getBoundingClientRect(),f=s.querySelector('footer').getBoundingClientRect(),c=s.querySelector('.content').getBoundingClientRect();if(c.bottom>f.top)a.push('footer collision');if(r.top<0||r.bottom>innerHeight-60)a.push('outside viewport');if(document.documentElement.scrollHeight>innerHeight)a.push('vertical page scroll');return a;
 });assert.deepEqual(bad,[],`slide ${i+1} ${width}`);samples++;
 if(width===1600)await p.screenshot({path:__dirname+`/evidence-v2/slide-${String(i+1).padStart(2,'0')}.png`});
 }
 }
 await p.setViewportSize({width:1600,height:1000});await p.emulateMedia({reducedMotion:'no-preference'});
 for(let i=0;i<total;i++){
 await p.locator('#jump').selectOption(String((i+1)%total));await p.locator('#jump').selectOption(String(i));
 const anim=await p.locator('.active').evaluate(s=>s.getAnimations({subtree:true}).filter(a=>a.playState==='running').length);assert.ok(anim>=2,`animations slide ${i+1}`);
 await p.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
 assert.equal(await p.locator('.active').evaluate(s=>getComputedStyle(s).opacity),'1');
 }
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('#jump').selectOption('4');assert.equal(await p.evaluate(()=>document.getAnimations().length),0);
 await p.emulateMedia({media:'print'});assert.equal(await p.locator('.slide:visible').count(),total);await p.pdf({path:__dirname+'/evidence-v2/print-check.pdf',preferCSSPageSize:true,printBackground:true});
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 const report={slides:total,seoAuditSlides:0,viewportSamples:samples,animatedSlides:total,oneSlidePerScreen:true,errors,externalRequests:requests};fs.writeFileSync(__dirname+'/evidence-v2/checks.json',JSON.stringify(report,null,2));console.log(report);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
