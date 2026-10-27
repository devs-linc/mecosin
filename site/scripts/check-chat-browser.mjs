import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import handler from '../api/chat.mjs';

const staticBase=process.env.PREVIEW_URL;
assert.ok(staticBase,'Set PREVIEW_URL to local Astro preview');
assert.ok(['localhost','127.0.0.1'].includes(new URL(staticBase).hostname));
const nativeFetch=globalThis.fetch;
let fail=false;
let calls=[];
globalThis.fetch=async (url,options)=>{
 if(String(url).startsWith('https://router.example.invalid')){
  calls.push(JSON.parse(options.body));
  if(fail)return new Response('provider outage',{status:503});
  return Response.json({choices:[{message:{content:JSON.stringify({intent:'products',products:['laserin-sachet']})}}]});
 }
 return nativeFetch(url,options);
};
process.env.NINE_ROUTER_BASE_URL='https://router.example.invalid/v1';
process.env.NINE_ROUTER_API_KEY='fixture-not-a-secret';
process.env.NINE_ROUTER_MODEL='gemini-3.8-flash';
const server=createServer(async(req,res)=>{
 try{
  if(req.url==='/api/chat')return await handler(req,res);
  const upstream=await nativeFetch(new URL(req.url,staticBase));
  res.statusCode=upstream.status;
  res.setHeader('Content-Type',upstream.headers.get('content-type')||'application/octet-stream');
  res.end(Buffer.from(await upstream.arrayBuffer()));
 }catch{res.statusCode=500;res.end('test server error');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
process.env.CHAT_ALLOWED_ORIGINS=base;
await mkdir('evidence/chat',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true});
try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844},{width:360,height:640}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);await page.locator('.mecosin-chat-launcher').click();
  assert.ok(await page.locator('#mecosin-chat').evaluate(e=>e.open));
  const input=page.locator('#mecosin-chat-input');
  await input.fill('Apa manfaat Laserin Sachet?');await input.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.mecosin-chat-messages').getAttribute('aria-busy')==='false');
  assert.match(await page.locator('.mecosin-chat-reply').last().innerText(),/membantu meredakan batuk & melegakan tenggorokan/);
  assert.equal(await page.locator('.mecosin-chat-reply a').last().getAttribute('href'),'https://mecosin.id/product/Laserin-Sachet');
  await input.fill('Kalau yang itu?');await input.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.mecosin-chat-messages').getAttribute('aria-busy')==='false');
  assert.equal(calls.at(-1).messages.length,4,'system + multi-turn history');
  const before=calls.length;
  await input.fill('Berapa dosis untuk anak saya?');await input.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.mecosin-chat-messages').getAttribute('aria-busy')==='false');
  assert.match(await page.locator('.mecosin-chat-reply').last().innerText(),/tidak memberi saran medis/);
  assert.equal(calls.length,before);
  assert.equal(await page.evaluate(()=>Object.keys(localStorage).some(k=>/chat/i.test(k))),false);
  assert.ok(await page.locator('#mecosin-chat').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}));
  await page.keyboard.press('Escape');assert.equal(await page.locator('.mecosin-chat-launcher').evaluate(e=>e===document.activeElement),true);
  await page.reload();await page.locator('.mecosin-chat-launcher').click();fail=true;
  await input.fill('Apa manfaat Laserin?');await input.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.mecosin-chat-messages').getAttribute('aria-busy')==='false');
  assert.match(await page.locator('.mecosin-chat-reply').last().innerText(),/sulit dihubungi/);
  assert.equal(await input.inputValue(),'Apa manfaat Laserin?');assert.equal(await input.isEnabled(),true);
  fail=false;await input.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.mecosin-chat-messages').getAttribute('aria-busy')==='false');
  assert.match(await page.locator('.mecosin-chat-reply').last().innerText(),/Laserin Sachet/);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:`evidence/chat/widget-${viewport.width}.png`});
  await context.close();
  console.log(`chat browser ${viewport.width}: API integration, sources, follow-up, medical refusal, error/retry, focus, containment PASS (provider fixture)`);
 }
}finally{
 await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));globalThis.fetch=nativeFetch;
}
