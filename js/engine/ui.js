/* UI: komponen bersama Tara Siaga. Pola overlay, sakelar, Pengaturan, Informasi, dan isyarat dari Kafe Cilik (483);
   tampilan mengikuti GDD bagian 12 (tombol kerikil, panel bertepi sisik).
   Isi: pengaturan dan senyap, ikon pojok, overlay (Pengaturan, Informasi, Referensi, Pengembang, Catatan Guru, konfirmasi),
   toast, balon kata Tara dengan sorot kata, tangan penunjuk, isyarat 8 detik, partikel, hitung naik, goyang, dan lompat. */
(function (root) {
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function stage() { return document.getElementById('stage'); }
  /* titik di panggung untuk elemen atau {x, y}; fy = letak vertikal (0 atas, 1 bawah) */
  function titik(sasaran, fy) {
    if (!sasaran) return null;
    if (sasaran.x != null && !sasaran.getBoundingClientRect) return sasaran;
    var r = sasaran.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    return Stage.toLocal(r.left + r.width / 2, r.top + r.height * (fy == null ? 0.4 : fy));
  }

  var UI = {
    prefersReduced: !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches),
    kurangi: false,
    esc: esc,
    titik: titik,
    applySettings: function () {
      var s = Save.data.settings;
      Aud.setMuted(s.senyap); Aud.setBus('musik', s.musik); Aud.setBus('sfx', s.efek);
      UI.kurangi = s.kurangi || UI.prefersReduced;
      document.body.classList.toggle('kurangi-gerak', UI.kurangi);
      /* uji dipercepat 4x; ?laju=1 memakai kecepatan asli (mengukur lama bermain) */
      Tween.speed = UI.kurangi ? 0.5 : (U.TEST && !/[?&]laju=1/.test(location.search) ? 0.25 : 1);
    },
    ikon: function (nama, ukuran) { return Seni.svg(ukuran || 48, ukuran || 48, Seni.ikon(nama, ukuran || 48), ' style="display:block"'); },
    tombolIkon: function (nama, aria, onTap, o) {
      o = o || {}; o.aria = aria;
      return Input.button(UI.ikon(nama, o.ukuran || 50), (o.warna || 'langit') + ' ikon ' + (o.cls || ''), onTap, o);
    },
    /* suara id-ID tersedia dan diizinkan? */
    adaSuara: function () { return Voice.available() && !!Voice.voice('id-ID', 'w') && Save.data.settings.suara; },

    /* ikon pojok kanan atas layar judul: suara, layar penuh, pengaturan (96 logis). Mengembalikan fungsi pembersih. */
    pojok: function (parent) {
      var s = Save.data.settings, x = 1168, fs = null;
      var atur = UI.tombolIkon('gerigi', STR.ikon.pengaturan, function () { UI.pengaturan(); }, { x: x, y: 12, id: 'pengaturan' });
      if (FS.supported()) {
        x -= 112;
        fs = UI.tombolIkon('layarPenuh', STR.ikon.layarPenuh, function () { FS.toggle(function () { UI.toast(STR.ikon.fsDitolak); }); }, { x: x, y: 12, id: 'layar-penuh' });
      }
      x -= 112;
      var snd = UI.tombolIkon(s.senyap ? 'senyap' : 'suara', '', function () { s.senyap = !s.senyap; Save.save(); UI.applySettings(); segar(); }, { x: x, y: 12, id: 'suara' });
      function segar() {
        Input.label(snd, UI.ikon(s.senyap ? 'senyap' : 'suara', 50));
        snd.setAttribute('aria-label', s.senyap ? STR.ikon.suaraMati : STR.ikon.suaraNyala);
        if (fs) fs.setAttribute('aria-label', FS.isFull() ? STR.ikon.keluarPenuh : STR.ikon.layarPenuh);
      }
      [snd, fs, atur].forEach(function (b) { if (b) parent.appendChild(b); });
      segar();
      FS.onChange(segar);
      return function () { FS.offChange(segar); };
    },

    /* panel modal bertepi sisik. Mengembalikan {el, body, panel, close} */
    overlay: function (judul, cls) {
      var ov = U.h('div', 'overlay'), panel = U.h('div', 'panel ' + (cls || '')), opener = document.activeElement;
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', judul);
      document.getElementById('scene-root').inert = true;
      document.querySelectorAll('.overlay').forEach(function (x) { x.inert = true; });
      document.querySelectorAll('.toast').forEach(function (x) { x.parentNode.removeChild(x); });
      panel.innerHTML = '<div class="pita-kepala">' + esc(judul) + '</div>';
      var body = U.h('div', 'isi-panel'); panel.appendChild(body); ov.appendChild(panel);
      stage().appendChild(ov);
      var tanganLama = UI.tangan && UI.tangan.classList.contains('tampil') && UI.sumberTangan === 'petunjuk' ? UI._tunjuk : null, layar = Scenes.name;
      UI.sembunyiTangan(true);
      if (!UI.kurangi) panel.classList.add('panel-muncul');
      var api = {
        el: ov, body: body, panel: panel,
        close: function () {
          if (ov.parentNode) ov.parentNode.removeChild(ov);
          var rest = document.querySelectorAll('.overlay');
          if (rest.length) rest[rest.length - 1].inert = false; else document.getElementById('scene-root').inert = false;
          if (opener && opener.isConnected && !opener.disabled) opener.focus({ preventScroll: true });
          if (api.onClose) api.onClose();
          if (tanganLama && !document.querySelector('.overlay') && Scenes.name === layar && (!tanganLama.s.nodeType || tanganLama.s.isConnected)) UI.tunjuk(tanganLama.s, tanganLama.o);
        }
      };
      return api;
    },
    /* Esc menutup panel teratas lewat tombol Tutup (atau Tidak pada konfirmasi) */
    pasangEsc: function () {
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var ov = document.querySelectorAll('.overlay'), b = ov.length && ov[ov.length - 1].querySelector('[data-id="tutup"], [data-id="konfirmasi-tidak"]');
        if (b) { e.preventDefault(); b.click(); }
      });
    },
    closeOverlays: function () {
      document.querySelectorAll('.overlay, .toast').forEach(function (x) { x.parentNode.removeChild(x); });
      UI._p.list = [];
      document.getElementById('scene-root').inert = false;
      UI.idle.fn = null;
      UI.sembunyiTangan(true);
    },
    tombolTutup: function (o, teks) {
      var b = Input.button(esc(teks || STR.tombol.tutup), 'hijau alir lebar', function () { o.close(); }, { id: 'tutup' });
      o.body.appendChild(b);
      setTimeout(function () { b.focus({ preventScroll: true }); }, 30);
      return b;
    },
    /* jeda: permainan dan suara berhenti selama panel terbuka */
    jedaPanel: function (o) {
      Voice.jeda(); Tween.paused = true;
      var lama = o.onClose;
      o.onClose = function () { Tween.paused = false; Voice.lanjutTertahan(); if (lama) lama(); };
      return o;
    },
    /* konfirmasi dua tombol (mis. kembali ke Peta) */
    konfirmasi: function (judul, isi, onYa) {
      var o = UI.jedaPanel(UI.overlay(judul, 'panel-konfirmasi'));
      o.body.insertAdjacentHTML('beforeend', '<p class="teks-konfirmasi" data-cek="konfirmasi">' + esc(isi) + '</p>');
      var baris = U.h('div', 'baris-tombol');
      var ya = Input.button(esc(STR.tombol.ya), 'kuning alir', function () { o.onClose = null; o.close(); onYa(); }, { w: 220, h: 96, font: 32, id: 'konfirmasi-ya' });
      var tidak = Input.button(esc(STR.tombol.tidak), 'krem alir', function () { o.close(); }, { w: 220, h: 96, font: 32, id: 'konfirmasi-tidak' });
      baris.appendChild(ya); baris.appendChild(tidak);
      o.body.appendChild(baris);
      setTimeout(function () { tidak.focus({ preventScroll: true }); }, 30);
      return o;
    },
    /* sakelar Nyala/Mati dengan label teks (bukan hanya warna) */
    barisSakelar: function (label, get, set, id, catatan, nonaktif) {
      var row = U.h('div', 'baris-sakelar');
      row.innerHTML = '<span class="label-sakelar">' + esc(label) + (catatan ? '<small>' + esc(catatan) + '</small>' : '') + '</span>';
      var b = Input.button('', 'sakelar alir', function () { set(!get()); cat(); }, { id: id, aria: label });
      function cat() {
        var on = get();
        b.classList.toggle('nyala', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        Input.label(b, '<span class="kenop"></span><span class="teks-sakelar">' + (on ? STR.pengaturan.nyala : STR.pengaturan.mati) + '</span>');
      }
      if (nonaktif) b.disabled = true;
      cat(); row.appendChild(b);
      return row;
    },
    pengaturan: function (onClose) {
      var T = STR.pengaturan, s = Save.data.settings, o = UI.jedaPanel(UI.overlay(T.judul, 'panel-pengaturan'));
      var grid = U.h('div', 'grid-sakelar');
      function simpan() { Save.save(); UI.applySettings(); }
      grid.appendChild(UI.barisSakelar(T.musik, function () { return s.musik; }, function (v) { s.musik = v; simpan(); }, 'sw-musik'));
      grid.appendChild(UI.barisSakelar(T.efek, function () { return s.efek; }, function (v) { s.efek = v; simpan(); }, 'sw-efek'));
      grid.appendChild(UI.barisSakelar(T.suara, function () { return s.suara; }, function (v) { s.suara = v; simpan(); if (!v) Voice.stop(); }, 'sw-suara', T.suaraCatatan));
      grid.appendChild(UI.barisSakelar(T.santai, function () { return s.santai; }, function (v) { s.santai = v; simpan(); }, 'sw-santai', T.santaiCatatan));
      grid.appendChild(UI.barisSakelar(T.kurangi, function () { return s.kurangi || UI.prefersReduced; }, function (v) { s.kurangi = v; simpan(); }, 'sw-kurangi', UI.prefersReduced ? T.kurangiCatatan : '', UI.prefersReduced));
      grid.appendChild(UI.barisSakelar(T.kursi, function () { return s.kursi; }, function (v) { s.kursi = v; simpan(); }, 'sw-kursi', T.kursiCatatan));
      /* Pengaturan guru (brief bagian 9): tekan lama judul panel 2 detik, atau tahan tombol G 2 detik.
         Isinya Buka semua tempat dan Pemain baru, supaya murid tidak menghapus progres tanpa sengaja. */
      var guruTampil = false, bukaAwal = !!s.bukaSemua;
      function tampilGuru() {
        if (guruTampil || !o.el.isConnected) return;
        guruTampil = true;
        Aud.sfx('buka');
        var buka = UI.barisSakelar(T.bukaSemua, function () { return !!s.bukaSemua; }, function (v) { s.bukaSemua = v; if (v) Save.data.hook = true; simpan(); }, 'sw-buka-semua', T.bukaSemuaCatatan);
        var row = U.h('div', 'baris-sakelar'), yakin = false;
        row.innerHTML = '<span class="label-sakelar">' + esc(T.muridBaru) + '<small>' + esc(T.muridBaruCatatan) + '</small></span>';
        var hapus = Input.button(esc(T.hapus), 'krem alir hapus', function () {
          if (!yakin) { yakin = true; Input.label(hapus, esc(T.yakin)); return; }
          /* simpanan dihapus sesudah layar lama keluar, supaya alurnya yang tersisa tidak menulis ke simpanan murid baru */
          lepasGuru(); o.onClose = null; o.close(); Scenes.go('judul', {}, function () { Save.newStudent(); });
        }, { id: 'murid-baru' });
        row.appendChild(hapus);
        /* panel menjeda Tween, jadi animasi muncul memakai CSS */
        [buka, row].forEach(function (r) { r.classList.add('baris-guru'); if (!UI.kurangi) r.classList.add('panel-muncul'); grid.appendChild(r); });
        buka.querySelector('button').focus({ preventScroll: true });
      }
      var pita = o.panel.querySelector('.pita-kepala'), tahanT = 0, tombolG = 0;
      function lepas() { clearTimeout(tahanT); tahanT = 0; }
      pita.addEventListener('pointerdown', function (e) { e.preventDefault(); lepas(); tahanT = setTimeout(tampilGuru, 2000); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (n) { pita.addEventListener(n, lepas); });
      function tekanG(e) {
        if (e.key !== 'g' && e.key !== 'G') return;
        if (e.type === 'keyup') { tombolG = 0; return; }
        if (!tombolG) tombolG = performance.now();
        else if (performance.now() - tombolG > 2000) { tombolG = 0; tampilGuru(); }
      }
      document.addEventListener('keydown', tekanG); document.addEventListener('keyup', tekanG);
      function lepasGuru() { lepas(); document.removeEventListener('keydown', tekanG); document.removeEventListener('keyup', tekanG); }
      o.body.appendChild(grid);
      UI.tombolTutup(o);
      var lama = o.onClose;
      o.onClose = function () {
        lepasGuru();
        if (lama) lama(); if (onClose) onClose();
        /* Peta digambar ulang bila Buka semua tempat berubah */
        if (!!s.bukaSemua !== bukaAwal && Scenes.name === 'peta') Scenes.go('peta');
      };
      return o;
    },
    /* Informasi (Tujuan, Cara Main, Tempat) dan Referensi (Sumber Materi, Kecerdasan Artifisial) bertab;
       Pengembang berisi foto dan data yang sama dengan gim lain kreator. Tanpa tautan keluar. */
    info: function (jenis) {
      var D = STR.info[jenis], o = UI.overlay(D.judul, 'panel-info panel-' + jenis), HAL = null;
      function daftar(a, tag) { return '<' + (tag || 'ul') + ' class="daftar-info">' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</' + (tag || 'ul') + '>'; }
      function baris(a) { return '<div class="baris-info">' + a.map(function (r) { return '<div><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>'; }).join('') + '</div>'; }
      function pustaka(r) { return '<p class="pustaka">' + esc(r[0]) + ' <i>' + esc(r[1]) + '</i> ' + esc(r[2]) + '</p>'; }
      if (jenis === 'info') HAL = {
        tujuan: function () { return '<p class="sorot-info">' + esc(D.pengantar) + '</p>' + baris(D.identitas) + '<p><b>' + esc(D.tujuanJudul) + '</b></p><p>' + esc(D.tujuan) + '</p>'; },
        cara: function () { return daftar(D.cara, 'ol') + '<p class="kecil-info">' + esc(D.caraCatatan) + '</p><p class="kecil-info">' + esc(D.caraGuru) + '</p>'; },
        misi: function () { return '<p><b>' + esc(D.misiJudul) + '</b></p>' + baris(D.misi) + '<p class="sorot-info">' + esc(D.misiCatatan) + '</p>'; }
      };
      if (jenis === 'referensi') HAL = {
        sumber: function () { return '<p><b>' + esc(D.sumberPengantar) + '</b></p>' + D.sumber.map(pustaka).join('') + '<p>' + esc(D.topik) + '</p><p class="kecil-info">' + esc(D.huruf) + '</p>'; },
        ka: function () { return '<p>' + esc(D.kaPengantar) + '</p>' + baris(D.ka) + '<p><b>' + esc(D.kaRujukanJudul) + '</b></p>' + pustaka(D.kaRujukan); }
      };
      if (!HAL) {
        /* satu halaman per pengembang (foto, nama, sekolah, kontak, prestasi), berpindah dengan tombol panah kiri dan kanan */
        var ke = 0, n = D.orang.length;
        var bingkai = U.h('div', 'bingkai-pengembang'), kartu = U.h('div', 'kartu-pengembang'), titik = U.h('div', 'titik-pengembang');
        kartu.setAttribute('data-cek', 'info pengembang'); kartu.setAttribute('aria-live', 'polite');
        function tampil(k) {
          ke = k;
          var p = D.orang[k], foto = root.ASET && ASET.gambar[p.foto];
          kartu.innerHTML = '<div class="foto-pengembang">' + (foto ? '<img src="' + foto + '" alt="' + esc(p.fotoAlt) + '">' : '') + '</div>' +
            '<div class="data-pengembang"><b class="nama-pengembang">' + esc(p.nama) + '</b>' + p.baris.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
            (p.daftar ? '<div class="prestasi"><b>' + esc(p.daftarJudul) + '</b>' + daftar(p.daftar) + '</div>' : '');
          kiri.disabled = k === 0; kanan.disabled = k === n - 1;
          titik.innerHTML = D.orang.map(function (x, j) { return '<span class="' + (j === k ? 'aktif' : '') + '"></span>'; }).join('');
          titik.setAttribute('aria-label', U.fmt(D.halaman, { i: k + 1, n: n }));
        }
        var kiri = Input.button('<span class="balik-x">' + UI.ikon('panah', 52) + '</span>', 'krem alir panah-pengembang', function () { if (ke > 0) tampil(ke - 1); }, { w: 96, h: 120, id: 'pengembang-sebelum', aria: D.sebelum });
        var kanan = Input.button(UI.ikon('panah', 52), 'krem alir panah-pengembang', function () { if (ke < n - 1) tampil(ke + 1); }, { w: 96, h: 120, id: 'pengembang-berikut', aria: D.berikut });
        bingkai.appendChild(kiri); bingkai.appendChild(kartu); bingkai.appendChild(kanan);
        o.body.appendChild(bingkai); o.body.appendChild(titik);
        tampil(0);
        UI.tombolTutup(o);
        return o;
      }
      var tabs = U.h('div', 'tab-buku'), isi = U.h('div', 'teks-info isi-tab');
      isi.setAttribute('data-cek', 'info ' + jenis);
      var pilih = function (k) {
        isi.innerHTML = HAL[k]();
        Array.prototype.forEach.call(tabs.children, function (b) { var on = b.dataset.id === 'tab-' + k; b.classList.toggle('aktif', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
      };
      Object.keys(HAL).forEach(function (k) {
        var b = Input.button(esc(D.tab[k]), 'krem alir tab', function () { pilih(k); }, { id: 'tab-' + k, h: 88, font: 26 });
        b.setAttribute('role', 'tab');
        tabs.appendChild(b);
      });
      tabs.setAttribute('role', 'tablist');
      var tutup = Input.button(esc(STR.tombol.tutup), 'hijau alir tab tutup-tab', function () { o.close(); }, { id: 'tutup', h: 88, font: 26 });
      tabs.appendChild(tutup);
      o.body.appendChild(tabs); o.body.appendChild(isi);
      pilih(Object.keys(HAL)[0]);
      setTimeout(function () { tutup.focus({ preventScroll: true }); }, 30);
      return o;
    },
    /* Catatan untuk Guru (GDD bagian 10): per TP, Momen Tahan, pola pikir yang perlu didiskusikan. Tanpa data pribadi. */
    guru: function () {
      var G = STR.guru, o = UI.overlay(G.judul, 'panel-guru'), baris = '';
      Object.keys(G.tp).forEach(function (t) {
        var k = Save.data.keterampilan[t];
        baris += '<tr><td>' + esc(G.tp[t]) + '</td><td>' + (k ? k.benarAwal + ' / ' + k.kesempatan : '-') + '</td><td>' + (k ? esc(G.bantu[Math.min(3, k.bantuan)]) : '-') + '</td></tr>';
      });
      var momen = Object.keys(Save.data.momen), tepat = momen.filter(function (m) { return Save.data.momen[m] === 'tepat'; }).length;
      var K = Save.data.keluarga, kode = Object.keys(K).sort(function (a, b) { return K[b] - K[a]; });
      /* tiga pola pikir terbanyak saja, supaya panel tetap muat satu layar */
      /* situasi bersisik perak (belum benar pada coba pertama), paling banyak 4 nama supaya panel muat satu layar */
      var perak = Object.keys(Save.data.sisik).filter(function (k) { return Save.data.sisik[k] === 'perak' && G.situasi[k]; }).map(function (k) { return G.situasi[k]; });
      var ulang = perak.length ? '<p class="ulang-guru"><b>' + esc(G.ulang) + '</b> ' + esc(perak.slice(0, 4).join(', ') + (perak.length > 4 ? ', ' + U.fmt(G.ulangLain, { n: perak.length - 4 }) : '')) + '</p>' : '';
      var pola = kode.length ? '<ul class="daftar-info">' + kode.slice(0, 3).map(function (x) { return '<li><b>' + esc(G.namaKeluarga[x] || x) + ' (' + K[x] + 'x)</b>: ' + esc(G.pemantik[x] || '') + '</li>'; }).join('') + '</ul>' : '<p>' + esc(G.polaKosong) + '</p>';
      o.body.insertAdjacentHTML('beforeend', '<div class="teks-guru" data-cek="guru"><div class="kolom-guru">' +
        '<table><thead><tr><th>' + esc(G.kolomTp) + '</th><th>' + esc(G.kolomBukti) + '</th><th>' + esc(G.kolomBantu) + '</th></tr></thead><tbody>' + baris + '</tbody></table>' +
        '<p>' + esc(U.fmt(G.momen, { n: tepat, m: momen.length })) + '</p>' +
        '<p>' + esc(U.fmt(G.menyeberang, { s: G.menyeberangStatus[Save.data.menyeberang || ''] })) + '</p>' +
        '<p class="kecil">' + esc(G.catatan) + '</p></div><div class="kolom-guru">' +
        (Save.data.pawai && Save.data.pawai.selesai ? '<p>' + esc(U.fmt(G.pawai, { b: Save.data.pawai.benar, n: Save.data.pawai.total })) + ' ' +
          esc(U.fmt(G.transfer, { t: Object.keys(Save.data.pawai.transfer || {}).filter(function (k) { return k in STR.pawai.transfer; }).map(function (k) { return (G.situasi['transfer-' + k] || STR.pawai.transfer[k].kalimat.replace(/\.$/, '')) + ' (' + (Save.data.pawai.transfer[k] ? G.transferBenar : G.transferBantu) + ')'; }).join('; ') })) + '</p>' : '') +
        '<p>' + esc(U.fmt(G.mode, { s: Save.data.settings.santai ? STR.pengaturan.nyala : STR.pengaturan.mati, m: Math.round(Save.data.detik / 60) })) + '</p>' +
        '<p><b>' + esc(G.pola) + '</b></p>' + pola + ulang + '</div></div>');
      /* bahan cetak (TAMBAHAN) di samping tombol Tutup */
      var baris2 = U.h('div', 'baris-tombol');
      baris2.appendChild(Input.button(esc(STR.cetak.tombolDiskusi), 'krem alir', function () { UI.cetak('diskusi'); }, { w: 330, h: 88, font: 24, id: 'cetak-diskusi' }));
      baris2.appendChild(Input.button(esc(STR.cetak.tombolMewarnai), 'krem alir', function () { UI.cetak('mewarnai'); }, { w: 360, h: 88, font: 24, id: 'cetak-mewarnai' }));
      o.body.appendChild(baris2);
      baris2.appendChild(UI.tombolTutup(o));
      return o;
    },
    /* Lagu Siaga (TAMBAHAN): lirik besar, empat gerakan tangan, tombol putar. Musik latar berhenti selama panel terbuka. */
    laguSiaga: function () {
      var L = STR.lagu, o = UI.overlay(L.judul, 'panel-lagu'), bgm = Aud._lagu && Aud._lagu.kunci, main = false;
      Aud.musik(null);
      var gerak = '<div class="gerak-lagu">' + L.gerak.map(function (g) { return '<div><span class="ikon-gerak">' + UI.ikon(g[0], 56) + '</span><b>' + esc(g[1]) + '</b><small>' + esc(g[2]) + '</small></div>'; }).join('') + '</div>';
      var lirik = '<div class="lirik-lagu">' + L.bait.map(function (b, i) {
        return '<div class="bait' + (i === 0 ? ' reff' : '') + '">' + (i === 0 ? '<span class="label-reff">' + esc(L.reff) + '</span>' : '') + b.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') + '</div>';
      }).join('') + '</div>';
      o.body.insertAdjacentHTML('beforeend', '<div class="isi-lagu" data-cek="lagu">' + gerak + lirik + '</div>');
      var baris = U.h('div', 'baris-tombol');
      function labelPutar(on) { return UI.ikon(on ? 'telapak' : 'mainkan', 40) + '<span>' + esc(on ? L.henti : L.putar) + '</span>'; }
      var putar = Input.button(labelPutar(false), 'kuning alir', function () {
        if (main) { main = false; Aud.hentiNyanyi(); Input.label(putar, labelPutar(false)); return; }
        if (Save.data.settings.senyap || !Save.data.settings.musik) { UI.toast(L.musikMati); return; }
        main = true; Input.label(putar, labelPutar(true));
        Aud.nyanyi(function () { main = false; if (putar.isConnected) Input.label(putar, labelPutar(false)); });
      }, { w: 300, h: 96, font: 28, id: 'lagu-putar' });
      baris.appendChild(putar);
      o.body.appendChild(baris);
      baris.appendChild(UI.tombolTutup(o));
      o.onClose = function () { Aud.hentiNyanyi(); Aud.musik(bgm || null); };
      setTimeout(function () { putar.focus({ preventScroll: true }); }, 40);
      return o;
    },
    /* bahan cetak untuk guru (TAMBAHAN): dibangun di #cetak (di luar panggung), lalu dialog cetak peramban.
       tanpaDialog dipakai uji untuk memeriksa tata letak cetak. */
    cetak: function (jenis, tanpaDialog) {
      var K = STR.cetak, el = document.getElementById('cetak'), html = '';
      if (!el) { el = U.h('div'); el.id = 'cetak'; document.body.appendChild(el); }
      function li(x) { return '<li>' + esc(x) + '</li>'; }
      if (jenis === 'diskusi') {
        html += '<h1>' + esc(K.judulDiskusi) + '</h1><p class="pengantar">' + esc(K.pengantar) + '</p><p class="pengantar">' + esc(K.gerakan) + '</p>' +
          '<section class="kartu-cetak"><h2>' + esc(K.umumJudul) + '</h2><ul>' + K.umum.map(li).join('') + '</ul></section>';
        TEMPAT.urut.concat(TEMPAT.tambahan || []).forEach(function (t) {
          var X = STR.tempat[t], T = TEMPAT[t];
          if (!X || !T) return;
          var aturan = T.bahaya.map(function (h) { return X.bahaya[h.id].aturan; }).concat(T.momen ? [X.momen.aturan] : []);
          html += '<section class="kartu-cetak"><h2>' + esc(X.nama) + '</h2><h3>' + esc(K.pertanyaan) + '</h3><ol>' + (K.tanya[t] || []).map(li).join('') +
            '</ol><h3>' + esc(K.aturan) + '</h3><ul>' + aturan.map(li).join('') + '</ul></section>';
        });
        var G = STR.guru;
        html += '<section class="kartu-cetak"><h2>' + esc(K.polaJudul) + '</h2><ul>' + Object.keys(G.pemantik).map(function (x) { return '<li><b>' + esc(G.namaKeluarga[x]) + '</b>: ' + esc(G.pemantik[x]) + '</li>'; }).join('') + '</ul></section>';
        html += '<p class="catatan-cetak">' + esc(K.catatanGuru) + '</p>';
      } else {
        Object.keys(ASET.gambar).filter(function (n) { return /^mewarnai-/.test(n); }).forEach(function (n) {
          html += '<section class="halaman-warna"><h2>' + esc(K.judulMewarnai) + '</h2><img src="' + ASET.gambar[n] + '" alt=""></section>';
        });
      }
      el.innerHTML = html;
      document.body.classList.add('mencetak');
      if (tanpaDialog) return el;
      function selesai() { document.body.classList.remove('mencetak'); window.removeEventListener('afterprint', selesai); }
      window.addEventListener('afterprint', selesai);
      Promise.all(Array.prototype.map.call(el.querySelectorAll('img'), function (im) { return im.decode ? im.decode().catch(function () { }) : null; })).then(function () {
        try { window.print(); } catch (e) { selesai(); }
      });
      return el;
    },
    /* teks yang meluap dari kotaknya (dipakai uji) */
    /* keterangan kartu: kata ulang (diam-diam, pelan-pelan) tidak dipenggal di tanda hubung */
    teksKartu: function (t) {
      return '<span class="isi">' + String(t).split(/\s+/).map(function (w) { return /-/.test(w) ? '<span class="utuh">' + esc(w) + '</span>' : esc(w); }).join(' ') + '</span>';
    },
    /* keterangan kartu maks. 2 baris (brief 4.2): huruf dikecilkan bertahap, paling kecil 24 px (CLAUDE.md bagian 3) */
    pasKartu: function (p) {
      var isi = p && p.querySelector('.isi');
      if (!isi || !isi.offsetHeight) return;
      var gs = getComputedStyle(p), fs = parseFloat(gs.fontSize), rasio = parseFloat(gs.lineHeight) / fs || 1.12;
      while (isi.offsetHeight > fs * rasio * 2.5 && fs > 24) { fs -= 1; p.style.fontSize = fs + 'px'; }
    },
    cekLuap: function () {
      var hasil = [];
      Array.prototype.forEach.call(document.querySelectorAll('#stage .kartu .teks .isi, #stage .papan-pawai .teks .isi'), function (el) {
        if (!el.offsetParent) return;
        var gs = getComputedStyle(el.parentElement), baris = Math.round(el.offsetHeight / parseFloat(gs.lineHeight));
        if (baris > 2) hasil.push('kartu ' + baris + ' baris: "' + el.textContent.trim().slice(0, 40) + '"');
      });
      Array.prototype.forEach.call(document.querySelectorAll('#stage [data-cek], #stage .tombol .badan'), function (el) {
        if (!el.offsetParent) return;
        if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 8) hasil.push((el.getAttribute('data-cek') || el.textContent.trim().slice(0, 30)) + ': ' + el.scrollWidth + 'x' + el.scrollHeight + ' > ' + el.clientWidth + 'x' + el.clientHeight);
        var wadah = el.parentElement && el.parentElement.closest('.balon, .kartu, .panel, .papan-hasil');
        if (wadah && wadah !== el) {
          var a = el.getBoundingClientRect(), b = wadah.getBoundingClientRect(), s = Stage.scale || 1;
          if (a.bottom > b.bottom + 2 * s || a.right > b.right + 2 * s) hasil.push((el.getAttribute('data-cek') || 'teks') + ': melewati wadah (bawah ' + Math.round((a.bottom - b.bottom) / s) + ' px, kanan ' + Math.round((a.right - b.right) / s) + ' px)');
        }
      });
      Array.prototype.forEach.call(document.querySelectorAll('#stage text[data-maxw]'), function (t) {
        var w = t.getComputedTextLength(), m = +t.getAttribute('data-maxw');
        if (w > m) hasil.push('svg "' + t.textContent + '": ' + Math.round(w) + ' > ' + m);
      });
      /* tombol minimal 88 logis = 44 px CSS di HP 800x360 */
      Array.prototype.forEach.call(document.querySelectorAll('#stage button'), function (b) {
        if (!b.offsetParent || b.classList.contains('area-ketuk')) return;
        if (b.offsetWidth < 88 || b.offsetHeight < 88) hasil.push('tombol kecil "' + (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 24) + '" ' + b.offsetWidth + 'x' + b.offsetHeight);
      });
      return hasil;
    },
    toast: function (text) {
      document.querySelectorAll('.toast').forEach(function (x) { x.parentNode.removeChild(x); });
      var t = U.h('div', 'toast', esc(text));
      t.setAttribute('role', 'status');
      stage().appendChild(t);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
    },

    /* Balon kata Tara: satu kalimat per tampilan, kata yang diucapkan disorot. Lebar mengikuti teks (maks. sampai x 1040). */
    balon: function (parent, o) {
      var el = U.h('div', 'balon balon-tara');
      el.style.left = o.x + 'px'; el.style.top = o.y + 'px';
      el.innerHTML = '<span class="speaker" aria-hidden="true">' + UI.ikon('suara', 34) + '</span><p class="ucapan" aria-live="polite" data-cek="balon"></p>' +
        '<svg class="ekor-balon" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><path d="M38,6 L4,20 L38,34 Z" fill="#FFF8EA"/><path d="M38,4 L4,20 L38,36" fill="none" stroke="#3A2A4F" stroke-width="4" stroke-linejoin="round"/></svg>';
      parent.appendChild(el);
      var p = el.querySelector('.ucapan');
      var api = {
        el: el, teks: '',
        tulis: function (teks) {
          api.teks = teks;
          p.innerHTML = teks.split(/\s+/).map(function (w, i) { return '<span class="kata" data-i="' + i + '">' + esc(w) + '</span>'; }).join(' ');
          el.style.visibility = 'visible';
          el.classList.toggle('tanpa-suara', !UI.adaSuara());
        },
        sorot: function (i) { Array.prototype.forEach.call(p.querySelectorAll('.kata'), function (k, j) { k.classList.toggle('aktif', j === i); }); },
        sembunyi: function () { el.style.visibility = 'hidden'; }
      };
      return api;
    },

    /* tangan penunjuk SVG: ujung telunjuk di titik sasaran */
    tangan: null, sumberTangan: '',
    tunjuk: function (sasaran, o) {
      o = o || {};
      var p = titik(sasaran, o.fy);
      if (!p) return;
      if (!UI.tangan) {
        UI.tangan = U.h('div', 'tangan-penunjuk', Seni.svg(120, 150, Seni.g('translate(30 14)', Seni.g('', Seni.tanganPenunjuk(), ' class="ketuk"')), ' style="overflow:visible"'));
        UI.tangan.setAttribute('aria-hidden', 'true');
      }
      stage().appendChild(UI.tangan);
      UI.tangan.style.left = Math.round(p.x - 30) + 'px';
      UI.tangan.style.top = Math.round(p.y - 14) + 'px';
      UI.tangan.classList.add('tampil');
      UI.sumberTangan = o.sumber || 'petunjuk';
      UI._tunjuk = { s: sasaran, o: o };
    },
    sembunyiTangan: function (semua) {
      if (!UI.tangan) return;
      if (semua || UI.sumberTangan === 'idle') { UI.tangan.classList.remove('tampil'); UI.sumberTangan = ''; }
    },
    /* isyarat bila 8 detik tanpa aksi (CLAUDE.md bagian 4). fn mengembalikan elemen (atau daftar elemen) yang ditunjuk, atau null.
       Tanpa opsi (layar menu): tangan menunjuk setelah 8 detik.
       Dengan opsi.ucap (pertanyaan): 8 detik, pertanyaan dibacakan ulang dan pilihan melompat kecil; 7 detik kemudian semua
       pilihan berdenyut bersama dan tangan menunjuk opsi.tangan() (tombol Dengar lagi), bukan salah satu pilihan, supaya
       tangan tidak terbaca sebagai jawaban. Tanpa opsi.tangan (satu langkah yang memang harus diketuk, mis. Ayo Menyeberang)
       tangan menunjuk elemen itu. opsi.saatTangan dipanggil saat tangan muncul. */
    idle: {
      fn: null, t: 0, tingkat: 0, opsi: null, sapu: 0, denyut: [],
      atur: function (fn, opsi) { UI.idle.fn = fn; UI.idle.opsi = opsi || null; UI.idle.reset(); },
      reset: function () {
        var I = UI.idle; I.t = performance.now(); I.tingkat = 0; clearTimeout(I.sapu); UI.sembunyiTangan(false);
        I.denyut.forEach(function (e) { e.classList.remove('denyut-pilih'); }); I.denyut = [];
      },
      cek: function () {
        var I = UI.idle;
        if (!I.fn || Loop.paused || Tween.paused || Scenes.busy || document.querySelector('.overlay')) return;
        if (Voice.sibuk()) { I.t = performance.now(); return; }
        if (UI.sumberTangan === 'petunjuk') return;
        var lama = performance.now() - I.t, o = I.opsi, el;
        if (o && o.ucap) {
          if (I.tingkat === 0 && lama > 8000) {
            el = I.fn(); if (!el) return;
            I.tingkat = 1;
            [].concat(el).forEach(function (e, i) { setTimeout(function () { if (e.isConnected) UI.lompat(e); }, i * 160); });
            o.ucap();
          } else if (I.tingkat === 1 && lama > 7000) {
            el = I.fn(); if (!el) return;
            I.tingkat = 2;
            if (o.tangan) {
              I.denyut = [].concat(el).filter(function (e) { return e && e.isConnected; });
              I.denyut.forEach(function (e) { e.classList.add('denyut-pilih'); });
              var t = o.tangan();
              if (t) UI.tunjuk(t, { sumber: 'idle', fy: 0.5 });
            } else UI.sapuTangan(el);
            if (o.saatTangan) o.saatTangan();
          }
          return;
        }
        if (lama > 8000 && UI.sumberTangan !== 'idle') { el = I.fn(); if (el) UI.sapuTangan(el); }
      }
    },
    /* tangan isyarat: satu elemen ditunjuk, atau beberapa elemen ditunjuk bergiliran terus-menerus
       (tidak berhenti di satu pilihan, agar tidak terbaca sebagai jawaban) sampai murid bergerak */
    sapuTangan: function (el) {
      var a = [].concat(el).filter(function (e) { return e && e.isConnected; }), i = 0;
      if (!a.length) return;
      (function langkah() {
        if (!a[i].isConnected) return UI.sembunyiTangan(false);
        UI.tunjuk(a[i], { sumber: 'idle', fy: 0.5 });
        i = (i + 1) % a.length;
        if (a.length > 1) UI.idle.sapu = setTimeout(function () { if (UI.sumberTangan === 'idle') langkah(); }, 1000);
      })();
    },

    /* partikel kecil saat benar: satu kanvas untuk semua */
    _p: { kanvas: null, ctx: null, list: [], jalan: false },
    ledak: function (x, y, n, jenis) {
      if (UI.kurangi) return;
      var P = UI._p, C = Seni.C, warna = jenis === 'sisik' ? [C.emas, C.kuningMuda, C.krem] : [C.kuning, C.hijau, C.koral, C.langit, C.krem];
      if (!P.kanvas) {
        P.kanvas = U.h('canvas', 'kanvas-partikel'); P.kanvas.width = 1280; P.kanvas.height = 720;
        P.ctx = P.kanvas.getContext('2d');
      }
      if (!P.kanvas.parentNode) stage().appendChild(P.kanvas);
      for (var i = 0; i < (n || 14); i++) {
        var a = Math.random() * Math.PI * 2, v = 160 + Math.random() * 240;
        P.list.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 180, umur: 0, maks: 0.7 + Math.random() * 0.4, r: 5 + Math.random() * 6, w: warna[i % warna.length], b: i % 3 === 0 });
      }
      if (P.jalan) return;
      P.jalan = true;
      var akhir = performance.now();
      (function tick(ts) {
        var dt = Math.min(0.05, (ts - akhir) / 1000); akhir = ts;
        var c = P.ctx;
        c.clearRect(0, 0, 1280, 720);
        if (!Loop.paused) P.list.forEach(function (q) { q.umur += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 520 * dt; });
        P.list = P.list.filter(function (q) { return q.umur < q.maks; });
        P.list.forEach(function (q) {
          var k = 1 - q.umur / q.maks;
          c.globalAlpha = Math.min(1, k * 1.5);
          c.fillStyle = q.w; c.strokeStyle = Seni.C.terong; c.lineWidth = 2.5;
          c.beginPath();
          if (q.b) { for (var j = 0; j < 10; j++) { var rr = j % 2 ? q.r * 0.45 : q.r * 1.2, aa = j * Math.PI / 5 - Math.PI / 2; c.lineTo(q.x + rr * Math.cos(aa), q.y + rr * Math.sin(aa)); } c.closePath(); }
          else c.arc(q.x, q.y, q.r * 0.7, 0, Math.PI * 2);
          c.fill(); c.stroke();
        });
        c.globalAlpha = 1;
        if (P.list.length) requestAnimationFrame(tick); else { P.jalan = false; c.clearRect(0, 0, 1280, 720); }
      })(akhir);
    },
    /* angka menghitung naik dengan bunyi detak */
    hitungNaik: function (el, dari, ke, fmt, ms) {
      var lalu = dari;
      el.textContent = fmt(dari);
      return Tween.run(ms || 600, function (e) {
        var v = Math.round(dari + (ke - dari) * e);
        if (v !== lalu) { lalu = v; el.textContent = fmt(v); Aud.sfx('tick', 1 + e * 0.5); }
      }, Ease.easeOutCubic).then(function () { el.textContent = fmt(ke); });
    },
    /* goyang lembut untuk jawaban salah */
    goyang: function (el) {
      if (UI.kurangi) return Promise.resolve();
      return Tween.run(380, function (e, k) { el.style.translate = (Math.sin(k * Math.PI * 5) * 9 * (1 - k)).toFixed(1) + 'px 0'; }, Ease.linear).then(function () { el.style.translate = ''; });
    },
    /* lompatan kecil untuk jawaban benar */
    lompat: function (el) {
      if (UI.kurangi) return Promise.resolve();
      return Tween.run(420, function (e, k) { el.style.translate = '0 ' + (-Math.sin(k * Math.PI) * 18).toFixed(1) + 'px'; el.style.scale = (1 + Math.sin(k * Math.PI) * 0.06).toFixed(3); }, Ease.linear)
        .then(function () { el.style.translate = ''; el.style.scale = ''; });
    },
    /* muncul memantul (easeOutBack) */
    muncul: function (el, ms, tunda) {
      if (UI.kurangi) { el.style.opacity = 1; el.style.scale = ''; return Promise.resolve(); }
      el.style.opacity = 0;
      return Tween.wait(tunda || 0).then(function () {
        return Tween.run(ms || 320, function (e, k) { el.style.opacity = Math.min(1, k * 2.5); el.style.scale = (0.4 + 0.6 * e).toFixed(3); }, Ease.easeOutBack);
      }).then(function () { el.style.scale = ''; el.style.opacity = 1; });
    }
  };
  document.addEventListener('pointerdown', function () { UI.idle.reset(); }, true);
  document.addEventListener('keydown', function () { UI.idle.reset(); }, true);
  setInterval(function () { UI.idle.cek(); }, 500);
  root.UI = UI;
})(window);
