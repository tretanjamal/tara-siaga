/* Pawai Siaga (GDD 6.5): teman berbaris membawa papan bergambar; murid menjawab JEMPOL (Aman) atau TELAPAK (Tahan).
   Benar Aman: papan berkilau. Benar Tahan: papan berbalik menampilkan cara amannya. Salah: papan bergoyang, lalu petunjuk bertingkat (dorongan; lalu sorot gambar dan tangan menunjuk).
   Kartu ulang yang dijawab benar mengubah sisik perak menjadi emas. Penutup: "Kampung kita aman!", lalu Hasil Belajarku. */
(function () {
  var P = null;
  var PEMBAWA = ['sari', 'raka', 'dina', 'bima', 'lala', 'ayu', 'sekar', 'tegar'];
  function hidup(p) { return p && p === P && Scenes.name === 'pawai'; }
  function kalimatKartu(c) {
    if (c.jenis === 'transfer') return STR.pawai.transfer[c.transfer].kalimat;
    var b = c.kunci.split('-');
    return STR.tempat[b[0]].kilat[b[2]];
  }
  /* kenapa aman atau kenapa ditahan: dibacakan saat salah dan sesudah jawaban Aman yang benar */
  function alasanKartu(c) {
    if (c.jenis === 'transfer') return STR.pawai.transfer[c.transfer].alasan || '';
    var b = c.kunci.split('-');
    return (STR.tempat[b[0]].alasan || {})[b[2]] || '';
  }
  function caraKartu(c) {
    if (c.jenis === 'transfer') return STR.pawai.transfer[c.transfer].cara || '';
    var b = c.kunci.split('-'), X = STR.tempat[b[0]];
    return b[2] === 'momen' ? X.momen.aturan : X.bahaya[b[2]].aturan;
  }

  function ucap(t) {
    var p = P;
    return Voice.say(t, { tokoh: 'tara', mulai: function () { if (hidup(p)) p.balon.tulis(t); }, onWord: function (i) { if (hidup(p)) p.balon.sorot(i); } });
  }

  function berikut() {
    var p = P;
    if (!hidup(p)) return;
    if (p.i >= p.kartu.length) return penutup();
    var c = p.kartu[p.i], id = PEMBAWA[p.i % PEMBAWA.length];
    p.salah = 0; p.fase = 'jalan';
    var opsi = { ekspresi: 'senang' };
    var anak = p.anak = new Aktor(p.lapis, { x: 1420, y: 560, s: 0.95, arah: -1, g: Gambar.orang(id, 'sorak', opsi) });
    var papan = p.papan = U.h('div', 'papan-pawai');
    papan.innerHTML = '<div class="muka depan"><div class="gambar">' + Seni.svg(296, 204, GAMBAR[c.kunci]()) + '</div><p class="teks" data-cek="papan pawai">' + UI.teksKartu(kalimatKartu(c)) + '</p></div>' +
      '<div class="muka belakang"><span class="ikon-belakang">' + UI.ikon('telapak', 64) + '</span><p data-cek="cara pawai">' + UI.esc(caraKartu(c)) + '</p></div>';
    p.root.appendChild(papan);
    UI.pasKartu(papan.querySelector('.teks'));
    function letak() { papan.style.left = (anak.x - 152) + 'px'; }
    letak();
    var jalan = id === 'tegar' ? null : ['jalan', 'jalan2', 'jalan3', 'jalan2'].map(function (q) { return Gambar.orang(id, q, opsi); });
    Aud.sfx('whoosh');
    Tween.run(UI.kurangi ? 10 : 1300, function (e, k) {
      anak.x = 1420 - (1420 - 720) * e;
      if (jalan && k < 1) anak.pakai(jalan[Math.floor(k * 9) % 4]);
      anak.dy = id === 'tegar' ? 0 : -Math.abs(Math.sin(k * 18)) * 4;
      anak.atur(); letak();
    }, Ease.easeOutCubic).then(function () {
      if (!hidup(p)) return;
      anak.pakai(Gambar.orang(id, 'sorak', opsi)); anak.dy = 0; anak.atur();
      p.fase = 'tanya';
      UI.idle.atur(function () { return hidup(p) && p.fase === 'tanya' ? [p.tombol.aman, p.tombol.tahan] : null; },
        { ucap: function () { if (hidup(p) && p.fase === 'tanya') ucap(kalimatKartu(c)).then(function () { if (hidup(p) && p.fase === 'tanya') return ucap(STR.pawai.tanya); }); },
          tangan: function () { return hidup(p) ? p.root.querySelector('[data-id="dengar"]') : null; } });
      return ucap(kalimatKartu(c)).then(function () { if (hidup(p) && p.fase === 'tanya') return ucap(STR.pawai.tanya); });
    });
  }

  function jawab(j, tombol) {
    var p = P;
    if (!p || p.fase !== 'tanya') return;
    Voice.stop(); UI.sembunyiTangan(true);
    var c = p.kartu[p.i];
    if (j !== c.jawab) {
      p.salah++;
      Aud.sfx('bad'); UI.goyang(p.papan); UI.goyang(tombol);
      p.catatan.salah++;
      /* petunjuk bertingkat: 1 dorongan; 2 sorot gambar papan dan tangan menunjuk jawaban
         (hanya dua tombol, jadi tingkat 2 dan 3 digabung, sesuai GDD 6.5) */
      var ke = p.salah;
      function alasanLagi() { if (hidup(p) && p.fase === 'tanya' && p.salah === ke && alasanKartu(c)) return ucap(alasanKartu(c)); }
      if (p.salah === 1) ucap(STR.pawai.salah).then(alasanLagi);
      else { p.papan.classList.add('sorot'); ucap(STR.pawai.tunjuk).then(alasanLagi); UI.tunjuk(p.tombol[c.jawab], { sumber: 'petunjuk', fy: 0.5 }); }
      return;
    }
    p.fase = 'benar';
    p.papan.classList.remove('sorot');
    var pertama = p.salah === 0;
    if (c.jenis === 'transfer') p.catatan.transfer[c.transfer] = pertama;
    p.catatan.benar += pertama ? 1 : 0;
    /* TP1 membedakan situasi berbahaya dari yang aman */
    Save.catat(['kenali-bahaya'], pertama, p.salah >= 2 ? 3 : p.salah ? 1 : 0); Save.save();
    Aud.sfx('good');
    p.tara.pakai(Gambar.tara('sorak', p.opsiTara()));
    UI.lompat(p.titik[p.i]);
    var q;
    if (j === 'aman') {
      UI.ledak(720, 260, 18); UI.lompat(p.papan);
      q = ucap(STR.pawai.benarAman).then(function () { if (hidup(p) && alasanKartu(c)) return ucap(alasanKartu(c)); });
    } else {
      /* papan berbalik: cara amannya */
      p.papan.classList.add('balik');
      q = ucap(STR.pawai.benarTahan).then(function () { if (hidup(p) && caraKartu(c)) return ucap(caraKartu(c)); });
    }
    if (c.jenis === 'ulang' && pertama && Save.data.sisik[c.sisik] === 'perak') {
      q = q.then(function () {
        if (!hidup(p)) return;
        Save.data.sisik[c.sisik] = 'emas'; Save.save();
        Aud.sfx('sisik', 8); UI.ledak(200, 520, 14, 'sisik');
        p.tara.pakai(Gambar.tara('sorak', p.opsiTara()));
        return ucap(STR.pawai.perakEmas);
      });
    }
    q.then(function () {
      if (!hidup(p)) return;
      var anak = p.anak, papan = p.papan, id = PEMBAWA[p.i % PEMBAWA.length];
      p.i++;
      p.titik.forEach(function (t, k) { t.className = k < p.i ? 'selesai' : k === p.i ? 'aktif' : ''; });
      return Tween.run(UI.kurangi ? 10 : 1000, function (e) { anak.x = 720 - 940 * e; anak.atur(); papan.style.left = (anak.x - 152) + 'px'; }, Ease.easeInOutCubic).then(function () {
        anak.hapus(); papan.remove();
        p.tara.pakai(Gambar.tara('senang', p.opsiTara()));
        berikut();
      });
    });
  }

  function penutup() {
    var p = P;
    p.fase = 'penutup';
    Save.data.pawai = { selesai: true, benar: p.catatan.benar, total: p.kartu.length, transfer: p.catatan.transfer };
    Save.save();
    p.tombol.aman.style.display = 'none'; p.tombol.tahan.style.display = 'none';
    Aud.jingle('hasil', 'aman');
    p.tara.pakai(Gambar.tara('sorak', p.opsiTara()));
    /* parade: semua teman lewat bersama Tara */
    PEMBAWA.forEach(function (id, k) {
      var a = new Aktor(p.lapis, { x: -120 - k * 110, y: 560 + (k % 2) * 30, s: 0.9, g: Gambar.orang(id, 'sorak', { ekspresi: 'senang' }) });
      Tween.run(UI.kurangi ? 10 : 4200, function (e, kk) { a.x = -120 - k * 110 + 1700 * e; a.dy = -Math.abs(Math.sin(kk * 30 + k)) * 6; a.atur(); }, Ease.linear);
    });
    UI.ledak(640, 200, 24);
    ucap(STR.pawai.penutup).then(function () {
      if (!hidup(p)) return;
      var lanjut = Input.button(UI.esc(STR.tombol.lanjut), 'kuning', function () { Scenes.go('hasil'); }, { x: 900, y: 596, w: 300, h: 108, font: 38, id: 'lanjut' });
      p.root.appendChild(lanjut);
      UI.muncul(lanjut, 300);
      lanjut.focus({ preventScroll: true });
      p.fase = 'selesai';
      UI.idle.atur(function () { return lanjut; });
    });
  }

  Scenes.add('pawai', {
    enter: function (root) {
      Aud.musik('pawai');
      var latar = U.h('img', 'latar'); latar.src = ASET.gambar['latar-pawai'] || ''; latar.alt = '';
      root.appendChild(latar);
      var ul = Object.keys(Save.data.sisik).filter(function (k) { return Save.data.sisik[k] === 'perak'; });
      P = { root: root, i: 0, fase: 'mulai', catatan: { benar: 0, salah: 0, transfer: {} },
        kartu: Aturan.susunPawai(Aturan.bankKilat(TEMPAT), STR.pawai.transfer, ul, Math.random) };
      P.opsiTara = function () { return { sisik: Save.daftarSisik(), perlengkapan: Save.perlengkapan(), topi: true }; };
      root.appendChild(U.h('div', 'judul-layar', UI.esc(STR.pawai.judul)));
      var titik = U.h('div', 'titik-pawai');
      titik.innerHTML = P.kartu.map(function (c, k) { return '<span class="' + (k === 0 ? 'aktif' : '') + '"></span>'; }).join('');
      root.appendChild(titik);
      P.titik = Array.prototype.slice.call(titik.children);
      /* HUD seperti di tempat: jalan keluar ke Peta (dengan konfirmasi), dengar lagi, dan Pengaturan */
      root.appendChild(UI.tombolIkon('peta', STR.ikon.peta, function () {
        UI.konfirmasi(STR.keluar.judul, STR.keluar.isi, function () { Scenes.go('peta'); });
      }, { x: 14, y: 10, id: 'peta', warna: 'krem', ukuran: 54 }));
      root.appendChild(UI.tombolIkon('suara', STR.ikon.dengar, function () {
        var p = P;
        if (!p) return;
        Voice.stop();
        if (p.fase === 'tanya') { var c = p.kartu[p.i]; ucap(kalimatKartu(c)).then(function () { if (hidup(p) && p.fase === 'tanya') return ucap(STR.pawai.tanya); }); }
        else if (p.balon.teks) ucap(p.balon.teks);
      }, { x: 1062, y: 10, id: 'dengar' }));
      root.appendChild(UI.tombolIkon('gerigi', STR.ikon.pengaturan, function () { UI.pengaturan(); }, { x: 1170, y: 10, id: 'pengaturan' }));
      P.lapis = U.h('div', 'adegan tembus'); P.lapis.style.zIndex = 5;
      root.appendChild(P.lapis);
      P.tara = new Aktor(P.lapis, { x: 150, y: 640, s: 1.05, g: Gambar.tara('senang', P.opsiTara()) });
      P.tara.putar = function (t, a) { a.sy = 1 + Math.sin(t * 2.4) * 0.012; };
      P.balon = UI.balon(root, { x: 290, y: 628 });
      P.balon.el.classList.add('balon-pawai');
      P.balon.sembunyi();
      P.tombol = {
        aman: Input.button(UI.ikon('jempol', 56) + UI.esc(STR.pawai.aman), 'hijau', function (e, b) { jawab('aman', b); }, { x: 760, y: 596, w: 236, h: 112, font: 38, id: 'pawai-aman' }),
        tahan: Input.button(UI.ikon('telapak', 56) + UI.esc(STR.pawai.tahan), 'koral', function (e, b) { jawab('tahan', b); }, { x: 1020, y: 596, w: 236, h: 112, font: 38, id: 'pawai-tahan' })
      };
      root.appendChild(P.tombol.aman); root.appendChild(P.tombol.tahan);
      var p = P;
      ucap(STR.pawai.mulai).then(function () { if (hidup(p)) berikut(); });
    },
    update: function (dt) { if (P && !UI.kurangi) P.tara.jalankan(dt); },
    exit: function () { P = null; },
    uji: {
      keadaan: function () { return { langkah: P ? P.fase : '', siap: !!P && (P.fase === 'tanya' || P.fase === 'selesai'), kartu: P ? P.i : 0 }; },
      benar: function () { if (!P) return []; if (P.fase === 'selesai') return ['lanjut']; return P.fase === 'tanya' ? ['pawai-' + P.kartu[P.i].jawab] : []; },
      salah: function () { if (!P || P.fase !== 'tanya') return []; return ['pawai-' + (P.kartu[P.i].jawab === 'aman' ? 'tahan' : 'aman')]; },
      kartu: function () { return P ? P.kartu : []; }
    }
  });
})();
