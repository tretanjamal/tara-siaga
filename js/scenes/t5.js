/* Naskah adegan T5 Hari Hujan (TAMBAHAN, GDD 6.1): hujan turun pelan, kilat lembut jauh di atas bukit tanpa guntur.
   Tiga bahaya dari kiri ke kanan: Raka di tepi sungai yang deras, Sari dan Dina bermain bola di lapangan terbuka saat ada kilat,
   Nino mendekati kabel listrik yang jatuh ke genangan. Tanpa Momen Tahan dan Teladan.
   Adegan aman tidak pernah membuat tokoh melewati kabel: Sari dan Dina masuk lewat sisi kiri teras, Ayah keluar dari pintu.
   Karena ada kilat, tidak ada anak yang tertinggal di lapangan: Raka masuk rumah, Nino berteduh di teras. */
(function (root) {
  var S = root.Seni, C = S.C, G = Gambar;
  var BAJU = {
    raka: { baju: 'rumahL', warna: { atas: C.hijauMuda, bawah: C.coklat }, alas: 'sandal' },
    sari: { baju: 'rumahP', warna: { atas: C.koralMuda, bawah: C.langitTua }, alas: 'sandal' },
    dina: { baju: 'rumahPanjang', alas: 'sandal' },
    bima: { baju: 'rumahL', warna: { atas: C.langit } },
    nino: { alas: 'sandal' }
  };
  function gabung(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b || {}) o[k] = b[k]; return o; }
  function tk(id, pose, eks, tambah) { return G.orang(id, pose, gabung(gabung(BAJU[id] || {}, { ekspresi: eks || 'senyum' }), tambah)); }
  var JALAN = ['jalan', 'jalan2', 'jalan3', 'jalan2'];
  function jalan(id, eks, tambah) { return JALAN.map(function (p) { return tk(id, p, eks, tambah); }); }
  function silih(gb, selang) { return function (t, a) { a.pakai(gb[Math.floor(t / selang) % gb.length]); }; }
  function benda(kunci, kotak, buat) { return G.gambar('t5|' + kunci, buat, kotak); }
  /* letak penting (logis 1280x720) */
  var TIANG = [1236, 606], GENANG = [1166, 618], PETIR = [338, 156];
  var B = {
    tiang: function () { return benda('tiang', [-80, -346, 200, 370], function () { return S.tiangRoboh(GENANG[0] - TIANG[0], GENANG[1] - TIANG[1] - 4, 316); }); },
    genangan: function () { return benda('genangan', [-60, -16, 120, 28], function () { return S.genangan(52); }); },
    petir: function () { return benda('petir', [-20, -4, 48, 102], function () { return S.petir(); }); },
    bola: function () { return benda('bola', [-14, -14, 28, 28], function () { return S.bola(0, 0, 11); }); }
  };

  function semuaGambar() {
    var a = [B.tiang(), B.genangan(), B.petir(), B.bola()];
    ['raka', 'sari', 'dina', 'nino', 'ayah'].forEach(function (id) { a = a.concat(jalan(id)); });
    ['raka', 'sari', 'dina', 'nino'].forEach(function (id) { a = a.concat(jalan(id, 'senang')); });
    a.push(tk('raka', 'jongkokRaih', 'senang'), tk('raka', 'berdiri'), tk('raka', 'sorak', 'senang'),
      tk('sari', 'tunjuk', 'senang'), tk('sari', 'sorak', 'senang'), tk('dina', 'sorak', 'senang'), tk('dina', 'tunjuk', 'senang'),
      tk('bima', 'berdiri'), tk('bima', 'panggil', 'senang'), tk('bima', 'sorak', 'senang'),
      tk('nino', 'berdiri'), tk('nino', 'tunjuk', 'kaget'), tk('nino', 'sorak', 'senang'),
      tk('ayah', 'berdiri'), tk('ayah', 'minum', 'senyum', { pegang: 'hp' }));
    return a;
  }

  function siapkan(ctx) {
    var L = ctx.lapis, A = {};
    function aktor(id, o) { o.id = id; A[id] = new Aktor(L, o); return A[id]; }
    /* hujan turun di atas seluruh adegan (CSS, berhenti saat Kurangi animasi) dan kilatan lembut */
    var hujan = U.h('div', 'hujan-turun'); L.appendChild(hujan);
    var kilatan = U.h('div', 'kilatan'); L.appendChild(kilatan);
    /* kilat jauh: muncul sebentar tiap 6 detik, layar sedikit terang; tanpa bunyi guntur */
    aktor('petir', { x: PETIR[0], y: PETIR[1], alpha: 0, g: B.petir() }).putar = function (t, a) {
      var k = t % 6, nyala = k > 5.2 && k < 5.55 ? 1 : k > 5.62 && k < 5.75 ? 0.7 : 0;
      a.alpha = nyala; kilatan.style.opacity = (nyala * 0.22).toFixed(2);
    };
    A.petir.el.style.zIndex = 0;
    aktor('raka', { x: 352, y: 548, arah: -1, g: tk('raka', 'jongkokRaih', 'senang') }).putar = function (t, a) { a.dx = Math.sin(t * 2.2) * 3; };
    /* Sari dan Dina saling melempar bola di lapangan terbuka */
    aktor('sari', { x: 506, y: 596, g: tk('sari', 'tunjuk', 'senang') });
    aktor('dina', { x: 624, y: 596, arah: -1, g: tk('dina', 'sorak', 'senang') });
    var keLalu = -1;
    aktor('bola', { x: 565, y: 520, g: B.bola() }).putar = function (t, a) {
      var k = (t % 1.6) / 1.6, ke = Math.floor(t / 1.6) % 2, x0 = ke ? 600 : 530, x1 = ke ? 530 : 600;
      a.x = x0 + (x1 - x0) * k; a.y = 532 - Math.sin(k * Math.PI) * 54; a.rot = t * 360;
      /* pose berganti hanya saat arah lemparan berganti */
      if (ke !== keLalu) { keLalu = ke; A.sari.pakai(tk('sari', ke ? 'sorak' : 'tunjuk', 'senang')); A.dina.pakai(tk('dina', ke ? 'tunjuk' : 'sorak', 'senang')); A.sari.atur(); A.dina.atur(); }
    };
    aktor('bima', { x: 984, y: 506, s: 0.9, g: tk('bima', 'berdiri') }).putar = function (t, a) { a.sy = 1 + Math.sin(t * 2.2) * 0.012; };
    aktor('genangan', { x: GENANG[0], y: GENANG[1], g: B.genangan() }).putar = function (t, a) { a.sx = 1 + Math.sin(t * 3) * 0.04; };
    aktor('tiang', { x: TIANG[0], y: TIANG[1], g: B.tiang() });
    aktor('nino', { x: 1086, y: 604, g: tk('nino', 'jalan') }).putar = function (t, a) {
      silih(jalan('nino'), 0.2)(t, a); a.dx = Math.sin(t * 1.1) * 12;
    };
    aktor('ayah', { x: 1100, y: 506, s: 0.92, arah: -1, alpha: 0, g: tk('ayah', 'berdiri') });
    ctx.aktor = A;
    return A;
  }

  /* saat ada kilat, anak tidak boleh tertinggal di lapangan terbuka: berjalan ke sisi kiri teras lalu masuk rumah */
  function masukRumah(a, x, y, ms) {
    return a.jalanKe(x, y, ms, jalan(a.id, 'senang')).then(function () {
      return Tween.run(UI.kurangi ? 10 : 400, function (e) { a.alpha = 1 - e; a.atur(); }, Ease.easeInOutCubic);
    }).then(function () { a.tampil(false); });
  }
  var AMAN = {
    sungai: function (ctx) {
      var r = ctx.aktor.raka;
      r.putar = null; r.dx = 0;
      r.pakai(tk('raka', 'berdiri')); r.atur();
      return r.jalanKe(418, 530, 900, jalan('raka'), tk('raka', 'sorak', 'senang')).then(function () {
        return Promise.all([ctx.ucap(ctx.X.bahaya.sungai.aman, 'tara'), masukRumah(r, 920, 512, 1500)]);
      });
    },
    petir: function (ctx) {
      var A = ctx.aktor, sr = A.sari, dn = A.dina, bl = A.bola;
      bl.putar = null; bl.tampil(false);
      A.bima.putar = null; A.bima.pakai(tk('bima', 'panggil', 'senang')); A.bima.arah = -1; A.bima.atur();
      /* masuk lewat sisi kiri teras, jauh dari tiang dan kabel */
      return Promise.all([
        sr.jalanKe(900, 512, 1400, jalan('sari', 'senang')),
        dn.jalanKe(940, 514, 1300, jalan('dina', 'senang'))
      ]).then(function () {
        return Tween.run(UI.kurangi ? 10 : 400, function (e) { sr.alpha = dn.alpha = 1 - e; sr.atur(); dn.atur(); }, Ease.easeInOutCubic);
      }).then(function () {
        sr.tampil(false); dn.tampil(false);
        A.bima.pakai(tk('bima', 'sorak', 'senang')); A.bima.arah = 1; A.bima.atur();
        return ctx.ucap(ctx.X.bahaya.petir.aman, 'tara');
      });
    },
    kabel: function (ctx) {
      var n = ctx.aktor.nino, ay = ctx.aktor.ayah;
      n.putar = null; n.dx = 0;
      /* Nino mundur menjauh, Ayah keluar dari pintu dan menelepon petugas listrik */
      return n.jalanKe(1000, 606, 700, jalan('nino'), tk('nino', 'tunjuk', 'kaget')).then(function () {
        n.arah = 1; n.atur();
        return Tween.run(UI.kurangi ? 10 : 400, function (e) { ay.alpha = e; ay.atur(); }, Ease.easeOutQuad);
      }).then(function () {
        ay.pakai(tk('ayah', 'minum', 'senyum', { pegang: 'hp' })); ay.atur();
        Aud.sfx('tap');
        return ctx.ucap(ctx.X.bahaya.kabel.aman, 'guru');
      }).then(function () {
        /* Nino naik ke teras (menjauh dari genangan, berteduh bersama Bima dan Ayah) */
        return n.jalanKe(1040, 512, 900, jalan('nino', 'senang'), tk('nino', 'sorak', 'senang'));
      }).then(function () {
        n.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 3)) * 3; };
      });
    }
  };

  var GELEMBUNG = { sungai: [352, 496, 62], petir: [565, 530, 96], kabel: [1086, 556, 56] };

  function tempatAman(ctx) {
    var A = ctx.aktor;
    A.raka.pakai(tk('raka', 'sorak', 'senang'));
    A.bima.pakai(tk('bima', 'sorak', 'senang'));
  }

  root.ADEGAN = root.ADEGAN || {};
  root.ADEGAN.t5 = { siapkan: siapkan, aman: AMAN, momen: null, gelembung: GELEMBUNG, tempatAman: tempatAman, semuaGambar: semuaGambar };
})(window);
