/* Gambar kartu pilihan dan Kartu Kilat (GDD 11: 72 kartu disusun dari rig tokoh SVG yang sama dengan adegan).
   Kunci: '<tempat>-<bahaya>-<kartu>' dan '<tempat>-kilat-<bahaya>'. Tiap fungsi mengembalikan isi SVG untuk bidang 296x204. */
(function (root) {
  var S = root.Seni, C = S.C, g = S.g;
  function tk(id, pose, x, y, s, o) { return g('translate(' + x + ',' + y + ')' + (s && s !== 1 ? ' scale(' + s + ')' : ''), S.tokoh(id, pose, o || {})); }
  /* langit dan tanah kartu */
  function bingkai(isi, tanah) {
    return S.path('M0,0 H296 V160 H0 Z', C.langitMuda) + S.path('M0,154 C80,146 200,148 296,154 V204 H0 Z', tanah || '#F3DCBD') + isi;
  }
  /* ayunan bertali dua dengan anak duduk (tampak depan). utuh=false: rantai kanan putus. */
  function ayunDuduk(id, cx, yAtas, yDuduk, s, utuh, eks) {
    var dx = 17 * s, out = S.rantai(cx - dx, yAtas, cx - dx, yDuduk - 4);
    out += utuh === false ? S.rantai(cx + dx, yAtas, cx + dx - 1, yAtas + 34) + S.path('M' + (cx + dx - 5) + ',' + (yAtas + 32) + ' l4,7 l4,-6', 'none', 2.6) : S.rantai(cx + dx, yAtas, cx + dx, yDuduk - 4);
    var timpa = utuh === false ? { lb: [[-15, -69], [-19, -82], [-17, -97]], ld: [[15, -69], [21, -57], [19, -44]] } : { lb: [[-15, -69], [-20, -82], [-17, -96]], ld: [[15, -69], [20, -82], [17, -96]] };
    out += tk(id, 'dudukAyun', cx, yDuduk + 36 * s, s, { ekspresi: eks || 'senyum', timpa: timpa });
    out += g('translate(' + cx + ',' + yDuduk + ') rotate(' + (utuh === false ? -14 : 0) + ')', S.kotak(-26 * s, -5, 52 * s, 10, 5, C.koral, 3.4));
    return out;
  }
  function bunyiPanggil(x, y) { return S.path('M' + x + ',' + y + ' q10,-6 14,4 M' + (x + 6) + ',' + (y - 14) + ' q16,-10 22,6', 'none', 3.4, C.koralTua); }
  function kacaKecil(x, y) {
    return g('translate(' + x + ',' + y + ') scale(.7)', ['M-24,4 L-14,-12 L-6,2 Z', 'M-2,6 L8,-16 L16,4 Z', 'M18,8 L28,-4 L32,10 Z'].map(function (d) { return S.path(d, '#DDF4FB', 3); }).join('') +
      S.kilauBintang(-12, -22, 8) + S.kilauBintang(14, -28, 10));
  }

  var G = {
    /* ===== T1 Taman Bermain ===== */
    't1-ayunan-guru': function () { return bingkai(tk('sari', 'panggil', 92, 194, 1, { ekspresi: 'teriak' }) + tk('ani', 'jalan', 214, 196, 0.9, { arah: -1, ekspresi: 'senyum' }) + bunyiPanggil(128, 70)); },
    't1-ayunan-duduk': function () { return bingkai(S.rangkaAyun(78, 218, 18, 204) + ayunDuduk('sari', 148, 22, 158, 1.02, false)); },
    't1-ayunan-diam': function () {
      return bingkai(S.rangkaAyun(168, 262, 22, 204) + S.rantai(196, 26, 200, 120) + g('translate(206,138) rotate(70)', S.kotak(-24, -5, 48, 10, 5, C.koral, 3.4)) +
        tk('sari', 'tutupMulut', 86, 194, 1, { ekspresi: 'tutup' }));
    },
    't1-lari-jauh': function () {
      return bingkai(S.rangkaAyun(64, 170, 22, 204) + ayunDuduk('dina', 117, 26, 150, 0.9, true, 'senang') +
        S.jejak('M190,186 C240,176 258,130 252,96') + tk('lala', 'jalan', 252, 150, 0.72, { ekspresi: 'senyum' }));
    },
    /* ayunan di kiri, Lala lewat di depan kanan; busur menunjukkan ayunan bergerak ke arah Lala */
    't1-lari-cepat': function () {
      return bingkai(S.rangkaAyun(46, 150, 18, 176) + ayunDuduk('dina', 98, 22, 136, 0.85, true, 'kaget') +
        S.path('M150,150 Q186,176 214,150', 'none', 4, C.lavender, ' stroke-dasharray="3 9"') +
        tk('lala', 'lari', 232, 200, 0.95, { ekspresi: 'senang' }) + S.garisCepat(196, 120));
    },
    't1-lari-hati': function () {
      return bingkai(S.rangkaAyun(46, 150, 18, 176) + ayunDuduk('dina', 98, 22, 136, 0.85, true, 'kaget') +
        S.path('M150,150 Q186,176 214,150', 'none', 4, C.lavender, ' stroke-dasharray="3 9"') +
        tk('lala', 'seimbang', 236, 200, 0.95, { ekspresi: 'fokus' }));
    },
    't1-dorong-antre': function () {
      return bingkai(S.perosotan(80, 196, 0.66) + tk('bima', 'panjatSamping', 108, 158, 0.82, { ekspresi: 'senyum' }) +
        tk('raka', 'berdiri', 64, 198, 0.86, { ekspresi: 'senyum' }) + tk('lala', 'berdiri', 22, 198, 0.86, { ekspresi: 'senyum' }));
    },
    't1-dorong-dorong': function () {
      return bingkai(S.perosotan(90, 196, 0.66) + tk('bima', 'panjatSamping', 118, 158, 0.82, { ekspresi: 'kaget' }) + tk('raka', 'dorong', 76, 198, 0.9, { ekspresi: 'senang' }) + S.garisCepat(42, 120));
    },
    't1-dorong-ikut': function () {
      return bingkai(S.perosotan(110, 196, 0.66) + tk('bima', 'panjatSamping', 138, 158, 0.82, { ekspresi: 'kaget' }) +
        tk('raka', 'dorong', 96, 198, 0.9, { ekspresi: 'senang' }) + tk('lala', 'dorong', 50, 198, 0.9, { ekspresi: 'senang' }));
    },
    't1-kaca-guru': function () {
      return bingkai(S.bakPasir(110, 196, 140) + kacaKecil(190, 160) + tk('bima', 'panggil', 64, 196, 0.95, { ekspresi: 'teriak' }) + bunyiPanggil(96, 76) +
        tk('ani', 'jalan', 262, 196, 0.8, { arah: -1 }));
    },
    't1-kaca-ambil': function () { return bingkai(S.bakPasir(110, 196, 160) + kacaKecil(196, 162) + tk('bima', 'ambil', 140, 194, 1, { ekspresi: 'senyum' })); },
    't1-kaca-diam': function () {
      return bingkai(S.bakPasir(60, 196, 200) + kacaKecil(214, 160) + S.ember(96, 170, C.langitTua) + tk('bima', 'jongkok', 150, 190, 1, { ekspresi: 'senang' }));
    },
    't1-pagar-turun': function () { return bingkai(S.kubah(148, 196, 210, 120) + tk('ayu', 'panjatSamping', 120, 176, 0.95, { ekspresi: 'senang' })); },
    't1-pagar-hati': function () { return bingkai(S.pagarTinggi(56, 204, 190, 196) + tk('ayu', 'panjatBelakang', 150, 156, 0.95)); },
    't1-pagar-cepat': function () {
      return bingkai(S.pagarTinggi(56, 204, 190, 196) + tk('ayu', 'panjatBelakang2', 150, 152, 0.95) +
        S.path('M110,170 v-30 M98,192 v-38 M200,170 v-30 M212,192 v-38', 'none', 4, C.lavender));
    },
    't1-momen-duduk': function () { return bingkai(S.perosotan(26, 198, 0.86) + tk('raka', 'meluncur', 150, 150, 0.8, { ekspresi: 'senang', timpa: { miring: -24 } })); },
    't1-momen-lompat': function () { return bingkai(S.perosotan(16, 198, 0.86) + tk('raka', 'lompat', 150, 132, 0.8, { ekspresi: 'senang' }) + S.garisCepat(118, 70)); },
    't1-momen-pelan': function () { return bingkai(S.perosotan(16, 198, 0.86) + tk('raka', 'jongkok', 74, 102, 0.8, { ekspresi: 'fokus' })); },
    /* Kartu Kilat T1 */
    't1-kilat-ayunan': function () { return bingkai(S.rangkaAyun(78, 218, 18, 204) + ayunDuduk('dina', 148, 22, 156, 1, true, 'senang')); },
    't1-kilat-dorong': function () {
      return bingkai(S.perosotan(90, 196, 0.66) + tk('lala', 'panjatSamping', 118, 158, 0.82, { ekspresi: 'kaget' }) + tk('raka', 'dorong', 76, 198, 0.9, { ekspresi: 'senang' }));
    },
    't1-kilat-lari': function () {
      return bingkai(S.rangkaAyun(64, 170, 22, 204) + ayunDuduk('dina', 117, 26, 150, 0.9, true, 'senang') + S.jejak('M190,186 C240,176 258,130 252,96') + tk('lala', 'jalan', 252, 150, 0.72));
    },
    't1-kilat-kaca': function () { return bingkai(S.bakPasir(110, 196, 160) + kacaKecil(196, 162) + tk('bima', 'ambil', 140, 194, 1, { ekspresi: 'senyum' })); },
    't1-kilat-pagar': function () { return bingkai(S.kubah(148, 196, 210, 120) + tk('ayu', 'panjatSamping', 120, 176, 0.95, { ekspresi: 'senang' }) + tk('sekar', 'berdiri', 236, 198, 0.86)); },
    't1-kilat-momen': function () { return bingkai(S.perosotan(16, 198, 0.86) + tk('bima', 'jongkok', 74, 102, 0.8, { ekspresi: 'senang' })); }
  };
  root.GAMBAR = G;
})(window);
