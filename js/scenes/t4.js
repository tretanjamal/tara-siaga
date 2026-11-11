/* Naskah adegan T4 Lapangan dan Kolam (GDD 6.1): lapangan di kiri, kolam renang umum di kanan.
   Baris atas: jendela kaca, tenda, kolam; baris bawah: lintasan. Anak memakai baju olahraga.
   Pilihan "Pemanasan dulu" memicu Gerak Siaga (SELA.gerak) di adegan ulang aman. */
(function (root) {
  var S = root.Seni, C = S.C, G = Gambar;
  function gabung(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b || {}) o[k] = b[k]; return o; }
  function baju(id) { return id === 'budi' || id === 'wulan' ? {} : { baju: id === 'dina' ? 'olahragaPanjang' : 'olahraga' }; }
  function tk(id, pose, eks, tambah) { return G.orang(id, pose, gabung(gabung(baju(id), { ekspresi: eks || 'senyum' }), tambah)); }
  var JALAN = ['jalan', 'jalan2', 'jalan3', 'jalan2'];
  function jalan(id, eks, tambah) { return JALAN.map(function (p) { return tk(id, p, eks, tambah); }); }
  function silih(gb, selang) { return function (t, a) { a.pakai(gb[Math.floor(t / selang) % gb.length]); }; }
  function benda(kunci, kotak, buat) { return G.gambar('t4|' + kunci, buat, kotak); }
  var B = { bola: function () { return benda('bola', [-14, -14, 28, 28], function () { return S.bola(0, 0, 11); }); } };
  var KURSI = [1156, 262];   // titik duduk Kak Wulan di kursi penjaga (kaki di tanah kursi)

  function semuaGambar() {
    var a = [B.bola()];
    ['bima', 'raka', 'sari', 'ayu', 'dina', 'sekar', 'wulan', 'budi'].forEach(function (id) { a = a.concat(jalan(id)); });
    a.push(tk('budi', 'berdiri'), tk('budi', 'panggil', 'senang'), tk('bima', 'lari', 'senang'), tk('bima', 'lari2', 'senang'), tk('bima', 'berdiri'),
      tk('raka', 'siapLari', 'fokus'), tk('raka', 'berdiri'), tk('raka', 'sorak', 'senang'), tk('sari', 'berdiri', 'senyum', { taliLepas: true }), tk('sari', 'ikatSepatu', 'fokus', { pegang: 'tali' }), tk('sari', 'berdiri', 'senang'),
      tk('lala', 'ikatSepatu', 'fokus', { pegang: 'tali' }), tk('tegar', 'minum', 'senyum', { pegang: 'gelas' }), tk('ayu', 'berdiri'), tk('ayu', 'sorak', 'senang'),
      tk('dina', 'lari', 'senang'), tk('dina', 'lari2', 'senang'), tk('dina', 'berdiri', 'kaget'), tk('wulan', 'panjatBelakang'), tk('wulan', 'panjatBelakang2'), tk('wulan', 'dudukSamping'),
      tk('sekar', 'lari', 'senang'), tk('sekar', 'lari2', 'senang'), tk('sekar', 'berdiri'), tk('sekar', 'sorak', 'senang'));
    return a;
  }

  function siapkan(ctx) {
    var L = ctx.lapis, A = {};
    function aktor(id, o) { o.id = id; A[id] = new Aktor(L, o); return A[id]; }
    aktor('budi', { x: 96, y: 470, s: 0.9, g: tk('budi', 'berdiri') }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.01; };
    var bola = aktor('bola', { x: 230, y: 400, g: B.bola() });
    aktor('bima', { x: 262, y: 418, g: tk('bima', 'lari', 'senang') }).putar = function (t, a) {
      var k = (t % 2.2) / 2.2;
      a.pakai(tk('bima', k < 0.3 ? 'lari2' : 'lari', 'senang'));
      /* bola melambung ke dinding berjendela lalu memantul kembali */
      var e = k < 0.5 ? k / 0.5 : 1 - (k - 0.5) / 0.5;
      bola.x = 246 - 70 * e; bola.y = 404 - 120 * Math.sin(e * Math.PI / 2) + 10 * e; bola.atur();
    };
    aktor('raka', { x: 284, y: 604, g: tk('raka', 'siapLari', 'fokus') }).putar = function (t, a) { a.dy = Math.sin(t * 6) * 2; };
    aktor('sari', { x: 424, y: 604, g: tk('sari', 'berdiri', 'senyum', { taliLepas: true }) }).putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 5)) * 4; };
    aktor('lala', { x: 566, y: 602, g: tk('lala', 'ikatSepatu', 'fokus', { pegang: 'tali' }) }).putar = function (t, a) { a.rot = Math.sin(t * 3) * 2; };
    aktor('tegar', { x: 640, y: 366, s: 0.9, g: tk('tegar', 'minum', 'senyum', { pegang: 'gelas' }) }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 2.2) * 0.012; };
    aktor('ayu', { x: 836, y: 378, s: 0.9, arah: -1, g: tk('ayu', 'jalan') }).putar = function (t, a) { silih(jalan('ayu'), 0.2)(t, a); a.dx = -Math.abs(Math.sin(t * 0.9)) * 14; };
    aktor('dina', { x: 1150, y: 616, g: tk('dina', 'lari', 'senang') }).putar = function (t, a) {
      silih([tk('dina', 'lari', 'senang'), tk('dina', 'lari2', 'senang')], 0.18)(t, a); a.dx = Math.sin(t * 1.3) * 34; a.arah = Math.cos(t * 1.3) >= 0 ? 1 : -1;
    };
    aktor('wulan', { x: 1340, y: 378, s: 0.9, arah: -1, g: tk('wulan', 'jalan') });
    aktor('sekar', { x: 900, y: 378, s: 0.9, g: tk('sekar', 'berdiri') }).tampil(false);
    ctx.aktor = A;
    return A;
  }

  /* ===== adegan ulang aman ===== */
  var AMAN = {
    bola: function (ctx) {
      var b = ctx.aktor.bima, bola = ctx.aktor.bola;
      b.putar = null;
      b.pakai(tk('bima', 'berdiri')); b.atur();
      bola.x = 246; bola.y = 404; bola.atur();
      return b.jalanKe(390, 480, 900, jalan('bima', 'senang')).then(function () {
        bola.x = 412; bola.y = 474; bola.atur();
        b.putar = function (t, a) {
          var k = (t % 1.6) / 1.6;
          a.pakai(tk('bima', k < 0.3 ? 'lari2' : 'lari', 'senang'));
          bola.x = 412 + 40 * Math.sin(k * Math.PI); bola.y = 474 - 30 * Math.sin(k * Math.PI); bola.atur();
        };
        return ctx.ucap(ctx.X.bahaya.bola.aman, 'tara');
      });
    },
    lari: function (ctx) {
      var r = ctx.aktor.raka, bd = ctx.aktor.budi;
      r.putar = null; r.dy = 0;
      r.pakai(tk('raka', 'berdiri')); r.atur();
      bd.pakai(tk('budi', 'panggil', 'senang'));
      Aud.sfx('tahan');
      return ctx.ucap(ctx.X.bahaya.lari.aman, 'guru').then(function () { return ctx.gerak(); }).then(function () {
        bd.pakai(tk('budi', 'berdiri'));
        r.pakai(tk('raka', 'sorak', 'senang'));
        r.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 5; };
      });
    },
    tali: function (ctx) {
      var sr = ctx.aktor.sari;
      sr.putar = null; sr.dy = 0;
      sr.pakai(tk('sari', 'ikatSepatu', 'fokus', { pegang: 'tali' })); sr.atur();
      return Tween.wait(1100).then(function () {
        Aud.sfx('tap');
        sr.pakai(tk('sari', 'berdiri', 'senang'));
        sr.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 5)) * 3; };
        return ctx.ucap(ctx.X.bahaya.tali.aman, 'tara');
      });
    },
    masuk: function (ctx) {
      var la = ctx.aktor.ayu, w = ctx.aktor.wulan;
      la.putar = null; la.dx = 0;
      la.pakai(tk('ayu', 'berdiri')); la.atur();
      return w.jalanKe(KURSI[0], 378, 1000, jalan('wulan')).then(function () {
        return w.jalanKe(KURSI[0], KURSI[1] - 30, 900, [tk('wulan', 'panjatBelakang'), tk('wulan', 'panjatBelakang2')]);
      }).then(function () {
        w.y = KURSI[1]; w.arah = -1; w.pakai(tk('wulan', 'dudukSamping')); w.atur();
        w.putar = function (t, a) { a.sy = 1 + Math.sin(t * 2) * 0.01; };
        return ctx.ucap(ctx.X.bahaya.masuk.aman, 'guru');
      }).then(function () {
        la.pakai(tk('ayu', 'sorak', 'senang'));
        la.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 4; };
      });
    },
    licin: function (ctx) {
      var d = ctx.aktor.dina;
      d.putar = null; d.dx = 0;
      d.pakai(tk('dina', 'berdiri', 'kaget')); d.atur();
      return Tween.wait(400).then(function () {
        d.putar = function (t, a) { var k = (Math.sin(t * 0.45) + 1) / 2; a.x = 1100 + k * 100; a.arah = Math.cos(t * 0.45) >= 0 ? 1 : -1; silih(jalan('dina'), 0.24)(t, a); };
        return ctx.ucap(ctx.X.bahaya.licin.aman, 'tara');
      });
    }
  };

  /* ===== Momen Tahan: Sekar berlari hendak melompat ke bagian dalam ===== */
  var MOMEN = {
    sorot: [990, 320, 170],
    siapkan: function (ctx) {
      var sk = ctx.aktor.sekar;
      sk.tampil(true); sk.x = 900; sk.y = 378; sk.arah = 1; sk.pakai(tk('sekar', 'berdiri')); sk.atur();
    },
    /* k 0-1 menuju tepi bagian dalam (x 1070); membeku saat Sekar masih di lantai tepi kolam */
    gerak: function (ctx, k) {
      var sk = ctx.aktor.sekar;
      sk.x = 900 + 170 * k;
      sk.pakai(tk('sekar', Math.floor(k * 14) % 2 ? 'lari2' : 'lari', 'senang'));
      sk.atur();
    },
    gelembung: function (ctx) { var sk = ctx.aktor.sekar; return [sk.x, sk.y - 56, 62]; },
    aman: function (ctx) {
      var sk = ctx.aktor.sekar;
      sk.pakai(tk('sekar', 'berdiri')); sk.atur();
      return sk.jalanKe(760, 392, 1400, jalan('sekar')).then(function () {
        sk.pakai(tk('sekar', 'sorak', 'senang'));
        sk.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 4; };
        return ctx.ucap(ctx.X.momen.aman, ctx.aktor.wulan.y < 300 ? 'guru' : 'tara');
      });
    }
  };

  var GELEMBUNG = { bola: [262, 360, 66], lari: [284, 548, 62], tali: [424, 546, 64], masuk: [836, 326, 62], licin: [1150, 560, 64] };

  function tempatAman(ctx) {
    var A = ctx.aktor;
    A.lala.pakai(tk('lala', 'ikatSepatu', 'senang', { pegang: 'tali' }));
    A.tegar.pakai(tk('tegar', 'minum', 'senang', { pegang: 'gelas' }));
    A.sari.pakai(tk('sari', 'berdiri', 'senang'));
  }

  root.ADEGAN = root.ADEGAN || {};
  root.ADEGAN.t4 = { siapkan: siapkan, aman: AMAN, momen: MOMEN, gelembung: GELEMBUNG, tempatAman: tempatAman, semuaGambar: semuaGambar };
})(window);
