/* Layar tempat (GDD bagian 3, 6, 7): mencari bahaya di adegan hidup, Ritme Siaga (Berhenti, Lihat, Pikir), Teladan,
   petunjuk bertingkat, Kartu Kilat, Momen Tahan, dan Tempat Aman. Data dari config/tempat.js, teks dari STR.tempat,
   aktor dan adegan ulang dari js/scenes/<tempat>.js (ADEGAN). */
(function () {
  var S = null;   // keadaan layar yang sedang hidup
  var DOK = [248, 328];   // tempat berlabuh Kaca Pembesar saat PIKIR
  var SK = 1.3;           // perbesaran Kaca Pembesar
  function hidup(s) { return s && s === S && S.hidup && Scenes.name === 'tempat'; }
  function santai() { return Save.data.settings.santai; }
  function acak(arr) { return U.shuffle(Math.random, arr); }

  /* ===== Tara: gambar sesuai pose, sisik, dan perlengkapan ===== */
  /* T4 terik: Tara memakai topi pelindung matahari menggantikan helm (GDD 8) */
  function gTara(pose, kedip) { return Gambar.tara(pose, { sisik: Save.daftarSisik(), perlengkapan: Save.perlengkapan(), kedip: kedip, topi: !!(S && S.id === 't4') }); }

  /* ===== babak (T3 punya dua babak); tempat lain satu babak berisi semua bahaya dan Teladan ===== */
  function babakIni() {
    var T = S.T;
    return T.babak ? T.babak[S.babak] : { latar: T.latar, bahaya: T.bahaya.map(function (h) { return h.id; }), teladan: T.teladan.map(function (t) { return t.id; }) };
  }
  function bahayaBabak() { var B = babakIni(); return S.T.bahaya.filter(function (h) { return B.bahaya.indexOf(h.id) >= 0; }); }
  function teladanBabak() { var B = babakIni(); return S.T.teladan.filter(function (t) { return B.teladan.indexOf(t.id) >= 0; }); }
  function bangunArea() {
    var L = S.areaLapis, X = S.X;
    L.innerHTML = '';
    bahayaBabak().map(function (h) { return { id: h.id, area: h.area, jenis: 'bahaya' }; }).concat(teladanBabak().map(function (t) { return { id: t.id, area: t.area, jenis: 'teladan' }; })).forEach(function (it) {
      var b = U.h('button', 'area-ketuk' + (U.TEST && /[?&]area=1/.test(location.search) ? ' ditandai' : ''));
      b.type = 'button'; b.dataset.id = 'area-' + it.id;
      b.style.cssText = 'left:' + it.area[0] + 'px;top:' + it.area[1] + 'px;width:' + it.area[2] + 'px;height:' + it.area[3] + 'px;pointer-events:auto';
      b.setAttribute('aria-label', X.area[it.id] || it.id);
      b.addEventListener('pointerdown', function () { Aud.init(); });
      b.addEventListener('click', function () { ketukArea(it); });
      L.appendChild(b);
    });
  }
  /* pindah babak: Tara menggelinding keluar ke kanan, layar memudar, latar dan aktor berganti, Tara menggelinding masuk */
  function pindahBabak() {
    var s = S, t = s.tara;
    s.fase = 'pindah';
    s.lapisTanda.innerHTML = '';
    taraPose('bola'); Aud.sfx('whoosh');
    return Tween.run(UI.kurangi ? 10 : 800, function (e) { t.x = 112 + (1400 - 112) * e; t.rot = 600 * e; t.atur(); }, Ease.easeInOutCubic).then(function () {
      if (!hidup(s)) return;
      var cover = document.getElementById('cover');
      return Tween.run(250, function (e) { cover.style.opacity = e; }, Ease.easeOutQuad).then(function () {
        s.babak++;
        s.latar.src = ASET.gambar[babakIni().latar] || '';
        s.ctx.lapis.innerHTML = '';
        s.A.siapkan(s.ctx, s.babak);
        bangunArea();
        t.x = -120; t.rot = 0; t.atur();
        return Tween.run(250, function (e) { cover.style.opacity = 1 - e; }, Ease.easeOutQuad);
      });
    }).then(function () {
      if (!hidup(s)) return;
      return masuk(true);
    });
  }
  /* setelah semua bahaya babak terakhir: permainan sela (Ayo Menyeberang) bila ada, lalu Momen Tahan */
  function sesudahBahaya() {
    var s = S, B = babakIni();
    if (s.T.babak && s.babak < s.T.babak.length - 1) return pindahBabak();
    var p = ucap(STR.tara.semuaKetemu);
    if (B.sela && window.SELA && SELA[B.sela]) p = p.then(function () { if (hidup(s)) { s.fase = 'sela'; return SELA[B.sela](s.ctx); } });
    /* tempat tanpa Momen Tahan (T5): langsung Tempat Aman */
    return p.then(function () { if (hidup(s)) return s.T.momen ? momenTahan() : ulangAkhir().then(function () { if (hidup(s)) return tempatAman(); }); });
  }
  function taraPose(pose) { S.taraPose = pose; S.tara.pakai(gTara(pose)); }

  /* ===== ucapan: balon menampilkan satu kalimat per tampilan, kata yang diucapkan disorot ===== */
  function ucap(teks, tokoh) {
    var s = S, gen = s.gen;
    /* teks panjang berisi dua kalimat dipecah: satu kalimat per tampilan, agar balon tidak meluap */
    var kal = [];
    [].concat(teks).filter(Boolean).forEach(function (t) {
      if (t.length > 38 && /[.!?]\s/.test(t)) t.replace(/([.!?])\s+/g, '$1\n').split('\n').forEach(function (k) { if (k) kal.push(k); });
      else kal.push(t);
    });
    var p = Promise.resolve();
    kal.forEach(function (t) {
      p = p.then(function () {
        if (!hidup(s) || s.gen !== gen) return;
        return Voice.say(t, { tokoh: tokoh || 'tara', mulai: function () { if (hidup(s)) { s.balon.tulis(t); s.dengar = kal; } }, onWord: function (i) { if (hidup(s)) s.balon.sorot(i); } });
      });
    });
    return p;
  }

  /* tindakan murid memotong ucapan: kalimat yang sedang diucapkan berhenti dan sisa rantai ucapan lama tidak dibacakan */
  function potong() { if (S) S.gen++; Voice.stop(); }

  /* ===== HUD ===== */
  /* tempat TAMBAHAN (tanpa Momen): papan 3 slot dan penghitung sisik ekor tempat itu */
  function totalSisik() { return S.T.momen ? 24 : S.T.slot.length; }
  function jumlahSisik() { return S.T.momen ? Save.jumlahSisik() : Save.sisikTempat(S.id); }
  function papanSisik() {
    var T = S.T, isi = [], n = 0, nSlot = T.momen ? 6 : T.slot.length;
    T.slot.forEach(function (k) { var v = Save.data.sisik[S.id + '-' + k]; if (v && k !== 'momen') isi.push(v); });
    var daftar = isi.slice(0, T.momen ? 5 : nSlot);
    while (daftar.length < (T.momen ? 5 : nSlot)) daftar.push('');
    if (T.momen) daftar.push(Save.data.sisik[S.id + '-momen'] || '');
    n = jumlahSisik();
    S.papan.innerHTML = Seni.svg(452, 96, Seni.papanSisik(daftar.map(function (x) { return x || 'kosong'; }), n, totalSisik(), nSlot).replace(/>\d+\/\d+</, '><'));
    var nilai = U.h('span', 'nilai-sisik', n + '/' + totalSisik()); nilai.setAttribute('data-cek', 'nilai sisik');
    S.papan.appendChild(nilai);
    S.nilaiSisik = nilai;
  }
  function ritmeUI(langkah) {
    /* langkah: -1 sembunyi (Papan Sisik tampil), 0 Berhenti, 1 Lihat, 2 Pikir */
    S.papan.style.display = langkah < 0 ? '' : 'none';
    S.ritme.style.display = langkah < 0 ? 'none' : 'flex';
    Array.prototype.forEach.call(S.ritme.querySelectorAll('.langkah'), function (el, i) {
      el.classList.toggle('selesai', i < langkah); el.classList.toggle('aktif', i === langkah); el.classList.toggle('nanti', i > langkah);
    });
  }
  function bangunRitme() {
    var R = STR.ritme, d = U.h('div', 'ritme');
    function satu(ikon, warna, teks) {
      return '<div class="langkah"><span class="bulat" style="background:' + warna + '">' + UI.ikon(ikon, 34) + '</span><span data-cek="ritme ' + teks + '">' + UI.esc(teks) + '</span><span class="centang">' + UI.ikon('centang', 18) + '</span></div>';
    }
    var panah = '<span class="panah-r">' + UI.ikon('panah', 22) + '</span>';
    d.innerHTML = satu('telapak', 'var(--koral)', R.berhenti) + panah + satu('mata', 'var(--langit)', R.lihat) + panah + satu('bohlam', 'var(--kuning-muda)', R.pikir);
    d.style.display = 'none';
    return d;
  }

  /* ===== efek: cincin isyarat, jejak bau, riak beku ===== */
  function efek(svgIsi) { S.efek.innerHTML = svgIsi ? Seni.svg(1280, 720, svgIsi) : ''; }
  function cincin(a) {
    var cx = a[0] + a[2] / 2, cy = a[1] + a[3] / 2, rx = a[2] / 2 + 6, ry = a[3] / 2 + 6, C = Seni.C;
    return Seni.g('', Seni.elips(cx, cy, rx, ry, 'none', 9, C.krem, ' stroke-dasharray="14 10" opacity=".95"') + Seni.elips(cx, cy, rx, ry, 'none', 4.5, C.koralTua, ' stroke-dasharray="14 10"'), ' class="denyut"');
  }

  /* ===== masuk ===== */
  function masuk(babakBaru) {
    var s = S, t = S.tara;
    t.x = -120; t.atur();
    taraPose('bola');
    Aud.sfx('whoosh');
    return Tween.run(UI.kurangi ? 10 : 900, function (e) { t.x = -120 + (112 + 120) * e; t.rot = 540 * e; t.atur(); }, Ease.easeOutCubic).then(function () {
      if (!hidup(s)) return;
      t.rot = 0; t.atur();
      return Tween.run(UI.kurangi ? 10 : 260, function (e, k) { t.dy = -Math.sin(k * Math.PI) * 26; t.atur(); }, Ease.linear);
    }).then(function () {
      if (!hidup(s)) return;
      Aud.sfx('buka'); taraPose('senang'); t.dy = 0; t.atur();
      var awal = !Save.data.hook;
      if (babakBaru) return ucap([s.X.masukB || s.X.masuk, STR.tara.cari]);
      return ucap(awal ? [STR.tara.halo, STR.tara.hook] : [s.X.masuk, STR.tara.cari]);
    }).then(function () {
      if (!hidup(s)) return;
      s.fase = 'cari'; s.diam = 0;
      taraPose('diam');
      if (!Save.data.hook) {
        /* hook: tangan penunjuk langsung muncul di bahaya pertama (GDD bagian 4) */
        var h = bahayaBabak()[0];
        efek(cincin(h.area));
        UI.tunjuk({ x: h.area[0] + h.area[2] / 2 + 10, y: h.area[1] + h.area[3] * 0.78 }, { sumber: 'petunjuk' });
        s.isyarat = 2;
      }
    });
  }

  /* ===== mencari ===== */
  function bahayaBerikut() {
    var sisa = bahayaBabak().filter(function (h) { return !S.selesai[h.id]; });
    if (!sisa.length) return null;
    /* bahaya terdekat ke Tara */
    sisa.sort(function (a, b) { return a.area[0] - b.area[0]; });
    return sisa[0];
  }
  function isyaratDiam(dt) {
    /* waktu diam berhenti dihitung (tidak direset) selama Tara berbicara atau panel terbuka */
    if (S.fase !== 'cari' || Voice.sibuk() || document.querySelector('.overlay')) return;
    S.diam += dt;
    var t1 = santai() ? 6 : 8, t2 = santai() ? 10 : 15, h = bahayaBerikut();
    if (!h) return;
    if (S.isyarat < 1 && S.diam > t1) {
      /* Tara mengendus: hidung ke bahaya terdekat, tiga titik jejak bau, cincin berdenyut (GDD 7.1) */
      S.isyarat = 1; S.isyaratPada[h.id] = Math.max(S.isyaratPada[h.id] || 0, 1);
      taraPose('endus'); Aud.sfx('endus');
      var C = Seni.C, x0 = 190, y0 = 560, x1 = h.area[0] + h.area[2] / 2, y1 = h.area[1] + h.area[3] / 2, titik = '';
      for (var i = 1; i <= 3; i++) titik += Seni.lingkar(x0 + (x1 - x0) * i / 4, y0 + (y1 - y0) * i / 4 - Math.sin(i / 4 * Math.PI) * 60, 9 - i, C.lavender, 2.4, C.krem, ' class="denyut" style="animation-delay:' + (i * 0.2) + 's"');
      efek(titik + cincin(h.area));
      if (!S.endusDiucap) { S.endusDiucap = true; ucap(STR.tara.endus); }
      setTimeout(function () { if (S && S.taraPose === 'endus' && S.fase === 'cari') taraPose('diam'); }, 1800);
    } else if (S.isyarat < 2 && S.diam > t2) {
      S.isyarat = 2; S.isyaratPada[h.id] = 2;
      efek(cincin(h.area));
      UI.tunjuk({ x: h.area[0] + h.area[2] / 2, y: h.area[1] + h.area[3] * 0.6 }, { sumber: 'idle' });
    }
  }
  /* ketukan meleset saat mencari: bunyi "tuk" lembut dan riak kecil di titik ketuk. Tiga kali meleset, Tara langsung mengendus. */
  function meleset(x, y) {
    Aud.sfx('tap');
    var r = U.h('div', 'riak-ketuk');
    r.style.left = Math.round(x - 32) + 'px'; r.style.top = Math.round(y - 32) + 'px';
    S.root.appendChild(r);
    setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 600);
    S.meleset = (S.meleset || 0) + 1;
    if (S.meleset >= 3 && S.isyarat < 1) { S.meleset = 0; S.diam = (santai() ? 6 : 8) + 0.01; }
    if (S.isyarat >= 2) setTimeout(function () {
      var h = S && S.fase === 'cari' && S.isyarat >= 2 && bahayaBerikut();
      if (h) UI.tunjuk({ x: h.area[0] + h.area[2] / 2, y: h.area[1] + h.area[3] * 0.6 }, { sumber: 'idle' });
    }, 0);
  }
  function resetDiam() { if (!S) return; S.diam = 0; if (S.isyarat) { S.isyarat = 0; efek(''); UI.sembunyiTangan(true); if (S.taraPose === 'endus') taraPose('diam'); } }

  function ketukArea(item) {
    if (!S || S.fase !== 'cari') return;
    var dariHook = !Save.data.hook;
    resetDiam();
    if (dariHook) S.isyarat = 0;
    if (item.jenis === 'teladan') return teladan(item);
    if (S.selesai[item.id]) { Aud.sfx('tap'); ucap(STR.tara.sudahAman); return; }
    /* Mata Jeli: ditemukan tanpa isyarat dari Tara */
    Save.catatJurus('mata-jeli', !S.isyaratPada[item.id] && !dariHook);
    /* TP1 menunjuk situasi berbahaya: bantuan 2 = Tara mengendus dan cincin berdenyut, 3 = tangan menunjuk */
    if (!dariHook) Save.catat(['kenali-bahaya'], !S.isyaratPada[item.id], S.isyaratPada[item.id] ? S.isyaratPada[item.id] + 1 : 0);
    ritme(S.T.bahaya.filter(function (b) { return b.id === item.id; })[0]);
  }

  function teladan(item) {
    var s = S;
    s.fase = 'teladan';
    potong(); Aud.sfx('jempol');
    var a = item.area;
    if (!s.teladan[item.id]) {
      s.teladan[item.id] = true;
      Save.data.teladan[s.id + '-' + item.id] = true; Save.save();
      var tanda = U.h('div', 'tanda-teladan');
      tanda.style.cssText = 'position:absolute;left:' + (a[0] + a[2] / 2 - 26) + 'px;top:' + (a[1] - 8) + 'px;z-index:13;pointer-events:none';
      tanda.innerHTML = Seni.svg(52, 52, Seni.centang(26, 26, 22));
      s.lapisTanda.appendChild(tanda);
      UI.muncul(tanda, 360);
    }
    taraPose('senang');
    return ucap(s.X.teladan[item.id]).then(function () { if (hidup(s) && s.fase === 'teladan') { s.fase = 'cari'; s.diam = 0; taraPose('diam'); } });
  }

  /* ===== Kaca Pembesar ===== */
  function lensaPasang(pusat, sorot, gelembung) {
    var L = S.lensa, isi = L.querySelector('.isi-lensa');
    isi.innerHTML = '';
    isi.appendChild(S.dunia.cloneNode(true));
    var C = Seni.C, tambahan = '';
    if (gelembung) tambahan += Seni.g('translate(' + gelembung[0] + ',' + gelembung[1] + ')', Seni.lingkar(0, 0, gelembung[2], 'rgba(221,242,251,.3)', 5, C.krem) + Seni.lingkar(0, 0, gelembung[2], 'none', 2.4, C.langitTua) +
      Seni.path('M' + (-gelembung[2] * 0.6) + ',' + (-gelembung[2] * 0.58) + ' Q' + (-gelembung[2] * 0.3) + ',' + (-gelembung[2] * 0.88) + ' ' + (gelembung[2] * 0.12) + ',' + (-gelembung[2] * 0.9), 'none', 6, C.putih, ' opacity=".9"'));
    if (sorot) tambahan += Seni.g('', Seni.lingkar(sorot[0], sorot[1], sorot[2], 'none', 7, C.krem, ' stroke-dasharray="7 7"') + Seni.lingkar(sorot[0], sorot[1], sorot[2], 'none', 3.4, C.koralTua, ' stroke-dasharray="7 7"'), ' class="denyut sorot-lensa"');
    var lap = U.h('div', 'lapis tembus'); lap.innerHTML = Seni.svg(1280, 720, tambahan);
    isi.appendChild(lap);
    isi.style.transform = 'translate(' + (178 - pusat[0] * SK) + 'px,' + (178 - pusat[1] * SK) + 'px) scale(' + SK + ')';
  }
  function lensaLetak(x, y, sk) { S.lensa.style.left = x + 'px'; S.lensa.style.top = y + 'px'; S.lensa.style.transform = 'scale(' + sk + ')'; S.lensa.style.display = sk > 0.01 ? '' : 'none'; }
  function sorotKuat() {
    var el = S.lensa.querySelector('.sorot-lensa');
    if (!el) return;
    el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center';
    Tween.run(700, function (e, k) { el.style.transform = 'scale(' + (1 + Math.sin(k * Math.PI * 2) * 0.25) + ')'; }, Ease.linear).then(function () { el.style.transform = ''; });
  }

  /* ===== Ritme Siaga: BERHENTI, LIHAT, PIKIR (GDD 3.1) ===== */
  function ritme(h, o) {
    o = o || {};
    var s = S, momen = h.id === 'momen', X = momen ? s.X.momen : s.X.bahaya[h.id];
    s.fase = 'ritme'; s.h = h; s.salah = 0; s.bantuan = 0; s.dariMomen = momen;
    potong(); UI.sembunyiTangan(true); efek('');
    var p = Promise.resolve();
    if (!o.sudahBerhenti) {
      p = p.then(function () {
        /* BERHENTI: Tara menggulung, riak dari Tara, dunia membeku */
        s.beku = true;
        taraPose('bola'); Aud.sfx('gulung');
        ritmeUI(0); Aud.sfx('ritme', 0);
        var C = Seni.C;
        Tween.run(UI.kurangi ? 10 : 650, function (e) {
          efek(Seni.lingkar(112, 620, 40 + e * 1300, 'none', 14 * (1 - e) + 2, C.krem, ' opacity="' + (1 - e).toFixed(2) + '"'));
        }, Ease.easeOutQuad).then(function () { if (hidup(s)) efek(''); });
        Aud.sfx('beku');
        Tween.run(300, function (e) { s.tirai.style.opacity = e; }, Ease.easeOutQuad);
        return Promise.all([ucap(STR.ritme.ucapBerhenti), Tween.wait(650)]);
      });
    } else p = p.then(function () { ritmeUI(0); return Tween.wait(300); });
    return p.then(function () {
      if (!hidup(s)) return;
      /* LIHAT: Kaca Pembesar muncul di atas situasi, bagian berisiko berdenyut */
      ritmeUI(1); Aud.sfx('ritme', 1);
      taraPose('intip');
      var ps = h.lensa, gel = momen ? s.A.momen.gelembung(s.ctx) : s.A.gelembung[h.id];
      lensaPasang(ps, h.sorot, gel);
      var lx = U.clamp(ps[0], 200, 1080), ly = U.clamp(ps[1], 200, 520);
      lensaLetak(lx, ly, 0.01);
      s.lensaXY = [lx, ly];
      var muncul = Tween.run(UI.kurangi ? 10 : 380, function (e) { lensaLetak(lx, ly, Math.max(0.01, e)); }, Ease.easeOutBack);
      return Promise.all([muncul, ucap(X.lihat), Tween.wait(1200)]);
    }).then(function () {
      if (!hidup(s)) return;
      /* PIKIR: kaca berlabuh di kiri, kartu naik di kanan satu per satu */
      ritmeUI(2); Aud.sfx('ritme', 2);
      taraPose('pikir');
      var lx = s.lensaXY[0], ly = s.lensaXY[1];
      Tween.run(UI.kurangi ? 10 : 450, function (e) { lensaLetak(lx + (DOK[0] - lx) * e, ly + (DOK[1] - ly) * e, 1); }, Ease.easeInOutCubic);
      return pasangKartu(h, X);
    });
  }

  function jumlahKartu() {
    var n = S.kartuN;
    return santai() ? Math.min(2, n) : n;
  }

  function pasangKartu(h, X) {
    var s = S, n = jumlahKartu();
    var benar = h.kartu.filter(function (k) { return k.benar; })[0];
    var pengecoh = h.kartu.filter(function (k) { return !k.benar && !k.cadangan; }), cadangan = h.kartu.filter(function (k) { return k.cadangan; });
    var pakai = [benar].concat(pengecoh, cadangan).slice(0, Math.max(2, n));
    pakai = acak(pakai);
    s.kartuLapis.innerHTML = '';
    var lebar = pakai.length === 3 ? 250 : 304, xs = pakai.length === 3 ? [470, 737, 1004] : [528, 870];
    s.kartu = pakai.map(function (k, i) {
      var b = U.h('button', 'kartu');
      b.type = 'button'; b.dataset.id = 'kartu-' + k.k;
      b.style.left = xs[i] + 'px'; b.style.top = '184px'; b.style.width = lebar + 'px';
      var gb = GAMBAR[s.id + '-' + h.id + '-' + k.k];
      b.innerHTML = '<div class="gambar">' + (gb ? Seni.svg(296, 204, gb(), ' style="display:block;margin-left:' + ((lebar - 8 - 296) / 2) + 'px"') : '') + '</div>' +
        '<span class="no">' + (i + 1) + '</span><p class="teks" data-cek="kartu ' + k.k + '"' + (lebar < 300 ? ' style="font-size:26px"' : '') + '>' + UI.teksKartu(X.kartu[k.k]) + '</p>';
      b.setAttribute('aria-label', (i + 1) + '. ' + X.kartu[k.k]);
      b.addEventListener('pointerdown', function () { Aud.init(); });
      b.addEventListener('click', function () { pilih(k, b); });
      b.style.opacity = 0;
      s.kartuLapis.appendChild(b);
      UI.pasKartu(b.querySelector('.teks'));
      return { k: k, el: b };
    });
    s.fase = 'pikir';
    s.Xh = X;
    /* diam 8 detik: pertanyaan dibacakan ulang dan kartu melompat; 7 detik lagi semua kartu berdenyut dan tangan menunjuk Dengar lagi */
    UI.idle.atur(function () { return hidup(s) && s.fase === 'pikir' ? s.kartu.filter(function (d) { return !d.el.disabled; }).map(function (d) { return d.el; }) : null; },
      { ucap: function () { if (hidup(s) && s.fase === 'pikir') ucap(X.tanya); }, tangan: tombolDengar });
    s.kartu.forEach(function (c, i) {
      UI.muncul(c.el, 340, 160 + i * 260).then(function () { if (hidup(s)) Aud.sfx('ritme', 2); });
    });
    return bacaKartu();
  }
  function tombolDengar() { return S && S.root.querySelector('[data-id="dengar"]'); }
  /* pertanyaan, lalu tiap kartu yang masih bisa dipilih dibacakan bergiliran dan disorot (juga lewat tombol Dengar lagi) */
  function bacaKartu() {
    var s = S, X = s.Xh, gen = s.gen, p = ucap(X.tanya);
    s.kartu.forEach(function (c) {
      p = p.then(function () {
        if (!hidup(s) || s.fase !== 'pikir' || c.el.disabled || s.gen !== gen) return;
        return Voice.say(X.kartu[c.k.k], { tokoh: 'tara', mulai: function () { if (hidup(s)) { s.kartu.forEach(function (d) { d.el.classList.toggle('dibaca', d === c); }); s.balon.tulis(X.kartu[c.k.k]); } }, onWord: function (i) { if (hidup(s)) s.balon.sorot(i); } });
      });
    });
    return p.then(function () {
      if (!hidup(s) || s.fase !== 'pikir') return;
      s.kartu.forEach(function (d) { d.el.classList.remove('dibaca'); });
      s.balon.tulis(X.tanya); s.dengar = [X.tanya];
    });
  }

  /* pilihan kartu melatih TP2 (dan TP lain menurut jurusnya). TP1 dicatat saat bahaya ditemukan dan di Kartu Kilat atau Pawai;
     TP3 dicatat dari TAHAN! dan kartu ber-jurus Berhenti. */
  function tagSituasi(h, k) {
    var t = ['pilih-aman'];
    var tj = TEMPAT.tagJurus[k.jurus];
    if (tj && t.indexOf(tj) < 0) t.push(tj);
    return t;
  }

  function pilih(k, el) {
    var s = S;
    if (!s || s.fase !== 'pikir' || el.disabled) return;
    potong();
    s.kartu.forEach(function (d) { d.el.classList.remove('dibaca'); });
    if (k.benar) return benar(k, el);
    return salah(k, el);
  }

  function salah(k, el) {
    var s = S, h = s.h, X = s.dariMomen ? s.X.momen : s.X.bahaya[h.id];
    s.salah++;
    Aud.sfx('bad');
    el.disabled = true;
    UI.goyang(el).then(function () { el.classList.add('pudar'); });
    taraPose('geleng');
    Save.catatKeluarga(k.keluarga); Save.catatSalah(tagSituasi(h, h.kartu.filter(function (x) { return x.benar; })[0]));
    s.salahPilih.push(s.id + '-' + h.id + ':' + k.k);
    var sisa = s.kartu.filter(function (d) { return !d.el.disabled; });
    var kal = (k.tanpaKeluarga ? [] : (STR.keluarga[k.keluarga] || [])).concat([X.balas[k.k]]);
    s.bantuan = Math.max(s.bantuan, 1);
    var p, adegan = s.dariMomen && s.A.momen.salah && s.A.momen.salah[k.k];
    if (adegan) {
      /* adegan khusus (brief bagian 8): lapisan PIKIR disingkirkan, akibatnya diperlihatkan dengan aman, lalu pilihan diulang */
      s.fase = 'adegan';
      p = lapisPikir(false).then(function () { if (hidup(s)) return adegan(s.ctx); }).then(function () { if (hidup(s)) return lapisPikir(true); })
        .then(function () { if (!hidup(s)) return; s.fase = 'pikir'; return ucap(kal.concat([X.tanya])); });
    } else p = ucap(kal);
    /* tingkat 2: sorot bagian penting dan bacakan ulang (di T1 dengan 2 kartu langsung pada salah pertama) */
    if (s.salah >= 2 || sisa.length === 1) {
      s.bantuan = Math.max(s.bantuan, 2);
      p = p.then(function () { if (!hidup(s) || s.fase !== 'pikir') return; sorotKuat(); return ucap(X.lihat[0]); });
    }
    /* tingkat 3: tersisa satu kartu sesudah dua kali salah, Tara menunjuk dan membacakannya */
    if (sisa.length === 1) {
      var c = sisa[0];
      if (s.salah >= 2) s.bantuan = 3;
      p = p.then(function () {
        /* petunjuk yang tertunda tidak muncul lagi bila anak sudah memilih kartu yang benar */
        if (!hidup(s) || s.fase !== 'pikir') return;
        c.el.classList.add('ditunjuk');
        taraPose('tunjuk');
        if (s.salah >= 2) UI.tunjuk({ x: parseFloat(c.el.style.left) + 150, y: 380 }, { sumber: 'petunjuk' });
        return ucap([STR.tara.tunjukKartu, X.kartu[c.k.k]]);
      });
    }
    return p.then(function () { if (hidup(s) && s.fase === 'pikir' && s.taraPose === 'geleng') taraPose('pikir'); });
  }

  /* lapisan PIKIR (kaca, kartu, tirai) disembunyikan sementara lalu dikembalikan */
  function lapisPikir(tampil) {
    var s = S, el = [s.kartuLapis, s.lensa], tirai0 = s.tiraiPikir == null ? (s.tiraiPikir = +s.tirai.style.opacity || 1) : s.tiraiPikir;
    return Tween.run(UI.kurangi ? 10 : 300, function (e) {
      var o = tampil ? e : 1 - e;
      el.forEach(function (x) { if (x) x.style.opacity = o; });
      s.tirai.style.opacity = tirai0 * o;
    }, Ease.easeInOutCubic).then(function () { if (tampil) { el.forEach(function (x) { if (x) x.style.opacity = ''; }); s.tiraiPikir = null; } });
  }

  function benar(k, el) {
    var s = S, h = s.h, momen = s.dariMomen, langsung = s.salah === 0, jenis = langsung ? 'emas' : 'perak';
    s.fase = 'aman';
    UI.sembunyiTangan(true);
    Aud.sfx('good');
    el.classList.add('benar'); el.classList.remove('ditunjuk');
    UI.lompat(el);
    UI.ledak(parseFloat(el.style.left) + 150, 300, 14);
    s.kartu.forEach(function (d) { if (d.el !== el) d.el.classList.add('pudar'); });
    Save.catat(tagSituasi(h, k), langsung, s.bantuan);
    Save.catatJurus(k.jurus, langsung);
    if (!momen) { s.adaptif.catat(langsung); s.kartuN = s.adaptif.t; if (langsung) s.benarAwal++; }
    /* belum benar pada coba pertama dan tidak mendapat Kartu Kilat: diulang di akhir tempat */
    if (!langsung && !(s.bantuan >= 3 && GAMBAR[s.id + '-kilat-' + h.id])) s.perluUlang.push(h);
    Save.save();
    var X = momen ? s.X.momen : s.X.bahaya[h.id];
    return Tween.wait(650).then(function () {
      if (!hidup(s)) return;
      /* tutup PIKIR: kartu turun, kaca kembali ke situasi lalu menutup, tirai terangkat */
      var lx = DOK[0], ly = DOK[1], tx = s.lensaXY[0], ty = s.lensaXY[1];
      Tween.run(UI.kurangi ? 10 : 320, function (e) { s.kartu.forEach(function (d) { d.el.style.translate = '0 ' + (e * 420) + 'px'; d.el.style.opacity = 1 - e; }); }, Ease.easeInOutCubic)
        .then(function () { if (hidup(s)) s.kartuLapis.innerHTML = ''; });
      return Tween.run(UI.kurangi ? 10 : 420, function (e) { lensaLetak(lx + (tx - lx) * e, ly + (ty - ly) * e, 1 - e); s.tirai.style.opacity = 1 - e; }, Ease.easeInOutCubic);
    }).then(function () {
      if (!hidup(s)) return;
      lensaLetak(0, 0, 0); s.tirai.style.opacity = 0; s.tirai.style.webkitMaskImage = s.tirai.style.maskImage = '';
      ritmeUI(-1);
      s.beku = false;
      taraPose('diam');
      s.balon.sembunyi();
      /* adegan ulang aman */
      return momen ? s.A.momen.aman(s.ctx) : s.A.aman[h.id](s.ctx);
    }).then(function () {
      if (!hidup(s)) return;
      /* AMAN: Tara membuka dengan pop dan bersorak, sisik terbang ke Papan dan punggung Tara */
      Aud.sfx('aman'); Aud.sfx('buka');
      taraPose('sorak');
      return terbangSisik(h, jenis);
    }).then(function () {
      if (!hidup(s)) return;
      return ucap([langsung ? STR.tara.sisik : STR.tara.sisikPerak, X.aturan]);
    }).then(function () {
      if (!hidup(s)) return;
      /* tingkat 3 sesudah benar: Kartu Kilat (situasi serupa) */
      if (s.bantuan >= 3 && GAMBAR[s.id + '-kilat-' + h.id]) return kartuKilat(h);
    }).then(function () {
      if (!hidup(s)) return;
      s.selesai[h.id] = true;
      if (!Save.data.hook) { Save.data.hook = true; Save.save(); }
      taraPose('diam');
      if (momen) return ulangAkhir().then(function () { if (hidup(s)) return tempatAman(); });
      if (bahayaBabak().every(function (b) { return s.selesai[b.id]; })) return sesudahBahaya();
      s.fase = 'cari'; s.diam = 0; s.isyarat = 0;
    });
  }

  function terbangSisik(h, jenis) {
    var s = S, terisi = s.T.slot.filter(function (k) { return k !== 'momen' && Save.data.sisik[s.id + '-' + k]; }).length;
    var nSlot = s.T.momen ? 6 : s.T.slot.length, geser = (6 - nSlot) * 24;
    var slot = h.id === 'momen' ? 5 : Math.min(s.T.momen ? 4 : nSlot - 1, terisi);
    var a = h.area || [600, 300, 100, 100];
    var x0 = h.id === 'momen' ? 680 : a[0] + a[2] / 2, y0 = h.id === 'momen' ? 320 : a[1] + a[3] / 3, x1 = 414 + 20 + geser + slot * 48 + 19, y1 = 8 + 14 + 22;
    var el = U.h('div', 'sisik-terbang');
    el.style.cssText = 'position:absolute;left:0;top:0;z-index:33;pointer-events:none';
    el.innerHTML = Seni.svg(56, 64, Seni.sisikIkon(jenis, 56));
    s.root.appendChild(el);
    Aud.sfx('sisik', jumlahSisik());
    UI.ledak(x0, y0, 10, 'sisik');
    return Tween.run(UI.kurangi ? 10 : 760, function (e) {
      var x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.sin(e * Math.PI) * 160;
      el.style.transform = 'translate(' + (x - 28) + 'px,' + (y - 32) + 'px) scale(' + (1.4 - 0.7 * e) + ')';
    }, Ease.easeInOutCubic).then(function () {
      el.remove();
      if (!hidup(s)) return;
      var lama = jumlahSisik();
      Save.beriSisik(s.id + '-' + h.id, jenis);
      papanSisik();
      Aud.sfx('sisik', lama + 1);
      UI.hitungNaik(s.nilaiSisik, lama, jumlahSisik(), function (v) { return v + '/' + totalSisik(); }, 400);
      taraPose('sorak');
    });
  }

  /* ===== Kartu Kilat: satu situasi serupa, jawab Aman (jempol) atau Tahan (telapak) ===== */
  /* soal yang salah muncul lagi di akhir tempat (CLAUDE.md bagian 5): paling banyak 2 Kartu Kilat untuk situasi yang belum
     benar pada coba pertama dan belum mendapat Kartu Kilat */
  function ulangAkhir() {
    var s = S, daftar = s.perluUlang.filter(function (h) { return GAMBAR[s.id + '-kilat-' + h.id]; }).slice(0, 2);
    if (!daftar.length) return Promise.resolve();
    var p = ucap(STR.tara.ulangAkhir);
    daftar.forEach(function (h) { p = p.then(function () { if (!hidup(s)) return; s.h = h; return kartuKilat(h); }); });
    return p;
  }

  function kartuKilat(h) {
    var s = S, K = STR.kilat, jawab = h.kilat, alasan = (s.X.alasan || {})[h.id];
    s.fase = 'kilat';
    UI.sembunyiTangan(true);
    s.tirai.style.opacity = 1;
    var d = U.h('div', 'kilat');
    d.style.cssText = 'position:absolute;left:0;top:0;width:1280px;height:720px;z-index:26';
    var kartu = '<div class="kartu" style="left:488px;top:110px;width:304px;height:316px;cursor:default"><div class="gambar">' + Seni.svg(296, 204, GAMBAR[s.id + '-kilat-' + h.id]()) +
      '</div><p class="teks" data-cek="kilat" style="font-size:25px">' + UI.teksKartu(s.X.kilat[h.id]) + '</p></div>';
    d.innerHTML = kartu;
    s.root.appendChild(d);
    UI.pasKartu(d.querySelector('.teks'));
    var selesai, janji = new Promise(function (ok) { selesai = ok; }), salahK = 0, tb = {};
    function tombol(jenis, x, warna, ikon) {
      var b = Input.button(UI.ikon(ikon, 50) + UI.esc(K[jenis]), warna, function () {
        if (s.fase !== 'kilat') return;
        potong();
        if (jenis === jawab) {
          s.fase = 'kilatSelesai'; UI.sembunyiTangan(true);
          Save.catat(['kenali-bahaya'], salahK === 0, salahK ? 2 : 0); Save.save();
          Aud.sfx('good'); UI.ledak(x + 120, 560, 10); taraPose('sorak');
          ucap([jenis === 'aman' ? K.benarAman : K.benarTahan, alasan]).then(function () { d.remove(); s.tirai.style.opacity = 0; if (hidup(s)) taraPose('diam'); selesai(); });
        } else {
          /* hanya dua tombol: salah ke-2 langsung ditunjukkan jawabannya */
          salahK++; Aud.sfx('bad'); UI.goyang(b); taraPose('geleng'); ucap([STR.tara.lihatLagi, alasan]);
          if (salahK >= 2) UI.tunjuk(tb[jawab], { sumber: 'petunjuk', fy: 0.5 });
        }
      }, { x: x, y: 450, w: 240, h: 100, font: 34, id: 'kilat-' + jenis });
      tb[jenis] = b;
      d.appendChild(b);
    }
    tombol('aman', 380, 'hijau', 'jempol');
    tombol('tahan', 660, 'koral', 'telapak');
    UI.idle.atur(function () { return hidup(s) && s.fase === 'kilat' ? [tb.aman, tb.tahan] : null; },
      { ucap: function () { if (hidup(s) && s.fase === 'kilat') ucap([s.X.kilat[h.id], K.tanya]); }, tangan: tombolDengar });
    ucap([s.X.kilat[h.id], K.tanya]);
    return janji;
  }

  /* ===== Momen Tahan (GDD 6.4) ===== */
  function momenTahan() {
    var s = S, M = s.T.momen, AM = s.A.momen;
    s.fase = 'momenSiap';
    AM.siapkan(s.ctx);
    /* sorot ke teman: tirai dengan lubang terang */
    var c = AM.sorot, mask = 'radial-gradient(circle at ' + c[0] + 'px ' + c[1] + 'px, transparent ' + c[2] + 'px, #000 ' + (c[2] + 60) + 'px)';
    s.tirai.style.webkitMaskImage = s.tirai.style.maskImage = mask;
    Tween.run(300, function (e) { s.tirai.style.opacity = e * 0.85; }, Ease.easeOutQuad);
    taraPose('tunjuk');
    return ucap([s.X.momen.siap, STR.tara.momenSiap]).then(function () {
      if (!hidup(s)) return;
      /* tombol TAHAN! naik dan berdenyut; gerak lambat dimulai */
      var b = s.tombolTahan;
      b.style.display = '';
      UI.muncul(b, 380).then(function () { if (hidup(s)) b.classList.add('denyut-tahan'); });
      b.focus({ preventScroll: true });
      Aud.musik('tahan'); Aud.lambat(true);
      s.mT = 0; s.mD = santai() ? M.gerakSantai : M.gerak; s.mBeku = s.mD - (santai() ? M.bekuSantai : M.beku); s.mTik = 0;
      s.fase = 'momen';
      taraPose('diam');
      ucap(STR.tara.tekanTahan);
    });
  }
  function momenLangkah(dt) {
    var s = S;
    if (s.fase !== 'momen') {
      if (s.fase === 'momenTunggu') {
        s.mTunggu += dt;
        if (s.mTunggu > 4 && !s.mTangan) { s.mTangan = true; UI.tunjuk({ x: 984, y: 520 }, { sumber: 'petunjuk' }); }
        if (s.mTunggu > 6) tahan(false);
      }
      return;
    }
    s.mT += dt; s.mTik += dt;
    if (s.mTik > 0.5) { s.mTik = 0; s.mTikK = !s.mTikK; Aud.sfx('tiktok', s.mTikK); }
    s.A.momen.gerak(s.ctx, Math.min(1, s.mT / s.mD));
    if (s.mT >= s.mBeku) {
      /* tidak ditekan: adegan membeku sendiri, teman masih di tempat aman */
      s.fase = 'momenTunggu'; s.mTunggu = 0; s.mTangan = false;
      Aud.lambat(false);
      ucap(STR.tara.hampir);
    }
  }
  function tahan(olehMurid) {
    var s = S;
    if (!s || (s.fase !== 'momen' && s.fase !== 'momenTunggu')) return;
    var tepat = s.fase === 'momen' || (santai() && olehMurid);
    s.fase = 'momenBeku';
    potong(); UI.sembunyiTangan(true);
    Aud.sfx('tahan'); Aud.lambat(false); Aud.musik(s.T.musik);
    var b = s.tombolTahan;
    b.classList.remove('denyut-tahan');
    s.tahanTepat = tepat;
    Save.data.momen[s.id] = tepat ? 'tepat' : 'bantu';
    Save.catat(['berhenti-pikir'], tepat, tepat ? 0 : 2);
    Save.save();
    Tween.run(260, function (e) { b.style.opacity = 1 - e; b.style.scale = (1 + e * 0.2).toFixed(3); }, Ease.easeOutQuad).then(function () { b.style.display = 'none'; b.style.opacity = 1; b.style.scale = ''; });
    s.tirai.style.webkitMaskImage = s.tirai.style.maskImage = '';
    s.tirai.style.opacity = 1;
    s.beku = true;
    var p = tepat ? ucap(STR.tara.tahanBagus) : Promise.resolve();
    return p.then(function () { if (hidup(s)) return ritme(s.T.momen, { sudahBerhenti: true }); });
  }

  /* ===== Tempat Aman ===== */
  function tempatAman() {
    var s = S, X = s.X, A = STR.aman;
    s.fase = 'selesai';
    s.A.tempatAman(s.ctx);
    var bintang = Aturan.bintang(s.benarAwal, !!s.tahanTepat, s.T.bahaya.length, !!s.T.momen), ket = s.T.momen ? A.bintangKet : A.bintangKetTanpaMomen;
    var n = bintang.filter(Boolean).length;
    Save.catatTempat(s.id, { selesai: true, bintang: n, detik: Math.round((performance.now() - s.mulai) / 1000) });
    Aud.jingle('aman', 'aman');
    taraPose('sorak');
    var papan = U.h('div', 'papan-hasil');
    papan.style.cssText = 'left:340px;top:112px;width:600px';
    papan.innerHTML = '<div class="judul-hasil" data-cek="judul aman">' + UI.esc(U.fmt(A.judul, { nama: X.nama })) + '</div>' +
      '<div class="bintang-hasil">' + bintang.map(function (b, i) {
        return '<div class="satu" style="opacity:0">' + Seni.svg(96, 96, Seni.ikon('bintang', 96).replace(/fill="#FFC83D"/, b ? 'fill="#FFC83D"' : 'fill="#DCD4EE"')) + '<span class="ket" data-cek="bintang ' + i + '">' + UI.esc(ket[i]) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="hadiah-baru" style="opacity:0">' + (ASET.gambar[s.T.hadiah] ? '<img src="' + ASET.gambar[s.T.hadiah] + '" alt="">' : '') + '<div><b>' + UI.esc(A.hadiah) + '</b><br><span>' + UI.esc(X.hadiah) + '</span></div></div>';
    s.root.appendChild(papan);
    /* nama tempat yang panjang: judul diperkecil sampai muat satu baris (min. 32 px) */
    var jd = papan.querySelector('.judul-hasil'), uk = 46;
    while (jd.scrollWidth > papan.clientWidth - 60 && uk > 32) { uk -= 2; jd.style.fontSize = uk + 'px'; }
    UI.muncul(papan, 360);
    var baris = U.h('div', 'baris-tombol');
    baris.style.cssText = 'position:absolute;left:0;right:0;top:506px;z-index:41;display:none';
    var lanjut = Input.button(UI.esc(STR.tombol.lanjut), 'kuning alir', function () { Scenes.go('peta', { dari: s.id }); }, { w: 260, h: 96, font: 34, id: 'lanjut' });
    var ulangi = Input.button(UI.esc(STR.tombol.ulangi), 'krem alir', function () { Scenes.go('tempat', { id: s.id }); }, { w: 240, h: 96, font: 28, id: 'ulangi' });
    baris.appendChild(lanjut); baris.appendChild(ulangi);
    s.root.appendChild(baris);
    var bintangEl = papan.querySelectorAll('.bintang-hasil .satu');
    var p = ucap(U.fmt(A.judul, { nama: X.nama }));
    bintangEl.forEach(function (el, i) {
      p = p.then(function () { if (!hidup(s)) return; Aud.sfx('star', i + (bintang[i] ? 2 : 0)); return UI.muncul(el, 320); });
    });
    return p.then(function () {
      if (!hidup(s)) return;
      return ucap(U.fmt(A.bintang, { n: n }));
    }).then(function () {
      if (!hidup(s)) return;
      var hd = papan.querySelector('.hadiah-baru');
      Aud.jingle('hadiah', 'aman');
      UI.muncul(hd, 420);
      taraPose('sorak');
      return ucap([A.hadiah, X.hadiah]);
    }).then(function () {
      if (!hidup(s)) return;
      baris.style.display = 'flex';
      UI.muncul(baris, 300);
      lanjut.focus({ preventScroll: true });
      UI.idle.atur(function () { return lanjut; });
    });
  }

  /* ===== layar ===== */
  function onKey(e) {
    if (!S || document.querySelector('.overlay')) return;
    /* angka 1-3 memilih kartu bernomor saat PIKIR */
    if (S.fase === 'pikir' && /^[1-3]$/.test(e.key) && S.kartu[+e.key - 1]) { e.preventDefault(); S.kartu[+e.key - 1].el.click(); return; }
    if ((e.key === ' ' || e.key === 'Enter') && (S.fase === 'momen' || S.fase === 'momenTunggu')) { e.preventDefault(); tahan(true); }
  }

  Scenes.add('tempat', {
    enter: function (root, p) {
      var id = p.id || 't1', T = TEMPAT[id], X = STR.tempat[id], A = ADEGAN[id];
      S = { hidup: true, id: id, T: T, X: X, A: A, root: root, fase: 'masuk', babak: 0, selesai: {}, teladan: {}, isyarat: 0, isyaratPada: {}, diam: 0,
        beku: false, kartuN: T.kartu, adaptif: new Adaptif(2, 3, T.kartu), benarAwal: 0, salahPilih: [], perluUlang: [], mulai: performance.now(), dengar: [], gen: 0 };
      Aud.musik(T.musik);
      /* dunia: latar, ambient, aktor (bagian yang disalin ke Kaca Pembesar) */
      var dunia = U.h('div', 'lapis dunia');
      var latar = U.h('img', 'latar'); latar.src = ASET.gambar[T.babak ? T.babak[0].latar : T.latar] || ''; latar.alt = '';
      S.latar = latar;
      dunia.appendChild(latar);
      var amb = U.h('div', 'lapis tembus');
      var Sn = Seni, C = Sn.C;
      amb.innerHTML = Sn.svg(1280, 720, Sn.g('', Sn.awan(1180, 64, 0.55) + Sn.awan(700, 48, 0.42) + Sn.awan(1600, 70, 0.5), ' class="awan-gerak"') +
        Sn.g('', Sn.burung(690, 108, 0.7) + Sn.burung(716, 98, 0.55), ' class="burung"') + Sn.g('', Sn.burung(1010, 130, 0.6), ' class="burung" style="animation-delay:-2s"') +
        Sn.g('', Sn.kupu(824, 470, C.kuning), ' class="ketuk"') + Sn.g('', Sn.kupu(1100, 330, C.koralMuda), ' class="ketuk" style="animation-delay:-.5s"'));
      dunia.appendChild(amb);
      var adegan = U.h('div', 'adegan');
      dunia.appendChild(adegan);
      root.appendChild(dunia);
      S.dunia = dunia;
      S.lapisTanda = U.h('div', 'lapis tembus'); root.appendChild(S.lapisTanda);
      /* ctx: yang boleh dipakai naskah tempat (ADEGAN) dan permainan sela (SELA) */
      S.ctx = { lapis: adegan, X: X, id: id, root: root, ucap: function (t, tk) { return ucap(t, tk); },
        tara: function (pose) { taraPose(pose); }, balon: function () { return S.balon; }, hidup: function () { return hidup(S); },
        papan: function (tampil) { S.papan.style.display = tampil ? '' : 'none'; },
        gerak: function () { return window.SELA && SELA.gerak ? SELA.gerak(S.ctx) : Promise.resolve(); } };
      A.siapkan(S.ctx, 0);

      /* kotak ketuk (tombol transparan, bisa Tab dan Enter) untuk babak ini */
      S.areaLapis = U.h('div', 'lapis');
      S.areaLapis.style.zIndex = 12; S.areaLapis.style.pointerEvents = 'none';
      root.appendChild(S.areaLapis);
      bangunArea();
      S.efek = U.h('div', 'lapis-efek'); root.appendChild(S.efek);
      S.tirai = U.h('div', 'tirai'); root.appendChild(S.tirai);
      /* Kaca Pembesar */
      var lensa = U.h('div', 'lensa');
      lensa.innerHTML = '<div class="kaca"><div class="isi-lensa"></div></div><div class="bingkai-lensa">' + Sn.svg(416, 416, Sn.g('translate(208,208)',
        Sn.g('rotate(135)', Sn.kotak(176, -17, 72, 34, 17, C.coklat, 4) + Sn.kotak(190, -11, 40, 8, 4, C.sisikKilau)) +
        Sn.lingkar(0, 0, 182, 'none', 20, C.terong) + Sn.lingkar(0, 0, 182, 'none', 12, C.kuning) + Sn.path('M-140,-70 A156,156 0 0 1 -60,-146', 'none', 9, C.putih, ' opacity=".75"'))) + '</div>';
      lensa.style.display = 'none';
      root.appendChild(lensa);
      S.lensa = lensa;
      S.kartuLapis = U.h('div', 'lapis-kartu'); root.appendChild(S.kartuLapis);

      /* Tara (di atas tirai) dan balon */
      var lapisTara = U.h('div', 'adegan tembus'); lapisTara.style.zIndex = 26;
      root.appendChild(lapisTara);
      S.tara = new Aktor(lapisTara, { x: 112, y: 704, s: 0.8, g: gTara('diam') });
      S.taraPose = 'diam';
      S.balon = UI.balon(root, { x: 252, y: 628 });
      S.balon.sembunyi();

      /* HUD */
      root.appendChild(UI.tombolIkon('peta', STR.ikon.peta, function () {
        UI.konfirmasi(STR.keluar.judul, STR.keluar.isi, function () { Scenes.go('peta', { dari: id }); });
      }, { x: 14, y: 10, id: 'peta', warna: 'krem', ukuran: 54 }));
      root.appendChild(UI.tombolIkon('suara', STR.ikon.dengar, function () {
        potong();
        if (S.fase === 'pikir' && S.kartu) bacaKartu();
        else ucap(S.dengar && S.dengar.length ? S.dengar : [S.balon.teks]);
      }, { x: 1062, y: 10, id: 'dengar' }));
      root.appendChild(UI.tombolIkon('gerigi', STR.ikon.pengaturan, function () { UI.pengaturan(); }, { x: 1170, y: 10, id: 'pengaturan' }));
      S.papan = U.h('div', 'papan'); root.appendChild(S.papan);
      papanSisik();
      S.ritme = bangunRitme(); root.appendChild(S.ritme);

      /* tombol TAHAN! */
      var tb = U.h('button', 'tombol-tahan');
      tb.type = 'button'; tb.dataset.id = 'tahan'; tb.setAttribute('aria-label', STR.tombol.tahan);
      tb.style.cssText = 'left:900px;top:420px;display:none';
      tb.innerHTML = Sn.svg(168, 168, Sn.lingkar(84, 84, 76, C.koral, 5) + Sn.lingkar(84, 84, 80, 'none', 8, C.kuning) + Sn.lingkar(84, 84, 84, 'none', 4, C.terong) +
        Sn.g('translate(34,32) scale(1)', Sn.telapak(C.putih, 3.5))) + '<span class="label-tahan" data-cek="tahan">' + UI.esc(STR.tombol.tahan) + '</span>';
      tb.addEventListener('pointerdown', function () { Aud.init(); });
      tb.addEventListener('click', function () { tahan(true); });
      root.appendChild(tb);
      S.tombolTahan = tb;

      document.addEventListener('keydown', onKey);
      document.addEventListener('pointerdown', resetDiamGlobal, true);
      root.addEventListener('pointerdown', ketukMeleset);
      masuk();
    },
    update: function (dt) {
      /* panel Pengaturan atau konfirmasi terbuka: dunia, isyarat, dan gerak lambat Momen ikut berhenti */
      if (!S || !S.hidup || Tween.paused) return;
      var gerak = !UI.kurangi;
      if (!S.beku && S.ctx.aktor) {
        for (var k in S.ctx.aktor) {
          var a = S.ctx.aktor[k];
          if (gerak || !a.putar) a.jalankan(dt);
        }
      }
      /* Tara bernapas dan berkedip */
      var t = S.tara;
      t.tNapas = (t.tNapas || 0) + dt;
      if (gerak) { t.sy = 1 + Math.sin(t.tNapas * 2.4) * 0.012; t.sx = 1 - Math.sin(t.tNapas * 2.4) * 0.006; }
      /* berkedip: gambar hanya diganti saat keadaan kedip berubah (kunci gambar tidak dihitung tiap frame) */
      var kedip = t.tNapas % 4.2 > 4.05;
      if ((S.taraPose === 'diam' || S.taraPose === 'senang') && kedip !== S.kedipLalu) { S.kedipLalu = kedip; t.pakai(gTara(S.taraPose, kedip)); }
      t.atur();
      if (S.fase === 'cari') isyaratDiam(dt);
      momenLangkah(dt);
    },
    exit: function () {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', resetDiamGlobal, true);
      if (S && S.root) S.root.removeEventListener('pointerdown', ketukMeleset);
      Aud.lambat(false);
      if (S) S.hidup = false;
      S = null;
    },
    uji: {
      keadaan: function () {
        if (!S) return { langkah: '', siap: false };
        var siap = ['cari', 'pikir', 'momen', 'momenTunggu', 'kilat', 'selesai'].indexOf(S.fase) >= 0;
        /* permainan sela (Ayo Menyeberang, Gerak Siaga) memasang ctx.uji selama berjalan */
        if (S.ctx.uji) return { langkah: S.ctx.uji.nama, siap: S.ctx.uji.siap(), tempat: S.id, babak: S.babak, selesai: Object.keys(S.selesai), sisik: Save.jumlahSisik() };
        if (S.fase === 'pikir') siap = S.kartu && S.kartu.every(function (c) { return c.el.style.opacity === '1' || c.el.disabled; });
        if (S.fase === 'selesai') siap = !!document.querySelector('[data-id="lanjut"]') && document.querySelector('.baris-tombol').style.display !== 'none';
        return { langkah: S.fase, siap: siap, tempat: S.id, babak: S.babak, selesai: Object.keys(S.selesai), sisik: Save.jumlahSisik(), kartu: S.kartu ? S.kartu.length : 0, bantuan: S.bantuan, tahanTepat: !!S.tahanTepat };
      },
      benar: function () {
        if (!S) return [];
        if (S.ctx.uji) return S.ctx.uji.benar();
        if (S.fase === 'cari') { var h = bahayaBabak().filter(function (b) { return !S.selesai[b.id]; })[0]; return h ? ['area-' + h.id] : []; }
        if (S.fase === 'pikir') return S.kartu.filter(function (c) { return c.k.benar; }).map(function (c) { return 'kartu-' + c.k.k; });
        if (S.fase === 'momen' || S.fase === 'momenTunggu') return ['tahan'];
        if (S.fase === 'kilat') return ['kilat-' + S.h.kilat];
        if (S.fase === 'selesai') return ['lanjut'];
        return [];
      },
      salah: function () {
        if (!S) return [];
        if (S.fase === 'pikir') return S.kartu.filter(function (c) { return !c.k.benar && !c.el.disabled; }).map(function (c) { return 'kartu-' + c.k.k; });
        if (S.fase === 'kilat') return ['kilat-' + (S.h.kilat === 'aman' ? 'tahan' : 'aman')];
        if (S.ctx.uji) return S.ctx.uji.salah ? S.ctx.uji.salah() : [];
        if (S.fase === 'cari') return teladanBabak().map(function (t) { return 'area-' + t.id; });
        return [];
      }
    }
  });
  /* ketukan di luar tombol saat mencari (dipasang di #scene-root, dilepas di exit) */
  function ketukMeleset(e) {
    if (!S || S.fase !== 'cari' || (e.target.closest && e.target.closest('button, .overlay'))) return;
    var p = Stage.toLocal(e.clientX, e.clientY);
    meleset(p.x, p.y);
  }
  /* hanya ketukan pada tombol yang mengulang hitungan diam; ketukan meleset tidak menunda isyarat */
  function resetDiamGlobal(e) { if (S && S.fase === 'cari' && e.target.closest && e.target.closest('button')) S.diam = 0; }
})();
