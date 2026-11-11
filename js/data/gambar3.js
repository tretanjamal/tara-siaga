/* Gambar kartu T5 Hari Hujan (TAMBAHAN) dan Kartu Kilatnya. Bidang 296x204, rig tokoh sama dengan adegan.
   Tanpa luka atau akibat: kilat selalu jauh di langit, kabel hanya tergeletak di genangan. */
(function (root) {
  var S = root.Seni, C = S.C, g = S.g, G = root.GAMBAR;
  function gabung(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b || {}) o[k] = b[k]; return o; }
  function tk(id, pose, x, y, s, o) { return g('translate(' + x + ',' + y + ')' + (s && s !== 1 ? ' scale(' + s + ')' : ''), S.tokoh(id, pose, o || {})); }
  var R = {
    raka: { baju: 'rumahL', warna: { atas: C.hijauMuda, bawah: C.coklat }, alas: 'sandal' },
    sari: { baju: 'rumahP', warna: { atas: C.koralMuda, bawah: C.langitTua }, alas: 'sandal' },
    dina: { baju: 'rumahPanjang', alas: 'sandal' },
    bima: { baju: 'rumahL', warna: { atas: C.langit } },
    lala: { baju: 'rumahP', warna: { atas: C.kuningMuda, bawah: C.lavenderTua }, alas: 'sandal' },
    sekar: { baju: 'rumahP', warna: { atas: C.hijauMuda, bawah: C.koral }, alas: 'sandal' },
    nino: { alas: 'sandal' }
  };
  function o(id, tambah) { return gabung(R[id] || {}, tambah); }
  /* latar hujan: langit kelabu, tanah rumput, garis hujan di atas */
  function hujan(isi, tanah) {
    return S.path('M0,0 H296 V204 H0 Z', '#C3CCE4') + S.path('M0,120 C90,112 200,114 296,120 V204 H0 Z', tanah || '#93CF7E') + isi + S.garisHujan(296, 204);
  }
  /* sungai cokelat deras di kiri bawah */
  function sungai(isi) {
    /* sungai lebar dari kiri atas ke kiri bawah, bergelombang putih supaya terbaca deras */
    return hujan(S.path('M0,118 C46,116 92,136 118,204 H0 Z', '#B78A63', 3, '#8F6A4B') +
      S.path('M6,134 q12,-6 24,0 q12,6 24,0 M10,158 q14,-6 28,0 q14,6 28,0 M18,184 q14,-6 28,0 q14,6 28,0', 'none', 3.4, C.putih, ' opacity=".9"') + isi);
  }
  function petirDi(x, y, s) { return g('translate(' + x + ',' + y + ') scale(' + (s || 0.7) + ')', S.petir()); }
  function tiangKabel(x, ux, uy) { return g('translate(' + x + ',196)', S.tiangRoboh(ux, uy, 170)); }
  function genangan(x, y, w) { return g('translate(' + x + ',' + y + ')', S.genangan(w || 34)); }

  /* ----- sungai ----- */
  G['t5-sungai-jauh'] = function () { return sungai(tk('raka', 'jalan', 200, 194, 1.05, o('raka', { ekspresi: 'senang' }))); };
  G['t5-sungai-pinggir'] = function () { return sungai(tk('raka', 'jongkokRaih', 128, 192, 1.05, o('raka', { arah: -1, ekspresi: 'senang' }))); };
  G['t5-sungai-teman'] = function () {
    return sungai(tk('bima', 'panggil', 118, 190, 1, o('bima', { arah: -1, ekspresi: 'senang' })) + tk('raka', 'jalan', 196, 194, 1.05, o('raka', { arah: -1, ekspresi: 'senang' })));
  };
  /* ----- petir ----- */
  G['t5-petir-masuk'] = function () {
    return hujan(g('translate(196,170)', S.rumahDepan(150)) + tk('sari', 'jalan', 150, 196, 0.95, o('sari', { ekspresi: 'senang' })) + tk('dina', 'jalan', 96, 196, 0.95, o('dina', { ekspresi: 'senang' })));
  };
  G['t5-petir-pohon'] = function () {
    return hujan(petirDi(40, 8) + g('translate(190,176)', S.pohon()) + tk('sari', 'berdiri', 170, 196, 0.92, o('sari')) + tk('dina', 'berdiri', 222, 196, 0.92, o('dina')));
  };
  G['t5-petir-sebentar'] = function () {
    return hujan(petirDi(250, 8) + tk('sari', 'tunjuk', 86, 196, 0.95, o('sari', { ekspresi: 'senang' })) + S.bola(148, 132, 11) +
      tk('dina', 'sorak', 206, 196, 0.95, o('dina', { arah: -1, ekspresi: 'senang' })));
  };
  /* ----- kabel ----- */
  G['t5-kabel-jauh'] = function () {
    return hujan(genangan(214, 190, 34) + tiangKabel(262, -48, -6) + tk('nino', 'tunjuk', 108, 196, 1.05, o('nino', { ekspresi: 'kaget' })) + tk('ayah', 'minum', 54, 196, 0.72, { pegang: 'hp' }));
  };
  G['t5-kabel-lompat'] = function () { return hujan(genangan(176, 190, 34) + tiangKabel(262, -86, -6) + tk('nino', 'lompat', 124, 184, 1.05, o('nino', { ekspresi: 'senang' }))); };
  /* pengecoh: Nino baru akan meraih kabel, tangannya belum menyentuh */
  G['t5-kabel-pindah'] = function () { return hujan(genangan(196, 190, 34) + tiangKabel(262, -66, -6) + tk('nino', 'jongkokRaih', 104, 194, 1.05, o('nino', { ekspresi: 'fokus' }))); };
  /* ----- Kartu Kilat ----- */
  G['t5-kilat-sungai'] = function () {
    return hujan(S.kotak(40, 150, 216, 16, 3, '#D8CFEA', 3) + g('translate(148,152)', S.rumahDepan(200)) + tk('bima', 'berdiri', 112, 154, 0.95, o('bima', { ekspresi: 'senang' })), '#93CF7E');
  };
  G['t5-kilat-petir'] = function () {
    return hujan(petirDi(48, 8) + S.layang(214, 44, 0.62, C.koral, C.kuning, -12) + S.path('M214,52 Q190,120 162,124', 'none', 2, C.terong) + tk('raka', 'raih', 150, 196, 1, o('raka', { ekspresi: 'senang' })));
  };
  G['t5-kilat-kabel'] = function () {
    return hujan(g('translate(196,196)', S.garisTebal('M0,0 V-170', '#8A6A50', 8)) + genangan(170, 192, 30) + tk('sekar', 'tempel', 150, 196, 1, o('sekar', { ekspresi: 'senyum' })));
  };
})(window);
