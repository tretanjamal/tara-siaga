/* Save: progres di localStorage (try/catch); tetap jalan bila penyimpanan diblokir. Tanpa data pribadi.
   Pola dari Kafe Cilik (483): data dibersihkan saat dimuat supaya simpanan lama atau rusak tidak membuat gim macet. */
(function (root) {
  var KEY = 'taraSiaga.v1';
  var memory = null;
  var SETEL = { senyap: false, musik: true, efek: true, suara: true, santai: false, kurangi: false, kursi: false, bukaSemua: false };
  function fresh() {
    var s = {}, k;
    for (k in SETEL) s[k] = SETEL[k];
    return {
      settings: s,
      hook: false,          // hook 10 detik sudah diputar
      sisik: {},            // 't1-ayunan' -> 'emas' | 'perak'
      tempat: {},           // 't1' -> { selesai, bintang, detik }
      keterampilan: {},     // tag TP -> { kesempatan, benarAwal, salah, bantuan }
      jurus: {},            // jurus -> { kesempatan, benarAwal }
      keluarga: {},         // kode pengecoh -> jumlah dipilih
      teladan: {},          // 't1-panjat' -> true
      momen: {},            // 't1' -> 'tepat' | 'bantu'
      menyeberang: '',      // Ayo Menyeberang: 'tepat' | 'bantu'
      pawai: {},            // { selesai, benar, total, transfer: { korek: true, ... } }
      detik: 0
    };
  }
  function isObj(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function angka(v) { return typeof v === 'number' && isFinite(v) && v >= 0; }
  function clean(d) {
    var f = fresh(), k;
    if (!isObj(d)) return f;
    if (!isObj(d.settings)) d.settings = f.settings;
    for (k in f.settings) if (typeof d.settings[k] !== 'boolean') d.settings[k] = f.settings[k];
    for (k in d.settings) if (!(k in f.settings)) delete d.settings[k];
    if (typeof d.hook !== 'boolean') d.hook = false;
    if (!angka(d.detik)) d.detik = 0;
    if (d.menyeberang !== 'tepat' && d.menyeberang !== 'bantu') d.menyeberang = '';
    ['sisik', 'tempat', 'keterampilan', 'jurus', 'keluarga', 'teladan', 'momen', 'pawai'].forEach(function (n) { if (!isObj(d[n])) d[n] = {}; });
    Object.keys(d.sisik).forEach(function (n) { if (d.sisik[n] !== 'emas' && d.sisik[n] !== 'perak') delete d.sisik[n]; });
    Object.keys(d.tempat).forEach(function (n) { var v = d.tempat[n]; if (!isObj(v) || !angka(v.bintang) || typeof v.selesai !== 'boolean') delete d.tempat[n]; });
    Object.keys(d.keterampilan).forEach(function (t) {
      var v = d.keterampilan[t];
      if (!isObj(v) || !angka(v.kesempatan) || !angka(v.benarAwal) || !angka(v.salah) || !angka(v.bantuan)) delete d.keterampilan[t];
    });
    Object.keys(d.jurus).forEach(function (t) { var v = d.jurus[t]; if (!isObj(v) || !angka(v.kesempatan) || !angka(v.benarAwal)) delete d.jurus[t]; });
    Object.keys(d.keluarga).forEach(function (t) { if (!angka(d.keluarga[t])) delete d.keluarga[t]; });
    Object.keys(d.teladan).forEach(function (t) { if (d.teladan[t] !== true) delete d.teladan[t]; });
    Object.keys(d.momen).forEach(function (t) { if (d.momen[t] !== 'tepat' && d.momen[t] !== 'bantu') delete d.momen[t]; });
    /* Pawai: { selesai, benar, total, transfer } dengan kunci transfer yang memang ada di strings.js */
    var pw = d.pawai, kenal = (root.STR && STR.pawai && STR.pawai.transfer) || {};
    if (pw.selesai !== undefined || Object.keys(pw).length) {
      if (pw.selesai !== true || !angka(pw.benar) || !angka(pw.total) || !isObj(pw.transfer)) d.pawai = {};
      else Object.keys(pw.transfer).forEach(function (k) { if (!(k in kenal) || typeof pw.transfer[k] !== 'boolean') delete pw.transfer[k]; });
    }
    return d;
  }
  function slot(tag) { return Save.data.keterampilan[tag] || (Save.data.keterampilan[tag] = { kesempatan: 0, benarAwal: 0, salah: 0, bantuan: 0 }); }

  var Save = {
    data: fresh(),
    load: function () {
      try {
        var raw = root.localStorage.getItem(KEY);
        if (raw) Save.data = clean(JSON.parse(raw));
      } catch (e) { Save.data = memory || fresh(); }
    },
    save: function () {
      memory = Save.data;
      try { root.localStorage.setItem(KEY, JSON.stringify(Save.data)); } catch (e) { /* diblokir: abaikan */ }
    },
    /* satu situasi selesai. langsung = benar pada coba pertama; bantuan = tingkat bantuan tertinggi (0-3) */
    catat: function (tags, langsung, bantuan) {
      (tags || []).forEach(function (t) {
        var s = slot(t);
        s.kesempatan++;
        if (langsung) s.benarAwal++;
        s.bantuan = Math.max(s.bantuan, bantuan || 0);
      });
    },
    catatSalah: function (tags) { (tags || []).forEach(function (t) { slot(t).salah++; }); },
    catatJurus: function (j, langsung) {
      if (!j) return;
      var s = Save.data.jurus[j] || (Save.data.jurus[j] = { kesempatan: 0, benarAwal: 0 });
      s.kesempatan++; if (langsung) s.benarAwal++;
    },
    catatKeluarga: function (kode) { if (kode) Save.data.keluarga[kode] = (Save.data.keluarga[kode] || 0) + 1; },
    /* jurus anak: 'sudah' (min. 80% benar coba pertama), 'terus', atau 'belum' */
    statusJurus: function (j) {
      var s = Save.data.jurus[j];
      if (!s || !s.kesempatan) return 'belum';
      return s.benarAwal / s.kesempatan >= 0.8 ? 'sudah' : 'terus';
    },
    /* sisik: emas mengalahkan perak; perak tidak menimpa emas */
    beriSisik: function (id, jenis) {
      if (Save.data.sisik[id] === 'emas') return;
      Save.data.sisik[id] = jenis;
      Save.save();
    },
    /* sisik punggung (24 slot tempat utama); sisik ekor dari tempat TAMBAHAN dihitung terpisah */
    jumlahSisik: function () { return Save.daftarSisik().filter(Boolean).length; },
    daftarEkor: function () {
      var a = [];
      (TEMPAT.tambahan || []).forEach(function (t) { var T = TEMPAT[t]; if (T) T.slot.forEach(function (k) { a.push(Save.data.sisik[t + '-' + k] || ''); }); });
      return a;
    },
    /* jumlah sisik tempat tertentu (Papan Sisik) */
    sisikTempat: function (t) { var T = TEMPAT[t]; return T ? T.slot.filter(function (k) { return Save.data.sisik[t + '-' + k]; }).length : 0; },
    /* 24 slot punggung Tara: urutan tempat lalu urutan bahaya (config/tempat.js) */
    daftarSisik: function () {
      var a = [];
      TEMPAT.urut.forEach(function (t) {
        var T = TEMPAT[t];
        for (var i = 0; i < 6; i++) a.push(T && T.slot[i] ? (Save.data.sisik[t + '-' + T.slot[i]] || '') : '');
      });
      return a;
    },
    perlengkapan: function () {
      return TEMPAT.urut.filter(function (t) { return Save.selesai(t) && TEMPAT[t]; }).map(function (t) { return TEMPAT[t].perlengkapan; });
    },
    selesai: function (t) { var v = Save.data.tempat[t]; return !!(v && v.selesai); },
    catatTempat: function (t, isi) {
      var lama = Save.data.tempat[t] || { selesai: false, bintang: 0, detik: 0 };
      Save.data.tempat[t] = { selesai: lama.selesai || !!isi.selesai, bintang: Math.max(lama.bintang, isi.bintang || 0), detik: isi.detik || lama.detik };
      Save.save();
    },
    /* Pemain baru di perangkat yang sama: progres dihapus, pengaturan tetap (termasuk Buka semua tempat dari guru) */
    newStudent: function () { var s = Save.data.settings; Save.data = fresh(); Save.data.settings = s; if (s.bukaSemua) Save.data.hook = true; Save.save(); },
    pawaiTerbuka: function () { return Save.perlengkapan().length >= 4 || !!Save.data.settings.bukaSemua; }
  };
  root.Save = Save;
})(typeof window !== 'undefined' ? window : globalThis);
