/* Permainan sela di dalam tempat (dipanggil js/scenes/tempat.js lewat ctx):
   SELA.gerak        Gerak Siaga (GDD 6.3): pemanasan sungguhan bersama Tara, sekitar 40 detik; gim tidak memeriksa gerakan.
   SELA.menyeberang  Ayo Menyeberang (GDD 6.2): urutan Berhenti, kanan, kiri, kanan, menyeberang dalam 3 putaran.
   Keduanya mengembalikan Promise dan memasang ctx.uji selama berjalan (kait bot). */
(function (root) {
  var Sn = root.Seni, C = Sn.C;

  /* ===================== Gerak Siaga ===================== */
  function gerak(ctx) {
    var Gk = STR.gerak, kursi = Save.data.settings.kursi, daftar = kursi ? Gk.gerakanKursi : Gk.gerakan;
    var hidup = ctx.hidup, selesai = false, ketuk = 0.62;
    var lapis = U.h('div', 'sela-gerak');
    lapis.innerHTML = '<div class="judul-sela" data-cek="judul gerak">' + UI.esc(Gk.judul) + '</div>' +
      '<div class="nama-gerak" data-cek="nama gerak"></div><div class="titik-gerak">' + daftar.map(function () { return '<span></span>'; }).join('') + '</div>' +
      '<div class="hitung" aria-live="polite"></div>';
    ctx.root.appendChild(lapis);
    var adegan = U.h('div', 'adegan tembus'); adegan.style.zIndex = 36;
    ctx.root.appendChild(adegan);
    var opsi = { sisik: Save.daftarSisik(), perlengkapan: Save.perlengkapan(), topi: ctx.id === 't4' };
    function gT(p) { return Gambar.tara(p, opsi); }
    var tara = new Aktor(adegan, { x: 520, y: 640, s: 1.45, g: gT('diam') });
    var elNama = lapis.querySelector('.nama-gerak'), elHitung = lapis.querySelector('.hitung'), titik = lapis.querySelectorAll('.titik-gerak span');
    var tutup, janji = new Promise(function (ok) { tutup = ok; });
    function akhiri() {
      if (selesai) return;
      selesai = true;
      Voice.stop(); Aud.musik(TEMPAT[ctx.id].musik);
      ctx.uji = null;
      Tween.run(250, function (e) { lapis.style.opacity = 1 - e; adegan.style.opacity = 1 - e; }, Ease.easeOutQuad).then(function () { lapis.remove(); adegan.remove(); tutup(); });
    }
    var lewati = Input.button(UI.esc(Gk.lewati), 'krem', akhiri, { x: 1040, y: 600, w: 220, h: 96, font: 30, id: 'gerak-lewati' });
    var sudah = Input.button(UI.esc(Gk.sudah), 'kuning', function () { Aud.sfx('good'); akhiri(); }, { x: 760, y: 560, w: 280, h: 110, font: 44, id: 'gerak-sudah' });
    lewati.style.display = 'none'; sudah.style.display = 'none';
    lapis.appendChild(lewati); lapis.appendChild(sudah);
    setTimeout(function () { if (!selesai && hidup()) { lewati.style.display = ''; UI.muncul(lewati, 300); } }, U.TEST ? 300 : 5000);
    ctx.uji = { nama: 'gerak', siap: function () { return lewati.style.display !== 'none' || sudah.style.display !== 'none'; },
      benar: function () { return sudah.style.display !== 'none' ? ['gerak-sudah'] : (lewati.style.display !== 'none' ? ['gerak-lewati'] : []); } };
    Aud.musik('gerak');
    UI.muncul(lapis, 300);

    /* satu hitungan: angka besar memantul, bunyi tik, Tara bergerak sesuai gerakan */
    function hitung(n, gerakTara) {
      if (selesai || !hidup()) return Promise.resolve();
      elHitung.textContent = n;
      Aud.sfx('tick', 1 + (n % 8) * 0.06);
      gerakTara(n);
      tara.atur();
      return Tween.run(ketuk * 1000, function (e, k) { elHitung.style.transform = 'scale(' + (1.25 - 0.25 * Math.min(1, k * 3)).toFixed(3) + ')'; }, Ease.linear);
    }
    function deret(jumlah, gerakTara) {
      var p = Promise.resolve();
      for (var i = 1; i <= jumlah; i++) (function (n) { p = p.then(function () { return hitung(n, gerakTara); }); })(i);
      return p;
    }
    var GERAK = [
      function (n) { tara.pakai(gT(n % 2 ? 'diam' : 'senang')); tara.dy = n % 2 ? -14 : 0; tara.rot = n % 2 ? -3 : 3; },
      function (n) { tara.pakai(gT(n % 2 ? 'sorak' : 'diam')); tara.dy = 0; tara.rot = n % 2 ? 4 : -4; },
      function (n) { var bola = (n - 1) % 8 < 4; tara.pakai(gT(bola ? 'bola' : 'sorak')); tara.sy = bola ? 1 : 1.08; tara.rot = 0; tara.dy = 0; },
      function (n) { tara.pakai(gT('senang')); tara.rot = Math.sin(n * 1.7) * 8; tara.dy = n % 2 ? -10 : 0; }
    ];
    var p = Voice.say(kursi ? Gk.ajakKursi : Gk.ajak, { tokoh: 'tara', mulai: function () { ctx.balon().tulis(kursi ? Gk.ajakKursi : Gk.ajak); } });
    daftar.forEach(function (gk, i) {
      p = p.then(function () {
        if (selesai || !hidup()) return;
        Array.prototype.forEach.call(titik, function (t, j) { t.className = j < i ? 'selesai' : j === i ? 'aktif' : ''; });
        elNama.textContent = gk.nama; elHitung.textContent = '';
        UI.lompat(elNama);
        return Voice.say(gk.ucap, { tokoh: 'tara', mulai: function () { ctx.balon().tulis(gk.ucap); } });
      }).then(function () {
        if (selesai || !hidup()) return;
        if (i < 3) return deret(8, GERAK[i]);
        /* Patung!: bergerak bebas, lalu musik berhenti dan Tara menggulung; semua diam (dua kali) */
        var q = Promise.resolve();
        [0, 1].forEach(function () {
          q = q.then(function () { if (selesai || !hidup()) return; Aud.musik('gerak'); return deret(4, GERAK[3]); }).then(function () {
            if (selesai || !hidup()) return;
            Aud.musik(null); tara.pakai(gT('bola')); tara.rot = 0; tara.dy = 0; tara.atur();
            elHitung.textContent = Gk.patung; Aud.sfx('tahan');
            return Promise.all([Voice.say(Gk.patung, { tokoh: 'tara' }), Tween.wait(1800)]);
          }).then(function () { if (!selesai && hidup()) { Aud.sfx('buka'); elHitung.textContent = ''; } });
        });
        return q;
      });
    });
    p.then(function () {
      if (selesai || !hidup()) return;
      Aud.musik('gerak');
      Array.prototype.forEach.call(titik, function (t) { t.className = 'selesai'; });
      tara.pakai(gT('sorak')); tara.rot = 0; tara.sy = 1; tara.atur();
      elNama.textContent = ''; elHitung.textContent = '';
      sudah.style.display = ''; UI.muncul(sudah, 320);
      sudah.focus({ preventScroll: true });
      Voice.say(Gk.selesai, { tokoh: 'tara', mulai: function () { ctx.balon().tulis(Gk.selesai); } });
    });
    return janji;
  }

  /* ===================== Ayo Menyeberang ===================== */
  /* titik mulai di trotoar dekat, cukup jauh dari garis zebra supaya Dina dan Ibu jelas berdiri di trotoar */
  var ZEBRA = [882, 652], SEBERANG_Y = 424;
  function menyeberang(ctx) {
    var M = STR.menyeberang, A = ctx.aktor, hidup = ctx.hidup, D = A.dina, I = A.ibuDina;
    var urut = M.urut, putaran = 0, i = 0, salahN = 0, sibuk = false, bantu = false, selesai = false, sudahLewat = false;
    var tutup, janji = new Promise(function (ok) { tutup = ok; });
    ctx.papan(false);
    /* jalur 5 langkah di tengah atas */
    var IKON = { berhenti: ['telapak', 'var(--koral)'], kanan: ['mata', 'var(--langit)'], kiri: ['mata', 'var(--langit)'], seberang: ['mainkan', 'var(--hijau)'] };
    var jalur = U.h('div', 'jalur-seberang');
    jalur.innerHTML = urut.map(function (u, j) {
      return '<span class="titik-seberang" data-j="' + j + '"><span class="bulat" style="background:' + IKON[u][1] + '">' + UI.ikon(IKON[u][0], 30) + '</span>' +
        (u === 'kanan' || u === 'kiri' ? '<b>' + (u === 'kanan' ? '&rarr;' : '&larr;') + '</b>' : '') + '</span>';
    }).join('');
    ctx.root.appendChild(jalur);
    /* empat tombol bergambar di kolom kanan */
    var kolom = U.h('div', 'kolom-seberang');
    var tombol = {};
    ['berhenti', 'kanan', 'kiri', 'seberang'].forEach(function (k) {
      var ik = k === 'kanan' ? UI.ikon('mata', 40) + '<b class="arah">&rarr;</b>' : k === 'kiri' ? '<b class="arah">&larr;</b>' + UI.ikon('mata', 40) : UI.ikon(IKON[k][0], 44);
      var b = Input.button('<span class="ikon-s">' + ik + '</span><span class="label-s">' + UI.esc(M.tombol[k]) + '</span>', k === 'berhenti' ? 'koral' : k === 'seberang' ? 'hijau' : 'langit', function () { tekan(k, b); },
        { x: 1080, y: 112 + ['berhenti', 'kanan', 'kiri', 'seberang'].indexOf(k) * 124, w: 188, h: 112, font: 22, id: 'seberang-' + k });
      tombol[k] = b; kolom.appendChild(b);
    });
    ctx.root.appendChild(kolom);
    /* tokoh di belakang kolom tombol disembunyikan selama permainan, lalu kembali */
    var tersembunyi = Object.keys(A).map(function (k) { return A[k]; }).filter(function (a) { return a && a.el && a.x > 1030 && a.el.style.visibility !== 'hidden'; });
    tersembunyi.forEach(function (a) { a.el.style.visibility = 'hidden'; });
    var efek = U.h('div', 'lapis tembus'); efek.style.zIndex = 15; ctx.root.appendChild(efek);
    function kerucut(arah) {
      efek.innerHTML = arah ? Sn.svg(1280, 720, Sn.path('M' + (D.x + arah * 6) + ',' + (D.y - 96) + ' L' + (D.x + arah * 330) + ',' + (D.y - 190) + ' L' + (D.x + arah * 330) + ',' + (D.y - 20) + ' Z', 'rgba(255,200,61,.28)', 3, C.kuningTua, ' stroke-dasharray="6 8"')) : '';
    }
    function tandai() {
      Array.prototype.forEach.call(jalur.children, function (el, j) { el.className = 'titik-seberang' + (j < i ? ' selesai' : j === i ? ' aktif' : ''); });
      Object.keys(tombol).forEach(function (k) { tombol[k].classList.remove('ditunjuk'); });
    }
    function ucap(t, tokoh) { return ctx.ucap(t, tokoh || 'tara'); }
    function gD(p) { return Gambar.orang('dina', p, { ekspresi: 'senyum' }); }
    function gI(p) { return Gambar.orang('ibuDina', p, {}); }
    function siapPutaran() {
      D.putar = null; I.putar = null;
      D.x = ZEBRA[0]; D.y = ZEBRA[1]; D.s = 1; D.arah = 1; D.pakai(gD('berdiriBelakang'));
      I.x = ZEBRA[0] + 52; I.y = ZEBRA[1] + 2; I.s = 0.95; I.arah = 1; I.pakai(gI('berdiriBelakang'));
      D.atur(); I.atur(); kerucut(0);
      i = 0; salahN = 0; sudahLewat = false; tandai();
    }
    /* kendaraan lewat: motor di lajur dekat dari kanan, angkot di lajur jauh dari kiri */
    function lewat(jenis) {
      var gb = jenis === 'motor' ? Gambar.gambar('t3|motorLewat', function () { return Sn.motor({ warna: C.langitTua, menyala: true }) + Sn.g('translate(6,-6) scale(.62)', Sn.tokoh('paman', 'dudukMotor', { arah: -1, helm: C.kuning })); }, [-110, -170, 230, 186])
        : Gambar.gambar('t3|angkotLewat', function () { return Sn.angkot(); }, [-140, -140, 286, 156]);
      var v = new Aktor(ctx.lapis, { x: jenis === 'motor' ? 1420 : -200, y: jenis === 'motor' ? 590 : 512, s: jenis === 'motor' ? 0.9 : 0.8, g: gb });
      v.el.style.zIndex = jenis === 'motor' ? 5 : 1;
      Aud.sfx('whoosh');
      return Tween.run(2600, function (e) { v.x = jenis === 'motor' ? 1420 - 1640 * e : -200 + 1700 * e; v.atur(); }, Ease.linear).then(function () { v.hapus(); });
    }
    function tunggu(jenis) {
      sibuk = true;
      I.pakai(gI('tempel')); I.arah = -1; I.atur();
      return ucap(jenis === 'motor' ? M.tunggu : M.tungguAngkot, 'guru').then(function () { return lewat(jenis); }).then(function () {
        if (!hidup()) return;
        I.pakai(gI('berdiriBelakang')); I.arah = 1; I.atur();
        i = 1; tandai(); kerucut(0);
        sibuk = false;
        return ucap(M.lihatLagi);
      });
    }
    function tekan(k, b) {
      if (selesai || sibuk || !hidup()) return;
      Voice.stop();
      var harap = urut[i];
      if (k !== harap) {
        /* urutan salah: petunjuk bertingkat; menyeberang terlalu awal ditahan Ibu */
        salahN++; bantu = true;
        Aud.sfx('bad'); UI.goyang(b);
        if (k === 'seberang') { I.pakai(gI('tempel')); I.arah = -1; I.atur(); ucap(M.salahUrut, 'guru').then(function () { I.pakai(gI('berdiriBelakang')); I.arah = 1; I.atur(); }); }
        else ucap(salahN === 1 ? M.salahLangkah : M.urutan);
        if (salahN >= 2) tombol[harap].classList.add('ditunjuk');
        if (salahN >= 3) UI.tunjuk(tombol[harap], { sumber: 'petunjuk', fy: 0.5 });
        return;
      }
      UI.sembunyiTangan(true);
      salahN = 0;
      Aud.sfx('ritme', Math.min(2, i));
      var langkah = i;
      i++; tandai();
      if (k === 'berhenti') { D.pakai(gD('berdiriBelakang')); D.atur(); kerucut(0); return ucap(M.langkah.berhenti); }
      if (k === 'kanan' || k === 'kiri') {
        D.pakai(gD('berdiri')); D.arah = k === 'kanan' ? 1 : -1; D.atur(); kerucut(D.arah);
        /* kendaraan lewat sekali per putaran; sesudahnya anak melihat lagi dari kanan */
        if (!sudahLewat && putaran === 1 && langkah === 1) { sudahLewat = true; return tunggu('motor'); }
        if (!sudahLewat && putaran === 2 && langkah === 2) { sudahLewat = true; return tunggu('angkot'); }
        return ucap(langkah === 3 ? M.langkah.kanan2 : M.langkah[k]).then(function () { if (langkah === 3 && hidup()) return ucap(M.kosong); });
      }
      /* menyeberang bergandengan di zebra cross */
      sibuk = true; kerucut(0);
      return ucap(M.langkah.seberang).then(function () {
        var d0 = D.y, i0 = I.y, n = 0;
        return Tween.run(2200, function (e, kk) {
          D.y = d0 + (SEBERANG_Y - d0) * e; I.y = i0 + (SEBERANG_Y + 2 - i0) * e; D.s = 1 - 0.15 * e; I.s = 0.95 - 0.14 * e;
          var f = Math.floor(kk * 12) % 2;
          if (f !== n) { n = f; D.pakai(gD(f ? 'jalanBelakang' : 'jalanBelakang2')); I.pakai(gI(f ? 'jalanBelakang' : 'jalanBelakang2')); Aud.sfx('langkah'); }
          D.atur(); I.atur();
        }, Ease.easeInOutCubic);
      }).then(function () {
        if (!hidup()) return;
        D.pakai(gD('berdiriBelakang')); I.pakai(gI('berdiriBelakang')); D.atur(); I.atur();
        Aud.sfx('aman'); UI.ledak(D.x, D.y - 80, 12); ctx.tara('sorak');
        return ucap(M.sampai).then(function () { if (hidup()) ctx.tara('diam'); });
      }).then(function () {
        if (!hidup()) return;
        putaran++;
        if (putaran >= 3) return selesaikan();
        var cover = document.getElementById('cover');
        return Tween.run(220, function (e) { cover.style.opacity = e; }, Ease.easeOutQuad).then(function () {
          siapPutaran();
          return Tween.run(220, function (e) { cover.style.opacity = 1 - e; }, Ease.easeOutQuad);
        }).then(function () { sibuk = false; return ucap(M.putaran[putaran]); });
      });
    }
    function selesaikan() {
      selesai = true;
      UI.idle.atur(null);
      ctx.uji = null;
      Save.catat(['aturan-main'], !bantu, bantu ? 2 : 0);
      Save.data.menyeberang = bantu ? 'bantu' : 'tepat'; Save.save();
      return ucap(M.selesai).then(function () {
        jalur.remove(); kolom.remove(); efek.remove();
        tersembunyi.forEach(function (a) { a.el.style.visibility = ''; });
        ctx.papan(true);
        /* Dina dan Ibu masuk ke halaman sekolah supaya gerbang tidak sesak */
        if (hidup()) [D, I].forEach(function (a, k) {
          var x0 = a.x, y0 = a.y, s0 = a.s, n = -1, gb = k ? gI : gD;
          a.putar = null;
          Tween.run(UI.kurangi ? 10 : 1100, function (e, kk) {
            var f = Math.floor(kk * 8) % 2;
            if (f !== n) { n = f; a.pakai(gb(f ? 'jalanBelakang' : 'jalanBelakang2')); }
            a.x = x0 + 70 * e; a.y = y0 - 30 * e; a.s = s0 * (1 - 0.15 * e); a.alpha = 1 - e; a.atur();
          }, Ease.easeInOutCubic).then(function () { a.el.style.visibility = 'hidden'; });
        });
        tutup();
      });
    }
    ctx.uji = { nama: 'menyeberang', siap: function () { return !sibuk && !selesai && !Voice.sibuk(); },
      benar: function () { return ['seberang-' + urut[i]]; },
      salah: function () { return ['berhenti', 'kanan', 'kiri', 'seberang'].filter(function (k) { return k !== urut[i]; }).map(function (k) { return 'seberang-' + k; }); } };
    siapPutaran();
    sibuk = true;
    /* diam 8 detik: urutan dibacakan ulang dan langkah sekarang melompat; 7 detik lagi tangan menunjuk tombol berikutnya */
    UI.idle.atur(function () { return !selesai && !sibuk && hidup() ? tombol[urut[i]] : null; }, {
      ucap: function () { if (!selesai && hidup()) { UI.lompat(jalur.children[i]); ucap(M.urutan); } },
      saatTangan: function () { bantu = true; }
    });
    ucap([M.ajak, M.urutan, M.putaran[0]]).then(function () { sibuk = false; });
    return janji;
  }

  root.SELA = { gerak: gerak, menyeberang: menyeberang };
})(window);
