import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import handler from '../api/chat.mjs';
const server=createServer(handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;process.env.CHAT_ALLOWED_ORIGINS=origin;
const ask=async(messages)=>{const r=await fetch(origin,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({messages})});assert.equal(r.status,200);return r.json();};
const user=content=>({role:'user',content});
try{
 assert.equal((await ask([user('makasih')])).reply,'Sama-sama!');
 assert.equal((await ask([user('kamu siapa')])).reply,'Aku asisten virtual Mecosin. Aku bantu kamu kenalan dengan produk kami.');
 const dose=await ask([user('berapa dosis Laserin Sachet untuk dewasa?')]);assert.match(dose.reply,/Laserin Sachet/);assert.doesNotMatch(dose.reply,/yang mana/);
 const history=[user('sachet aja'),{role:'assistant',content:'Ini Laserin Sachet.\nProduk yang ditampilkan: Laserin Sachet'}];
 const ingredients=await ask([...history,user('apa kandungannya?')]);assert.match(ingredients.sources[0].description,/Zingiberis officinale/);assert.equal(ingredients.sources[0].field,'composition');
 const guarantee=await ask([...history,user('pasti sembuh kan?')]);assert.match(guarantee.reply,/bukan jaminan/);assert.doesNotMatch(guarantee.reply,/sebutkan/);
 const other=await ask([...history,user('apa kandungan Mecowell Normoten?')]);assert.equal(other.sources[0].slug,'mecowell-normoten');assert.match(other.sources[0].description,/belum tersedia/);
 process.env.NINE_ROUTER_BASE_URL='https://retry.invalid/v1';process.env.NINE_ROUTER_API_KEY='fixture';
 const nativeFetch=globalThis.fetch;let attempts=0;
 globalThis.fetch=async(url,options)=>{
  if(!String(url).startsWith('https://retry.invalid'))return nativeFetch(url,options);
  attempts++;if(attempts===1)throw new DOMException('fixture','TimeoutError');
  return Response.json({choices:[{message:{content:JSON.stringify({intent:'clarify',reply:'Mau pilihan botol atau sachet?',products:[]})}}]});
 };
 try{const recovered=await ask([user('kalau gw batuk pake apa ya')]);assert.equal(attempts,2);assert.match(recovered.reply,/^Lagi batuk, ya\./);}finally{globalThis.fetch=nativeFetch;}
 console.log('PASS audit regressions: local thanks/identity, contextual dose/guarantee, sourced composition, product switch, timeout recovery, warm opener');
}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
