/* Gambar kartu T2-T4, Kartu Kilat, dan kartu transfer Pawai (GDD 6.5, 11). Bidang 296x204, rig tokoh sama dengan adegan.
   Kunci: '<tempat>-<bahaya>-<kartu>', '<tempat>-kilat-<bahaya>', 'transfer-<kunci>'. */
(function (root) {
  var S = root.Seni, C = S.C, g = S.g, G = root.GAMBAR;
  function gabung(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b || {}) o[k] = b[k]; return o; }
  function tk(id, pose, x, y, s, o) { return g('translate(' + x + ',' + y + ')' + (s && s !== 1 ? ' scale(' + s + ')' : ''), S.tokoh(id, pose, o || {})); }
  /* ---------- latar kartu ---------- */
  function luar(isi, tanah) { return S.path('M0,0 H296 V160 H0 Z', C.langitMuda) + S.path('M0,154 C80,146 200,148 296,154 V204 H0 Z', tanah || '#F3DCBD') + isi; }
  function dalam(isi) { return S.path('M0,0 H296 V150 H0 Z', '#FFF1D6') + S.path('M0,150 H296 V204 H0 Z', '#E4DCF2') + S.path('M0,150 H296', 'none', 3, '#CFC4E6') + isi; }
  function kamarMandi(isi) {
    var d = '';
    for (var x = 0; x <= 296; x += 32) d += 'M' + x + ',0 V150 ';
    for (var y = 0; y <= 150; y += 32) d += 'M0,' + y + ' H296 ';
    return S.path('M0,0 H296 V150 H0 Z', '#CFEFFA') + S.path(d, 'none', 1.6, '#A9DCEF') + S.path('M0,150 H296 V204 H0 Z', '#E7F6FC') + isi;
  }
  function jalanan(isi, opsi) {
    opsi = opsi || {};
    var z = '';
    if (opsi.zebra) for (var i = 0; i < 5; i++) z += S.kotak(opsi.zebra + i * 0, 108 + i * 16, 110, 9, 2, C.krem);
    return S.path('M0,0 H296 V96 H0 Z', C.langitMuda) + S.path('M0,96 H296 V104 H0 Z', '#D9D2E8') + S.path('M0,104 H296 V186 H0 Z', '#8E86A6') +
      (opsi.zebra ? z : S.path('M10,146 H60 M110,146 H160 M210,146 H260', 'none', 5, C.krem)) + S.path('M0,186 H296 V204 H0 Z', '#D9D2E8') + isi;
  }
  function gang(isi, got) {
    return S.path('M0,0 H296 V92 H0 Z', C.langitMuda) + S.path('M0,92 H296 V204 H0 Z', '#D6CFE4') + S.path('M0,92 H296', 'none', 3, '#BDB4D3') +
      (got ? S.path('M0,176 H296 V204 H0 Z', '#7EC8E8') + S.path('M0,172 H296', 'none', 7, '#A79FC2') + S.path('M20,190 q20,-6 40,0 M140,192 q20,-6 40,0', 'none', 3, C.putih) : '') + isi;
  }
  function lapangan(isi) { return S.path('M0,0 H296 V110 H0 Z', C.langitMuda) + S.path('M0,110 H296 V204 H0 Z', '#8ED17A') + S.path('M0,170 C100,160 200,160 296,170', 'none', 4, C.putih, ' opacity=".7"') + isi; }
  function kolam(isi, dalamKolam) {
    return S.path('M0,0 H296 V96 H0 Z', C.langitMuda) + S.path('M0,96 H296 V128 H0 Z', '#E4DCF2') + S.path('M0,128 H296 V204 H0 Z', dalamKolam ? '#3E9FD6' : '#6CC6EE') +
      S.path('M0,128 H296', 'none', 6, '#C9C2DE') + S.path('M30,160 q20,-8 40,0 M150,176 q20,-8 40,0 M220,150 q14,-6 28,0', 'none', 3, C.putih) + isi;
  }
  /* ---------- properti ---------- */
  function stopkontak(x, y) { return S.kotak(x - 14, y - 14, 28, 28, 6, C.putih, 3) + S.lingkar(x - 5, y, 2.6, C.terong) + S.lingkar(x + 5, y, 2.6, C.terong); }
  function kompor(x, y) {
    return S.kotak(x - 50, y, 100, 52, 6, C.hijauMuda, 3.4) + S.kotak(x - 54, y - 8, 108, 12, 4, '#D9DCE8', 3) + g('translate(' + x + ',' + (y - 8) + ') scale(.8)', S.panci()) +
      g('translate(' + x + ',' + (y - 50) + ') scale(.7)', S.uap());
  }
  function meja(x, y, w) { return S.kotak(x, y, w, 10, 4, C.coklat, 3.2) + S.garisTebal('M' + (x + 8) + ',' + (y + 10) + ' V' + (y + 46) + ' M' + (x + w - 8) + ',' + (y + 10) + ' V' + (y + 46), C.coklat, 4); }
  function lemari(x, y) { return S.kotak(x, y, 70, 150, 6, C.coklat, 3.4) + S.path('M' + (x + 35) + ',' + (y + 6) + ' V' + (y + 144), 'none', 2.4, C.coklatTua) + g('translate(' + (x + 35) + ',' + y + ') scale(.8)', S.toples()); }
  function genangan(x, y, w) { return g('translate(' + x + ',' + y + ')', S.genangan(w || 40)); }
  function tiang(x) { return S.garisTebal('M' + x + ',204 V10', C.coklat, 9) + S.garisTebal('M' + (x - 22) + ',22 H' + (x + 22), C.coklat, 6) + S.path('M0,40 Q' + (x / 2) + ',60 ' + (x - 20) + ',22 M' + (x + 20) + ',22 Q' + (x + 60) + ',44 296,30', 'none', 3, '#4A3D5C'); }
  function percik(x, y) { return S.path('M' + x + ',' + y + ' l-10,-14 M' + (x + 8) + ',' + (y - 2) + ' l2,-18 M' + (x + 16) + ',' + y + ' l12,-12', 'none', 4, '#7EC8E8'); }
  function kursiPenjaga(x, y, wulan) {
    return S.garisTebal('M' + (x - 20) + ',' + y + ' L' + (x - 12) + ',' + (y - 110) + ' M' + (x + 20) + ',' + y + ' L' + (x + 12) + ',' + (y - 110) + ' M' + (x - 18) + ',' + (y - 40) + ' H' + (x + 18) + ' M' + (x - 16) + ',' + (y - 76) + ' H' + (x + 16), C.putih, 5) +
      S.kotak(x - 20, y - 118, 40, 10, 3, C.putih, 3) + (wulan ? tk('wulan', 'dudukSamping', x, y - 72, 0.62, { ekspresi: 'senyum' }) : '');
  }
  function lintasan(isi) { return S.path('M0,0 H296 V104 H0 Z', C.langitMuda) + S.path('M0,104 H296 V204 H0 Z', '#E58A6E') + S.path('M0,140 H296 M0,176 H296', 'none', 3, C.putih) + isi; }
  function dindingKaca(isi) {
    return S.path('M0,0 H296 V120 H0 Z', '#FFF1D6') + S.kotak(30, 22, 100, 60, 4, '#BFE8F7', 4, C.langitTua) + S.kotak(166, 22, 100, 60, 4, '#BFE8F7', 4, C.langitTua) +
      S.path('M44,70 L70,34 M180,70 L206,34', 'none', 4, C.putih, ' opacity=".8"') + S.path('M0,120 H296 V204 H0 Z', '#8ED17A') + isi;
  }
  function gawang(x, y) { return S.garisTebal('M' + x + ',' + y + ' V' + (y - 60) + ' H' + (x + 90) + ' V' + y, C.putih, 5) + S.path('M' + (x + 10) + ',' + (y - 60) + ' V' + y + ' M' + (x + 30) + ',' + (y - 60) + ' V' + y + ' M' + (x + 50) + ',' + (y - 60) + ' V' + y + ' M' + (x + 70) + ',' + (y - 60) + ' V' + y + ' M' + x + ',' + (y - 40) + ' H' + (x + 90) + ' M' + x + ',' + (y - 20) + ' H' + (x + 90), 'none', 1.6, '#D9DCE8'); }
  function bola(x, y) { return S.bola(x, y, 12); }
  /* seragam rumah dan olahraga (sama dengan adegan) */
  var R = {
    sari: { baju: 'rumahP', warna: { atas: C.koralMuda, bawah: C.langitTua } }, bima: { baju: 'rumahL', warna: { atas: C.langit } },
    raka: { baju: 'rumahL', warna: { atas: C.hijauMuda, bawah: C.coklat } }, lala: { baju: 'rumahP', warna: { atas: C.kuningMuda, bawah: C.lavenderTua } },
    ayu: { baju: 'rumahP', warna: { atas: C.langit, bawah: C.koral } }, nino: { alas: 'kaki' }, dina: { baju: 'rumahPanjang' }
  };
  function rumah(id, o) { return gabung(R[id], o); }
  function or(id, o) { return gabung({ baju: id === 'dina' ? 'olahragaPanjang' : 'olahraga' }, o); }
  var COLOK = { ld: [[15, -69], [27, -76], [41, -84]] };

  /* ===== T2 Rumah Sari ===== */
  G['t2-stopkontak-jauh'] = function () { return dalam(stopkontak(60, 120) + tk('bima', 'berdiri', 200, 196, 1, rumah('bima', { ekspresi: 'senang', arah: -1 })) + S.path('M150,180 h-50', 'none', 4, C.lavender, ' stroke-dasharray="4 8"')); };
  G['t2-stopkontak-sebentar'] = function () { return dalam(stopkontak(96, 116) + tk('bima', 'tunjuk', 150, 196, 1, rumah('bima', { ekspresi: 'fokus', arah: -1, pegang: 'jepit', timpa: COLOK }))); };
  G['t2-stopkontak-diam'] = function () { return dalam(stopkontak(96, 116) + tk('bima', 'tunjuk', 150, 196, 1, rumah('bima', { ekspresi: 'tutup', arah: -1, pegang: 'jepit', timpa: COLOK })) + tk('ibu', 'berdiri', 260, 200, 0.8, { arah: -1 }) + S.path('M222,60 q8,-10 16,0', 'none', 3, C.lavender)); };
  G['t2-gunting-taruh'] = function () { return dalam(meja(30, 130, 120) + g('translate(80,128)', S.barang('gunting', 0, 0, 1.2)) + tk('raka', 'berdiri', 210, 196, 1, rumah('raka', { ekspresi: 'senang', pegang: 'bola' }))); };
  G['t2-gunting-pelan'] = function () { return dalam(tk('raka', 'panggil', 96, 196, 1, rumah('raka', { ekspresi: 'senang', pegang: 'gunting' })) + tk('bima', 'panggil', 210, 196, 1, rumah('bima', { ekspresi: 'senang', arah: -1, pegang: 'pisau' }))); };
  G['t2-gunting-lari'] = function () { return dalam(tk('raka', 'lari', 160, 196, 1, rumah('raka', { ekspresi: 'senang', pegang: 'gunting' })) + S.garisCepat(110, 110)); };
  G['t2-botol-tanya'] = function () { return dalam(tk('sari', 'tunjuk', 100, 196, 1, rumah('sari', { pegang: 'botol' })) + tk('ibu', 'berdiri', 214, 200, 0.82, { arah: -1 }) + S.path('M150,70 q8,-12 16,-2', 'none', 3.4, C.koralTua)); };
  G['t2-botol-cicip'] = function () { return dalam(tk('sari', 'minum', 148, 196, 1.05, rumah('sari', { pegang: 'botol' }))); };
  G['t2-botol-cium'] = function () { return dalam(tk('sari', 'minum', 148, 196, 1.05, rumah('sari', { ekspresi: 'tutup', pegang: 'botol' })) + S.path('M176,70 q8,-6 4,-14 M186,76 q10,-6 6,-16', 'none', 2.6, C.lavenderTua)); };
  G['t2-panci-jauh'] = function () { return dalam(kompor(90, 110) + tk('ayah', 'tempel', 150, 202, 0.8, { celemek: true, arah: -1 }) + tk('nino', 'berdiri', 246, 198, 1.05, { alas: 'kaki', ekspresi: 'senang' })); };
  G['t2-panci-pegang'] = function () { return dalam(kompor(110, 110) + tk('nino', 'raih', 176, 198, 1.1, { alas: 'kaki', ekspresi: 'senang', arah: -1, timpa: { ld: [[13, -54], [17, -76], [19, -98]] } })); };
  G['t2-panci-bantu'] = function () { return dalam(kompor(110, 110) + tk('nino', 'tempel', 190, 198, 1.1, { alas: 'kaki', ekspresi: 'fokus', arah: -1 })); };
  G['t2-basah-pelan'] = function () { return kamarMandi(genangan(200, 186, 44) + tk('lala', 'jalan', 120, 196, 1, rumah('lala', { alas: 'sandal' }))); };
  G['t2-basah-lari'] = function () { return kamarMandi(genangan(200, 186, 44) + tk('lala', 'lari', 150, 196, 1, rumah('lala', { ekspresi: 'senang' })) + S.garisCepat(110, 110)); };
  G['t2-basah-lompat'] = function () { return kamarMandi(genangan(150, 188, 56) + tk('lala', 'lompat', 150, 168, 1, rumah('lala', { ekspresi: 'senang' })) + percik(120, 182) + percik(176, 182)); };
  G['t2-momen-minta'] = function () { return dalam(lemari(40, 30) + tk('nino', 'panggil', 150, 198, 1.05, { alas: 'kaki', ekspresi: 'teriak' }) + tk('ibu', 'jalan', 250, 200, 0.82, { arah: -1 })); };
  G['t2-momen-pelan'] = function () { return dalam(lemari(30, 30) + g('translate(140,200) scale(.95)', S.kursiTumpuk()) + tk('nino', 'panjatSamping', 136, 150, 0.95, { alas: 'kaki', ekspresi: 'fokus' })); };
  G['t2-momen-lompat'] = function () { return dalam(lemari(30, 30) + tk('nino', 'lompat', 160, 168, 1, { alas: 'kaki', ekspresi: 'senang' }) + S.garisCepat(130, 70)); };
  G['t2-kilat-panci'] = function () { return dalam(kompor(80, 110) + tk('ayah', 'tempel', 140, 202, 0.8, { celemek: true, arah: -1 }) + meja(190, 140, 96) + tk('nino', 'dudukSamping', 230, 196, 0.95, { alas: 'kaki', ekspresi: 'senang' })); };
  G['t2-kilat-stopkontak'] = function () { return dalam(stopkontak(96, 116) + tk('nino', 'tunjuk', 150, 196, 1, rumah('nino', { ekspresi: 'fokus', arah: -1, timpa: COLOK }))); };
  G['t2-kilat-gunting'] = function () { return dalam(meja(120, 130, 150) + tk('ayu', 'dudukSamping', 150, 196, 1, rumah('ayu', { ekspresi: 'fokus', pegang: 'gunting' })) + g('translate(220,128)', S.barang('kertas', 0, 0, 1.2))); };
  G['t2-kilat-basah'] = function () { return kamarMandi(genangan(210, 186, 44) + tk('bima', 'lari', 150, 196, 1, rumah('bima', { ekspresi: 'senang' })) + S.garisCepat(110, 110)); };
  G['t2-kilat-botol'] = function () { return dalam(tk('sari', 'minum', 148, 196, 1.05, rumah('sari', { ekspresi: 'senang', pegang: 'gelas' }))); };
  G['t2-kilat-momen'] = function () { return dalam(meja(80, 150, 140) + tk('raka', 'panjatSamping', 130, 170, 0.9, rumah('raka', { ekspresi: 'fokus' })) + g('translate(250,40)', S.bola(0, 0, 14))); };

  /* ===== T3 Jalan ke Sekolah ===== */
  function motor(x, y, s, o) { return g('translate(' + x + ',' + y + ') scale(' + s + ')', S.motor(o || {})); }
  function pengendara(id, x, y, s, o) { return tk(id, 'dudukMotor', x, y, s, gabung({ arah: -1 }, o)); }
  G['t3-motor-kiri'] = function () { return gang(motor(170, 190, 0.8, { menyala: true }) + pengendara('ayah', 172, 186, 0.62) + tk('sari', 'jalan', 64, 196, 0.95, { arah: 1 }) + S.path('M96,184 q30,10 52,-4', 'none', 4, C.hijauTua, ' stroke-dasharray="2 10"')); };
  G['t3-motor-cepat'] = function () { return gang(motor(130, 190, 0.8, { menyala: true, panas: true }) + pengendara('ayah', 132, 186, 0.62) + tk('sari', 'lari', 228, 196, 0.95, { arah: -1 }) + S.garisCepat(282, 110)); };
  G['t3-motor-sentuh'] = function () { return gang(motor(130, 190, 0.8, { menyala: true, panas: true }) + tk('sari', 'tunjuk', 234, 198, 0.95, { arah: -1, timpa: { ld: [[15, -69], [27, -58], [40, -48]] } })); };
  G['t3-layang-biar'] = function () { return gang(tiang(60) + g('translate(130,40)', S.layangTersangkut(0, 20)) + tk('bima', 'panggil', 160, 198, 0.95, { ekspresi: 'teriak' }) + tk('ayah', 'jalan', 262, 202, 0.78, { arah: -1 })); };
  G['t3-layang-tarik'] = function () { return gang(tiang(60) + g('translate(130,40)', S.layang(0, 0, 0.7, C.koral, C.kuning, 38)) + S.path('M134,62 L196,128', 'none', 2.6, C.lavenderTua) + tk('bima', 'raih', 200, 198, 0.95, { ekspresi: 'fokus', arah: -1 })); };
  G['t3-layang-panjat'] = function () { return gang(tiang(130) + g('translate(220,40)', S.layang(0, 0, 0.7, C.koral, C.kuning, 38)) + tk('bima', 'panjatSamping', 118, 170, 0.88, { ekspresi: 'fokus' })); };
  G['t3-got-jauh'] = function () { return gang(tk('raka', 'jalan', 150, 150, 0.95, { ekspresi: 'senang' }), true); };
  G['t3-got-lompat'] = function () { return gang(tk('raka', 'lompat', 150, 178, 0.9, { ekspresi: 'senang' }) + S.garisCepat(118, 110), true); };
  G['t3-got-tepi'] = function () { return gang(tk('raka', 'seimbang', 150, 184, 0.9, { ekspresi: 'fokus' }), true); };
  G['t3-helm-helm'] = function () { return jalanan(motor(150, 194, 0.85) + pengendara('paman', 128, 188, 0.62, { helm: C.hijau }) + pengendara('lala', 176, 188, 0.8, { helm: C.koral, ekspresi: 'senang' })); };
  G['t3-helm-dekat'] = function () { return jalanan(motor(150, 194, 0.85) + pengendara('paman', 128, 188, 0.62, { helm: C.hijau }) + pengendara('lala', 176, 188, 0.8, { ekspresi: 'senang' })); };
  G['t3-helm-topi'] = function () { return jalanan(motor(150, 194, 0.85) + pengendara('paman', 128, 188, 0.62, { helm: C.hijau }) + pengendara('lala', 176, 188, 0.8, { topi: C.kuning, ekspresi: 'senang' })); };
  G['t3-seberang-zebra'] = function () { return jalanan(tk('dina', 'jalan', 132, 168, 0.9, { ekspresi: 'senang' }) + tk('ibuDina', 'jalan', 184, 172, 0.68), { zebra: 90 }); };
  G['t3-seberang-lari'] = function () { return jalanan(tk('dina', 'lari', 150, 170, 0.92, { ekspresi: 'senang' }) + S.garisCepat(108, 100)); };
  G['t3-seberang-sendiri'] = function () { return jalanan(tk('dina', 'jalan', 150, 170, 0.92, { ekspresi: 'senyum' })); };
  G['t3-momen-minta'] = function () { return jalanan(bola(150, 146) + tk('ayu', 'panggil', 64, 200, 0.9, { ekspresi: 'teriak' }) + tk('ani', 'jalan', 236, 202, 0.68, { arah: -1 })); };
  G['t3-momen-kejar'] = function () { return jalanan(bola(220, 156) + tk('ayu', 'lari', 150, 170, 0.92, { ekspresi: 'senang' }) + S.garisCepat(110, 100)); };
  G['t3-momen-lihat'] = function () { return jalanan(bola(220, 156) + tk('ayu', 'lari', 150, 170, 0.92, { ekspresi: 'fokus' }) + S.path('M168,70 l18,-6 M168,78 l20,2', 'none', 3, C.lavender)); };
  G['t3-kilat-motor'] = function () { return gang(motor(130, 190, 0.8, { menyala: true, panas: true }) + tk('bima', 'tunjuk', 234, 198, 0.95, { arah: -1, timpa: { ld: [[15, -69], [27, -58], [40, -48]] } })); };
  G['t3-kilat-got'] = function () { return gang(tk('sekar', 'jalan', 150, 150, 0.95, { ekspresi: 'senang' }), true); };
  G['t3-kilat-layang'] = function () { return gang(tiang(130) + tk('raka', 'panjatSamping', 118, 172, 0.88, { ekspresi: 'fokus' })); };
  G['t3-kilat-helm'] = function () { return jalanan(motor(150, 194, 0.85) + pengendara('ayah', 128, 188, 0.62, { helm: C.hijau }) + pengendara('sari', 176, 188, 0.8, { helm: C.koral, ekspresi: 'senang' })); };
  G['t3-kilat-seberang'] = function () { return jalanan(tk('lala', 'jalan', 132, 168, 0.9, { ekspresi: 'senang' }) + tk('ibu', 'jalan', 184, 172, 0.68), { zebra: 90 }); };
  G['t3-kilat-momen'] = function () { return jalanan(bola(220, 156) + tk('bima', 'lari', 150, 170, 0.92, { ekspresi: 'senang' }) + S.garisCepat(110, 100)); };

  /* ===== T4 Lapangan dan Kolam ===== */
  G['t4-lari-pemanasan'] = function () { return lapangan(tk('raka', 'sorak', 110, 196, 1, or('raka', { ekspresi: 'senang' })) + tk('budi', 'sorak', 210, 198, 0.78, {})); };
  G['t4-lari-menang'] = function () { return lintasan(tk('raka', 'lari', 160, 196, 1, or('raka', { ekspresi: 'senang' })) + S.garisCepat(118, 110)); };
  G['t4-lari-nanti'] = function () { return lintasan(tk('raka', 'lari', 120, 196, 1, or('raka', { ekspresi: 'senang' })) + tk('budi', 'panggil', 236, 198, 0.78, { arah: -1 })); };
  G['t4-tali-ikat'] = function () { return lintasan(tk('sari', 'ikatSepatu', 130, 194, 1.05, or('sari', { ekspresi: 'fokus', pegang: 'tali' }))); };
  G['t4-tali-lari'] = function () { return lintasan(tk('sari', 'lari', 150, 196, 1, or('sari', { ekspresi: 'senang', taliLepas: true })) + S.garisCepat(110, 110)); };
  G['t4-tali-pelan'] = function () { return lintasan(tk('sari', 'jalan', 150, 196, 1, or('sari', { ekspresi: 'senyum', taliLepas: true }))); };
  G['t4-bola-tengah'] = function () { return lapangan(gawang(190, 130) + tk('bima', 'lari', 110, 196, 1, or('bima', { ekspresi: 'senang' })) + bola(150, 186)); };
  G['t4-bola-pelan'] = function () { return dindingKaca(tk('bima', 'jalan', 150, 196, 1, or('bima', { ekspresi: 'fokus' })) + bola(186, 186)); };
  G['t4-bola-situ'] = function () { return dindingKaca(tk('bima', 'lari', 110, 196, 1, or('bima', { ekspresi: 'senang' })) + tk('raka', 'sorak', 220, 196, 1, or('raka', { ekspresi: 'senang' })) + bola(150, 140)); };
  G['t4-masuk-tunggu'] = function () { return kolam(kursiPenjaga(240, 128, false) + tk('ayu', 'berdiri', 110, 128, 0.95, or('ayu', { ekspresi: 'senyum' }))); };
  G['t4-masuk-sendiri'] = function () { return kolam(kursiPenjaga(250, 128, false) + tk('ayu', 'lompat', 120, 148, 0.9, or('ayu', { ekspresi: 'senang' })) + percik(110, 170)); };
  G['t4-masuk-sebentar'] = function () { return kolam(kursiPenjaga(250, 128, false) + tk('ayu', 'berdiri', 120, 190, 0.95, or('ayu', { ekspresi: 'senang' })) + S.path('M80,150 H170 V204 H80 Z', '#6CC6EE') + S.path('M86,152 q20,-8 40,0 q20,8 40,0', 'none', 3, C.putih)); };
  G['t4-licin-jalan'] = function () { return kolam(tk('dina', 'jalan', 150, 124, 0.95, or('dina', { ekspresi: 'senyum' }))); };
  G['t4-licin-cepat'] = function () { return kolam(tk('dina', 'lari', 150, 124, 0.95, or('dina', { ekspresi: 'senang' })) + S.garisCepat(110, 60)); };
  G['t4-licin-hati'] = function () { return kolam(tk('dina', 'lari', 150, 124, 0.95, or('dina', { ekspresi: 'fokus' }))); };
  G['t4-momen-dangkal'] = function () { return kolam(S.path('M40,128 h50 v12 h-12 v12 h-12 v12 h-26 Z', C.putih, 2.6) + tk('sekar', 'jalan', 70, 140, 0.9, or('sekar', { ekspresi: 'senang' })) + tk('wulan', 'berdiri', 236, 128, 0.62, { arah: -1 })); };
  G['t4-momen-teman'] = function () { return kolam(tk('sekar', 'lompat', 140, 142, 0.85, or('sekar', { ekspresi: 'senang' })) + S.lingkar(232, 176, 14, '#F3CDA4', 2.6) + percik(130, 172), true); };
  G['t4-momen-napas'] = function () { return kolam(tk('sekar', 'lompat', 140, 142, 0.85, or('sekar', { ekspresi: 'tutup' })) + percik(130, 172), true); };
  G['t4-kilat-lari'] = function () { return lapangan(tk('sekar', 'sorak', 150, 196, 1, or('sekar', { ekspresi: 'senang' }))); };
  G['t4-kilat-tali'] = function () { return lintasan(tk('raka', 'lari', 150, 196, 1, or('raka', { ekspresi: 'senang', taliLepas: true })) + S.garisCepat(110, 110)); };
  G['t4-kilat-bola'] = function () { return dindingKaca(tk('bima', 'lari', 150, 196, 1, or('bima', { ekspresi: 'senang' })) + bola(120, 70)); };
  G['t4-kilat-masuk'] = function () { return kolam(tk('wulan', 'berdiri', 236, 128, 0.62, { arah: -1 }) + S.lingkar(120, 166, 16, C.kuning, 2.6) + tk('lala', 'sorak', 110, 230, 0.8, or('lala', { ekspresi: 'senang' }))); };
  G['t4-kilat-licin'] = function () { return kolam(tk('ayu', 'jalan', 150, 124, 0.95, or('ayu', { ekspresi: 'senyum' }))); };
  G['t4-kilat-momen'] = function () { return kolam(tk('raka', 'lompat', 140, 142, 0.85, or('raka', { ekspresi: 'senang' })) + percik(130, 172), true); };

  /* ===== kartu transfer Pawai (situasi baru) ===== */
  G['transfer-korek'] = function () { return dalam(g('translate(190,140)', S.korek()) + tk('nino', 'tunjuk', 120, 198, 1.05, { alas: 'kaki', ekspresi: 'senang' })); };
  G['transfer-sumur'] = function () { return luar(g('translate(196,190) scale(.9)', S.sumur()) + tk('raka', 'tunjuk', 100, 196, 1, { ekspresi: 'senang' })); };
  G['transfer-jendela'] = function () {
    return luar(g('translate(150,196) scale(.95)', S.angkot()) + S.lingkar(70, 92, 15, '#F3CDA4', 2.8) + S.path('M54,88 C54,72 86,72 86,88 Z', C.rambut, 2.4) +
      S.garisTebal('M58,108 L18,96', '#F3CDA4', 7), '#D9D2E8');
  };
  G['transfer-sepeda'] = function () { return luar(g('translate(150,196)', S.sepeda(C.hijau)) + tk('sari', 'dudukMotor', 150, 162, 0.85, { helm: C.koral, ekspresi: 'senang', arah: 1 })); };
  G['transfer-sabuk'] = function () { return luar(g('translate(150,196) scale(.95)', S.mobil()) + S.lingkar(156, 112, 15, C.kuning, 0) + tk('dina', 'dudukSamping', 160, 172, 0.7, { ekspresi: 'senang' }) + S.path('M146,128 L176,160', 'none', 5, C.koralTua), '#D9D2E8'); };
  G['transfer-lutut'] = function () {
    return luar(tk('ayu', 'seimbang', 150, 186, 1, { ekspresi: 'senang', helm: C.hijau }) + g('translate(138,188) scale(.7)', S.sepatuRoda()) + g('translate(162,188) scale(.7)', S.sepatuRoda()) +
      S.lingkar(140, 166, 6, C.koral, 2.4) + S.lingkar(160, 166, 6, C.koral, 2.4));
  };
})(window);
