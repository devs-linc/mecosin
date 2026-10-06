import products from '../data/products.json';
import { CART_KEY, cleanCart, totals, price } from './cart.mjs';

export function setup() {
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s);
  const all = <T extends HTMLElement = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];
  let lang = document.documentElement.lang === 'id' ? 'id' : 'en';
  try { const saved=localStorage.getItem('mecosin-language');if(saved==='id'||saved==='en')lang=saved; } catch { /* Storage is optional. */ }
  const t = (id: string, en: string) => lang === 'en' ? en : id;
  const money = (n: number) => `${n < 0 ? '−' : ''}Rp${Math.abs(n).toLocaleString(lang === 'en' ? 'en-US' : 'id-ID')}`;
  let cart = [] as {id: string; qty: number}[];
  let storageOK = true;
  try { cart = cleanCart(localStorage.getItem(CART_KEY)); localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { storageOK = false; }
  const status = $('#cart-status');
  const drawer = $<HTMLDialogElement>('#cart-drawer');
  let cartTrigger: HTMLElement | null = null;
  function openCart(trigger: HTMLElement) {
    if (!drawer || drawer.open) return;
    cartTrigger = trigger;
    drawer.showModal();
    document.documentElement.classList.add('cart-open');
    renderCart();
  }
  drawer?.addEventListener('close', () => {
    document.documentElement.classList.remove('cart-open');
    drawer.querySelector('[data-cart-items]')?.replaceChildren();
    cartTrigger?.focus();
  });
  all('[data-close-cart]').forEach(button => button.addEventListener('click', () => drawer?.close()));
  drawer?.addEventListener('click', event => {
    const bounds = drawer.getBoundingClientRect();
    if (event.target === drawer && (event.clientX < bounds.left || event.clientX > bounds.right)) drawer.close();
  });
  all<HTMLAnchorElement>('[data-open-cart]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); openCart(link);
  }));
  let statusTimer: ReturnType<typeof setTimeout>;
  function announce(text: string) {
    if (!status) return;
    clearTimeout(statusTimer); status.textContent = text;
    statusTimer = setTimeout(() => { status.textContent = ''; }, 6500);
  }
  function save() {
    cart = cleanCart(cart);
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { storageOK = false; }
    renderCart();
  }
  const promo = $('#demo-promo') as HTMLInputElement | null;
  function renderCart() {
    const value = totals(cart, promo?.checked || false);
    all('[data-cart-count]').forEach(e => e.textContent = String(value.count));
    all('[data-totals]').forEach(e => {
      e.replaceChildren();
      for (const [label, amount] of [[t('Subtotal','Subtotal'),value.subtotal],[t('Diskon','Discount'),-value.discount],[t('Ongkir','Shipping'),value.shipping],[t('Pajak','Tax'),value.tax],[t('Total','Total'),value.total]] as [string,number][]) {
        const row=document.createElement('div'); row.className='total-row';
        const title=document.createElement('span');title.textContent=label;
        const sum=document.createElement('strong');sum.textContent=money(amount); row.append(title,sum);e.append(row);
      }
    });
    all('[data-cart-subtotal]').forEach(e => e.textContent = money(value.subtotal));
    for (const items of all('#cart-items, [data-checkout-items], #cart-drawer[open] [data-cart-items]')) {
      items.replaceChildren();
      for(const row of cart) {
        const product=products.find(p=>p.slug===row.id)!;
        const item=document.createElement('article');item.className='cart-row';item.dataset.cartId=row.id;
        const img=document.createElement('img');img.src=product.image;img.alt=product.name;img.width=100;img.height=100;
        const info=document.createElement('div');const link=document.createElement('a');link.href=`/produk/${product.slug}/`;link.textContent=product.name;
        const cost=document.createElement('p');cost.textContent=`${money(price(row.id))} / ${t('unit','unit')}`;
        const control=document.createElement('div');control.className='quantity';
        for(const [delta,label] of [[-1,t('Kurangi','Decrease')],[1,t('Tambah','Increase')]] as [number,string][]) {
          const b=document.createElement('button');b.type='button';b.textContent=delta===1?'+':'−';b.dataset.delta=String(delta);b.setAttribute('aria-label',`${label} ${product.name}`);b.disabled=delta===1&&row.qty>=99;
          b.addEventListener('click',()=>{const next=cart.map(x=>x.id===row.id?{...x,qty:x.qty+delta}:x);cart=cleanCart(next);save(); announce(t('Jumlah diperbarui.','Quantity updated.')); const replacement=items.querySelector<HTMLButtonElement>(`[data-cart-id="${row.id}"] [data-delta="${delta}"]`); if(replacement&&!replacement.disabled)replacement.focus();else (items.querySelector('button')||(drawer?.open ? drawer.querySelector<HTMLElement>('[data-close-cart]') : $('#cart-empty a')))?.focus();});
          control.append(b);if(delta===-1){const count=document.createElement('span');count.textContent=String(row.qty);count.setAttribute('aria-label',t('Jumlah','Quantity'));control.append(count);}
        }
        const remove=document.createElement('button');remove.type='button';remove.className='remove';remove.textContent=t('Hapus','Remove');remove.setAttribute('aria-label',`${t('Hapus','Remove')} ${product.name}`);remove.addEventListener('click',()=>{cart=cart.filter(x=>x.id!==row.id);save();announce(t('Produk dihapus.','Product removed.'));(items.querySelector('button')||(drawer?.open ? drawer.querySelector<HTMLElement>('[data-close-cart]') : $('#cart-empty a')))?.focus();});
        const line=document.createElement('strong');line.textContent=money(price(row.id)*row.qty);line.className='line-total';
        info.append(link,cost,control,remove);item.append(img,info,line);items.append(item);
      }
    }
    const empty=$('#cart-empty');if(empty)empty.hidden=value.count>0;
    all('[data-drawer-empty]').forEach(e => e.hidden = value.count > 0);
    all('[data-drawer-filled]').forEach(e => e.hidden = !value.count);
    const checkoutLink=$('#checkout-link');if(checkoutLink)checkoutLink.hidden=!value.count;
    const form=$('#checkout-form');const checkoutEmpty=$('#checkout-empty');
    if(form && $('#completion')?.hidden)form.hidden=!value.count;
    if(checkoutEmpty)checkoutEmpty.hidden=!!value.count||!$('#completion')?.hidden;
  }
  all<HTMLButtonElement>('[data-add]').forEach(button=>{button.disabled=false;button.addEventListener('click',()=>{
    const id=button.dataset.add!;if(!products.some(p=>p.slug===id))return;
    const quantity = button.hasAttribute('data-use-quantity') ? $<HTMLInputElement>('#product-quantity') : null;
    if (quantity && (!quantity.reportValidity() || !Number.isSafeInteger(Number(quantity.value)) || Number(quantity.value)<1 || Number(quantity.value)>99)) return;
    const qty = quantity ? Number(quantity.value) : 1;
    const existing=cart.find(row=>row.id===id);
    if((existing?.qty||0)+qty>99){announce(t('Maksimal 99 unit per produk.','Maximum 99 units per product.'));return;}
    cart=cleanCart([...cart,{id,qty}]);save();
    if(button.hasAttribute('data-buy-now') && storageOK){location.assign('/checkout/');return;}
    openCart(button);announce(t('Ditambahkan ke keranjang.','Added to cart.')+(storageOK?'':t(' Penyimpanan diblokir; keranjang hanya tersedia di halaman ini.',' Storage blocked; cart is available on this page only.')));
  });});
  const productQuantity=$<HTMLInputElement>('#product-quantity');
  productQuantity?.addEventListener('input',()=>{const qty=Number(productQuantity.value);const subtotal=$('[data-detail-subtotal]');if(subtotal)subtotal.textContent=Number.isSafeInteger(qty)&&qty>=1&&qty<=99?money(qty*25000):'Jumlah tidak valid';});
  all<HTMLButtonElement>('[data-review-filter]').forEach(button=>button.addEventListener('click',()=>{all('[data-review-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const result=$('#review-result');if(result)result.textContent=`${button.textContent}: belum ada ulasan pembeli aktual.`;}));
  all<HTMLButtonElement>('[data-favourite]').forEach(button=>button.addEventListener('click',()=>{const liked=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(liked));button.textContent=liked?'♥':'♡';button.setAttribute('aria-label',liked?'Batal sukai produk':'Sukai produk');}));
  all<HTMLButtonElement>('[data-share]').forEach(button=>button.addEventListener('click',async()=>{const status=$('[data-share-status]');try{await navigator.clipboard.writeText(location.href);if(status)status.textContent='Tautan produk disalin.';}catch{if(status)status.textContent='Salin alamat halaman dari browser untuk membagikan produk.';}}));
  promo?.addEventListener('change',()=>{renderCart();announce(t('Total simulasi diperbarui.','Simulated total updated.'));});
  window.addEventListener('storage',event=>{if(event.key===CART_KEY){cart=cleanCart(event.newValue);renderCart();announce(t('Keranjang disinkronkan.','Cart synchronized.'));}});

  const menu=$<HTMLButtonElement>('.menu-toggle');
  if(menu){menu.hidden=false;const close=()=>{menu.setAttribute('aria-expanded','false');menu.textContent='Menu ☰';};menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?t('Tutup ×','Close ×'):'Menu ☰';});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){close();menu.focus();}});document.addEventListener('click',e=>{if(!(e.target as Element).closest('.site-header'))close();});$('#main-nav')?.addEventListener('click',e=>{if((e.target as Element).closest('a'))close();});}

  const companyMenu=$<HTMLDetailsElement>('.company-nav');
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&companyMenu?.open){companyMenu.open=false;companyMenu.querySelector('summary')?.focus();}});
  document.addEventListener('click',e=>{if(companyMenu&&!(e.target as Element).closest('.company-nav'))companyMenu.open=false;});

  const search=$<HTMLInputElement>('#product-search'),brand=$<HTMLSelectElement>('#brand-filter'),need=$<HTMLSelectElement>('#need-filter');
  const minPrice=$<HTMLInputElement>('#price-min'),maxPrice=$<HTMLInputElement>('#price-max'),sort=$<HTMLSelectElement>('#product-sort');
  const catalogItems=all('[data-product]');
  function filter(update=true){
    if(!search||!brand||!need)return;
    let count=0;catalogItems.forEach(p=>{p.hidden=!!((brand.value&&p.dataset.brand!==brand.value)||(need.value&&p.dataset.need!==need.value)||!p.dataset.name?.includes(search.value.trim().toLocaleLowerCase('id'))||(minPrice?.value&&25000<Number(minPrice.value))||(maxPrice?.value&&25000>Number(maxPrice.value)));if(!p.hidden)count++;});
    const ordered=[...catalogItems];if(sort?.value==='name')ordered.sort((a,b)=>(a.dataset.name||'').localeCompare(b.dataset.name||'','id'));
    ordered.forEach(p=>p.parentElement?.append(p));
    $('#result-count')!.textContent=`${count} ${t('produk','products')}`;$('.empty-state')!.hidden=count>0;
    if(update){const u=new URL(location.href);for(const [key,value] of [['merek',brand.value],['kebutuhan',need.value],['q',search.value]])value?u.searchParams.set(key,value):u.searchParams.delete(key);history.replaceState(null,'',u);}
  }
  if(search&&brand&&need){$('.catalog-tools')!.hidden=false;const q=new URLSearchParams(location.search);brand.value=[...brand.options].some(o=>o.value===q.get('merek'))?q.get('merek')!:'';need.value=[...need.options].some(o=>o.value===q.get('kebutuhan'))?q.get('kebutuhan')!:'';search.value=(q.get('q')||'').slice(0,120);[search,brand,need].forEach(el=>el.addEventListener('input',()=>filter()));$('#reset-catalog')?.addEventListener('click',()=>{search.value='';brand.value='';need.value='';const u=new URL(location.href);u.searchParams.delete('q');history.replaceState(null,'',u);filter();search.focus();});}
  [minPrice,maxPrice,sort].forEach(el=>el?.addEventListener('input',()=>filter()));
  const filterPanel=$<HTMLDetailsElement>('.shop-filters');if(filterPanel&&matchMedia('(max-width:760px)').matches)filterPanel.open=false;
  $('#reset-catalog')?.addEventListener('click',()=>{if(minPrice)minPrice.value='';if(maxPrice)maxPrice.value='';if(sort)sort.value='recommended';filter();});

  const checkout=$<HTMLFormElement>('#checkout-form');
  if(checkout){checkout.addEventListener('submit',event=>{event.preventDefault();if(!checkout.reportValidity()||!totals(cart).count)return;cart=[];checkout.reset();checkout.hidden=true;$('#completion')!.hidden=false;$('#completion')!.focus();if(promo){promo.checked=false;promo.disabled=true;}save();if(status)status.textContent='';});checkout.querySelector('fieldset')!.disabled=false;}
  const partner=$<HTMLFormElement>('#partner-form');
  const chatAttached=new URLSearchParams(location.search).get('chat')==='partnership';
  if(partner){partner.addEventListener('submit',event=>{event.preventDefault();if(!partner.reportValidity())return;const topic=$<HTMLSelectElement>('#partner-topic')!,region=$<HTMLSelectElement>('#partner-region')!;$('#partner-preview')!.textContent=t('PRATINJAU LOKAL — tidak dikirim. Topik: ','LOCAL PREVIEW — not sent. Topic: ')+topic.selectedOptions[0].textContent+'; '+t('Wilayah: ','Region: ')+region.selectedOptions[0].textContent+(chatAttached&&$<HTMLInputElement>('#attach-chat')!.checked?t('. Ringkasan chat: pengunjung mengeksplorasi informasi kemitraan; ketersediaan perlu dikonfirmasi.','. Chat summary: visitor explored partnership information; availability needs confirmation.'):'');});partner.querySelector('fieldset')!.disabled=false;if(chatAttached){$<HTMLInputElement>('#attach-chat')!.checked=true;$<HTMLSelectElement>('#partner-topic')!.value='manufacturing';}}

  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const video=$<HTMLVideoElement>('#hero-video'),toggle=$<HTMLButtonElement>('#video-toggle');
  let mediaFailed=false;
  function updateVideo(){if(toggle&&video){const label=mediaFailed?t('Video tidak tersedia','Video unavailable'):video.paused?t('Putar video','Play video'):t('Jeda video','Pause video');toggle.setAttribute('aria-label',label);toggle.setAttribute('title',label);toggle.dataset.paused=String(video.paused);}}
  if(video&&toggle){toggle.hidden=false;const play=async()=>{if(!video.getAttribute('src'))video.src=video.dataset.src!;video.muted=true;try{await video.play();}catch{updateVideo();}};video.addEventListener('playing',()=>{video.classList.add('playing');updateVideo();});video.addEventListener('pause',updateVideo);video.addEventListener('error',()=>{mediaFailed=true;video.classList.remove('playing');toggle.disabled=true;updateVideo();});toggle.addEventListener('click',()=>video.paused?void play():video.pause());motion.addEventListener('change',()=>{if(motion.matches){video.pause();video.classList.remove('playing');video.removeAttribute('autoplay');video.removeAttribute('src');video.load();updateVideo();}});if(!motion.matches){video.autoplay=true;void play();}}

  const chatLog=$('#chat-log');
  all<HTMLButtonElement>('[data-chat]').forEach(button=>{button.disabled=false;button.addEventListener('click',()=>{
    const type=button.dataset.chat;let reply='';
    if(type==='product'){const product=products.find(p=>p.slug===$<HTMLSelectElement>('#chat-product')?.value);reply=product?`${product.name} — ${t('Kutipan sumber Bahasa Indonesia, bukan saran medis:','Indonesian source excerpt, not medical advice:')} ${product.excerpt} ${t('Baca label untuk informasi lengkap.','Read the label for complete information.')}`:t('Pilih produk dahulu. Bantuan ini hanya membaca katalog, bukan memilih produk untuk gejala Anda.','Choose a product first. This guide reads the catalog, not matches products to symptoms.');}
    if(type==='safety')reply=t('Bantuan ini tidak memberi dosis, diagnosis, rekomendasi gejala atau jaminan keamanan. Tanyakan pada apoteker/dokter, terutama untuk interaksi obat, anak, kehamilan atau menyusui. Untuk gejala berat atau darurat, segera cari pertolongan medis.','This guide gives no dosage, diagnosis, symptom recommendations or safety assurances. Ask a pharmacist/doctor, especially about interactions, children, pregnancy or breastfeeding. Seek immediate medical help for severe symptoms or emergencies.');
    if(type==='certification')reply=t('Dokumen BPOM/Halal terverifikasi belum tersedia di sini. Periksa label, basis data regulator atau hubungi Mecosin. Status sertifikasi perlu dikonfirmasi.','Verified BPOM/Halal documents are unavailable here. Check the label, regulator database or contact Mecosin. Certification status needs confirmation.');
    if(type==='partnership'){reply=t('Sumber Mecosin mencantumkan toll manufacturing, market management dan importasi. Cakupan, kapasitas dan ekspor perlu dikonfirmasi. Buka pratinjau B2B untuk memilih topik dan wilayah. Hanya ringkasan topik tetap yang dilampirkan, tidak ada pesan yang dikirim.','Mecosin lists toll manufacturing, market management and importation. Scope, capacity and export availability need confirmation. Open the B2B preview to choose a topic and region. Only a fixed topic summary is attached; no message is sent.');$('#chat-partner-link')!.setAttribute('href','/kemitraan/?chat=partnership#form');}
    if(type==='order')reply=t('Semua harga, promo, ongkir dan pajak adalah simulasi. Checkout tidak membuat pesanan atau pembayaran. Hanya ID produk dan jumlah tersimpan pada browser.','All prices, promotions, shipping and tax are simulated. Checkout creates no order or payment. Only product IDs and quantities are saved in the browser.');
    const bubble=document.createElement('p');bubble.className='chat-bubble';bubble.textContent=`${t('Informasi','Information')}: ${reply}`;if(type==='product'){const selected=products.find(p=>p.slug===$<HTMLSelectElement>('#chat-product')?.value);if(selected){const link=document.createElement('a');link.className='source-link';link.href=`/produk/${selected.slug}/`;link.textContent=t('Baca kutipan dan sumber produk ↗','Read the product excerpt and source ↗');bubble.append(link);}}chatLog?.append(bubble);if(chatLog){while(chatLog.children.length>8)chatLog.firstElementChild?.remove();chatLog.scrollTop=chatLog.scrollHeight;}
  });});
  const reset=$<HTMLButtonElement>('#chat-reset');if(reset){reset.disabled=false;reset.addEventListener('click',()=>{chatLog?.replaceChildren();$('#chat-partner-link')!.setAttribute('href','/kemitraan/#form');});}
  const loyalty=$<HTMLButtonElement>('#loyalty-try');if(loyalty){loyalty.disabled=false;loyalty.addEventListener('click',()=>{const amount=Number($<HTMLSelectElement>('#loyalty-amount')?.value);if(![50000,100000,200000].includes(amount))return;$('#loyalty-result')!.textContent=`${amount/10000} ${t('poin contoh. Tidak ditambahkan ke saldo; tidak ada poin yang diperoleh.','example points. Not added to a balance; no points earned.')}`;});}

  function language(){document.documentElement.lang=lang;all<HTMLOptionElement>('option[data-id]').forEach(o=>o.textContent=lang==='en'?o.dataset.en!:o.dataset.id!);renderCart();filter(false);updateVideo();if($('#partner-preview')&&partner)$('#partner-preview')!.textContent=t('Pilih topik dan wilayah untuk membuat pratinjau lokal.','Choose a topic and region to create a local preview.');if($('#loyalty-result'))$('#loyalty-result')!.textContent='';}
  const languageSelect=$<HTMLSelectElement>('#language');if(languageSelect){$('.language-control')!.hidden=false;languageSelect.value=lang;languageSelect.addEventListener('change',()=>{lang=languageSelect.value==='en'?'en':'id';try{localStorage.setItem('mecosin-language',lang);}catch{/* preference stays page-local */}language();});}
  language();
  if(!storageOK)announce(t('Penyimpanan browser diblokir. Keranjang hanya tersedia di halaman ini.','Browser storage blocked. Cart is available on this page only.'));
}
