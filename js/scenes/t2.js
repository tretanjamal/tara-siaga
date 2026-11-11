/* Naskah adegan T2 Rumah Sari (GDD 6.1): rumah potong, sore. Tujuh titik berjajar dari ruang tengah sampai kamar mandi.
   Anak memakai baju rumah tanpa alas kaki; skala anak 1,2 karena perabot rumah potong lebih besar dari taman. */
(function (root) {
  var S = root.Seni, C = S.C, G = Gambar;
  var BAJU = {
    sari: { baju: 'rumahP', warna: { atas: C.koralMuda, bawah: C.langitTua } },
    bima: { baju: 'rumahL', warna: { atas: C.langit } },
    raka: { baju: 'rumahL', warna: { atas: C.hijauMuda, bawah: C.coklat } },
    lala: { baju: 'rumahP', warna: { atas: C.kuningMuda, bawah: C.lavenderTua } },
    dina: { baju: 'rumahPanjang' },
    sekar: { baju: 'rumahP', warna: { atas: C.hijauMuda, bawah: C.koral } },
    nino: { alas: 'kaki' },
    ayah: { celemek: true }
  };
  function gabung(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function tk(id, pose, eks, tambah) { return G.orang(id, pose, gabung(gabung(BAJU[id] || {}, { ekspresi: eks || 'senyum' }), tambah || {})); }
  var JALAN = ['jalan', 'jalan2', 'jalan3', 'jalan2'];
  function jalan(id, eks, tambah) { return JALAN.map(function (p) { return tk(id, p, eks, tambah); }); }
  function silih(gb, selang) { return function (t, a) { a.pakai(gb[Math.floor(t / selang) % gb.length]); }; }
  var SK = 1.2, SKD = 1.12;
  var COLOK = { ld: [[15, -69], [27, -76], [41, -84]] };
  var RAIH_NINO = { ld: [[13, -54], [17, -76], [19, -98]] };

  function benda(kunci, kotak, buat) { return G.gambar('t2|' + kunci, buat, kotak); }
  var B = {
    panci: function (aman) { return benda('panci' + (aman ? 'Aman' : ''), [-76, -64, 140, 72], function () { return S.panci(aman); }); },
    uap: function () { return benda('uap', [-30, -56, 64, 62], function () { return S.uap(); }); },
    bangku: function () { return benda('bangku', [-30, -60, 60, 64], function () { return S.bangku(); }); },
    genangan: function () { return benda('genangan', [-72, -18, 144, 30], function () { return S.genangan(62); }); },
    kursiTumpuk: function () { return benda('kursiTumpuk', [-36, -148, 76, 154], function () { return S.kursiTumpuk(); }); },
    gunting: function () { return benda('gunting', [-14, -22, 40, 36], function () { return S.barang('gunting', 0, 0, 1); }); },
    toples: function () { return benda('toples', [-26, -40, 52, 46], function () { return S.toples(); }); }
  };

  function semuaGambar() {
    var a = [B.panci(), B.panci(true), B.uap(), B.bangku(), B.genangan(), B.kursiTumpuk(), B.gunting(), B.toples()];
    ['sari', 'bima', 'raka', 'lala', 'ibu', 'nino', 'ayah'].forEach(function (id) { a = a.concat(jalan(id)); });
    a.push(tk('ibu', 'berdiri'), tk('ibu', 'tempel'), tk('ibu', 'raih'), tk('dina', 'dudukLantai', 'fokus', { pegang: 'kertas' }),
      tk('bima', 'tunjuk', 'fokus', { pegang: 'jepit', timpa: COLOK }), tk('bima', 'berdiri'), tk('bima', 'sorak', 'senang'),
      tk('raka', 'panggil', 'senang', { pegang: 'gunting' }), tk('raka', 'berdiri'), tk('raka', 'sorak', 'senang'),
      tk('sekar', 'minum', 'senyum', { pegang: 'gelas' }), tk('sari', 'minum', 'senyum', { pegang: 'botol' }), tk('sari', 'minum', 'senang', { pegang: 'gelas' }), tk('sari', 'berdiri'),
      tk('nino', 'raih', 'senang', { timpa: RAIH_NINO }), tk('nino', 'berdiri'), tk('nino', 'sorak', 'senang'), tk('nino', 'panjatSamping', 'fokus'), tk('nino', 'panjatSamping2', 'fokus'),
      tk('ayah', 'tempel', 'senyum'), tk('ayah', 'berdiri', 'senyum'), tk('lala', 'lari', 'senang'), tk('lala', 'lari2', 'senang'), tk('lala', 'berdiri', 'kaget'), tk('lala', 'berdiri', 'senyum', { alas: 'sandal' }),
      tk('lala', 'jalan', 'senyum', { alas: 'sandal' }), tk('lala', 'jalan2', 'senyum', { alas: 'sandal' }), tk('lala', 'jalan3', 'senyum', { alas: 'sandal' }));
    return a;
  }

  function siapkan(ctx) {
    var L = ctx.lapis, A = {};
    function aktor(id, o) { o.id = id; A[id] = new Aktor(L, o); return A[id]; }
    aktor('ibu', { x: 252, y: 592, s: SKD, g: tk('ibu', 'berdiri') }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.01; };
    aktor('dina', { x: 312, y: 590, s: SK, g: tk('dina', 'dudukLantai', 'fokus', { pegang: 'kertas' }) }).putar = function (t, a) { a.rot = Math.sin(t * 4) * 2; };
    aktor('bima', { x: 452, y: 576, s: SK, arah: -1, g: tk('bima', 'tunjuk', 'fokus', { pegang: 'jepit', timpa: COLOK }) }).putar = function (t, a) { a.dx = Math.sin(t * 2.4) * 3; };
    aktor('raka', { x: 556, y: 590, s: SK, g: tk('raka', 'panggil', 'senang', { pegang: 'gunting' }) }).putar = function (t, a) { a.rot = Math.sin(t * 5) * 6; };
    aktor('sekar', { x: 704, y: 590, s: SK, arah: -1, g: tk('sekar', 'minum', 'senyum', { pegang: 'gelas' }) }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 2.2) * 0.012; };
    aktor('sari', { x: 828, y: 590, s: SK, arah: -1, g: tk('sari', 'minum', 'senyum', { pegang: 'botol' }) }).putar = function (t, a) { a.rot = Math.sin(t * 1.6) * 2; };
    /* Ayah belum di dapur: kompor menyala tanpa orang dewasa. Ayah datang pada adegan ulang aman. */
    aktor('ayah', { x: 1340, y: 592, s: SKD, arah: -1, g: tk('ayah', 'berdiri', 'senyum') });
    aktor('panci', { x: 918, y: 418, s: 1.1, arah: -1, g: B.panci() });
    aktor('uap', { x: 918, y: 368, g: B.uap() }).putar = function (t, a) { var k = (t % 2) / 2; a.dy = -k * 18; a.alpha = Math.sin(k * Math.PI) * 0.9; };
    aktor('bangku', { x: 998, y: 592, s: 1.2, g: B.bangku() });
    aktor('nino', { x: 998, y: 540, s: 1.15, arah: -1, g: tk('nino', 'raih', 'senang', { timpa: RAIH_NINO }) }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 3) * 0.02; };
    aktor('genangan', { x: 1150, y: 592, g: B.genangan() }).putar = function (t, a) { a.sx = 1 + Math.sin(t * 2) * 0.03; };
    aktor('lala', { x: 1120, y: 590, s: SK, g: tk('lala', 'lari', 'senang') }).putar = function (t, a) {
      silih([tk('lala', 'lari', 'senang'), tk('lala', 'lari2', 'senang')], 0.18)(t, a); a.dx = Math.sin(t * 1.4) * 26; a.arah = Math.cos(t * 1.4) >= 0 ? 1 : -1;
    };
    ctx.aktor = A;
    return A;
  }

  /* ===== adegan ulang aman ===== */
  function ibuKe(ctx, x, arah) {
    var ibu = ctx.aktor.ibu;
    ibu.putar = null; ibu.sy = 1;
    return ibu.jalanKe(x, 592, Math.max(500, Math.abs(x - ibu.x) * 4), jalan('ibu'), tk('ibu', 'berdiri')).then(function () { if (arah) { ibu.arah = arah; ibu.atur(); } });
  }
  function ibuKembali(ctx) {
    return ibuKe(ctx, 252, 1).then(function () { var ibu = ctx.aktor.ibu; ibu.putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.01; }; });
  }
  var AMAN = {
    stopkontak: function (ctx) {
      var b = ctx.aktor.bima;
      b.putar = null; b.dx = 0;
      b.pakai(tk('bima', 'berdiri')); b.atur();
      return b.jalanKe(480, 592, 600, jalan('bima'), tk('bima', 'sorak', 'senang')).then(function () {
        b.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 4; };
        return ctx.ucap(ctx.X.bahaya.stopkontak.aman, 'tara');
      });
    },
    gunting: function (ctx) {
      var r = ctx.aktor.raka;
      r.putar = null; r.rot = 0;
      r.pakai(tk('raka', 'berdiri')); r.atur();
      new Aktor(ctx.lapis, { x: 432, y: 500, g: B.gunting() });
      Aud.sfx('tap');
      return Tween.wait(400).then(function () {
        r.pakai(tk('raka', 'sorak', 'senang'));
        r.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 2.6)) * 4; };
        return ctx.ucap(ctx.X.bahaya.gunting.aman, 'tara');
      });
    },
    botol: function (ctx) {
      var sr = ctx.aktor.sari;
      sr.putar = null; sr.rot = 0;
      sr.pakai(tk('sari', 'berdiri')); sr.atur();
      return ibuKe(ctx, 774, 1).then(function () {
        ctx.aktor.ibu.pakai(tk('ibu', 'tempel'));
        return ctx.ucap(ctx.X.bahaya.botol.aman, 'guru');
      }).then(function () {
        sr.pakai(tk('sari', 'minum', 'senang', { pegang: 'gelas' }));
        return ibuKembali(ctx);
      });
    },
    panci: function (ctx) {
      var n = ctx.aktor.nino, ay = ctx.aktor.ayah;
      n.putar = null; n.dy = 0; n.sy = 1;
      n.pakai(tk('nino', 'berdiri'));
      /* Nino turun dari bangku dan mundur; Ayah datang dan memutar gagang panci ke dalam */
      return Tween.run(400, function (e) { n.y = 540 + 52 * e; n.x = 998 - 46 * e; n.atur(); }, Ease.easeOutQuad).then(function () {
        n.arah = 1; n.atur();
        return ay.jalanKe(1032, 592, 1100, jalan('ayah'), tk('ayah', 'tempel', 'senyum'));
      }).then(function () {
        ay.arah = -1; ay.atur();
        Aud.sfx('tap');
        ctx.aktor.panci.pakai(B.panci(true));
        return ctx.ucap(ctx.X.bahaya.panci.aman, 'guru');
      }).then(function () {
        ay.pakai(tk('ayah', 'berdiri', 'senyum')); ay.atur();
        ay.putar = function (t, a) { a.sy = 1 + Math.sin(t * 2.2) * 0.01; };
        n.putar = function (t, a) { a.sy = 1 + Math.sin(t * 2.4) * 0.015; };
      });
    },
    basah: function (ctx) {
      var la = ctx.aktor.lala;
      la.putar = null; la.dx = 0; la.arah = 1;
      la.pakai(tk('lala', 'berdiri', 'kaget')); la.atur();
      return Tween.wait(400).then(function () {
        Aud.sfx('muncul');
        la.pakai(tk('lala', 'berdiri', 'senyum', { alas: 'sandal' }));
        return Tween.wait(300);
      }).then(function () {
        return la.jalanKe(1180, 590, 1300, jalan('lala', 'senyum', { alas: 'sandal' }), tk('lala', 'berdiri', 'senyum', { alas: 'sandal' }));
      }).then(function () {
        var bingkai = jalan('lala', 'senyum', { alas: 'sandal' });
        la.putar = function (t, a) { var k = (Math.sin(t * 0.5) + 1) / 2; a.x = 1090 + k * 100; a.arah = Math.cos(t * 0.5) >= 0 ? 1 : -1; silih(bingkai, 0.22)(t, a); };
        return ctx.ucap(ctx.X.bahaya.basah.aman, 'tara');
      });
    }
  };

  /* ===== Momen Tahan: Nino menumpuk dua kursi di depan lemari untuk meraih toples kue ===== */
  var MOMEN = {
    sorot: [612, 420, 170],
    siapkan: function (ctx) {
      var n = ctx.aktor.nino;
      n.putar = null; n.dy = 0;
      new Aktor(ctx.lapis, { x: 612, y: 592, s: 1.2, g: B.kursiTumpuk() }).el.style.zIndex = 0;
      n.el.style.zIndex = 2;
      n.x = 650; n.y = 592; n.arah = -1; n.pakai(tk('nino', 'berdiri')); n.atur();
    },
    /* k 0-1 menuju berdiri di kursi atas; membeku selalu saat Nino masih memanjat kursi bawah */
    gerak: function (ctx, k) {
      var n = ctx.aktor.nino;
      if (k < 0.3) { var e = k / 0.3; n.x = 650 - 34 * e; n.pakai(jalan('nino')[Math.floor(e * 4) % 4]); }
      else { var e2 = (k - 0.3) / 0.7; n.x = 616; n.y = 592 - e2 * 120; n.pakai(e2 * 6 % 2 < 1 ? tk('nino', 'panjatSamping', 'fokus') : tk('nino', 'panjatSamping2', 'fokus')); }
      n.atur();
    },
    gelembung: function (ctx) { var n = ctx.aktor.nino; return [n.x, n.y - 60, 64]; },
    aman: function (ctx) {
      var n = ctx.aktor.nino;
      return Tween.run(500, function (e) { n.y = n.y + (592 - n.y) * e; n.x = 616 + 34 * e; n.atur(); }, Ease.easeOutQuad).then(function () {
        n.pakai(tk('nino', 'berdiri')); n.arah = -1; n.atur();
        return ibuKe(ctx, 576, 1);
      }).then(function () {
        ctx.aktor.ibu.pakai(tk('ibu', 'raih'));
        var tp = new Aktor(ctx.lapis, { x: 618, y: 316, g: B.toples() });
        return Tween.run(600, function (e) { tp.x = 618 - 12 * e; tp.y = 316 + 140 * e; tp.atur(); }, Ease.easeInOutCubic);
      }).then(function () {
        n.pakai(tk('nino', 'sorak', 'senang'));
        n.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 5; };
        return ctx.ucap(ctx.X.momen.aman, 'guru');
      });
    }
  };

  var GELEMBUNG = { stopkontak: [440, 520, 72], gunting: [556, 500, 78], botol: [828, 500, 78], panci: [998, 470, 64], basah: [1120, 515, 78] };

  function tempatAman(ctx) {
    var A = ctx.aktor;
    A.bima.pakai(tk('bima', 'sorak', 'senang'));
    A.sekar.pakai(tk('sekar', 'minum', 'senang', { pegang: 'gelas' }));
    A.dina.pakai(tk('dina', 'dudukLantai', 'senang', { pegang: 'kertas' }));
  }

  root.ADEGAN = root.ADEGAN || {};
  root.ADEGAN.t2 = { siapkan: siapkan, aman: AMAN, momen: MOMEN, gelembung: GELEMBUNG, tempatAman: tempatAman, semuaGambar: semuaGambar };
})(window);
