/* Hasil Belajarku (GDD bagian 10): Tara dengan sisik dan perlengkapannya, bintang tiap tempat muncul satu per satu dengan nada
   bertingkat, enam jurus dalam bahasa anak bergambar ikon dengan tanda "Sudah bisa" atau "Terus berlatih", dan tombol "Untuk Guru".
   Brief bagian 2: kalimat jurus dibacakan satu per satu sambil disorot; tombol Dengar lagi mengulangnya. */
(function () {
  var aktor = null, token = 0;
  var IKON = { 'mata-jeli': 'mata', menjauh: 'menjauh', pelindung: 'helm', berhenti: 'telapak', beritahu: 'beritahu', aturan: 'aturan' };
  /* "Hasil Belajarku!", lalu jurus yang sudah bisa dibacakan satu per satu; jurus yang perlu dilatih diajak berlatih */
  function bacakan(papan) {
    var H = STR.hasil, my = ++token, baris = Array.prototype.slice.call(papan.querySelectorAll('.baris-j'));
    function sorot(daftar) { baris.forEach(function (b) { b.classList.toggle('dibaca', daftar.indexOf(b) >= 0); }); }
    Voice.stop();
    var p = Voice.say(H.judul + '!', { tokoh: 'tara' });
    baris.filter(function (b) { return b.classList.contains('sudah'); }).forEach(function (b) {
      p = p.then(function () { if (my === token && b.isConnected) return Voice.say(H.jurus[b.dataset.j][1], { tokoh: 'tara', mulai: function () { if (my === token) sorot([b]); } }); });
    });
    var terus = baris.filter(function (b) { return b.classList.contains('terus'); });
    if (terus.length) p = p.then(function () { if (my === token && papan.isConnected) return Voice.say(H.latih, { tokoh: 'tara', mulai: function () { if (my === token) sorot(terus); } }); });
    return p.then(function () { if (my === token) sorot([]); });
  }
  Scenes.add('hasil', {
    enter: function (root) {
      Aud.musik('pawai');
      var H = STR.hasil, latar = U.h('img', 'latar'); latar.src = ASET.gambar['latar-pawai'] || ''; latar.alt = '';
      root.appendChild(latar);
      var adegan = U.h('div', 'adegan tembus');
      root.appendChild(adegan);
      var tara = new Aktor(adegan, { x: 250, y: 640, s: 1.45, g: Gambar.tara('sorak', { sisik: Save.daftarSisik(), perlengkapan: Save.perlengkapan() }) });
      tara.putar = function (t, a) { a.dy = -Math.abs(Math.sin(t * 2.6)) * 8; };
      aktor = [tara];

      var papan = U.h('div', 'papan-hasil');
      papan.style.cssText = 'left:500px;top:24px;width:756px';
      /* T5 (TAMBAHAN) ikut ditampilkan bila sudah dimainkan; lima kolom lebih sempit */
      var daftarT = TEMPAT.urut.concat((TEMPAT.tambahan || []).filter(function (id) { return Save.selesai(id); })), lebarK = daftarT.length > 4 ? 136 : 170;
      var bintang = daftarT.map(function (id) {
        var v = Save.data.tempat[id], b = v ? v.bintang : 0, s = '';
        for (var i = 0; i < 3; i++) s += Seni.svg(34, 34, Seni.ikon('bintang', 34).replace(/fill="#FFC83D"/, i < b ? 'fill="#FFC83D"' : 'fill="#DCD4EE"'));
        return '<div class="satu" style="width:' + lebarK + 'px"><span class="deret">' + s + '</span><span class="ket" data-cek="tempat ' + id + '">' + UI.esc(STR.peta.tempat[id]) + '</span></div>';
      }).join('');
      var jurus = Object.keys(H.jurus).map(function (j) {
        var st = Save.statusJurus(j);
        return '<div class="baris-j ' + st + '" data-j="' + j + '" title="' + UI.esc(H.jurus[j][0]) + '"><span class="ikon-j">' + UI.ikon(IKON[j] || 'bintang', 40) + '</span>' +
          '<span class="k" data-cek="jurus ' + j + '">' + UI.esc(H.jurus[j][1]) + '</span>' +
          '<span class="chip-status ' + st + '">' + UI.esc(st === 'sudah' ? H.sudah : st === 'terus' ? H.terus : H.belum) + '</span></div>';
      }).join('');
      papan.innerHTML = '<div class="judul-hasil" data-cek="judul hasil">' + UI.esc(H.judul) + '</div>' +
        '<div class="sub-hasil">' + Seni.svg(26, 30, Seni.sisikIkon('emas', 26)) + ' ' + UI.esc(U.fmt(H.sisik, { n: Save.jumlahSisik() })) + '</div>' +
        '<div class="bintang-hasil"' + (daftarT.length > 4 ? ' style="gap:4px"' : '') + '>' + bintang + '</div><div class="daftar-jurus">' + jurus + '</div>';
      root.appendChild(papan);
      var baris = U.h('div', 'baris-tombol');
      baris.style.cssText = 'position:absolute;left:500px;width:756px;top:612px;z-index:41';
      var peta = Input.button(UI.esc(STR.tombol.peta), 'kuning alir', function () { Scenes.go('peta'); }, { w: 220, h: 96, font: 32, id: 'ke-peta' });
      baris.appendChild(peta);
      baris.appendChild(Input.button(UI.esc(STR.tombol.guru), 'krem alir', function () { token++; Voice.stop(); UI.guru(); }, { w: 240, h: 96, font: 28, id: 'guru' }));
      /* Lagu Siaga (TAMBAHAN) hanya bila lagunya ada */
      if (ASET.audio && ASET.audio.lagu_siaga) baris.appendChild(Input.button(UI.esc(STR.tombol.lagu), 'hijau alir', function () { token++; Voice.stop(); UI.laguSiaga(); }, { w: 240, h: 96, font: 28, id: 'lagu' }));
      root.appendChild(baris);
      /* bintang muncul satu per satu dengan nada bertingkat */
      var n = 0;
      Array.prototype.forEach.call(papan.querySelectorAll('.bintang-hasil .satu'), function (el, i) {
        UI.muncul(el, 320, 300 + i * 320).then(function () { Aud.sfx('star', n++); });
      });
      Aud.jingle('hasil', 'aman');
      root.appendChild(UI.tombolIkon('suara', STR.ikon.dengar, function () { bacakan(papan); }, { x: 14, y: 10, id: 'dengar' }));
      bacakan(papan);
      UI.idle.atur(function () { return peta; });
      setTimeout(function () { if (peta.isConnected) peta.focus({ preventScroll: true }); }, 60);
    },
    update: function (dt) { if (!UI.kurangi && aktor) aktor.forEach(function (a) { a.jalankan(dt); }); },
    exit: function () { aktor = null; token++; },
    uji: {
      keadaan: function () { return { langkah: 'hasil', siap: true }; },
      benar: function () { return ['ke-peta']; },
      salah: function () { return []; }
    }
  });
})();
