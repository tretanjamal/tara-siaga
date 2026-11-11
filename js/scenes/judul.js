/* Layar judul (mockup Fase 0 yang disetujui): logo, pita, Jalur Ritme sebagai mantra, MULAI, Informasi, Referensi, Pengembang.
   Tara memakai sisik dan perlengkapan yang sudah dikumpulkan. MULAI pertama kali langsung ke T1 (hook); sesudahnya ke Peta Kampung. */
(function () {
  var lepas = null, tara = null, aktor = null;
  function svgLogo() {
    var S = Seni, C = S.C, g = S.g;
    function teks(x, y, isi, warna, ukuran, maxw) {
      var a = ' font-family="Grandstander, \'Baloo 2\', sans-serif" font-weight="900" font-size="' + ukuran + '" letter-spacing="1"';
      return '<text x="' + x + '" y="' + (y + 9) + '"' + a + ' fill="' + C.lavender + '" opacity=".55" stroke="' + C.lavender + '" stroke-width="16" stroke-linejoin="round">' + isi + '</text>' +
        '<text x="' + x + '" y="' + y + '"' + a + ' fill="' + warna + '" stroke="' + C.terong + '" stroke-width="15" stroke-linejoin="round" paint-order="stroke" data-maxw="' + maxw + '">' + isi + '</text>';
    }
    var pita = g('translate(40,300) rotate(-2)',
      S.path('M0,8 L-22,-6 L-10,26 L-26,52 L22,46 Z', C.hijauTua, 4) + S.path('M540,8 L562,-6 L550,26 L566,52 L518,46 Z', C.hijauTua, 4) +
      S.path('M8,0 C180,-10 360,-10 532,0 L528,52 C360,44 180,44 12,52 Z', C.hijau, 4.5) + S.path('M14,8 C180,-1 360,-1 526,8', 'none', 3, 'rgba(255,255,255,.45)') +
      '<text x="270" y="38" text-anchor="middle" font-family="Grandstander, sans-serif" font-weight="900" font-size="34" fill="' + C.terong + '" data-maxw="480">' + UI.esc(STR.judul.pita) + '</text>');
    return g('translate(96,128) rotate(-8)', S.lingkar(0, 6, 62, C.lavender, 0, 0, ' opacity=".45"') + S.lencana(0, 0, 60)) +
      g('rotate(-3 300 200)', teks(176, 176, UI.esc(STR.judul.a), C.kuning, 128, 400) + teks(56, 286, UI.esc(STR.judul.b), C.koral, 128, 520)) + pita;
  }
  function jalurMantra() {
    var R = STR.ritme;
    function satu(ikon, warna, teks) { return '<div class="jurus"><span class="bulat" style="background:' + warna + '">' + UI.ikon(ikon, 34) + '</span>' + UI.esc(teks) + '</div>'; }
    var panah = '<span class="panah-r">' + UI.ikon('panah', 22) + '</span>';
    var d = U.h('div', 'baris-jurus', satu('telapak', 'var(--koral)', R.berhenti) + panah + satu('mata', 'var(--langit)', R.lihat) + panah + satu('bohlam', 'var(--kuning-muda)', R.pikir));
    d.style.left = '44px'; d.style.top = '378px';
    return d;
  }

  Scenes.add('judul', {
    enter: function (root) {
      Aud.musik('judul');
      var S = Seni, C = S.C, g = S.g;
      var latar = U.h('img', 'latar'); latar.src = ASET.gambar['latar-judul'] || ''; latar.alt = '';
      root.appendChild(latar);
      var amb = U.h('div', 'lapis tembus');
      amb.innerHTML = S.svg(1280, 720, g('', S.awan(470, 130, 0.8) + S.awan(1180, 250, 0.6) + S.awan(1700, 90, 0.7), ' class="awan-gerak"') +
        g('translate(640,170)', g('', S.layang(0, 0, 0.95, C.koral, C.kuning, 12), ' class="ayun"')) +
        g('translate(760,250)', g('', S.layang(0, 0, 0.62, C.hijau, C.langit, -8), ' class="ayun" style="animation-delay:-1.4s"')) +
        g('', S.burung(560, 300, 0.9) + S.burung(590, 286, 0.7), ' class="burung"') + g('', S.burung(980, 250, 0.8), ' class="burung" style="animation-delay:-3s"'));
      root.appendChild(amb);
      var logo = U.h('div', 'lapis tembus');
      logo.innerHTML = S.svg(1280, 720, svgLogo());
      root.appendChild(logo);
      root.appendChild(U.h('h1', 'tersembunyi', UI.esc(STR.judul.lengkap)));
      root.appendChild(jalurMantra());

      /* tokoh: dua teman dan Tara (gambar aktor, hidup lewat loop) */
      var adegan = U.h('div', 'adegan tembus');
      root.appendChild(adegan);
      var sari = new Aktor(adegan, { x: 1134, y: 592, s: 0.9, g: Gambar.tokoh('sari', 'panggil', 'senang') });
      var tegar = new Aktor(adegan, { x: 1214, y: 600, s: 0.9, g: Gambar.tokoh('tegar', 'lempar', 'senang') });
      var opsi = { sisik: Save.daftarSisik(), perlengkapan: Save.perlengkapan() };
      var gSenang = Gambar.tara('senang', opsi), gKedip = Gambar.tara('senang', { sisik: opsi.sisik, perlengkapan: opsi.perlengkapan, kedip: true });
      tara = new Aktor(adegan, { x: 930, y: 676, s: 1.55, g: gSenang });
      tara.putar = function (t, a) {
        a.sy = 1 + Math.sin(t * 2.4) * 0.012; a.sx = 1 - Math.sin(t * 2.4) * 0.006;
        a.pakai(t % 4.2 > 4.05 ? gKedip : gSenang);
      };
      sari.putar = function (t, a) { a.rot = Math.sin(t * 3) * 2; };
      tegar.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 2.2)) * 3; };
      aktor = [tara, sari, tegar];

      var balon = U.h('div', 'balon');
      balon.style.cssText = 'left:520px;top:298px;height:76px;padding:0 26px';
      balon.innerHTML = '<p class="ucapan" data-cek="balon judul">' + UI.esc(STR.judul.balon) + '</p>' +
        '<svg class="ekor-balon" width="40" height="40" viewBox="0 0 40 40" style="left:auto;right:-36px;top:16px" aria-hidden="true"><path d="M2,6 L36,22 L2,34 Z" fill="#FFF8EA"/><path d="M2,4 L36,22 L2,36" fill="none" stroke="#3A2A4F" stroke-width="4" stroke-linejoin="round"/></svg>';
      root.appendChild(balon);

      var mulai = Input.button(UI.ikon('mainkan', 44) + UI.esc(STR.tombol.mulai), 'kuning', function () {
        Scenes.go(Save.data.hook ? 'peta' : 'tempat', { id: 't1' });
      }, { x: 48, y: 466, w: 340, h: 110, font: 56, id: 'mulai' });
      root.appendChild(mulai);
      [['info', 36, 190], ['referensi', 238, 190], ['pengembang', 440, 210]].forEach(function (b) {
        root.appendChild(Input.button(UI.esc(STR.tombol[b[0]]), 'krem', function () { UI.info(b[0]); }, { x: b[1], y: 600, w: b[2], h: 88, font: 25, id: b[0] }));
      });
      lepas = UI.pojok(root);
      UI.idle.atur(function () { return mulai; });
      setTimeout(function () { if (mulai.isConnected) mulai.focus({ preventScroll: true }); }, 60);
    },
    update: function (dt) {
      if (UI.kurangi || !aktor) return;
      aktor.forEach(function (a) { a.jalankan(dt); });
    },
    exit: function () { if (lepas) lepas(); lepas = null; aktor = null; },
    uji: {
      keadaan: function () { return { langkah: 'judul', siap: true }; },
      benar: function () { return ['mulai']; },
      salah: function () { return []; }
    }
  });
})();
