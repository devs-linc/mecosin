"""Indonesian HTML deck. Direct topic headings; no private client metrics."""
from html import escape
from art_direction import compose, competitor



def populate(slide, photo, row):
    def page(title, lead, points, nodes=None, image=None, source='Usulan pengembangan · Linc × Mecosin', mode='hub'):
        layout = 'process' if title in ('Basic SEO: crawl, index, dan rank', 'Strategi meningkatkan keyword ranking', 'Kesiapan operasional e-commerce', 'Tahapan pengembangan website Mecosin') else 'columns'
        if title.startswith('Portfolio'):
            layout = 'portfolio'
        elif title.startswith('Rencana revamp'):
            layout = 'opening'
        elif title.startswith('Jalur consumer'):
            layout = 'journeys'
        elif title.startswith('Batas AI'):
            layout = 'boundaries'
        elif title.startswith('Mengukur'):
            layout = 'ledger'
        elif title.startswith('Fungsi AI'):
            layout = 'ledger'
        elif title.startswith('Struktur website'):
            layout = 'sitemap'
        body='<div class="message-layout '+layout+'">'+''.join('<article class="message-point"><span class="message-number">'+f'{i+1:02}'+'</span><h3>'+escape(h)+'</h3><p>'+escape(t)+'</p></article>' for i,(h,t) in enumerate(points))+'</div>'
        if layout == 'sitemap':
            body='<div class="sitemap-root">Homepage Mecosin</div>'+body
        body, style = compose(title, points, body)
        slide(title,escape(title),escape(lead),body,note=source,cls=style)
    def comparison(title, lead, headers, rows, source):
        if title.startswith('Website B2B competitor'):
            slide(title,escape(title),escape(lead),competitor(),note=source,cls='art-competitors')
            return
        table='<table class="id-table"><thead><tr>'+''.join('<th scope="col">'+escape(h)+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+escape(v)+'</td>' for v in values)+'</tr>' for values in rows)+'</tbody></table>'
        slide(title,escape(title),escape(lead),'<figure class="visual-art comparison-art">'+table+'</figure>',note=source)

    page('Rencana revamp website Mecosin','Website, SEO, e-commerce, dan AI live chat untuk consumer serta calon business partner.',[
        ('Discovery','Bantu audience menemukan informasi resmi Mecosin.'),('Customer journey','Hubungkan informasi produk dengan purchase options dan partnership enquiries.')],image='botanical.webp')
    page('Layanan Linc: website, SEO, dan automation','Linc menghubungkan website experience dengan kebutuhan bisnis dan pengukuran hasil.',[
        ('Website','Design, development, redesign, dan website maintenance.'),('Search & commerce','SEO, content strategy, serta pengembangan e-commerce.'),('AI & tracking','AI live chat, automation, dan lead tracking.')],['Website','SEO','E-commerce','AI & tracking'])
    page('Portfolio Linc: Wingoh, InsideVVIP, Truecare','Pengalaman website dan customer journey untuk kebutuhan bisnis yang berbeda.',[
        ('Wingoh · wingoh.com','Website design & development dengan jalur enquiry melalui WhatsApp.'),('InsideVVIP','International party concierge service. Website redesign dan lead tracking.'),('Truecare · truecare.id','Website redesign dan website maintenance.')],['Website design','Redesign','Lead tracking','Maintenance'])
    page('Alasan website Mecosin perlu revamp','Prioritas revamp: kejelasan informasi, kepercayaan, dan langkah setelah pengunjung membaca.',[
        ('Informasi mudah ditemukan','Product information harus mudah dijangkau dari search maupun navigasi.'),('Kepercayaan berbasis bukti','Jelaskan perusahaan dan produk lewat informasi yang dapat diverifikasi.'),('Next step yang jelas','Arahkan pengunjung untuk membeli, bertanya, atau mengirim partnership enquiry.')],['Product information','Brand trust','Purchase options','Enquiry'])
    page('Jalur consumer dan business partner','Dua audience membutuhkan informasi dan tujuan kunjungan yang berbeda.',[
        ('Consumer','Cari produk, baca informasi label, lalu pilih purchase channel atau bertanya.'),('Business partner','Pelajari capabilities, dokumen, dan layanan sebelum mengirim enquiry.'),('Business outcome','Ukur purchase dan kualitas enquiry, bukan page views saja.')],['Homepage','Consumer','Business partner','Enquiry','Next step'],mode='branches')
    page('Competitor Mecosin dalam pencarian Google','DataForSEO menunjukkan persaingan search yang lebih luas dari brand sejenis.',[
        ('Consumer search','Media dan marketplace ikut tampil pada pencarian produk dan edukasi.'),('B2B search','Brigit dan FAST muncul untuk keyword “maklon herbal”.'),('Batas analisis','Sampel Google Indonesia, bahasa Indonesia, mobile. Bukan market-share study.')],['Search results','Media','Marketplace','B2B websites','Pilihan pengunjung'],mode='branches',source='DataForSEO Live SERP · 4 Oktober 2026 · Snapshot, bukan ranking permanen')
    comparison('Hasil Google untuk pencarian produk herbal','Organic rank pada snapshot mobile Indonesia; hasil dapat berbeda menurut waktu dan perangkat.',
        ['Keyword','Hasil organic','Peluang Mecosin'],[
        ['obat batuk herbal','1. AI Care · 2. Detik · 3. Lazada','Educational content dan product page harus menjawab intent yang berbeda.'],
        ['suplemen pelancar asi','1. Shopee · 2. Lazada · 3. Tokopedia','Sediakan informasi resmi dan purchase options yang jelas.'],
        ['Alasan pemilihan','Kategori Laserin (batuk) dan Lancar ASI (menyusui)','Eksplorasi non-branded intent; bukan target keyword final. Volume dan prioritas belum divalidasi.']],
        'DataForSEO · Indonesia / mobile · 4 Oktober 2026 · Keyword eksplorasi, bukan audit ranking seluruh Mecosin')
    comparison('Website B2B competitor: FAST dan Brigit','Keyword “maklon herbal”; struktur dan content halaman diperiksa langsung, bukan conversion performance.',
        ['Website / organic rank','Yang terlihat','Pelajaran untuk Mecosin'],[
        ['fast1herbal.co.id · posisi 2','Navigasi proses, OEM/ODM, sediaan, fasilitas, laboratorium, FAQ.','Pisahkan informasi capabilities dan layanan agar mudah dievaluasi.'],
        ['brigit.id · posisi 3','Dedicated maklon landing page, kategori layanan, FAQ, CTA konsultasi.','Jawab pertanyaan awal dan jelaskan langkah memulai enquiry.']],
        'DataForSEO mobile + halaman publik · Klaim perusahaan tidak diaudit · 4 Oktober 2026')
    page('Halaman yang perlu disiapkan Mecosin','Rekomendasi berdasarkan search intent dan benchmark competitor; capability perlu dikonfirmasi.',[
        ('Product pages','Informasi resmi, ingredients, label, FAQ, dan purchase options.'),('Knowledge hub','Edukasi dengan sumber terpercaya dan qualified review.'),('Partnership pages','Capabilities terverifikasi, dokumen, dan enquiry flow.')],['Kebutuhan audience','Products','Education','Partnership','Tindakan relevan'],mode='branches')
    page('Basic SEO: crawl, index, dan rank','SEO membantu search engine menemukan, memahami, dan menilai relevansi halaman.',[
        ('Crawl','URL ditemukan lewat links dan sitemap; halaman penting harus dapat diakses.'),('Index','Search engine memproses content dan struktur halaman.'),('Rank','Hasil dipilih sesuai query dan kualitas. Indexing tidak menjamin ranking.')],['Crawl','Index','Rank','Organic visit'],mode='flow',source='Google Search Central · SEO Starter Guide')
    comparison('Perbedaan organic traffic dan paid traffic','Traffic juga bisa berasal dari direct, referral, dan social. Ads tidak membeli organic ranking.',
        ['Aspek','Organic search','Paid traffic'],[
        ['Sumber','Unpaid search results','Penempatan iklan'],['Investasi','SEO, content, review, maintenance','Ad spend, creative, campaign management'],['Peran','Membangun discovery secara bertahap','Menguji demand dan menjangkau audience'],['Faktor hasil','Relevansi, kualitas, competition','Budget, targeting, creative, landing page']],
        'Organic bukan gratis · Kedua channel membutuhkan conversion path dan tidak menjamin sales')
    comparison('Contoh organic traffic non-brand: Wingoh','Contoh pencarian jenis produk dan supplier yang membawa audience ke Wingoh tanpa mencari nama brand.',
        ['Keyword non-brand','Impressions / CTR','Relevansi untuk Mecosin'],[
        ['thinwall','14.891 impressions · CTR 0,07%','Audience mencari jenis produk, bukan nama perusahaan. Content kategori dapat membuka discovery baru.'],
        ['pabrik cup plastik','158 impressions · CTR 5,70%','Intent mencari supplier lebih spesifik. Padankan query dengan halaman layanan yang relevan.'],
        ['sendok plastik','6.138 impressions · CTR 0,11%','Exposure besar belum tentu menghasilkan banyak clicks; relevansi dan snippet perlu dievaluasi.']],
        'Contoh data Google Search Console · Impressions = tampil di hasil pencarian · CTR = persentase impressions menjadi klik, bukan conversion penjualan')
    page('Content dan technical SEO yang dikerjakan','Setiap halaman perlu tujuan, struktur yang jelas, dan next step yang relevan.',[
        ('Content','Gunakan title, heading, dan jawaban yang sesuai kebutuhan pencarian.'),('Technical foundation','Rapikan internal links, sitemap, canonical, dan mobile usability.'),('Customer journey','Hubungkan edukasi ke product information atau enquiry yang relevan.')],['Useful content','Internal links','Indexability','Mobile usability'])
    page('Cara membangun authority dan trust','Authority dibangun lewat kualitas informasi dan reputasi, bukan sekadar skor tool SEO.',[
        ('Expertise','Tampilkan author atau qualified reviewer, referensi, dan tanggal pembaruan.'),('Bukti perusahaan','Gunakan dokumen, fasilitas, registrasi, dan sertifikasi yang sudah diverifikasi.'),('Reputasi relevan','Peroleh relevant backlinks melalui publikasi, partnership, dan content yang berguna.')],image='laboratory-large.webp',source='Health content perlu qualified review · Hindari spam links dan unsupported claims')
    page('Strategi meningkatkan keyword ranking','Prioritaskan keyword yang sesuai bisnis; jangan mengejar keyword luas tanpa melihat intent.',[
        ('Validasi peluang','Periksa search volume, competition, intent, serta halaman yang sedang tampil.'),('Bangun dan evaluasi','Publikasikan halaman relevan, hubungkan internal links, lalu perbaiki berdasarkan data.'),('Ukur hasil','Gunakan Search Console untuk query dan clicks; analytics untuk enquiries dan purchases.')],['Research','Publish','Measure','Improve'],mode='flow',source='Volume dan difficulty belum diukur pada sampel ini · Tidak ada jaminan posisi pertama')
    page('Mengukur traffic, lead, dan penjualan','Definisikan conversion dan baseline sebelum menilai hasil revamp.',[
        ('Discovery','Impressions, organic clicks, query, dan landing page dari Search Console.'),('Conversion','Track form submission, purchase, dan klik WhatsApp dengan consent yang sesuai.'),('Lead quality','Pisahkan klik WhatsApp, percakapan masuk, qualified lead, dan transaksi.')],['Search impression','Website visit','Enquiry / purchase','Business outcome'],mode='flow')
    comparison('Own store vs marketplace','Kedua channel bisa berjalan bersama dengan peran dan biaya berbeda.',
        ['Aspek','Marketplace','Own store'],[
        ['Audience','Audience belanja sudah tersedia','Traffic perlu dibangun'],['Experience','Mengikuti fitur dan kebijakan platform','Content dan customer journey lebih fleksibel'],['Biaya','Seller fees, promosi, ads, operasional','Acquisition, payment, technology, operasional'],['Relationship','Dalam batas kebijakan platform','Direct relationship dengan consent dan tata kelola data']],
        'Perbandingan kualitatif · Biaya aktual bergantung pada kategori, program, dan integrasi')
    comparison('Perbandingan cost marketplace dan own store','Ilustrasi order Rp100.000. Fee marketplace 8% adalah asumsi simulasi, bukan tarif kategori Mecosin.',
        ['Komponen','Marketplace','Own store'],[
        ['Biaya transaksi contoh','8% asumsi + Rp1.250/order = Rp9.250','QRIS 0,7% = Rp700; alternatif VA Rp4.000–5.000'],
        ['Biaya tambahan','Ads, program promo/affiliate, subsidi ongkir dan diskon sesuai keikutsertaan','SEO/ads, domain, hosting/platform, maintenance, keamanan dan integrasi'],
        ['Operasional keduanya','Produk, packing, pengiriman, returns, dan customer support','Produk, packing, pengiriman, returns, dan customer support'],
        ['Kesimpulan','Bandingkan potongan aktual Seller Centre dan program yang digunakan','Fee payment lebih kecil belum berarti total cost lebih murah; acquisition dan fixed costs tetap dihitung']],
        'Midtrans: midtrans.com/id/biaya · Shopee: seller.shopee.co.id/edu/article/25787 · Pajak/ketentuan tambahan belum dihitung')
    comparison('Payment, pengiriman, dan operasi own store','Mulai dengan opsi yang familiar; setiap provider perlu onboarding, integrasi, dan pengujian.',
        ['Kebutuhan','Contoh opsi','Yang perlu disiapkan'],[
        ['Payment','QRIS · Virtual Account · kartu debit/kredit (gateway, misalnya Midtrans)','Verifikasi merchant, settlement, webhook status pembayaran, refund; fee sesuai metode.'],
        ['Pengiriman','JNE · J&T · SiCepat (langsung atau aggregator seperti Biteship)','Alamat asal, berat/dimensi, tarif checkout, label/resi, pickup/drop-off, tracking dan klaim.'],
        ['Website & stock','Catalog, cart, checkout, dashboard order dan stock','Domain/hosting, sinkronisasi stock, keamanan, backup, privacy, maintenance.'],
        ['Tim operasional','Admin order · fulfilment · customer support','Packing, batas waktu proses, retur/refund; ongkir ditanggung pembeli atau disubsidi sesuai kebijakan.']],
        'Contoh provider, bukan partnership Linc · midtrans.com/id/biaya · biteship.com/id/produk/rates')
    page('Fungsi AI live chat untuk Mecosin','Linc mengonfigurasi AI berdasarkan approved knowledge base dan alur enquiry Mecosin.',[
        ('Consumer support','Bantu menemukan informasi label, FAQ, dan purchase channel.'),('B2B qualification','Kumpulkan kebutuhan dan contact dengan consent; kirim summary ke Sales.'),('Human handoff','Di luar knowledge base, teruskan ke tim. AI tidak mendiagnosis; pertanyaan medis ke dokter atau apoteker.')],['Pertanyaan','Approved knowledge','Jawaban / handoff','Human follow-up'],mode='flow')
    page('Struktur website Mecosin yang diusulkan','Homepage memisahkan kebutuhan consumer dan business partner.',[
        ('Consumer pages','Product catalog, product detail, knowledge hub, serta purchase options.'),('Company & partnership','About, credibility, capabilities, dan enquiry flow.'),('Support & measurement','AI live chat terbatas dan tracking; commerce sesuai kesiapan operasi.')],image='laserin-dewasa.webp')
    page('Tahapan pengembangan website Mecosin','Urutan usulan; bukan komitmen timeline, budget, atau fitur aktif.',[
        ('Foundation','Mobile-first website, product pages, partnership pages, SEO, dan tracking.'),('Content & support','Knowledge hub, verified documents, enquiry workflow, dan AI live chat.'),('Commerce','Payment dan fulfilment teruji, support, lalu retention sesuai kebutuhan.')],['Foundation','Content & support','Commerce','Owner review'],mode='flow')
    page('Keputusan untuk scope tahap pertama','Tentukan business priority dan penanggung jawab sebelum mengunci fitur serta jadwal.',[
        ('Business priority','Consumer sales, qualified B2B enquiries, atau brand discovery.'),('Content readiness','Product labels, assets, dokumen, dan penanggung jawab review.'),('Operational owner','Pemilik enquiry, support, payment, stock, dan maintenance.')],['Business goal','Content readiness','Team ownership','Agreed scope'])
    slide('Diskusikan website Mecosin bersama Linc','Diskusikan website Mecosin<br>bersama Linc','Tentukan prioritas, scope, dan langkah pengembangan berikutnya.', '<div class="closing-cta"><a href="https://linc.id" target="_blank" rel="noopener noreferrer">linc.id <span aria-hidden="true">↗</span></a><div class="closing-contacts"><div><span>Email</span><a href="mailto:George@linc.id">George@linc.id</a></div><div><span>WhatsApp / telepon</span><a href="https://wa.me/628111666218" target="_blank" rel="noopener noreferrer">+62 811-1666-218</a></div></div><p>Website · SEO · E-commerce · AI live chat</p></div>',cls='cta-slide',note='Linc × Mecosin')
