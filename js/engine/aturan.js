/* Aturan permainan yang murni (tanpa DOM), supaya bisa diuji ribuan kali dengan node (test/logic/aturan.js).
   susunPawai: 6 kartu Pawai Siaga (GDD 6.5): sampai 3 kartu ulang (bahaya bersisik perak), tepat 2 kartu transfer
   (satu Aman dan satu Tahan), sisanya Kartu Kilat lain; selalu minimal 2 Aman dan 2 Tahan.
   bintang: bintang tempat (GDD 6). */
(function (root) {
  function acak(rnd, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var Aturan = {
    /* bank kilat dari tempat: [{ kunci: 't1-kilat-ayunan', sisik: 't1-ayunan', jawab: 'aman'|'tahan' }] */
    bankKilat: function (TEMPAT) {
      var a = [];
      TEMPAT.urut.forEach(function (t) {
        var T = TEMPAT[t];
        if (!T) return;
        T.bahaya.concat([T.momen]).forEach(function (h) { a.push({ kunci: t + '-kilat-' + h.id, sisik: t + '-' + h.id, jawab: h.kilat, jenis: 'kilat' }); });
      });
      return a;
    },
    /* transfer: { korek: { jawab }, ... } (STR.pawai.transfer); ulang: daftar id sisik bersisik perak */
    susunPawai: function (bank, transfer, ulang, rnd) {
      rnd = rnd || Math.random;
      var kartu = [], dipakai = {};
      function ambil(c) { kartu.push(c); dipakai[c.kunci] = true; }
      /* 1. kartu ulang: sampai 3 dari bahaya bersisik perak */
      var ul = acak(rnd, bank.filter(function (c) { return ulang.indexOf(c.sisik) >= 0; })).slice(0, 3);
      ul.forEach(function (c) { ambil({ kunci: c.kunci, sisik: c.sisik, jawab: c.jawab, jenis: 'ulang' }); });
      /* 2. tepat 2 kartu transfer: satu Aman dan satu Tahan */
      var tr = Object.keys(transfer).map(function (k) { return { kunci: 'transfer-' + k, transfer: k, jawab: transfer[k].jawab, jenis: 'transfer' }; });
      ['aman', 'tahan'].forEach(function (j) { var pilih = acak(rnd, tr.filter(function (c) { return c.jawab === j; }))[0]; if (pilih) ambil(pilih); });
      /* 3. isi sampai 6, utamakan jenis jawaban yang masih kurang dari 2 */
      function hitung(j) { return kartu.filter(function (c) { return c.jawab === j; }).length; }
      var sisa = acak(rnd, bank.filter(function (c) { return !dipakai[c.kunci]; }));
      while (kartu.length < 6 && sisa.length) {
        var kurang = hitung('aman') < 2 ? 'aman' : hitung('tahan') < 2 ? 'tahan' : null;
        var idx = 0;
        if (kurang) { idx = sisa.findIndex(function (c) { return c.jawab === kurang; }); if (idx < 0) idx = 0; }
        ambil(sisa.splice(idx, 1)[0]);
      }
      return acak(rnd, kartu);
    },
    /* bintang tempat: 1 selesai; 2 = semua kecuali satu bahaya benar coba pertama (4 dari 5; 2 dari 3);
       3 = TAHAN! tepat waktu (Santai: kapan saja), atau semua benar coba pertama untuk tempat tanpa Momen (T5) */
    bintang: function (benarAwal, tahanTepat, nBahaya, adaMomen) {
      var n = nBahaya || 5;
      return [true, benarAwal >= n - 1, adaMomen === false ? benarAwal >= n : !!tahanTepat];
    }
  };
  root.Aturan = Aturan;
  if (typeof module !== 'undefined') module.exports = Aturan;
})(typeof window !== 'undefined' ? window : globalThis);
