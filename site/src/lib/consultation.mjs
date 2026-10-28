// Product-information intake, not diagnosis or a validated medical triage tool.
export function consultation(messages){
 const latest=messages.at(-1).content.toLowerCase();
 const informationOnly=/komposisi|kandungan|ingredients|apa manfaat|lihat produk|jelaskan produk/.test(latest);
 let start=0;
 for(let i=0;i<messages.length;i++)if(messages[i].role==='user'&&/sekarang untuk|ganti.*untuk|beda orang|untuk anak saya|untuk ibu saya|untuk ayah saya/.test(messages[i].content.toLowerCase()))start=i;
 const active=messages.slice(start);const userText=active.filter(m=>m.role==='user').map(m=>m.content.toLowerCase()).join(' ');
 if(!/batuk|pilek|mual|kembung|sakit tenggorokan|keluhan|gejala|sesak|sulit bernapas|nyeri dada|pingsan|demam/.test(userText))return null;
 const respond=(reply,blocked=false)=>({reply,ready:false,blocked});
 let age=null,duration=false,persistent=false,type=false,redFlags=false,risks=false,emergency=false,special=false;
 for(let i=0;i<active.length;i++){
  if(active[i].role!=='user')continue;
  const text=active[i].content.toLowerCase();const prior=active[i-1]?.role==='assistant'?active[i-1].content.toLowerCase():'';
  const ageMatch=text.match(/(?:usia|umur)\s*(\d{1,3})|\b(\d{1,3})\s*(?:tahun|thn|th)\b/);
  if(ageMatch)age=Number(ageMatch[1]||ageMatch[2]);
  else if(/usia/.test(prior)&&/^\d{1,3}$/.test(text.trim()))age=Number(text.trim());
  if(/bayi|usia\s*\d+\s*bulan|umur\s*\d+\s*bulan/.test(text))special=true;
  if(/\b(\d+|satu|dua|tiga|empat|seminggu|sebulan|sehari)\s*(hari|minggu|bulan)|sejak kemarin|kemarin|baru tadi/.test(text))duration=true;
  if(/(?:2|dua|3|tiga|[4-9]|\d{2,})\s*minggu|sebulan|\d+\s*bulan/.test(text)&&/batuk/.test(userText))persistent=true;
  if(/kering|berdahak/.test(text))type=true;
  const no=/^(tidak( ada)?|nggak( ada)?|enggak( ada)?|ga( ada)?|gak( ada)?|tidak semuanya|semua tidak)[.! ]*$/.test(text.trim());
  if(/ada sesak napas, nyeri dada/.test(prior)){
   if(no)redFlags=true;
   else if(/iya|ya\b|ada|sesak|demam|darah|dada/.test(text))emergency=true;
  }
  // Explicit negatives are excluded clause by clause, not by a whole-message 'tidak'.
  for(const clause of text.split(/[,.;]|\btapi\b|\btetapi\b|\bnamun\b/)){
   if(/sesak|sulit bernapas|nyeri dada|batuk darah|batuk berdarah|pingsan|demam tinggi/.test(clause)&&!/^\s*(tidak|tanpa|nggak|enggak|ga|gak)\b/.test(clause))emergency=true;
  }
  if(/riwayat alergi, obat lain/.test(prior)){if(no)risks=true;else special=true;}
  if(/hamil|menyusui|alergi|sedang minum obat|penyakit kronis/.test(text)&&!/^\s*(tidak|tanpa|nggak|enggak|ga|gak)\b/.test(text))special=true;
 }
 if(emergency)return respond('Keluhan seperti sesak napas, nyeri dada, batuk berdarah, atau demam tinggi perlu pertolongan medis segera. Jangan menunggu rekomendasi produk dari chat ini.',true);
 if(informationOnly)return null;
 if(persistent)return respond('Batuk sudah berlangsung lama, sebaiknya periksa ke dokter agar penyebabnya dinilai. Aku bisa menjelaskan produk yang kamu sebutkan, tetapi tidak memilih pengobatan untuk keluhan ini.',true);
 if(special||(age!==null&&age<18))return respond('Untuk anak atau kondisi khusus, pilihan produk perlu dikonfirmasi ke apoteker atau dokter. Data batas usia dan kecocokan tiap varian belum lengkap di sini. Kalau ada nama produk, aku bisa bantu jelaskan informasinya.',true);
 if(age===null||age<1||age>120)return respond('Biar aku pahami dulu, ini untuk siapa dan usianya berapa?');
 if(!duration)return respond('Keluhannya sudah berapa lama?');
 if(/batuk/.test(userText)&&!type)return respond('Batuknya kering atau berdahak?');
 if(!redFlags)return respond('Ada sesak napas, nyeri dada, batuk berdarah, atau demam tinggi?');
 if(!risks)return respond('Ada riwayat alergi, obat lain yang sedang diminum, penyakit kronis, atau kondisi hamil/menyusui? Cukup jawab singkat; tidak perlu kirim data pribadi atau rekam medis.');
 return {ready:true,blocked:false,age};
}
