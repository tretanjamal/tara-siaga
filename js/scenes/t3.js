/* Naskah adegan T3 Jalan ke Sekolah (GDD 6.1): babak 0 Gang Kampung, babak 1 Depan Sekolah, lalu Ayo Menyeberang (SELA)
   dan Momen Tahan (bola Ayu masuk ke jalan). Anak memakai seragam sekolah. siapkan(ctx, babak) membangun aktor per babak. */
(function (root) {
  var S = root.Seni, C = S.C, G = Gambar;
  function gabung(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b || {}) o[k] = b[k]; return o; }
  function tk(id, pose, eks, tambah) { return G.orang(id, pose, gabung({ ekspresi: eks || 'senyum' }, tambah)); }
  var JALAN = ['jalan', 'jalan2', 'jalan3', 'jalan2'];
  function jalan(id, eks, tambah) { return JALAN.map(function (p) { return tk(id, p, eks, tambah); }); }
  function silih(gb, selang) { return function (t, a) { a.pakai(gb[Math.floor(t / selang) % gb.length]); }; }
  function benda(kunci, kotak, buat) { return G.gambar('t3|' + kunci, buat, kotak); }
  /* pengendara duduk di jok motor: titik asal motor di tanah; jok di y -78 */
  function motorDengan(kunci, warna, pengendara) {
    return benda(kunci, [-110, -200, 230, 216], function () {
      var isi = S.motor({ warna: warna, menyala: kunci.indexOf('Mati') < 0, panas: kunci.indexOf('Panas') >= 0 });
      pengendara.forEach(function (p) { isi += S.g('translate(' + p[1] + ',' + p[2] + ') scale(' + p[3] + ')', S.tokoh(p[0], 'dudukMotor', gabung({ arah: -1 }, p[4]))); });
      return isi;
    });
  }
  var B = {
    motorAyah: function () { return motorDengan('motorAyahPanas', C.koral, [['ayah', 4, -6, 0.62, {}]]); },
    motorAyahSari: function () { return motorDengan('motorAyahSari', C.koral, [['ayah', 4, -6, 0.62, {}], ['sari', 44, -8, 0.8, { helm: C.koral, ekspresi: 'senang' }]]); },
    motorPaman: function () { return motorDengan('motorPamanMati', C.langitTua, [['paman', 4, -6, 0.62, { helm: C.hijau }]]); },
    motorPamanLala: function () { return motorDengan('motorPamanLalaMati', C.langitTua, [['paman', 4, -6, 0.62, { helm: C.hijau }], ['lala', 44, -8, 0.8, { helm: C.koral, ekspresi: 'senang' }]]); },
    layang: function () { return benda('layang', [-60, -50, 120, 360], function () { return S.layangTersangkut(30, 284); }); },
    ayam: function () { return benda('ayam', [-40, -72, 90, 80], function () { return S.ayam(); }); },
    bola: function () { return benda('bola', [-14, -14, 28, 28], function () { return S.bola(0, 0, 11); }); }
  };

  function semuaGambar() {
    var a = [B.motorAyah(), B.motorAyahSari(), B.motorPaman(), B.motorPamanLala(), B.layang(), B.ayam(), B.bola()];
    ['sari', 'bima', 'raka', 'sekar', 'dina', 'ibuDina', 'ani', 'ayu', 'lala'].forEach(function (id) { a = a.concat(jalan(id)); });
    a.push(tk('sari', 'jalan'), tk('bima', 'raih', 'fokus'), tk('bima', 'berdiri'), tk('bima', 'sorak', 'senang'), tk('raka', 'seimbang', 'senang'), tk('raka', 'berdiri'),
      tk('lala', 'berdiri', 'senang'), tk('lala', 'berdiri', 'senang', { helm: C.koral }), tk('dina', 'berdiriBelakang'), tk('dina', 'berdiri'), tk('dina', 'jalanBelakang'), tk('dina', 'jalanBelakang2'),
      tk('ibuDina', 'berdiriBelakang'), tk('ibuDina', 'jalanBelakang'), tk('ibuDina', 'jalanBelakang2'), tk('ibuDina', 'tempel'), tk('tegar', 'dudukSamping'), tk('ibu', 'berdiri'),
      tk('ani', 'berdiri'), tk('ani', 'ambil'), tk('ayu', 'berdiri', 'senang', { pegang: 'bola' }), tk('ayu', 'berdiri', 'kaget'), angkotLewat(), tk('ayu', 'lari', 'senang'), tk('ayu', 'lari2', 'senang'), tk('ayu', 'sorak', 'senang'));
    return a;
  }

  function siapkan(ctx, babak) {
    var L = ctx.lapis, A = {};
    function aktor(id, o) { o.id = id; A[id] = new Aktor(L, o); return A[id]; }
    if (!babak) {
      /* ---- Gang Kampung ---- */
      aktor('ayam', { x: 300, y: 612, s: 0.9, g: B.ayam() }).putar = function (t, a) { var k = (Math.sin(t * 0.4) + 1) / 2; a.x = 260 + k * 120; a.arah = Math.cos(t * 0.4) >= 0 ? 1 : -1; a.dy = -Math.abs(Math.sin(t * 6)) * 3; };
      aktor('motor', { x: 520, y: 574, g: B.motorAyah() }).putar = function (t, a) { a.dy = Math.sin(t * 30) * 0.8; };
      aktor('sari', { x: 646, y: 594, arah: -1, g: tk('sari', 'jalan') }).putar = function (t, a) { silih(jalan('sari'), 0.2)(t, a); a.dx = -Math.abs(Math.sin(t * 0.8)) * 10; };
      aktor('layang', { x: 752, y: 118, g: B.layang() }).putar = function (t, a) { a.rot = Math.sin(t * 2) * 3; };
      aktor('bima', { x: 786, y: 500, g: tk('bima', 'raih', 'fokus') }).putar = function (t, a) { a.dx = -Math.abs(Math.sin(t * 2.5)) * 6; };
      aktor('sekar', { x: 910, y: 566, arah: -1, g: tk('sekar', 'jalan') }).putar = function (t, a) {
        silih(jalan('sekar'), 0.2)(t, a); var k = (Math.sin(t * 0.5) + 1) / 2; a.x = 880 + k * 60; a.arah = Math.cos(t * 0.5) >= 0 ? 1 : -1;
      };
      aktor('raka', { x: 1132, y: 618, g: tk('raka', 'seimbang', 'senang') }).putar = function (t, a) { a.dx = Math.sin(t * 0.8) * 22; a.dy = -Math.sin(t * 0.8) * 5; a.rot = Math.sin(t * 2.2) * 5; };
    } else {
      /* ---- Depan Sekolah ---- */
      aktor('ani', { x: 905, y: 398, s: 0.82, g: tk('ani', 'berdiri') }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.01; };
      aktor('ayu', { x: 300, y: 426, s: 0.85, g: tk('ayu', 'berdiri', 'senang', { pegang: 'bola' }) }).tampil(false);
      aktor('bola', { x: 330, y: 420, g: B.bola() }).tampil(false);
      aktor('motor', { x: 300, y: 594, g: B.motorPaman() });
      aktor('lala', { x: 404, y: 606, arah: -1, g: tk('lala', 'berdiri', 'senang') }).putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3.2)) * 5; };
      aktor('dina', { x: 570, y: 614, g: tk('dina', 'berdiriBelakang') }).putar = function (t, a) { a.dx = Math.sin(t * 1.2) * 3; };
      aktor('ibuDina', { x: -120, y: 614, s: 0.95, g: tk('ibuDina', 'berdiriBelakang') });
      aktor('tegar', { x: 1112, y: 622, s: 0.95, arah: -1, g: tk('tegar', 'dudukSamping') }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.01; };
      aktor('ibuTegar', { x: 1186, y: 624, s: 0.9, arah: -1, g: tk('ibu', 'berdiri') });
    }
    ctx.aktor = A;
    return A;
  }

  var AMAN = {
    motor: function (ctx) {
      var sr = ctx.aktor.sari, m = ctx.aktor.motor;
      sr.putar = null; sr.dx = 0;
      /* memutar lewat depan motor ke sisi kiri, jauh dari knalpot */
      return sr.jalanKe(560, 622, 900, jalan('sari')).then(function () { return sr.jalanKe(452, 600, 700, jalan('sari')); }).then(function () {
        sr.arah = 1; sr.pakai(tk('sari', 'berdiri', 'senang')); sr.atur();
        return ctx.ucap(ctx.X.bahaya.motor.aman, 'guru');
      }).then(function () {
        sr.tampil(false); m.pakai(B.motorAyahSari());
        Aud.sfx('muncul');
      });
    },
    layang: function (ctx) {
      var b = ctx.aktor.bima;
      b.putar = null; b.dx = 0;
      b.pakai(tk('bima', 'berdiri')); b.atur();
      ctx.aktor.layang.pakai(G.gambar('t3|layangLepas', function () { return S.layangTersangkut(10, 160); }, [-60, -50, 120, 360]));
      return b.jalanKe(720, 528, 700, jalan('bima')).then(function () {
        return ctx.ucap(ctx.X.bahaya.layang.aman, 'guru');
      }).then(function () {
        b.pakai(tk('bima', 'sorak', 'senang'));
        b.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 4; };
      });
    },
    got: function (ctx) {
      var r = ctx.aktor.raka;
      r.putar = null; r.dx = 0; r.dy = 0; r.rot = 0;
      return r.jalanKe(1040, 560, 900, jalan('raka', 'senang')).then(function () {
        r.putar = function (t, a) { silih(jalan('raka', 'senang'), 0.2)(t, a); var k = (Math.sin(t * 0.5) + 1) / 2; a.x = 1010 + k * 60; a.arah = Math.cos(t * 0.5) >= 0 ? 1 : -1; };
        return ctx.ucap(ctx.X.bahaya.got.aman, 'tara');
      });
    },
    helm: function (ctx) {
      var la = ctx.aktor.lala, m = ctx.aktor.motor;
      la.putar = null; la.dy = 0;
      Aud.sfx('muncul');
      la.pakai(tk('lala', 'berdiri', 'senang', { helm: C.koral })); la.atur();
      return Tween.wait(500).then(function () {
        la.tampil(false); m.pakai(B.motorPamanLala());
        return ctx.ucap(ctx.X.bahaya.helm.aman, 'guru');
      });
    },
    seberang: function (ctx) {
      var d = ctx.aktor.dina, i = ctx.aktor.ibuDina;
      d.putar = null; d.dx = 0;
      d.arah = -1; d.pakai(tk('dina', 'berdiri')); d.atur();
      return i.jalanKe(526, 614, 1100, jalan('ibuDina')).then(function () {
        return ctx.ucap(ctx.X.bahaya.seberang.aman, 'guru');
      }).then(function () {
        d.arah = 1;
        return Promise.all([d.jalanKe(882, 612, 1500, jalan('dina')), i.jalanKe(934, 614, 1500, jalan('ibuDina'))]);
      }).then(function () {
        d.pakai(tk('dina', 'berdiriBelakang')); i.pakai(tk('ibuDina', 'berdiriBelakang')); d.atur(); i.atur();
      });
    }
  };

  /* ===== Momen Tahan: bola Ayu menggelinding ke jalan; Ayu berlari mengejarnya (brief) ===== */
  var MOMEN = {
    sorot: [360, 440, 160],
    siapkan: function (ctx) {
      var ay = ctx.aktor.ayu, bl = ctx.aktor.bola;
      ay.tampil(true); bl.tampil(true);
      ay.x = 300; ay.y = 426; ay.arah = 1; ay.pakai(tk('ayu', 'lari', 'senang')); ay.atur();
      bl.x = 340; bl.y = 422; bl.atur();
    },
    /* k 0-1: bola masuk ke jalan, Ayu menuju tepi trotoar (titik bahaya = turun ke jalan di y 440) */
    gerak: function (ctx, k) {
      var ay = ctx.aktor.ayu, bl = ctx.aktor.bola;
      bl.x = 340 + 120 * Math.min(1, k * 1.6); bl.y = 422 + 110 * Math.min(1, k * 1.6); bl.rot = k * 720; bl.atur();
      ay.x = 300 + 90 * k; ay.y = 426 + 12 * k;
      ay.pakai(tk('ayu', Math.floor(k * 16) % 2 ? 'lari2' : 'lari', 'senang'));
      ay.atur();
    },
    gelembung: function (ctx) { var ay = ctx.aktor.ayu; return [ay.x, ay.y - 54, 58]; },
    aman: function (ctx) {
      var ay = ctx.aktor.ayu, ani = ctx.aktor.ani, bl = ctx.aktor.bola;
      ay.pakai(tk('ayu', 'berdiri', 'senang')); ay.atur();
      return ani.jalanKe(470, 430, 1500, jalan('ani')).then(function () {
        ani.pakai(tk('ani', 'ambil')); ani.atur();
        return Tween.run(500, function (e) { bl.x = bl.x + (472 - bl.x) * e; bl.y = bl.y + (400 - bl.y) * e; bl.atur(); }, Ease.easeOutQuad);
      }).then(function () {
        bl.tampil(false);
        ay.pakai(tk('ayu', 'sorak', 'senang'));
        ay.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 4; };
        ani.pakai(tk('ani', 'berdiri'));
        return ctx.ucap(ctx.X.momen.aman, 'guru');
      });
    }
  };

  /* Pengecoh "kejar bola" (brief bagian 8): Ayu berhenti di tepi trotoar, angkot lewat jauh di lajurnya, lalu pilihan diulang.
     Tanpa bunyi rem atau klakson; kendaraan tidak pernah mendekati anak. */
  function kejarBola(ctx) {
    var ay = ctx.aktor.ayu, x0 = ay.x, y0 = ay.y;
    var lari = [tk('ayu', 'lari', 'senang'), tk('ayu', 'lari2', 'senang')];
    return ay.jalanKe(x0 + 24, 440, 380, lari, tk('ayu', 'berdiri', 'kaget')).then(function () {
      var v = new Aktor(ctx.lapis, { x: -220, y: 512, s: 0.8, g: angkotLewat() });
      ctx.lapis.insertBefore(v.el, ctx.lapis.firstChild);
      Aud.sfx('whoosh');
      return Tween.run(UI.kurangi ? 900 : 2400, function (e) { v.x = -220 + 1720 * e; v.atur(); }, Ease.linear).then(function () { v.hapus(); });
    }).then(function () {
      return ay.jalanKe(x0, y0, 420, jalan('ayu'), tk('ayu', 'lari', 'senang'));
    }).then(function () { ay.arah = 1; ay.atur(); });
  }
  function angkotLewat() { return G.gambar('t3|angkotLewat', function () { return S.angkot(); }, [-140, -140, 286, 156]); }
  MOMEN.salah = { kejar: kejarBola, lihat: kejarBola };

  var GELEMBUNG = { motor: [646, 540, 66], layang: [786, 444, 66], got: [1132, 560, 66], helm: [404, 552, 64], seberang: [570, 558, 64] };

  function tempatAman(ctx) {
    var A = ctx.aktor;
    if (A.tegar) A.tegar.pakai(tk('tegar', 'dudukSamping', 'senang'));
  }

  root.ADEGAN = root.ADEGAN || {};
  root.ADEGAN.t3 = { siapkan: siapkan, aman: AMAN, momen: MOMEN, gelembung: GELEMBUNG, tempatAman: tempatAman, semuaGambar: semuaGambar };
})(window);
