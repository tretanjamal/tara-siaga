/* Naskah adegan T1 Taman Bermain Sekolah (GDD 6.1, posisi dari mockup Fase 0, GDD 12.7).
   Berisi: aktor dan gerak diamnya, gelembung beku per bahaya, adegan ulang aman, gerak Momen Tahan, dan Tempat Aman.
   Dipakai js/scenes/tempat.js lewat ADEGAN.t1. Semua koordinat logis 1280x720. */
(function (root) {
  var S = root.Seni, C = S.C;
  var G = Gambar;
  function tk(id, pose, eks, timpaKunci, timpa) { return G.tokoh(id, pose, eks, timpaKunci, timpa); }
  var JALAN = ['jalan', 'jalan2', 'jalan3', 'jalan2'];
  function jalan(id, eks) { return JALAN.map(function (p) { return tk(id, p, eks || 'senyum'); }); }
  var DUDUK_ANI = { kb: [[-4, -72], [16, -72], [18, -38]], kd: [[4, -72], [24, -71], [26, -38]], naik: 34 };
  var TANGAN_DINA = { lb: [[-15, -69], [-25, -62], [-23, -78]], ld: [[15, -69], [25, -62], [23, -78]] };

  /* gambar benda di koordinat adegan (kotak = wilayah gambar) */
  function benda(kunci, kotak, buat) { return G.gambar('t1|' + kunci, buat, kotak); }
  var B = {
    ayunanRusak: function () { return benda('ayunanRusak', [180, 286, 80, 226], function () { return S.ayunanRusak(206, 234, 296, 438); }); },
    ayunanPita: function () {
      return benda('ayunanPita', [180, 286, 80, 226], function () { return S.ayunanRusak(206, 234, 296, 438) + S.pita(192, 330, 248, 372) + S.pita(192, 372, 248, 330); });
    },
    /* ayunan Dina: poros di palang (269, 296), gambar relatif terhadap poros */
    ayunDina: function (eks) {
      return G.gambar('t1|ayunDina|' + eks, function () {
        return S.rantai(-15, 0, -22, 148) + S.rantai(15, 0, 22, 148) + S.dudukanAyun(0, 152, 0) +
          S.g('translate(0,190) scale(.92)', S.tokoh('dina', 'dudukAyun', { ekspresi: eks, timpa: TANGAN_DINA }));
      }, [-70, -8, 140, 214]);
    },
    kaca: function () { return benda('kaca', [636, 530, 104, 56], function () { return S.pecahanKaca(687, 572); }); },
    keranjang: function () { return benda('keranjang', [1204, 604, 70, 56], function () { return S.keranjang(1238, 654); }); },
    bola: function () { return G.gambar('t1|bola', function () { return S.bola(0, 0, 11); }, [-14, -14, 28, 28]); },
    pengki: function () { return G.gambar('t1|pengki', function () { return S.pengki(0, 0); }, [-26, -40, 52, 52]); }
  };

  /* daftar gambar yang dipramuat di layar muat */
  function semuaGambar() {
    var a = [B.ayunanRusak(), B.ayunanPita(), B.ayunDina('senang'), B.ayunDina('kaget'), B.kaca(), B.keranjang(), B.bola(), B.pengki()];
    ['sari', 'lala', 'raka', 'bima', 'ayu', 'ani'].forEach(function (id) { a = a.concat(jalan(id)); });
    a.push(tk('sari', 'berdiri', 'senyum'), tk('sari', 'panggil', 'teriak'), tk('sari', 'panggil', 'senang'),
      tk('lala', 'lari', 'senang'), tk('lala', 'lari2', 'senang'), tk('lala', 'berdiri', 'kaget'), tk('lala', 'berdiri', 'senyum'),
      tk('raka', 'dorong', 'senang'), tk('raka', 'dorong2', 'senang'), tk('raka', 'berdiri', 'senyum'), tk('raka', 'jongkok', 'fokus'), tk('raka', 'meluncur', 'senang'), tk('raka', 'sorak', 'senang'),
      tk('bima', 'panjatSamping', 'kaget'), tk('bima', 'panjatSamping2', 'kaget'), tk('bima', 'panjatSamping', 'senyum'), tk('bima', 'panjatSamping2', 'senyum'), tk('bima', 'berdiri', 'senyum'), tk('bima', 'meluncur', 'senang'), tk('bima', 'sorak', 'senang'),
      tk('ayu', 'panjatBelakang'), tk('ayu', 'panjatBelakang2'), tk('ayu', 'panjatSamping', 'senang'), tk('ayu', 'panjatSamping2', 'senang'),
      tk('sekar', 'panjatSamping', 'fokus'), tk('sekar', 'panjatSamping2', 'fokus'), tk('sekar', 'sorak', 'senang'),
      tk('tegar', 'lempar', 'senang'), tk('tegar', 'dudukSamping', 'senang'), tk('tegar', 'sorak', 'senang'),
      tk('ani', 'dudukSamping', 'senyum', 'bangku', DUDUK_ANI), tk('ani', 'berdiri', 'senyum'), tk('ani', 'tempel', 'senyum'), tk('ani', 'ambil', 'senyum'));
    return a;
  }

  /* gerak diam: pose bergantian tiap selang detik */
  function silih(pose, selang) { return function (t, a) { a.pakai(pose[Math.floor(t / selang) % pose.length]); }; }

  function siapkan(ctx) {
    var L = ctx.lapis, A = {};
    function aktor(id, o) { o.id = id; A[id] = new Aktor(L, o); return A[id]; }
    aktor('ayu', { x: 1190, y: 404, s: 0.9, g: tk('ayu', 'panjatBelakang') }).putar = function (t, a) { silih([tk('ayu', 'panjatBelakang'), tk('ayu', 'panjatBelakang2')], 0.7)(t, a); a.dy = -Math.abs(Math.sin(t * 2.2)) * 6; };
    aktor('sekar', { x: 962, y: 470, s: 0.92, g: tk('sekar', 'panjatSamping', 'fokus') }).putar = silih([tk('sekar', 'panjatSamping', 'fokus'), tk('sekar', 'panjatSamping2', 'fokus')], 0.9);
    aktor('ani', { x: 432, y: 452, s: 0.95, arah: -1, g: tk('ani', 'dudukSamping', 'senyum', 'bangku', DUDUK_ANI) }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.01; };
    aktor('bima', { x: 546, y: 448, s: 0.92, g: tk('bima', 'panjatSamping', 'kaget') }).putar = silih([tk('bima', 'panjatSamping', 'kaget'), tk('bima', 'panjatSamping2', 'kaget')], 0.6);
    aktor('raka', { x: 494, y: 514, s: 0.95, g: tk('raka', 'dorong', 'senang') }).putar = function (t, a) {
      var k = Math.floor(t / 0.6) % 2; a.pakai(tk('raka', k ? 'dorong2' : 'dorong', 'senang')); a.dx = k ? -5 : 0;
    };
    aktor('ayunanRusak', { g: B.ayunanRusak() }).putar = function (t, a) { a.rot = 0; };
    aktor('dina', { x: 269, y: 296, g: B.ayunDina('senang') }).putar = function (t, a) { a.rx = Math.sin(t * 1.9) * 24; };
    aktor('kaca', { g: B.kaca() }).putar = function (t, a) { a.alpha = 0.85 + Math.sin(t * 5) * 0.15; };
    aktor('sari', { x: 82, y: 516, g: tk('sari', 'jalan', 'senyum') }).putar = function (t, a) { silih(jalan('sari'), 0.16)(t, a); a.dx = Math.sin(t * 0.8) * 5; };
    aktor('lala', { x: 304, y: 574, g: tk('lala', 'lari', 'senang') }).putar = function (t, a) {
      silih([tk('lala', 'lari', 'senang'), tk('lala', 'lari2', 'senang')], 0.18)(t, a); a.dx = Math.sin(t * 1.3) * 22; a.arah = Math.cos(t * 1.3) >= 0 ? 1 : -1;
    };
    aktor('tegar', { x: 1150, y: 650, s: 0.95, g: tk('tegar', 'lempar', 'senang') });
    aktor('keranjang', { g: B.keranjang() });
    var bola = aktor('bola', { x: 1170, y: 556, g: B.bola() });
    /* Tegar melempar bola ke keranjang berulang (Teladan) */
    A.tegar.putar = function (t, a) {
      var k = (t % 2.6) / 2.6;
      a.pakai(tk('tegar', k < 0.25 ? 'lempar' : 'dudukSamping', 'senang'));
      if (k < 0.25) { bola.x = 1170; bola.y = 552; bola.alpha = 1; }
      else if (k < 0.75) { var e = (k - 0.25) / 0.5; bola.x = 1170 + 68 * e; bola.y = 552 - Math.sin(e * Math.PI) * 70 + 72 * e; bola.alpha = 1; }
      else bola.alpha = 0;
      bola.atur();
    };
    ctx.aktor = A;
    return A;
  }

  /* ===== adegan ulang aman (GDD pilar 2: tunjukkan cara yang benar). Mengembalikan Promise. ===== */
  function buGuruKe(ctx, x, y) {
    var ani = ctx.aktor.ani;
    ani.putar = null; ani.sy = 1;
    ani.pakai(tk('ani', 'berdiri', 'senyum'));
    return ani.jalanKe(x, y, Math.max(500, Math.hypot(x - ani.x, y - ani.y) * 7), jalan('ani'), tk('ani', 'berdiri', 'senyum'));
  }
  function buGuruDuduk(ctx) {
    var ani = ctx.aktor.ani;
    return ani.jalanKe(432, 452, Math.max(500, Math.hypot(432 - ani.x, 452 - ani.y) * 7), jalan('ani')).then(function () {
      ani.arah = -1; ani.pakai(tk('ani', 'dudukSamping', 'senyum', 'bangku', DUDUK_ANI));
      ani.putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.01; };
    });
  }
  var AMAN = {
    ayunan: function (ctx) {
      var A = ctx.aktor;
      A.sari.putar = null; A.sari.dx = 0; A.sari.arah = 1;
      A.sari.pakai(tk('sari', 'panggil', 'teriak')); A.sari.atur();
      Aud.sfx('muncul');
      return Tween.wait(500).then(function () { return buGuruKe(ctx, 262, 470); }).then(function () {
        A.ani.arah = -1; A.ani.pakai(tk('ani', 'tempel', 'senyum')); A.ani.atur();
        Aud.sfx('whoosh');
        A.ayunanRusak.pakai(B.ayunanPita());
        A.sari.pakai(tk('sari', 'berdiri', 'senyum'));
        return ctx.ucap(ctx.X.bahaya.ayunan.aman, 'guru');
      }).then(function () { return buGuruDuduk(ctx); }).then(function () {
        A.sari.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 1.6)) * 2; };
      });
    },
    lari: function (ctx) {
      var la = ctx.aktor.lala;
      la.putar = null; la.dx = 0;
      la.pakai(tk('lala', 'berdiri', 'kaget')); la.atur();
      return Tween.wait(400).then(function () {
        la.pakai(tk('lala', 'berdiri', 'senyum'));
        return la.jalanKe(330, 486, 1200, jalan('lala'));
      }).then(function () {
        la.putar = function (t, a) {
          var k = (Math.sin(t * 0.5) + 1) / 2;
          a.x = 330 + k * 70; a.arah = Math.cos(t * 0.5) >= 0 ? 1 : -1; silih(jalan('lala'), 0.16)(t, a);
        };
        return ctx.ucap(ctx.X.bahaya.lari.aman, 'tara');
      });
    },
    dorong: function (ctx) {
      var A = ctx.aktor, r = A.raka, b = A.bima;
      r.putar = null; b.putar = null; r.dx = 0;
      r.pakai(tk('raka', 'berdiri', 'senyum')); r.atur();
      b.pakai(tk('bima', 'panjatSamping', 'senyum')); b.atur();
      return r.jalanKe(462, 522, 600, jalan('raka'), tk('raka', 'berdiri', 'senyum')).then(function () {
        r.arah = 1; r.atur();
        return b.jalanKe(604, 354, 1100, [tk('bima', 'panjatSamping', 'senyum'), tk('bima', 'panjatSamping2', 'senyum')], tk('bima', 'berdiri', 'senyum'));
      }).then(function () { return luncur(b, 'bima'); }).then(function () {
        return b.jalanKe(880, 512, 700, jalan('bima'), tk('bima', 'berdiri', 'senyum'));
      }).then(function () {
        b.arah = -1; b.atur();
        b.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 1.4)) * 2; };
        r.putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.012; };
        return ctx.ucap(ctx.X.bahaya.dorong.aman, 'tara');
      });
    },
    kaca: function (ctx) {
      var A = ctx.aktor, p = null;
      return buGuruKe(ctx, 640, 566).then(function () {
        A.ani.arah = 1; A.ani.pakai(tk('ani', 'ambil', 'senyum')); A.ani.atur();
        p = new Aktor(ctx.lapis, { x: 690, y: 584, g: B.pengki() });
        Aud.sfx('whoosh');
        return Tween.run(700, function (e) { A.kaca.alpha = 1 - e; A.kaca.putar = null; A.kaca.atur(); }, Ease.easeOutQuad);
      }).then(function () {
        A.kaca.tampil(false); p.hapus();
        A.ani.pakai(tk('ani', 'berdiri', 'senyum'));
        return ctx.ucap(ctx.X.bahaya.kaca.aman, 'guru');
      }).then(function () { return buGuruDuduk(ctx); });
    },
    pagar: function (ctx) {
      var a = ctx.aktor.ayu;
      a.putar = null; a.dy = 0;
      return a.jalanKe(1190, 448, 900, [tk('ayu', 'panjatBelakang'), tk('ayu', 'panjatBelakang2')], tk('ayu', 'jalan', 'senyum')).then(function () {
        return a.jalanKe(1060, 476, 900, jalan('ayu'));
      }).then(function () {
        a.arah = -1; a.y = 468; a.pakai(tk('ayu', 'panjatSamping', 'senang'));
        a.putar = silih([tk('ayu', 'panjatSamping', 'senang'), tk('ayu', 'panjatSamping2', 'senang')], 0.9);
        return ctx.ucap(ctx.X.bahaya.pagar.aman, 'tara');
      });
    }
  };
  /* meluncur di perosotan (latar): dari puncak (680, 352) ke ujung (806, 494) */
  function luncur(a, id) {
    a.pakai(tk(id, 'meluncur', 'senang')); a.arah = 1;
    Aud.sfx('whoosh');
    return Tween.run(900, function (e) {
      var u = 1 - e;
      a.x = u * u * 676 + 2 * u * e * 752 + e * e * 812; a.y = u * u * 356 + 2 * u * e * 380 + e * e * 496;
      a.rot = 34 - 30 * e; a.atur();
    }, Ease.easeInOutCubic).then(function () { a.rot = 0; a.pakai(tk(id, 'berdiri', 'senyum')); a.atur(); });
  }

  /* ===== Momen Tahan: Raka di puncak perosotan bersiap melompat ===== */
  var MOMEN = {
    /* titik sorot kamera (lingkaran terang di tirai) */
    sorot: [650, 300, 150],
    siapkan: function (ctx) {
      var A = ctx.aktor, r = A.raka;
      r.putar = null; r.rot = 0; r.dx = 0; r.dy = 0;
      r.x = 626; r.y = 354; r.arah = 1; r.pakai(tk('raka', 'berdiri', 'senyum')); r.atur();
    },
    /* k: 0 sampai 1 menuju titik bahaya (melompat dari tepi). Membeku selalu sebelum k = 1, saat kaki masih di platform. */
    gerak: function (ctx, k) {
      var r = ctx.aktor.raka;
      if (k < 0.55) {
        var e = k / 0.55;
        r.x = 626 + 52 * e;
        r.pakai(jalan('raka', 'senang')[Math.floor(e * 6) % 4]);
        r.rot = 0;
      } else {
        var e2 = (k - 0.55) / 0.45;
        r.x = 678 + 6 * e2;
        r.pakai(tk('raka', 'jongkok', 'fokus'));
        r.rot = 12 * e2;
      }
      r.atur();
    },
    gelembung: function (ctx) { var r = ctx.aktor.raka; return [r.x, r.y - 58, 72]; },
    aman: function (ctx) {
      var r = ctx.aktor.raka;
      r.rot = 0; r.x = 676; r.y = 356; r.atur();
      return Tween.wait(250).then(function () { return luncur(r, 'raka'); }).then(function () {
        return r.jalanKe(800, 512, 400, jalan('raka'), tk('raka', 'sorak', 'senang'));
      }).then(function () {
        r.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 6; };
        return ctx.ucap(ctx.X.momen.aman, 'tara');
      });
    }
  };

  /* gelembung beku per bahaya (koordinat adegan): tokoh yang dibekukan saat BERHENTI */
  var GELEMBUNG = { ayunan: [82, 462, 66], lari: [300, 516, 66], dorong: [520, 430, 92], kaca: null, pagar: [1190, 346, 66] };

  /* Tempat Aman: semua teman bermain dengan aman sekaligus */
  function tempatAman(ctx) {
    var A = ctx.aktor;
    A.sari.pakai(tk('sari', 'panggil', 'senang')); A.sari.putar = function (t, a) { a.rot = Math.sin(t * 3) * 3; };
    A.sekar.pakai(tk('sekar', 'sorak', 'senang')); A.sekar.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 5; };
    A.bima.pakai(tk('bima', 'sorak', 'senang')); A.bima.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3 + 1)) * 5; };
    A.dina.pakai(B.ayunDina('senang'));
  }

  root.ADEGAN = root.ADEGAN || {};
  root.ADEGAN.t1 = { siapkan: siapkan, aman: AMAN, momen: MOMEN, gelembung: GELEMBUNG, tempatAman: tempatAman, semuaGambar: semuaGambar };
})(window);
