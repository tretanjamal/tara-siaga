/* Peta Kampung (GDD bagian 5): papan tiap tempat dengan bintang dan sisiknya; Tara menggelinding sebagai bola ke tempat
   yang diketuk. Guru bisa memilih satu tempat per pertemuan. T1-T5 terbuka; Pawai terbuka sesudah T1-T4 selesai. */
(function () {
  var aktor = null, tara = null, sibuk = false;
  /* ujung tiang papan = letak tempat di gambar peta */
  var PIN = { t1: [330, 300], t2: [270, 530], t3: [640, 400], t4: [1000, 560], t5: [628, 668], pawai: [960, 262] };
  var SIAP = { t1: true, t2: true, t3: true, t4: true, t5: true, pawai: true };   // tempat yang sudah dibangun

  function infoPin(id) {
    var P = STR.peta, T = TEMPAT[id];
    if (id === 'pawai') return Save.pawaiTerbuka() ? '' : '<span class="info-pin">' + UI.ikon('kunci', 26) + UI.esc(P.kunci) + '</span>';
    if (!SIAP[id] || !T) return '<span class="info-pin">' + UI.ikon('kunci', 26) + UI.esc(P.segera) + '</span>';
    var v = Save.data.tempat[id], b = v ? v.bintang : 0, n = T.slot.filter(function (k) { return Save.data.sisik[id + '-' + k]; }).length, bintang = '';
    for (var i = 0; i < 3; i++) bintang += Seni.svg(26, 26, Seni.ikon('bintang', 26).replace(/fill="#FFC83D"/, i < b ? 'fill="#FFC83D"' : 'fill="#DCD4EE"'));
    return '<span class="info-pin">' + bintang + '&nbsp;' + Seni.svg(22, 26, Seni.sisikIkon('emas', 22)) + n + '/' + T.slot.length + '</span>';
  }

  function pergi(id, el) {
    if (sibuk) return;
    var terbuka = id === 'pawai' ? Save.pawaiTerbuka() && SIAP.pawai : SIAP[id];
    if (!terbuka) {
      Aud.sfx('gembok'); UI.goyang(el);
      var pesan = id === 'pawai' ? STR.peta.terkunci : STR.peta.segera;
      UI.toast(pesan); Voice.stop(); Voice.say(pesan, { tokoh: 'tara' });
      return;
    }
    sibuk = true;
    UI.sembunyiTangan(true);
    Voice.stop();   // murid sudah memilih: ajakan Tara berhenti saat itu juga, bukan saat layar berganti
    var p = PIN[id], x0 = tara.x, y0 = tara.y, x1 = p[0] + 70, y1 = p[1] + 40;
    tara.pakai(Gambar.tara('bola', { sisik: Save.daftarSisik(), perlengkapan: Save.perlengkapan() }));
    Aud.sfx('whoosh');
    var jarak = Math.hypot(x1 - x0, y1 - y0);
    Tween.run(UI.kurangi ? 10 : Math.max(500, Math.min(1500, jarak * 2.2)), function (e) {
      tara.x = x0 + (x1 - x0) * e; tara.y = y0 + (y1 - y0) * e - Math.sin(e * Math.PI) * 30; tara.rot = (x1 > x0 ? 1 : -1) * e * jarak * 1.2; tara.atur();
    }, Ease.easeInOutCubic).then(function () {
      Aud.sfx('buka');
      Scenes.go(id === 'pawai' ? 'pawai' : 'tempat', { id: id });
    });
  }

  Scenes.add('peta', {
    enter: function (root, prm) {
      sibuk = false;
      Aud.musik('judul');
      var latar = U.h('img', 'latar'); latar.src = ASET.gambar['latar-peta'] || ''; latar.alt = '';
      root.appendChild(latar);
      root.appendChild(U.h('div', 'judul-layar', UI.esc(STR.peta.judul)));
      var adegan = U.h('div', 'adegan tembus'); adegan.style.zIndex = 11;
      root.appendChild(adegan);
      ['t1', 't2', 't3', 't4', 't5', 'pawai'].filter(function (id) { return id === 'pawai' || TEMPAT[id]; }).forEach(function (id) {
        var p = PIN[id], terbuka = id === 'pawai' ? Save.pawaiTerbuka() && SIAP.pawai : !!SIAP[id];
        var b = U.h('button', 'pin-peta ' + (terbuka ? 'terbuka' : 'terkunci'));
        b.type = 'button'; b.dataset.id = 'pin-' + id;
        b.style.left = (p[0] - 110) + 'px'; b.style.top = (p[1] - 138) + 'px';
        b.innerHTML = '<span class="papan-pin"><span class="nama-pin" data-cek="pin ' + id + '">' + UI.esc(STR.peta.tempat[id]) + '</span>' + infoPin(id) + '</span><span class="tiang"></span>';
        b.setAttribute('aria-label', STR.peta.tempat[id]);
        b.addEventListener('pointerdown', function () { Aud.init(); Aud.sfx('click'); });
        b.addEventListener('click', function () { pergi(id, b); });
        root.appendChild(b);
      });
      /* Tara berdiri di tempat terakhir */
      var dari = PIN[prm.dari] || [130, 640];
      var opsi = { sisik: Save.daftarSisik(), perlengkapan: Save.perlengkapan() };
      tara = new Aktor(adegan, { x: dari[0] + 70, y: dari[1] + 40, s: 0.55, g: Gambar.tara('senang', opsi) });
      tara.putar = function (t, a) { a.sy = 1 + Math.sin(t * 2.4) * 0.014; };
      aktor = [tara];
      root.appendChild(UI.tombolIkon('kembali', STR.tombol.judul, function () { Scenes.go('judul'); }, { x: 14, y: 10, id: 'ke-judul', warna: 'krem' }));
      var hasil = Input.button(UI.esc(STR.tombol.hasil), 'kuning', function () { Scenes.go('hasil'); }, { x: 852, y: 10, w: 300, h: 96, font: 28, id: 'hasil' });
      root.appendChild(hasil);
      root.appendChild(UI.tombolIkon('gerigi', STR.ikon.pengaturan, function () { UI.pengaturan(); }, { x: 1170, y: 10, id: 'pengaturan' }));
      /* saran: tempat terbuka pertama yang belum selesai */
      /* saran: tempat utama yang belum selesai, lalu Pawai, lalu T5 (TAMBAHAN), lalu Hasil */
      var saran = ['t1', 't2', 't3', 't4'].filter(function (id) { return SIAP[id] && !Save.selesai(id); })[0] ||
        (Save.pawaiTerbuka() && !(Save.data.pawai && Save.data.pawai.selesai) ? 'pawai' : TEMPAT.t5 && !Save.selesai('t5') ? 't5' : null);
      UI.idle.atur(function () { return saran ? root.querySelector('[data-id="pin-' + saran + '"]') : hasil; });
      Voice.say(STR.peta.pilih, { tokoh: 'tara' });
    },
    update: function (dt) { if (!UI.kurangi && aktor) aktor.forEach(function (a) { a.jalankan(dt); }); },
    exit: function () { aktor = null; tara = null; },
    uji: {
      keadaan: function () { return { langkah: 'peta', siap: !sibuk }; },
      benar: function () { return ['pin-t1']; },
      salah: function () { return ['pin-t2']; }
    }
  });
})();
