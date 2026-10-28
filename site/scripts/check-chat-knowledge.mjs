import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import knowledge from '../src/data/chat-knowledge.json' with {type:'json'};
import handler from '../api/chat.mjs';
assert.equal(knowledge.products.length,20);
assert.equal(new Set(knowledge.products.map(p=>p.slug)).size,20);
assert.equal(knowledge.products.filter(p=>p.sourceType==='secondary').length,16);
for(const p of knowledge.products){
 assert.equal(p.directions,undefined,'unverified dosing never enters live KB');
 if(p.sourceType==='secondary'){assert.ok(p.evidenceQuote);assert.ok(p.previousSource);}
}
for(const slug of ['laserin-madu-strawberry','beauty-360-body-serum','beauty-360-shower-gel','mecowell-normoten'])assert.equal(knowledge.products.find(p=>p.slug===slug).sourceType,undefined);
assert.doesNotMatch(JSON.stringify(knowledge.products.find(p=>p.slug==='mecowell-normoten')),/amlodipine/i);
const server=createServer(handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
process.env.NINE_ROUTER_BASE_URL='https://fixture.invalid/v1';process.env.NINE_ROUTER_API_KEY='fixture';process.env.CHAT_ALLOWED_ORIGINS=origin;
const native=globalThis.fetch;let slug='mecovit-go';
globalThis.fetch=async(url,options)=>String(url).startsWith('https://fixture.invalid')?Response.json({choices:[{message:{content:JSON.stringify({intent:'ingredients',reply:'Ini komposisi produknya.',products:[slug]})}}]}):native(url,options);
try{
 for(const [id,expected,host] of [['mecovit-go','Vit C, Vit B1, Vit B2, Vit B6, Vit B12, Vit D3, Calcium, Zinc, Vit E','www.hbhoz.id'],['mecovit-d3-1000-iu','Vitamin D3 (cholecalciferol) 1000 IU (25 mcg)','www.halodoc.com'],['beauty-360-body-serum','Komposisi lengkap belum tersedia. Periksa label kemasan produk ini.','mecosin.id']]){
  slug=id;const r=await native(`${origin}/api/chat`,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:`Komposisi ${id}?`}]})});
  assert.equal(r.status,200);const body=await r.json();assert.equal(body.sources[0].description,expected);assert.equal(new URL(body.sources[0].url).hostname,host);assert.equal(body.sources[0].field,'composition');
 }
 console.log('PASS external KB: 16 enriched, 4 retained, exact composition provenance, no unverified doses');
}finally{globalThis.fetch=native;server.closeAllConnections();await new Promise(r=>server.close(r));}
