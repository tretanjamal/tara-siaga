/* Benda adegan T2-T4 dan kartu transfer Pawai (gaya sama dengan seni.js: garis Terong, isi rata, satu bayangan).
   Menambah fungsi ke objek Seni. Titik asal benda berdiri = tengah bawah di tanah. */
(function (root) {
  'use strict';
  var S = root.Seni, C = S.C, g = S.g, path = S.path, lingkar = S.lingkar, elips = S.elips, kotak = S.kotak, f = S.f, T = C.terong;
  function roda(x, y, r) {
    return lingkar(x, y, r, '#4A3D5C', 4) + lingkar(x, y, r * 0.55, C.lavenderMuda, 2.6) + lingkar(x, y, r * 0.18, T);
  }
  /* motor tampak samping menghadap kiri: knalpot di sisi kanan (menghadap kamera). o: warna, panas (knalpot panas), menyala (asap kecil) */
  S.motor = function (o) {
    o = o || {};
    var w = o.warna || C.koral, out = S.bayangTanah(84, 10, 0, 0);
    out += roda(52, -24, 24) + roda(-52, -24, 24);
    /* knalpot */
    out += path('M6,-38 L76,-34 L78,-24 L8,-28 Z', '#C9CDD9', 3.2) + kotak(70, -38, 14, 16, 4, '#8C8FA8', 3);
    if (o.panas) out += path('M24,-48 q5,-8 0,-16 q-5,-8 0,-16 M44,-46 q5,-8 0,-16 q-5,-8 0,-16 M64,-44 q5,-8 0,-16 q-5,-8 0,-16', 'none', 3.4, C.koral, ' opacity=".9"') +
      path('M10,-36 L74,-32', 'none', 4, C.koral, ' opacity=".55"');
    if (o.menyala) out += lingkar(92, -34, 7, 'rgba(220,214,235,.8)', 0) + lingkar(104, -40, 9, 'rgba(220,214,235,.6)', 0);
    /* badan, jok, setang, lampu */
    out += path('M-44,-48 C-40,-74 -10,-80 20,-76 C40,-74 56,-66 62,-50 L60,-40 L-40,-40 Z', w, 3.6) +
      path('M-2,-82 C10,-90 46,-88 58,-78 L56,-70 L-4,-72 Z', '#4A3D5C', 3.2) +
      S.garisTebal('M-52,-24 L-42,-92', '#8C8FA8', 4) + S.garisTebal('M-50,-96 L-34,-96', T, 3) +
      lingkar(-50, -82, 8, C.kuningMuda, 3) + path('M-30,-44 L20,-44', 'none', 3, 'rgba(255,255,255,.5)') + path('M-14,-30 L14,-30', 'none', 6, T);
    return out;
  };
  /* angkot tampak samping. o.arah -1 = menghadap kiri */
  S.angkot = function (o) {
    o = o || {};
    var out = S.bayangTanah(126, 12, 0, 0) + roda(-80, -24, 24) + roda(80, -24, 24);
    out += path('M-128,-30 L-128,-112 C-128,-122 -120,-128 -110,-128 L96,-128 C112,-128 124,-118 130,-100 L132,-30 Z', C.hijau, 4) +
      kotak(-114, -116, 52, 40, 8, C.langitMuda, 3) + kotak(-54, -116, 52, 40, 8, C.langitMuda, 3) + kotak(6, -116, 52, 40, 8, C.langitMuda, 3) +
      path('M70,-116 L104,-116 C114,-116 120,-108 122,-96 L122,-76 L70,-76 Z', C.langitMuda, 3) +
      path('M-128,-62 L132,-62', 'none', 8, C.kuning) + lingkar(124, -48, 7, C.kuningMuda, 2.6);
    return g(o.arah === -1 ? 'scale(-1,1)' : '', out);
  };
  S.ayam = function () {
    return S.bayangTanah(24, 5, 0, 0) + S.garisTebal('M-6,-14 L-8,0 M6,-14 L6,0', C.kuningTua, 2.4) +
      path('M-26,-40 C-34,-58 -20,-60 -14,-46 C-6,-62 26,-60 28,-34 C30,-18 12,-12 -4,-14 C-20,-16 -28,-26 -26,-40 Z', C.krem, 3.2) +
      path('M14,-50 C16,-62 24,-66 30,-58 C34,-52 30,-44 24,-42', C.krem, 3.2) + path('M20,-66 q4,-8 8,-2 q4,-6 6,2', C.koral, 2.4) +
      path('M32,-56 L40,-53 L32,-50 Z', C.kuning, 2.2) + lingkar(26, -57, 2, T) + path('M30,-48 q3,6 -2,8', C.koral, 2) + path('M-8,-36 q8,8 18,0', 'none', 2.6, C.krem2 || '#E8D9BC');
  };
  /* panci di atas kompor; gagang ke kiri (x negatif). aman = gagang diputar ke belakang kompor */
  S.panci = function (aman) {
    return (aman ? S.garisTebal('M-26,-32 L-40,-54', C.coklatTua, 5) : '') +
      path('M-28,-40 L28,-40 L24,0 L-24,0 Z', '#B9B2CF', 3.4) + path('M-30,-44 L30,-44', 'none', 7, T) + path('M-30,-44 L30,-44', 'none', 3.6, '#D9DCE8') +
      path('M-6,-50 L6,-50', 'none', 7, T) + (aman ? '' : S.garisTebal('M-28,-24 L-58,-20', C.coklatTua, 5)) + path('M-20,-24 L18,-24', 'none', 3, 'rgba(255,255,255,.55)');
  };
  /* bangku kecil (asal = tengah bawah), tinggi sekitar 50 */
  S.bangku = function () {
    return S.garisTebal('M-16,0 L-12,-44 M16,0 L12,-44', C.coklat, 5) + kotak(-22, -52, 44, 10, 4, C.coklat, 3.2) + path('M-14,-20 L14,-20', 'none', 4, C.coklatTua);
  };
  S.uap = function () {
    return path('M-14,0 q-8,-12 0,-22 q8,-10 0,-22 M4,-4 q-8,-12 0,-22 q8,-10 0,-24 M20,0 q-8,-12 0,-22 q8,-10 0,-20', 'none', 5, 'rgba(255,255,255,.9)');
  };
  S.genangan = function (w) {
    w = w || 60;
    return elips(0, 0, w, w * 0.2, 'rgba(163,222,245,.85)', 2.6, C.langitTua) + path('M' + f(-w * 0.5) + ',-2 q' + f(w * 0.2) + ',-5 ' + f(w * 0.4) + ',-3', 'none', 3, C.putih);
  };
  /* kursi kayu tampak samping (asal = tengah bawah) */
  S.kursi = function () {
    return S.garisTebal('M-16,0 L-16,-40 M16,0 L16,-40 M16,-40 L18,-84', C.coklat, 5) + kotak(-22, -46, 44, 9, 3, C.coklat, 3.2) + path('M16,-70 L18,-58', 'none', 4, C.coklatTua);
  };
  S.kursiTumpuk = function () { return S.kursi() + g('translate(2,-50)', S.kursi()); };
  S.toples = function () {
    return path('M-16,-28 L16,-28 C20,-28 22,-24 22,-18 L22,-4 C22,0 18,2 14,2 L-14,2 C-18,2 -22,0 -22,-4 L-22,-18 C-22,-24 -20,-28 -16,-28 Z', 'rgba(221,242,251,.85)', 3) +
      kotak(-14, -36, 28, 8, 3, C.koral, 2.6) + lingkar(-8, -10, 6, C.kuning, 2) + lingkar(7, -8, 6, C.kuning, 2) + lingkar(0, -18, 5.5, C.kuningTua, 2);
  };
  /* layang-layang tersangkut di kabel: badan miring, tali kusut menjuntai ke (dx, dy) */
  S.layangTersangkut = function (dx, dy) {
    return S.layang(0, 0, 0.7, C.koral, C.kuning, 38) +
      path('M4,26 C-10,60 20,90 4,130 L' + f(dx) + ',' + f(dy), 'none', 2.6, C.lavenderTua) + path('M-20,-6 q6,8 14,2 q8,-6 14,4', 'none', 2.4, C.lavenderTua);
  };
  /* ---------- kartu transfer Pawai ---------- */
  S.korek = function () {
    return kotak(-26, -16, 52, 32, 5, C.koral, 3) + kotak(-26, -8, 52, 8, 2, C.kuning, 2) + S.garisTebal('M30,-30 L54,-58', C.krem, 4) +
      lingkar(56, -61, 6, C.koralTua, 2.4) + path('M56,-70 q-8,-10 0,-22 q8,10 0,22 Z', C.kuning, 2.4);
  };
  S.sumur = function () {
    return elips(0, -40, 60, 16, '#4A3D5C', 3.6) + path('M-60,-40 L-60,0 L60,0 L60,-40', '#C9C2B4', 3.6) + path('M-60,-22 H60 M-30,-40 V0 M30,-40 V0', 'none', 2.4, '#A39B8C') +
      elips(0, -40, 44, 10, '#2F2742', 0);
  };
  S.sepeda = function (warna) {
    return roda(-38, -24, 24) + roda(38, -24, 24) + S.garisTebal('M-38,-24 L-8,-60 L28,-60 L38,-24 M-8,-60 L4,-24 L28,-60 M4,-24 L-38,-24 M28,-60 L24,-74 M-8,-60 L-12,-70', warna || C.hijau, 4) +
      kotak(-20, -74, 20, 6, 3, T, 0) + path('M18,-76 L32,-76', 'none', 5, T);
  };
  S.mobil = function () {
    return S.bayangTanah(100, 10, 0, 0) + roda(-62, -24, 22) + roda(62, -24, 22) +
      path('M-104,-30 L-104,-66 C-104,-74 -98,-78 -90,-80 L-60,-82 L-38,-116 L44,-116 L72,-82 L96,-78 C104,-76 108,-70 108,-62 L108,-30 Z', C.langitTua, 4) +
      path('M-32,-108 L-2,-108 L-2,-84 L-50,-84 Z M6,-108 L40,-108 L60,-84 L6,-84 Z', C.langitMuda, 3);
  };
  /* ---------- T5 Hari Hujan ---------- */
  /* tiang listrik (asal = kaki tiang): satu kabel masih terpasang ke kanan, satu kabel putus menjuntai ke kiri bawah
     sampai (ujungX, ujungY) relatif terhadap kaki tiang. Percikan kecil kuning sebagai tanda bahaya, tanpa api. */
  S.tiangRoboh = function (ujungX, ujungY, tinggi) {
    var h = tinggi || 330, ux = ujungX == null ? -70 : ujungX, uy = ujungY == null ? 10 : ujungY;
    return S.bayangTanah(18, 5, 0, 0) + S.garisTebal('M0,0 V' + (-h), '#8A6A50', 9) + S.garisTebal('M-36,' + (-h + 20) + ' H36', '#8A6A50', 6) +
      kotak(-40, -h + 10, 8, 12, 3, C.putih, 2.4) + kotak(32, -h + 10, 8, 12, 3, C.putih, 2.4) +
      path('M36,' + (-h + 16) + ' Q70,' + (-h + 34) + ' 110,' + (-h + 22), 'none', 3.4, '#2F2742') +
      path('M-36,' + (-h + 16) + ' C-60,' + (-h + 120) + ' ' + f(ux + 10) + ',' + f(uy - 120) + ' ' + f(ux) + ',' + f(uy), 'none', 3.6, '#2F2742') +
      path('M' + f(ux - 8) + ',' + f(uy - 14) + ' l5,-7 l-4,-2 l6,-8 M' + f(ux + 10) + ',' + f(uy - 12) + ' l6,-5 l-4,-3 l7,-6', 'none', 2.6, C.kuning);
  };
  /* kilat jauh di langit (asal = puncak) */
  S.petir = function () {
    return path('M2,0 L-14,44 L0,44 L-12,92 L22,34 L8,34 L20,0 Z', '#FFF3B0', 3, C.kuningTua);
  };
  /* pohon kecil untuk kartu (asal = pangkal batang) */
  S.pohon = function () {
    return S.bayangTanah(40, 7, 0, 0) + kotak(-9, -64, 18, 66, 6, C.coklat, 3.4) +
      lingkar(-26, -86, 28, '#6BBF59', 3.4) + lingkar(24, -88, 30, '#6BBF59', 3.4) + lingkar(0, -112, 34, '#7FCD68', 3.4);
  };
  /* depan rumah dengan pintu terbuka (asal = tengah bawah) */
  S.rumahDepan = function (lebar) {
    var w = lebar || 150;
    return kotak(-w / 2, -110, w, 110, 4, '#FFF1D6', 3.4) + path('M' + (-w / 2 - 14) + ',-106 L0,-160 L' + (w / 2 + 14) + ',-106 Z', C.koral, 3.4) +
      kotak(-24, -76, 48, 76, 4, '#FFD98A', 3.4) + path('M-24,-76 L-40,-70 L-40,4 L-24,0', C.coklat, 3) +
      kotak(w / 2 - 44, -86, 32, 30, 3, C.langitMuda, 3);
  };
  /* garis hujan untuk kartu */
  S.garisHujan = function (w, h) {
    var d = '';
    for (var y = 6, b = 0; y < h; y += 26, b++) for (var x = (b % 2) * 18; x < w; x += 36) d += 'M' + x + ',' + y + ' l-5,12 ';
    return path(d, 'none', 2.4, '#FFFFFF', ' opacity=".75" stroke-linecap="round"');
  };
  S.sepatuRoda = function () {
    return path('M-20,-34 L4,-34 L6,-14 L24,-12 C30,-12 30,-2 24,-2 L-22,-2 Z', C.koral, 3) + roda(-14, 4, 6) + roda(16, 4, 6);
  };
})(window);
