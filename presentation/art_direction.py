"""Editorial slide compositions with actual website captures, not fake UI evidence."""
from pathlib import Path
from base64 import b64encode
from html import escape as esc
ROOT=Path(__file__).resolve().parent

def img(path,alt,cls=''):
    p=Path(path);mime='image/webp' if p.suffix=='.webp' else 'image/png'
    return f'<img class="{cls}" src="data:{mime};base64,{b64encode(p.read_bytes()).decode()}" alt="{esc(alt)}">'

def points_html(points):
    return ''.join(f'<article><h3>{esc(h)}</h3><p>{esc(t)}</p></article>' for h,t in points)

def compose(title,points,default):
    p=points_html(points)
    if title.startswith('Rencana revamp'):
        logos=img(ROOT/'assets/logo-linc.png','Linc')+'<span>×</span>'+img(ROOT.parent/'site/public/images/logo.webp','Mecosin')
        return '<div class="brand-cover"><div class="cover-logos">'+logos+'</div><div class="cover-topics">Website revamp <span>SEO</span> E-commerce <span>AI live chat</span></div><p>Informasi yang jelas. Discovery yang relevan. Jalur bisnis yang terukur.</p></div>','art-cover'
    if title.startswith('Portfolio'):
        return '<div class="portfolio-gallery">'+''.join('<article>'+img(ROOT/'assets'/f'{name}.png','Screenshot website '+heading)+'<h3>'+heading+'</h3><p>'+esc(body)+'</p></article>' for name,heading,body in [('wingoh','Wingoh','wingoh.com · Website dan WhatsApp enquiry'),('insidevvip','InsideVVIP','International party concierge · Redesign dan lead tracking'),('truecare','Truecare','truecare.id · Redesign dan website maintenance')])+'</div>','art-portfolio'
    if title.startswith('Layanan Linc'):
        return '<div class="service-poster"><div class="service-word">Design.<br>Build.<br>Connect.</div><div class="service-detail">'+p+'</div></div>','art-services'
    if title.startswith('Alasan website'):
        return '<div class="revamp-poster"><div class="big-question">Apa yang harus<br>bisa dilakukan<br>pengunjung?</div><div>'+p+'</div></div>','art-revamp'
    if title.startswith('Cara membangun authority'):
        return '<div class="evidence-photo">'+img(ROOT.parent/'site/public/images/laboratory-large.webp','Foto laboratorium dari aset Mecosin')+'<div>'+p+'</div></div><p class="asset-note">Foto fasilitas dari website Mecosin; bukan bukti sertifikasi atau clinical efficacy.</p>','art-trust'
    if title.startswith('Fungsi AI'):
        return '<div class="chat-layout"><div class="chat-demo"><small>CONTOH SCRIPTED · BUKAN CHAT AKTUAL</small><p class="bubble user">Di mana saya bisa membaca informasi produk?</p><p class="bubble agent">Saya bantu arahkan ke informasi label resmi. Untuk kondisi kesehatan pribadi, konsultasikan dengan dokter atau apoteker.</p><div class="handoff-label">Di luar knowledge base? Human handoff.</div></div><div class="chat-purpose">'+p+'</div></div>','art-chat'
    if title.startswith('Biaya dan keuntungan'):
        return '<div class="economics"><div class="equation"><span>Net sales</span><b>−</b><span>Biaya channel</span><b>=</b><strong>Contribution</strong></div><div class="economics-notes">'+p+'</div></div>','art-economics'
    if title.startswith('Batas AI'):
        return '<div class="safety-layout"><article class="allowed"><small>INFORMASI</small><h3>'+esc(points[0][0])+'</h3><p>'+esc(points[0][1])+'</p></article><article class="restricted"><small>BATAS KEWENANGAN</small><h3>'+esc(points[1][0])+'</h3><p>'+esc(points[1][1])+'</p></article></div><div class="clinical-strip"><b>'+esc(points[2][0])+'</b> '+esc(points[2][1])+'</div>','art-safety'
    if title.startswith('Keputusan untuk scope'):
        return '<div class="decision-layout"><div class="decision-statement">Mulai dari<br>tujuan bisnis.<span>Scope mengikuti kesiapan.</span></div><div>'+p+'</div></div>','art-decision'
    if title.startswith('Content dan technical'):
        return '<div class="page-anatomy"><div class="page-wire"><small>ILUSTRASI STRUKTUR HALAMAN</small><div class="wire-heading">Title & heading</div><div class="wire-copy">Content relevan + sumber</div><div class="wire-links">Internal links <span>CTA</span></div><div class="wire-base">Canonical · sitemap · mobile usability</div></div><div>'+p+'</div></div>','art-anatomy'
    return default,'message-slide'

def competitor():
    return '<div class="competitor-shots">'+''.join('<article>'+img(ROOT/'assets'/f'{name}.png','Screenshot '+domain)+'<div><h3>'+domain+'</h3><p>'+text+'</p></div></article>' for name,domain,text in [('fast','fast1herbal.co.id','Organic posisi 2 untuk “maklon herbal”. Navigasi memisahkan proses, OEM/ODM, fasilitas, dan FAQ.'),('brigit','brigit.id','Organic posisi 3 untuk “maklon herbal”. Dedicated landing page dengan kategori layanan dan CTA konsultasi.')])+'</div><p class="asset-note">Pelajaran untuk Mecosin: buat layanan mudah dievaluasi, lalu sediakan jalur enquiry yang jelas.</p>'

CSS='''
.art-cover header .brands{visibility:hidden}.art-cover .chapter{display:none}.art-cover .content>h2{font-size:48px;text-align:center;max-width:none}.art-cover .lead{text-align:center;max-width:none}.brand-cover{text-align:center;margin-top:48px}.cover-logos{display:flex;align-items:center;justify-content:center;gap:65px;height:145px}.cover-logos img:first-child{width:280px;height:125px;object-fit:contain}.cover-logos img:last-child{width:420px;height:135px;object-fit:contain}.cover-logos span{font-size:50px;color:#87a193}.cover-topics{display:flex;justify-content:center;gap:35px;font-size:25px;margin-top:50px;color:#17613f}.cover-topics span{color:#087fba}.brand-cover>p{font-size:25px;margin-top:28px;color:#56645b}
.portfolio-gallery{display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;margin-top:34px}.portfolio-gallery img{width:100%;height:265px;object-fit:cover;object-position:top;border:1px solid #dce5dc;border-radius:8px;box-shadow:0 10px 24px #16362612}.portfolio-gallery h3{font-size:29px;margin:20px 0 10px}.portfolio-gallery p{font-size:22px;line-height:1.4;color:#56645b}
.service-poster,.revamp-poster,.decision-layout{display:grid;grid-template-columns:1fr 1.1fr;gap:90px;margin-top:40px}.service-word{font-size:88px;line-height:1.08;color:#17613f;letter-spacing:-.045em;font-weight:600}.service-detail article,.revamp-poster article,.decision-layout article{padding:16px 0;border-bottom:1px solid #dce5dc}.service-detail h3,.revamp-poster h3,.decision-layout h3{font-size:27px;margin-bottom:8px}.service-detail p,.revamp-poster p,.decision-layout p{font-size:24px;line-height:1.45;color:#56645b}.big-question{font-size:57px;line-height:1.13;background:#17613f;color:white;border-radius:0 60px 0 0;padding:42px 35px;letter-spacing:-.035em}
.evidence-photo{display:grid;grid-template-columns:1.2fr 1fr;gap:50px;margin-top:30px}.evidence-photo>img{width:100%;height:405px;object-fit:cover;border-radius:12px}.evidence-photo article{margin-bottom:22px}.evidence-photo h3{font-size:27px;margin-bottom:8px}.evidence-photo p{font-size:23px;line-height:1.4;color:#56645b}.asset-note{font-size:17px!important;line-height:1.4;margin-top:15px!important;color:#56645b}
.chat-layout,.page-anatomy{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:34px}.chat-demo{background:#eff7e9;border-radius:24px;padding:27px}.chat-demo small,.page-wire small{font-size:13px;color:#56645b}.bubble{font-size:23px;line-height:1.4;padding:20px;border-radius:18px;margin-top:20px;background:white}.bubble.user{margin-left:60px;background:#087fba;color:white}.bubble.agent{margin-right:28px}.handoff-label{font-size:19px;margin-top:24px;color:#17613f}.chat-purpose article,.page-anatomy article{margin-bottom:24px}.chat-purpose h3,.page-anatomy h3{font-size:28px;margin-bottom:8px}.chat-purpose p,.page-anatomy p{font-size:23px;line-height:1.4;color:#56645b}
.equation{display:flex;align-items:center;justify-content:space-between;font-size:37px;padding:45px 35px;background:#eff7e9;margin-top:40px}.equation b{font-size:48px;font-weight:400;color:#087fba}.equation strong{background:#17613f;color:white;padding:25px}.economics-notes{display:flex;gap:40px;margin-top:32px}.economics-notes article{flex:1}.economics-notes h3{font-size:25px;margin-bottom:12px}.economics-notes p{font-size:22px;line-height:1.4;color:#56645b}
.safety-layout{display:grid;grid-template-columns:1fr 1fr;gap:35px;margin-top:35px}.safety-layout article{padding:35px;border-radius:15px}.allowed{background:#eff7e9}.restricted{background:#fff0e9}.safety-layout small{font-size:15px;letter-spacing:.08em}.safety-layout h3{font-size:32px;margin:22px 0}.safety-layout p{font-size:26px;line-height:1.4}.clinical-strip{font-size:24px;margin-top:30px;line-height:1.5}.clinical-strip b{color:#17613f;margin-right:20px}.decision-statement{font-size:68px;line-height:1.05;letter-spacing:-.04em;color:#17613f;padding-top:20px}.decision-statement span{display:block;font-size:27px;letter-spacing:0;line-height:1.4;margin-top:35px;color:#56645b}
.page-wire{border:2px solid #c2d1c7;border-radius:12px;padding:25px;background:#f7f9f5}.wire-heading{font-size:32px;margin:27px 0 18px;border-bottom:4px solid #17613f;padding-bottom:12px}.wire-copy{background:#eff7e9;padding:25px;font-size:24px}.wire-links{display:flex;justify-content:space-between;font-size:22px;padding:25px 0}.wire-links span{background:#087fba;color:white;padding:7px 25px}.wire-base{font-size:18px;padding-top:16px;border-top:1px solid #dce5dc}
.competitor-shots{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:26px}.competitor-shots img{width:100%;height:270px;object-fit:cover;object-position:top;border:1px solid #dce5dc;border-radius:9px}.competitor-shots h3{font-size:28px;margin:15px 0 8px}.competitor-shots p{font-size:22px;line-height:1.4;color:#56645b}
.slide.active .portfolio-gallery,.slide.active .service-poster,.slide.active .revamp-poster,.slide.active .evidence-photo,.slide.active .chat-layout,.slide.active .economics,.slide.active .safety-layout,.slide.active .decision-layout,.slide.active .page-anatomy,.slide.active .competitor-shots,.slide.active .brand-cover{animation:rise .75s .2s both}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important}}
'''
