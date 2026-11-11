/* Boot: simpanan, layar muat (huruf, gambar pose Tara dan aktor dipramuat), lalu layar judul.
   Kait uji window.__test hanya aktif dengan ?test=1 dan tidak terlihat oleh murid. */
(function () {
  Save.load();
  bootStage();
  UI.applySettings();
  UI.pasangEsc();
  document.title = STR.judul.lengkap;
  document.getElementById('rotate-text').textContent = STR.putar;
  Muat.buka();

  function suaraSiap() {
    return new Promise(function (ok) {
      var ss = window.speechSynthesis;
      if (!ss || (ss.getVoices() || []).length) { ok(); return; }
      ss.addEventListener('voiceschanged', function () { ok(); });
      setTimeout(ok, 1200);
    });
  }
  /* gambar pose yang dipakai di layar judul, peta, dan T1 (tempat pertama, hook) dirasterkan saat muat.
     Tempat lain disiapkan di latar belakang sesudah layar judul tampil, supaya muat awal di HP lambat tetap singkat. */
  var TEMPAT_AWAL = ['t1'];
  function daftarGambar() {
    var o = { sisik: Save.daftarSisik(), perlengkapan: Save.perlengkapan() }, a = [];
    ['diam', 'senang', 'bola', 'intip', 'pikir', 'sorak', 'geleng', 'endus', 'tunjuk'].forEach(function (p) { a.push(Gambar.tara(p, o)); });
    a.push(Gambar.tara('diam', { sisik: o.sisik, perlengkapan: o.perlengkapan, kedip: true }), Gambar.tara('senang', { sisik: o.sisik, perlengkapan: o.perlengkapan, kedip: true }));
    a.push(Gambar.tokoh('sari', 'panggil', 'senang'), Gambar.tokoh('tegar', 'lempar', 'senang'));
    TEMPAT_AWAL.forEach(function (t) { if (ADEGAN[t]) a = a.concat(ADEGAN[t].semuaGambar()); });
    return a;
  }
  /* satu tempat per giliran, dengan jeda, supaya layar judul tetap lancar */
  function siapkanSisa() {
    var sisa = TEMPAT.urut.concat(TEMPAT.tambahan || []).filter(function (t) { return TEMPAT_AWAL.indexOf(t) < 0 && ADEGAN[t]; });
    (function berikut() {
      var t = sisa.shift();
      if (!t) return;
      setTimeout(function () { Gambar.pramuat(ADEGAN[t].semuaGambar()).then(berikut); }, 120);
    })();
  }
  var huruf = ['900 40px Grandstander', '800 40px Grandstander', '400 24px Andika', '700 24px Andika'].map(function (f) { return document.fonts.load(f).catch(function () { }); });
  Promise.all(huruf).then(function () {
    Muat.atur(0.25);
    /* membangun SVG pose memakan waktu: dibagi per potongan supaya bilah muat tetap bergerak */
    return new Promise(function (ok) { setTimeout(function () { ok(daftarGambar()); }, 30); });
  }).then(function (gambar) {
    Muat.atur(0.6);
    return Gambar.pramuat(gambar);
  }).then(function () {
    Muat.atur(0.85);
    return suaraSiap();
  }).then(function () {
    Muat.atur(1);
    return Muat.tunggu();
  }).then(function () {
    Muat.tutup();
    Scenes.go('judul').then(siapkanSisa);
  });

  /* lama bermain (untuk Catatan Guru), tidak dihitung saat tab tersembunyi atau di layar judul */
  setInterval(function () {
    if (Loop.paused || Stage.portrait || !Scenes.name || Scenes.name === 'judul') return;
    Save.data.detik++;
    if (Save.data.detik % 15 === 0) Save.save();
  }, 1000);

  if (U.TEST) {
    window.__test = {
      scene: function () { return Scenes.name; },
      keadaan: function () {
        var c = Scenes.cur, k = c && c.uji ? c.uji.keadaan() : {}, o = { scene: Scenes.name, busy: Scenes.busy, overlay: !!document.querySelector('.overlay') }, n;
        for (n in k) o[n] = k[n];
        o.siap = !!k.siap && !Scenes.busy;
        return o;
      },
      benar: function () { return Scenes.cur && Scenes.cur.uji ? Scenes.cur.uji.benar() : []; },
      salah: function () { return Scenes.cur && Scenes.cur.uji ? Scenes.cur.uji.salah() : []; },
      ke: function (nama, p) { Scenes.go(nama, p || {}); },
      aturSantai: function (b) { Save.data.settings.santai = !!b; Save.save(); },
      lewatiHook: function () { Save.data.hook = true; Save.save(); },
      simpanan: function () { return JSON.parse(JSON.stringify(Save.data)); },
      hapus: function () { Save.newStudent(); },
      ucapan: function () { return Voice.log.slice(); },
      luap: function () { return UI.cekLuap(); },
      gambar: function () { return Gambar.jumlah(); },
      /* gambar aktor yang gagal dimuat (SVG tidak sah sebagai XML): daftar id aktor */
      gambarRusak: function () {
        var imgs = Array.prototype.slice.call(document.querySelectorAll('#stage .aktor img, #stage img.latar'));
        return Promise.all(imgs.map(function (im) {
          return (im.complete && im.naturalWidth) ? null : im.decode().then(function () { return null; }, function () { var a = im.closest('.aktor'); return a ? (a.dataset.aktor || 'aktor') : im.src.slice(-30); });
        })).then(function (a) { return a.filter(Boolean); });
      },
      /* nama kait dari brief bagian 11 */
      status: function () { return window.__test.keadaan(); },
      /* daftar bahaya dan Teladan tempat yang sedang dimainkan, beserta kotak ketuknya [x, y, w, h] */
      bahaya: function () {
        var id = window.__test.keadaan().tempat, T = id && TEMPAT[id];
        if (!T) return null;
        function satu(h) { return { id: h.id, area: h.area }; }
        return { tempat: id, bahaya: T.bahaya.map(satu), teladan: T.teladan.map(satu) };
      },
      /* ketuk tombol atau kotak ketuk lewat data-id ("ayunan" sama dengan "area-ayunan"); true bila ada */
      ketuk: function (id) {
        var el = document.querySelector('[data-id="' + id + '"]') || document.querySelector('[data-id="area-' + id + '"]');
        if (el) el.click();
        return !!el;
      },
      /* pilih kartu ke-i (mulai 0) di PIKIR, Kartu Kilat, atau Pawai */
      pilih: function (i) {
        var el = document.querySelectorAll('[data-id^="kartu-"], [data-id^="kilat-"], [data-id^="pawai-"]')[i];
        if (el) el.click();
        return !!el;
      },
      tahan: function () { return window.__test.ketuk('tahan'); },
      /* tombol Lewati Gerak Siaga */
      lewati: function () { return window.__test.ketuk('gerak-lewati'); }
    };
  }
})();
