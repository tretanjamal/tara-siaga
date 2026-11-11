/* Sistem seni Tara Siaga: "Buku Bergambar Kampung" (docs/GDD.md bagian 12), dasar dari mockup Fase 0.
   Aturan dua lapis: latar (gambar AI) pucat tanpa garis gelap; aktor (Tara, tokoh, benda interaktif) bergaris Terong dan berwarna penuh.
   Semua fungsi mengembalikan potongan SVG (string). Titik asal tokoh = tengah telapak kaki di tanah.
   Aktor di adegan dirasterkan sekali menjadi gambar oleh js/engine/aktor.js; kartu dan ikon tetap SVG di dalam halaman. */
var Seni = (function () {
  'use strict';

  var C = {
    terong: '#3A2A4F', krem: '#FFF8EA', kuning: '#FFC83D', koral: '#FF6F5B', hijau: '#3DB57C', langit: '#A3DEF5', coklat: '#B07A4E', lavender: '#8E7CC3',
    kuningTua: '#D99A12', koralTua: '#D9493A', hijauTua: '#23855A', coklatTua: '#7E5233', langitTua: '#4E9CC4', lavenderTua: '#6A58A3',
    kuningMuda: '#FFE7A3', koralMuda: '#FFC9BE', hijauMuda: '#B5E6CC', langitMuda: '#DDF2FB', lavenderMuda: '#DCD4EE',
    kuningBayang: '#F0AE2A', sisikTepi: '#8A5A34', sisikKilau: '#E7C08F', sisikBayang: '#996641',
    kulitTara: '#F8DDB2', kulitTaraBayang: '#EBC48F', perutGaris: '#E0B582',
    emas: '#FFC83D', emasTepi: '#C98A0B', emasKilau: '#FFF3C4', perak: '#D9DCE8', perakTepi: '#8C8FA8', perakKilau: '#FFFFFF',
    rambut: '#3B2A33', putih: '#FFFFFF', bajuBayang: '#E6E1F2', merah: '#D9493A', merahBayang: '#B83A2F'
  };
  var T = C.terong;
  var nomor = 0;
  function uid(p) { return (p || 'i') + (++nomor); }
  function f(v) { return Math.round(v * 10) / 10; }
  function pt(p) { return f(p[0]) + ',' + f(p[1]); }

  function svg(w, h, isi, atr) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '"' + (atr || '') + '>' + isi + '</svg>';
  }
  function g(tr, isi, atr) { return '<g' + (tr ? ' transform="' + tr + '"' : '') + (atr || '') + '>' + isi + '</g>'; }
  function garis(sw, warna) { return sw ? ' stroke="' + (warna || T) + '" stroke-width="' + f(sw) + '" stroke-linejoin="round" stroke-linecap="round"' : ''; }
  /* SVG yang dirasterkan diurai sebagai XML ketat: atribut ganda membuat gambar gagal dimuat, jadi stroke-linecap dari atr menggantikan bawaan */
  function path(d, isi, sw, warna, atr) {
    var gs = garis(sw, warna);
    if (atr && atr.indexOf('stroke-linecap') >= 0) gs = gs.replace(' stroke-linecap="round"', '');
    return '<path d="' + d + '" fill="' + (isi || 'none') + '"' + gs + (atr || '') + '/>';
  }
  function lingkar(cx, cy, r, isi, sw, warna, atr) { return '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '" fill="' + (isi || 'none') + '"' + garis(sw, warna) + (atr || '') + '/>'; }
  function elips(cx, cy, rx, ry, isi, sw, warna, atr) { return '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="' + (isi || 'none') + '"' + garis(sw, warna) + (atr || '') + '/>'; }
  function kotak(x, y, w, h, r, isi, sw, warna, atr) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" rx="' + f(r) + '" fill="' + (isi || 'none') + '"' + garis(sw, warna) + (atr || '') + '/>'; }
  function polyline(pts) { return 'M' + pts.map(pt).join(' L'); }
  /* Anggota tubuh: garis tebal berujung bulat. Garis luar Terong dulu, isi di atasnya. */
  function tungkai(pts, lebar, isi, sw) {
    var d = polyline(pts);
    return path(d, 'none', lebar + sw * 2, T) + path(d, 'none', lebar, isi);
  }
  function bayangTanah(rx, ry, cx, cy) { return elips(cx || 0, cy || 0, rx, ry || rx * 0.16, C.lavender, 0, 0, ' opacity=".35"'); }

  /* ---------------- uji titik di dalam bentuk (untuk menyaring sisik) ---------------- */
  var ctxUji = null;
  function diDalam(d, x, y) {
    if (!ctxUji) ctxUji = document.createElement('canvas').getContext('2d');
    return ctxUji.isPointInPath(new Path2D(d), x, y);
  }

  /* ---------------- sisik trenggiling ---------------- */
  function bentukSisik(s) {
    var w = s * 0.56;
    return 'M' + f(-w) + ',0 C' + f(-w) + ',' + f(s * 0.62) + ' ' + f(-w * 0.45) + ',' + f(s) + ' 0,' + f(s) +
      ' C' + f(w * 0.45) + ',' + f(s) + ' ' + f(w) + ',' + f(s * 0.62) + ' ' + f(w) + ',0 Z';
  }
  function satuSisik(s, keadaan) {
    var isi = C.coklat, tepi = C.sisikTepi, kilau = C.sisikKilau;
    if (keadaan === 'emas') { isi = C.emas; tepi = C.emasTepi; kilau = C.emasKilau; }
    else if (keadaan === 'perak') { isi = C.perak; tepi = C.perakTepi; kilau = C.perakKilau; }
    else if (keadaan === 'bayang') { isi = C.sisikBayang; }
    var w = s * 0.56;
    return path(bentukSisik(s), isi, Math.max(1.2, s * 0.1), tepi) +
      path('M' + f(-w * 0.52) + ',' + f(s * 0.3) + ' Q' + f(-w * 0.48) + ',' + f(s * 0.68) + ' ' + f(-w * 0.08) + ',' + f(s * 0.8), 'none', Math.max(1, s * 0.09), kilau);
  }
  /* Medan sisik di dalam bentuk d. Kisi diputar sebesar rot (0 = ujung sisik ke bawah).
     Baris digambar dari bawah ke atas agar tepi bulat tiap sisik menutupi pangkal baris di bawahnya.
     opsi.slot(urut, x, y) mengembalikan keadaan sisik ('', 'emas', 'perak', 'bayang'). */
  function medanSisik(d, kotakB, s, rot, opsi) {
    opsi = opsi || {};
    var id = uid('ks');
    var cx = (kotakB[0] + kotakB[2]) / 2, cy = (kotakB[1] + kotakB[3]) / 2;
    var r = Math.hypot(kotakB[2] - kotakB[0], kotakB[3] - kotakB[1]) / 2 + s;
    var dy = s * 0.56, dx = s * 0.98, rad = rot * Math.PI / 180, cs = Math.cos(rad), sn = Math.sin(rad);
    var baris = [];
    var b = 0;
    for (var y = -r; y < r; y += dy, b++) {
      var isi = [];
      for (var x = -r + (b % 2 ? dx / 2 : 0); x < r; x += dx) {
        /* titik pusat sisik di bingkai asli */
        var tx = cx + x * cs - (y + s * 0.5) * sn, ty = cy + x * sn + (y + s * 0.5) * cs;
        var t2x = cx + x * cs - y * sn, t2y = cy + x * sn + y * cs;
        var t3x = cx + x * cs - (y + s) * sn, t3y = cy + x * sn + (y + s) * cs;
        if (!diDalam(d, tx, ty) && !diDalam(d, t2x, t2y) && !diDalam(d, t3x, t3y)) continue;
        isi.push({ x: x, y: y, ax: tx, ay: ty });
      }
      baris.push(isi);
    }
    var urut = 0, keluaran = '';
    /* nomori sisik dari atas ke bawah, kiri ke kanan (untuk slot), tetapi gambar dari bawah ke atas */
    baris.forEach(function (bb) { bb.forEach(function (sk) { sk.urut = urut++; sk.k = opsi.slot ? opsi.slot(sk.urut, sk.ax, sk.ay) : ''; }); });
    for (var i = baris.length - 1; i >= 0; i--) {
      baris[i].forEach(function (sk) {
        keluaran += g('translate(' + f(sk.x) + ',' + f(sk.y) + ')', satuSisik(s, sk.k));
      });
    }
    return '<clipPath id="' + id + '"><path d="' + d + '"/></clipPath>' +
      g('', g('translate(' + f(cx) + ',' + f(cy) + ') rotate(' + rot + ')', keluaran), ' clip-path="url(#' + id + ')"');
  }

  /* ---------------- ikon telapak (lencana Tim Siaga, tombol TAHAN!) ---------------- */
  /* Kotak 100x100, tengah (50,52). Bentuk disatukan: garis luar semua bagian dulu, lalu isi. */
  function telapak(isi, sw, warnaGaris) {
    var bagian = [
      ['r', 30, 16, 12, 44, 6], ['r', 44, 8, 12, 50, 6], ['r', 58, 11, 12, 46, 6], ['r', 72, 22, 11, 36, 5.5],
      ['t'], ['r', 28, 42, 55, 46, 20]
    ];
    function bentuk(b, isiB, swB) {
      if (b[0] === 't') return '<rect x="14" y="44" width="12" height="34" rx="6" transform="rotate(-38 20 61)" fill="' + isiB + '"' + garis(swB, warnaGaris) + '/>';
      return kotak(b[1], b[2], b[3], b[4], b[5], isiB, swB, warnaGaris);
    }
    var luar = sw ? bagian.map(function (b) { return bentuk(b, warnaGaris || T, sw * 2); }).join('') : '';
    return luar + bagian.map(function (b) { return bentuk(b, isi, 0); }).join('');
  }
  function lencana(cx, cy, r) {
    var k = r * 0.0148;
    return lingkar(cx, cy, r, C.koral, Math.max(2, r * 0.18)) + g('translate(' + f(cx - 52 * k) + ',' + f(cy - 50 * k) + ') scale(' + f(k) + ')', telapak(C.putih, 0));
  }

  /* ---------------- TARA ---------------- */
  var TARA = {
    badan: 'M-4,-104 C-32,-104 -48,-78 -48,-52 C-48,-26 -34,-12 -10,-12 L14,-12 C36,-12 46,-28 44,-54 C42,-82 24,-104 -4,-104 Z',
    perut: 'M12,-97 C30,-95 40,-76 40,-54 C40,-32 30,-16 14,-15 C-2,-15 -8,-34 -8,-56 C-8,-80 -2,-97 12,-97 Z',
    ekor: 'M-30,-70 C-62,-70 -90,-80 -106,-106 C-116,-86 -114,-56 -102,-36 C-88,-14 -58,-10 -28,-18 Z',
    kepala: 'M8,-170 C34,-170 50,-154 50,-137 C58,-134 62,-123 58,-114 C54,-105 44,-100 34,-96 C22,-88 -6,-88 -20,-96 C-36,-104 -36,-128 -33,-142 C-29,-160 -14,-170 8,-170 Z',
    wajah: 'M-3,-153 C22,-161 44,-153 50,-137 C58,-134 62,-123 58,-114 C54,-105 44,-100 34,-96 C22,-89 -3,-89 -15,-98 C-25,-108 -23,-145 -3,-153 Z',
    helm: 'M-39,-137 C-41,-170 -16,-190 8,-190 C35,-190 55,-170 53,-141 Z',
    helmBayang: 'M30,-186 C47,-177 56,-160 53,-141 L37,-139 C41,-157 39,-174 30,-186 Z',
    lidah: 'M-43,-141 C-10,-133 30,-133 63,-143 C68,-137 64,-128 55,-128 C24,-122 -12,-124 -41,-130 C-47,-132 -47,-139 -43,-141 Z',
    bola: 'M0,-126 C36,-126 62,-98 62,-64 C62,-28 36,0 0,0 C-36,0 -62,-28 -62,-64 C-62,-98 -36,-126 0,-126 Z',
    gulungEkor: 'M-63,-46 C-44,-4 28,-6 63,-58 C64,-70 63,-78 61,-86 C30,-36 -36,-34 -58,-76 C-63,-66 -64,-56 -63,-46 Z'
  };
  /* 24 slot Sisik Emas di punggung: sisik badan di sisi belakang (x < -4), dinomori dari atas ke bawah
     (medanSisik memanggil fungsi ini dalam urutan atas ke bawah sebelum menggambar). */
  function aturSlot(daftar) {
    var n = 0;
    return function (urut, x, y) {
      if (!daftar || !(x < -4 && y > -100 && y < -20)) return '';
      var i = n++;
      return i >= 24 ? '' : (daftar[i] || '');
    };
  }

  /* sisik ekor (tempat TAMBAHAN): tiga sisik di tengah ekor, dari pangkal ke ujung */
  function aturSlotEkor(daftar) {
    var n = 0;
    return function (urut, x, y) {
      if (!daftar || !daftar.length || !(x < -56 && x > -100 && y > -84 && y < -40)) return '';
      var i = n++;
      return i >= daftar.length ? '' : (daftar[i] || '');
    };
  }

  function lenganTara(pts, cakarBuka) {
    var u = pts[pts.length - 1];
    var cakar = '';
    var sudut = Math.atan2(u[1] - pts[pts.length - 2][1], u[0] - pts[pts.length - 2][0]);
    for (var i = -1; i <= 1; i++) {
      var a = sudut + i * (cakarBuka ? 0.55 : 0.38);
      cakar += elips(u[0] + Math.cos(a) * 10, u[1] + Math.sin(a) * 10, 3.4, 2.4, C.putih, 1.6, T, ' transform="rotate(' + f(a * 180 / Math.PI) + ' ' + f(u[0] + Math.cos(a) * 10) + ' ' + f(u[1] + Math.sin(a) * 10) + ')"');
    }
    return tungkai(pts, 17, C.coklat, 4) + path(polyline(pts.slice(0, 2)), 'none', 5, C.sisikKilau, ' opacity=".7"') + cakar + lingkar(u[0], u[1], 9.5, C.kulitTara, 3.5);
  }
  function kakiTara(pinggul, telapakX) {
    return tungkai([pinggul, [telapakX, -9]], 20, C.coklat, 4) +
      elips(telapakX + 6, -6.5, 15, 7, C.kulitTara, 3.5) +
      elips(telapakX + 19, -5, 3, 2.2, C.putih, 1.4) + elips(telapakX + 14, -2.5, 3, 2.2, C.putih, 1.4);
  }
  function mataTara(x, y, jenis, sx, sy) {
    sx = sx || 0; sy = sy || 0;
    if (jenis === 'tutup') return path('M' + f(x - 7) + ',' + f(y + 2) + ' Q' + f(x) + ',' + f(y - 7) + ' ' + f(x + 7) + ',' + f(y + 2), 'none', 3.6);
    return elips(x, y, 6.6, 8.2, T) + lingkar(x - 2.2 + sx, y - 3.2 + sy, 2.7, C.putih) + lingkar(x + 2 + sx, y + 2.6 + sy, 1.2, C.putih);
  }

  /* topi pelindung matahari (T4 dan Pawai): mahkota krem, tepi lebar, pita kuning, penutup tengkuk, lencana telapak */
  function topiTara() {
    return path('M-44,-138 C-56,-118 -50,-100 -34,-96 L-26,-132 Z', C.krem, 3.4) +
      elips(8, -141, 64, 13, C.krem, 4) + path('M-34,-143 C-34,-178 -14,-190 8,-190 C32,-190 50,-178 50,-143 Z', C.krem, 4) +
      path('M-34,-152 C-10,-147 26,-147 50,-152 L50,-143 L-34,-143 Z', C.kuning, 2.6) + path('M30,-184 C42,-176 48,-164 48,-152', 'none', 5, '#EADFC8') + lencana(20, -166, 12);
  }
  function kepalaTara(ekspresi, miring, kedip, topi) {
    var e = ekspresi || 'senang';
    var isi = path(TARA.kepala, C.coklat, 0) +
      medanSisik(TARA.kepala, [-36, -172, 10, -88], 12, 25) +
      path(TARA.kepala, 'none', 4) +
      path(TARA.wajah, C.kulitTara, 0) +
      path('M-15,-98 C-25,-108 -23,-145 -3,-153 C-10,-142 -12,-112 -6,-101 Z', C.kulitTaraBayang, 0) +
      path('M-3,-153 C22,-161 44,-153 50,-137 C58,-134 62,-123 58,-114 C54,-105 44,-100 34,-96 C22,-89 -3,-89 -15,-98', 'none', 2, C.sisikTepi, ' opacity=".55"');
    /* mata, pipi, hidung, mulut */
    var mt = e === 'sorak' || e === 'geleng' || e === 'endus' || kedip ? 'tutup' : 'buka';
    if (e === 'endus') isi += path('M64,-132 q6,-4 4,-10 M70,-126 q8,-3 8,-11 M66,-118 q9,0 12,-6', 'none', 2.6, C.lavenderTua);
    var lirik = e === 'pikir' ? [1.5, -2] : [0, 0];
    isi += elips(-7, -110, 7, 4, C.koral, 0, 0, ' opacity=".55"') + elips(45, -110, 6.5, 3.8, C.koral, 0, 0, ' opacity=".55"');
    isi += mataTara(6, -127, mt, lirik[0], lirik[1]) + mataTara(32, -127, mt, lirik[0], lirik[1]);
    if (e === 'pikir') isi += path('M0,-143 Q7,-147 13,-144', 'none', 2.8) + path('M26,-145 Q33,-149 39,-144', 'none', 2.8);
    isi += elips(57, -122, 5.2, 4.2, '#F2898C', 2.2);
    if (e === 'senang' || e === 'sorak') {
      var bsr = e === 'sorak' ? 1.3 : 1.05;
      isi += g('translate(26,-106) scale(' + bsr + ')', path('M-9,-3 C-6,8 6,9 9,-4 Z', '#7B3048', 2.4) + path('M-5,3 C-2,7 3,7 5,3 C2,1 -2,1 -5,3 Z', C.koral, 0));
    } else if (e === 'pikir') {
      isi += elips(28, -104, 3.4, 3.8, '#7B3048', 2.2);
    } else {
      isi += path('M18,-107 Q26,-100 34,-108', 'none', 2.8);
    }
    /* helm */
    var helm = path(TARA.helm, C.kuning, 0) + path(TARA.helmBayang, C.kuningBayang, 0) +
      elips(-14, -170, 12, 5.5, '#FFF4C9', 0, 0, ' transform="rotate(-32 -14 -170)"') +
      path(TARA.helm, 'none', 4) +
      path(TARA.lidah, C.kuning, 4) + path('M-38,-133 C-10,-127 26,-127 58,-133', 'none', 3, C.kuningTua, ' opacity=".6"') +
      lencana(18, -164, 14);
    var tali = path('M-31,-146 C-33,-118 -20,-98 4,-93', 'none', 4.5) + kotak(-30, -120, 10, 7, 2, '#A79FC2', 2, T, ' transform="rotate(60 -25 -116)"');
    return g('translate(8,-94) scale(1.1) translate(-8,94)' + (miring ? ' rotate(' + miring + ' 8 -100)' : ''), isi + (topi ? topiTara() : tali + g('translate(1,-15)', helm)));
  }

  /* pose: senang, pikir, sorak, geleng, bola, intip. opsi.sisik = array 24 ('', 'perak', 'emas') */
  function tara(pose, opsi) {
    opsi = opsi || {};
    var slot = aturSlot(opsi.sisik);
    var out = bayangTanah(pose === 'bola' || pose === 'intip' ? 58 : 62, 9);
    if (pose === 'bola' || pose === 'intip') {
      out += path(TARA.bola, C.coklat, 0) + medanSisik(TARA.bola, [-62, -126, 62, 0], 24, 0, { slot: slot }) +
        path(TARA.gulungEkor, C.sisikBayang, 0) + medanSisik(TARA.gulungEkor, [-64, -90, 64, -8], 18, -72) + path(TARA.gulungEkor, 'none', 3.5) +
        path(TARA.bola, 'none', 4.5);
      if (pose === 'intip') {
        out += elips(8, -82, 36, 16, C.kulitTara, 3.5) + elips(-16, -76, 6, 3.4, C.koral, 0, 0, ' opacity=".55"') + elips(32, -76, 6, 3.4, C.koral, 0, 0, ' opacity=".55"') + mataTara(-4, -84, 'buka') + mataTara(21, -84, 'buka') +
          g('translate(-22,-72)', satuSisik(17, '')) + g('translate(-4,-70)', satuSisik(18, '')) + g('translate(16,-70)', satuSisik(18, '')) + g('translate(34,-72)', satuSisik(17, '')) +
          path('M-23,-86 C-12,-93 28,-93 39,-86', 'none', 0);
      }
      var helmBola = path(TARA.helm, C.kuning, 0) + path(TARA.helmBayang, C.kuningBayang, 0) +
        elips(-14, -170, 12, 5.5, '#FFF4C9', 0, 0, ' transform="rotate(-32 -14 -170)"') + path(TARA.helm, 'none', 4) +
        path(TARA.lidah, C.kuning, 4) + lencana(18, -164, 14);
      out += g('translate(-7,22)', opsi.topi ? topiTara() : helmBola);
      return g(opsi.arah === -1 ? 'scale(-1,1)' : '', out);
    }
    var L = {
      senang: { b: [[-26, -86], [-34, -62], [-26, -44]], d: [[30, -88], [60, -90], [80, -112]], buka: true, ekorRot: 0, kepala: 0 },
      diam: { b: [[-26, -86], [-34, -62], [-26, -44]], d: [[30, -88], [38, -64], [32, -46]], ekorRot: 0, kepala: 0 },
      pikir: { b: [[-26, -86], [-24, -60], [-2, -54]], d: [[30, -88], [44, -66], [46, -98]], ekorRot: 4, kepala: -6 },
      sorak: { b: [[-26, -86], [-46, -112], [-50, -144]], d: [[30, -88], [52, -116], [60, -146]], buka: true, ekorRot: -10, kepala: 0 },
      geleng: { b: [[-26, -86], [-22, -60], [4, -50]], d: [[30, -88], [32, -62], [14, -50]], ekorRot: 0, kepala: -9 },
      endus: { b: [[-26, -86], [-30, -62], [-22, -46]], d: [[30, -88], [40, -66], [34, -48]], ekorRot: -6, kepala: -11 },
      tunjuk: { b: [[-26, -86], [-34, -62], [-26, -44]], d: [[30, -88], [58, -94], [86, -98]], buka: true, ekorRot: 0, kepala: 0, wajah: 'senang' }
    }[pose] || {};
    var lompat = pose === 'sorak' ? -10 : 0;
    var tubuh = '';
    tubuh += g('translate(-30,-40) scale(.9) translate(30,40)' + (L.ekorRot ? ' rotate(' + L.ekorRot + ' -30 -40)' : ''),path(TARA.ekor, C.coklat, 0) + medanSisik(TARA.ekor, [-116, -110, -26, -12], 17, 135, { slot: aturSlotEkor(opsi.ekor) }) + path(TARA.ekor, 'none', 4));
    tubuh += lenganTara(L.b, false);
    tubuh += kakiTara([-20, -26], -26) ;
    tubuh += path(TARA.badan, C.coklat, 0) + medanSisik(TARA.badan, [-48, -106, 44, -12], 17, 0, { slot: slot }) + path(TARA.badan, 'none', 4);
    tubuh += path(TARA.perut, C.kulitTara, 3) + path('M-6,-80 Q16,-74 38,-80 M-8,-64 Q16,-58 40,-64 M-7,-48 Q16,-42 39,-48 M-3,-32 Q16,-26 35,-32', 'none', 2, C.perutGaris);
    tubuh += kakiTara([16, -26], 14);
    var pl = opsi.perlengkapan || [];
    if (pl.indexOf('peluit') >= 0) {
      /* peluit bertali hijau (hadiah T1) */
      tubuh += path('M-14,-100 Q-8,-80 10,-74 M36,-100 Q32,-80 18,-74', 'none', 7, T) + path('M-14,-100 Q-8,-80 10,-74 M36,-100 Q32,-80 18,-74', 'none', 3.6, C.hijau) +
        g('translate(14,-68) rotate(-12)', kotak(-10, -6, 20, 13, 6, C.kuning, 3) + lingkar(-5, 1, 4, C.kuningTua, 2) + kotak(6, -6, 7, 6, 1.5, C.kuningTua, 2));
    }
    if (pl.indexOf('rompi') >= 0) {
      /* rompi reflektif kuning dengan dua garis perak (hadiah T3) */
      tubuh += path('M-36,-92 C-46,-70 -46,-44 -38,-26 L-14,-24 L-10,-92 Z', C.kuning, 3) + path('M30,-92 C42,-70 42,-44 36,-26 L22,-24 L18,-92 Z', C.kuning, 3) +
        path('M-44,-64 L-11,-64 M-44,-46 L-12,-46 M20,-64 L42,-64 M21,-46 L42,-46', 'none', 5, '#D9DCE8');
    }
    if (pl.indexOf('p3k') >= 0) {
      /* kotak P3K mainan hijau bertanda tambah putih (bukan lambang palang merah, GDD 8) */
      tubuh += path('M-30,-74 Q-40,-56 -34,-40', 'none', 3, C.hijauTua) + g('translate(-36,-32) rotate(-8)', kotak(-14, -10, 28, 20, 5, C.hijau, 3) + path('M0,-5 V5 M-5,0 H5', 'none', 3.4, C.putih));
    }
    tubuh += kepalaTara(L.wajah || pose, L.kepala, opsi.kedip, opsi.topi);
    tubuh += lenganTara(L.d, L.buka);
    if (pose === 'sorak') tubuh += path('M-62,-176 L-74,-188 M-50,-192 L-56,-208 M70,-176 L84,-186 M58,-194 L64,-210', 'none', 5, C.kuningTua);
    if (pose === 'geleng') tubuh += path('M-48,-150 Q-56,-136 -48,-122 M-58,-154 Q-68,-136 -58,-118 M70,-150 Q78,-136 70,-122 M80,-154 Q90,-136 80,-118', 'none', 3.5, C.lavender);
    out += g(lompat ? 'translate(0,' + lompat + ')' : '', tubuh);
    return g(opsi.arah === -1 ? 'scale(-1,1)' : '', out);
  }

  /* ---------------- TOKOH (satu rig untuk anak dan orang dewasa) ---------------- */
  var KULIT = { terang: '#F3CDA4', kuning: '#EFC093', sawo: '#D9A272', cokelat: '#B97E52', gelap: '#875638' };
  var TOKOH = {
    sari:  { kulit: KULIT.terang, rambut: 'kuncir', baju: 'seragamP' },
    dina:  { kulit: KULIT.kuning, rambut: 'jilbab', baju: 'seragamPanjang' },
    bima:  { kulit: KULIT.terang, rambut: 'pendek', baju: 'seragamL', kacamata: true },
    raka:  { kulit: KULIT.sawo, rambut: 'jabrik', baju: 'seragamL' },
    lala:  { kulit: KULIT.gelap, rambut: 'keriting', baju: 'seragamP' },
    tegar: { kulit: KULIT.cokelat, rambut: 'rapi', baju: 'seragamL', kursiRoda: true },
    ayu:   { kulit: KULIT.terang, rambut: 'poni', baju: 'seragamP' },
    sekar: { kulit: KULIT.sawo, rambut: 'kepang', baju: 'seragamP' },
    nino:  { kulit: KULIT.kuning, rambut: 'balita', baju: 'kaosBelang', kecil: true },
    ani:   { kulit: KULIT.sawo, rambut: 'jilbabUngu', baju: 'batik', dewasa: true },
    /* orang dewasa T2-T4 (GDD 12.5) */
    ayah:  { kulit: KULIT.sawo, rambut: 'pendek', kumis: true, baju: 'polo', dewasa: true },
    ibu:   { kulit: KULIT.terang, rambut: 'sanggul', baju: 'daster', dewasa: true },
    ibuDina: { kulit: KULIT.kuning, rambut: 'jilbabBiru', baju: 'gamis', dewasa: true },
    paman: { kulit: KULIT.cokelat, rambut: 'rapi', baju: 'kemeja', dewasa: true },
    budi:  { kulit: KULIT.sawo, rambut: 'pendek', baju: 'training', dewasa: true },
    wulan: { kulit: KULIT.cokelat, rambut: 'kuncirTopi', baju: 'penjaga', dewasa: true }
  };
  /* Preset pakaian. bawahan: rok, rokPanjang, celana (pendek), celanaPanjang. alas: warna sepatu, 'kaki' (tanpa alas), 'sandal'.
     kerah: seragam (kerah + dasi merah), polo, olahraga, v. motif: batik, belang, garis, bunga. Per tokoh bisa ditimpa lewat opsi.baju dan opsi.warna. */
  var PAKAIAN = {
    seragamP: { atas: C.putih, bawah: C.merah, bawahan: 'rok', kerah: 'seragam', kaus: true, alas: T },
    seragamL: { atas: C.putih, bawah: C.merah, bawahan: 'celana', kerah: 'seragam', kaus: true, alas: T },
    seragamPanjang: { atas: C.putih, bawah: C.merah, bawahan: 'rokPanjang', lengan: 'panjang', kerah: 'seragam', kaki: C.putih, alas: T },
    batik: { atas: C.kuning, bawah: C.coklatTua, bawahan: 'rokPanjang', lengan: 'panjang', motif: 'batik', alas: C.coklatTua },
    kaosBelang: { atas: C.langit, bawah: C.coklat, bawahan: 'celana', motif: 'belang', alas: T },
    rumahP: { atas: C.koralMuda, bawah: C.langitTua, bawahan: 'rok', alas: 'kaki' },
    rumahL: { atas: C.hijauMuda, bawah: C.coklat, bawahan: 'celana', alas: 'kaki' },
    rumahPanjang: { atas: C.lavenderMuda, bawah: C.lavender, bawahan: 'rokPanjang', lengan: 'panjang', alas: 'kaki' },
    olahraga: { atas: C.putih, bawah: C.langitTua, bawahan: 'celanaPanjang', kerah: 'olahraga', alas: C.putih },
    olahragaPanjang: { atas: C.putih, bawah: C.langitTua, bawahan: 'celanaPanjang', lengan: 'panjang', kerah: 'olahraga', alas: C.putih },
    polo: { atas: C.hijau, bawah: '#5E4E72', bawahan: 'celanaPanjang', kerah: 'polo', alas: C.coklatTua },
    daster: { atas: C.koralMuda, bawah: C.koralMuda, bawahan: 'rokPanjang', motif: 'bunga', alas: 'sandal' },
    gamis: { atas: C.langit, bawah: C.langit, bawahan: 'rokPanjang', lengan: 'panjang', alas: C.coklatTua },
    kemeja: { atas: C.langit, bawah: '#5E4E72', bawahan: 'celanaPanjang', kerah: 'polo', alas: T },
    training: { atas: C.langitTua, bawah: C.langitTua, bawahan: 'celanaPanjang', lengan: 'panjang', motif: 'garis', kerah: 'olahraga', alas: C.putih },
    penjaga: { atas: C.kuning, bawah: C.koral, bawahan: 'celana', kerah: 'v', alas: 'sandal' }
  };
  function pakaianOf(tk, opsi) {
    var p = {}, k, dasar = PAKAIAN[(opsi && opsi.baju) || tk.baju] || PAKAIAN.seragamL;
    for (k in dasar) p[k] = dasar[k];
    if (opsi && opsi.warna) for (k in opsi.warna) p[k] = opsi.warna[k];
    if (opsi && opsi.alas) p.alas = opsi.alas;
    return p;
  }
  /* Kerangka ukuran: anak tinggi sekitar 124, dewasa sekitar 176, balita sekitar 100 */
  function kerangka(tk) {
    if (tk.dewasa) return { kY: -150, kR: 24, bahuY: -122, bahuX: 19, pinggangY: -76, panggulY: -72, lebarBadan: 22, lengan: 22, kaki: 9.5, tangan: 6, tebalLengan: 11 };
    if (tk.kecil) return { kY: -78, kR: 21, bahuY: -56, bahuX: 13, pinggangY: -32, panggulY: -26, lebarBadan: 15, lengan: 11, kaki: 8.5, tangan: 4.8 };
    return { kY: -96, kR: 22.5, bahuY: -71, bahuX: 15, pinggangY: -47, panggulY: -36, lebarBadan: 18, lengan: 12.5, kaki: 9, tangan: 5.2 };
  }
  /* Pose bawaan (berdiri menghadap kanan 3/4). Titik bisa ditimpa per pose. */
  function poseAnak(nama, K) {
    var bY = K.bahuY, pY = K.panggulY, bx = K.bahuX, L = K.lengan;
    var p = {
      berdiri: { lb: [[-bx, bY + 2], [-bx - 3, bY + L], [-bx - 3, bY + L * 2]], ld: [[bx, bY + 2], [bx + 3, bY + L], [bx + 3, bY + L * 2]],
        kb: [[-7, pY], [-8, pY / 2 - 2], [-9, -7]], kd: [[7, pY], [8, pY / 2 - 2], [9, -7]] },
      jalan: { lb: [[-bx + 2, bY + 2], [-bx - 4, bY + L], [-bx - 9, bY + L * 1.75]], ld: [[bx - 2, bY + 2], [bx + 5, bY + L], [bx + 12, bY + L * 1.7]],
        kb: [[-5, pY], [-11, pY / 2 - 1], [-17, -8]], kd: [[5, pY], [12, pY / 2 - 3], [15, -7]], miring: 3 },
      lari: { lb: [[-bx + 2, bY + 2], [-bx - 9, bY + L * 0.6], [-bx - 6, bY + L * 1.4]], ld: [[bx - 2, bY + 2], [bx + 10, bY + L * 0.9], [bx + 18, bY + L * 0.3]],
        kb: [[-5, pY], [-16, pY / 2 + 2], [-27, -16]], kd: [[5, pY], [18, pY / 2 - 6], [17, -7]], miring: 10, angkat: -4 },
      dorong: { lb: [[-bx + 3, bY + 2], [bx + 4, bY + 6], [bx + 20, bY + 2]], ld: [[bx - 2, bY + 2], [bx + 12, bY + 4], [bx + 26, bY - 2]],
        kb: [[-5, pY], [-14, pY / 2], [-22, -7]], kd: [[6, pY], [12, pY / 2 - 2], [14, -7]], miring: 14 },
      panjatBelakang: { lb: [[-bx, bY + 2], [-bx - 8, bY - 12], [-bx - 6, bY - 30]], ld: [[bx, bY + 2], [bx + 8, bY - 16], [bx + 6, bY - 36]],
        kb: [[-7, pY], [-9, pY / 2 - 2], [-9, -7]], kd: [[7, pY], [16, pY + 2], [13, pY + 16]], belakang: true },
      panjatSamping: { lb: [[-bx + 3, bY + 2], [bx + 2, bY - 6], [bx + 14, bY - 14]], ld: [[bx - 2, bY + 2], [bx + 12, bY - 14], [bx + 18, bY - 32]],
        kb: [[-5, pY], [-8, pY / 2], [-6, -7]], kd: [[5, pY], [18, pY + 4], [20, pY + 18]], miring: 8 },
      dudukAyun: { lb: [[-bx, bY + 2], [-bx - 7, bY - 6], [-bx - 7, bY - 22]], ld: [[bx, bY + 2], [bx + 7, bY - 6], [bx + 7, bY - 22]],
        kb: [[-7, pY], [-9, pY + 8], [-10, pY + 22]], kd: [[7, pY], [9, pY + 8], [10, pY + 22]], depan: true },
      dudukSamping: { duduk: true, lb: [[-bx + 3, bY + 2], [-bx + 8, bY + L], [bx - 2, bY + L * 1.6]], ld: [[bx - 2, bY + 2], [bx + 2, bY + L], [bx + 8, bY + L * 1.7]],
        kb: [[-4, pY], [14, pY], [16, pY + 22]], kd: [[4, pY], [22, pY + 1], [24, pY + 24]] },
      lempar: { lb: [[-bx + 3, bY + 2], [-bx + 8, bY + L], [bx - 2, bY + L * 1.6]], ld: [[bx - 2, bY + 2], [bx + 8, bY - 12], [bx + 10, bY - 28]],
        kb: [[-4, pY], [14, pY], [16, pY + 22]], kd: [[4, pY], [22, pY + 1], [24, pY + 24]] },
      panggil: { lb: [[-bx, bY + 2], [-bx - 3, bY + L], [-bx - 2, bY + L * 2]], ld: [[bx, bY + 2], [bx + 12, bY - 6], [bx + 18, bY - 24]],
        kb: [[-7, pY], [-8, pY / 2 - 2], [-9, -7]], kd: [[7, pY], [8, pY / 2 - 2], [9, -7]] },
      tunjuk: { lb: [[-bx, bY + 2], [-bx - 3, bY + L], [-bx - 2, bY + L * 2]], ld: [[bx, bY + 2], [bx + 14, bY + 4], [bx + 28, bY + 2]],
        kb: [[-7, pY], [-8, pY / 2 - 2], [-9, -7]], kd: [[7, pY], [8, pY / 2 - 2], [9, -7]] },
      /* bingkai kedua dan ketiga untuk siklus jalan, lari, dorong, panjat */
      jalan2: { lb: [[-bx + 2, bY + 2], [-bx, bY + L], [-bx - 1, bY + L * 1.9]], ld: [[bx - 2, bY + 2], [bx, bY + L], [bx + 1, bY + L * 1.9]],
        kb: [[-5, pY], [-5, pY / 2 - 1], [-6, -8]], kd: [[5, pY], [9, pY / 2 - 5], [6, -10]], miring: 2, angkat: -2 },
      jalan3: { lb: [[-bx + 2, bY + 2], [-bx + 6, bY + L], [-bx + 12, bY + L * 1.7]], ld: [[bx - 2, bY + 2], [bx - 6, bY + L], [bx - 10, bY + L * 1.75]],
        kb: [[-5, pY], [6, pY / 2 - 3], [12, -7]], kd: [[5, pY], [-4, pY / 2 - 1], [-12, -8]], miring: 3 },
      lari2: { lb: [[-bx + 2, bY + 2], [-bx + 8, bY + L * 0.9], [-bx + 16, bY + L * 0.3]], ld: [[bx - 2, bY + 2], [bx - 10, bY + L * 0.6], [bx - 8, bY + L * 1.4]],
        kb: [[-5, pY], [10, pY / 2 - 6], [9, -7]], kd: [[5, pY], [-8, pY / 2 + 2], [-19, -16]], miring: 10, angkat: -4 },
      dorong2: { lb: [[-bx + 3, bY + 2], [bx - 4, bY + 12], [bx + 8, bY + 6]], ld: [[bx - 2, bY + 2], [bx + 6, bY + 12], [bx + 14, bY + 4]],
        kb: [[-5, pY], [-12, pY / 2], [-18, -7]], kd: [[6, pY], [12, pY / 2 - 2], [14, -7]], miring: 6 },
      panjatSamping2: { lb: [[-bx + 3, bY + 2], [bx + 4, bY - 12], [bx + 16, bY - 26]], ld: [[bx - 2, bY + 2], [bx + 10, bY - 8], [bx + 16, bY - 18]],
        kb: [[-5, pY], [6, pY + 4], [10, pY + 18]], kd: [[5, pY], [10, pY / 2], [8, -7]], miring: 8 },
      panjatBelakang2: { lb: [[-bx, bY + 2], [-bx - 8, bY - 16], [-bx - 6, bY - 36]], ld: [[bx, bY + 2], [bx + 8, bY - 12], [bx + 6, bY - 30]],
        kb: [[-7, pY], [-16, pY + 2], [-13, pY + 16]], kd: [[7, pY], [9, pY / 2 - 2], [9, -7]], belakang: true },
      tutupMulut: { lb: [[-bx, bY + 2], [-bx + 1, bY + 13], [-3, bY - 12]], ld: [[bx, bY + 2], [bx - 1, bY + 13], [6, bY - 11]],
        kb: [[-7, pY], [-8, pY / 2 - 2], [-9, -7]], kd: [[7, pY], [8, pY / 2 - 2], [9, -7]] },
      seimbang: { lb: [[-bx, bY + 2], [-bx - 11, bY - 2], [-bx - 22, bY - 7]], ld: [[bx, bY + 2], [bx + 11, bY - 2], [bx + 22, bY - 7]],
        kb: [[-6, pY], [-9, pY / 2 - 3], [-12, -10]], kd: [[6, pY], [10, pY / 2 - 4], [12, -12]], angkat: -3 },
      ambil: { lb: [[-bx + 3, bY + 2], [-bx + 6, bY + L], [-bx + 8, bY + L * 1.8]], ld: [[bx - 2, bY + 2], [bx + 10, bY + 14], [bx + 14, bY + 32]],
        kb: [[-6, pY], [-2, pY / 2 + 2], [-10, -7]], kd: [[6, pY], [16, pY / 2 - 1], [12, -7]], miring: 30 },
      jongkok: { lb: [[-bx + 3, bY + 2], [bx - 2, bY + 12], [bx + 8, bY + 18]], ld: [[bx - 2, bY + 2], [bx + 8, bY + 12], [bx + 16, bY + 16]],
        kb: [[-6, pY], [8, pY - 4], [-2, -16]], kd: [[6, pY], [16, pY - 6], [10, -16]], naik: 14, miring: 10 },
      lompat: { lb: [[-bx, bY + 2], [-bx - 8, bY - 12], [-bx - 6, bY - 26]], ld: [[bx, bY + 2], [bx + 8, bY - 12], [bx + 6, bY - 28]],
        kb: [[-6, pY], [-12, pY + 12], [-22, pY + 16]], kd: [[6, pY], [14, pY + 10], [8, pY + 24]], angkat: -18 },
      meluncur: { duduk: true, lb: [[-bx + 3, bY + 2], [-bx - 4, bY + 14], [-bx - 8, bY + 26]], ld: [[bx - 2, bY + 2], [bx + 10, bY + 12], [bx + 18, bY + 20]],
        kb: [[-4, pY], [14, pY + 4], [30, pY + 10]], kd: [[4, pY], [20, pY + 5], [38, pY + 12]], miring: -6 },
      tempel: { lb: [[-bx + 3, bY + 2], [bx - 2, bY + 14], [bx + 20, bY + 12]], ld: [[bx - 2, bY + 2], [bx + 12, bY + 10], [bx + 28, bY + 6]],
        kb: [[-7, pY], [-8, pY / 2 - 2], [-9, -7]], kd: [[7, pY], [8, pY / 2 - 2], [9, -7]] },
      sorak: { lb: [[-bx, bY + 2], [-bx - 10, bY - 12], [-bx - 14, bY - 28]], ld: [[bx, bY + 2], [bx + 10, bY - 12], [bx + 14, bY - 28]],
        kb: [[-7, pY], [-8, pY / 2 - 2], [-10, -8]], kd: [[7, pY], [8, pY / 2 - 2], [10, -8]], angkat: -6 },
      /* tampak belakang (menghadap jalan saat menyeberang) */
      berdiriBelakang: { lb: [[-bx, bY + 2], [-bx - 3, bY + L], [-bx - 3, bY + L * 2]], ld: [[bx, bY + 2], [bx + 3, bY + L], [bx + 3, bY + L * 2]],
        kb: [[-7, pY], [-8, pY / 2 - 2], [-9, -7]], kd: [[7, pY], [8, pY / 2 - 2], [9, -7]], belakang: true },
      jalanBelakang: { lb: [[-bx, bY + 2], [-bx - 4, bY + L], [-bx - 2, bY + L * 1.9]], ld: [[bx, bY + 2], [bx + 4, bY + L], [bx + 2, bY + L * 1.9]],
        kb: [[-7, pY], [-8, pY / 2 - 6], [-8, -14]], kd: [[7, pY], [8, pY / 2 + 1], [9, -6]], belakang: true },
      jalanBelakang2: { lb: [[-bx, bY + 2], [-bx - 4, bY + L], [-bx - 2, bY + L * 1.9]], ld: [[bx, bY + 2], [bx + 4, bY + L], [bx + 2, bY + L * 1.9]],
        kb: [[-7, pY], [-8, pY / 2 + 1], [-9, -6]], kd: [[7, pY], [8, pY / 2 - 6], [8, -14]], belakang: true },
      /* pose T2-T4 */
      dudukMotor: { duduk: true, lb: [[-bx + 3, bY + 2], [bx + 2, bY + 10], [bx + 18, bY + 8]], ld: [[bx - 2, bY + 2], [bx + 12, bY + 8], [bx + 26, bY + 6]],
        kb: [[-4, pY], [14, pY + 2], [12, pY + 24]], kd: [[4, pY], [20, pY + 3], [18, pY + 26]] },
      raih: { lb: [[-bx, bY + 2], [-bx - 3, bY + L], [-bx - 2, bY + L * 2]], ld: [[bx, bY + 2], [bx + 6, bY - 14], [bx + 8, bY - 32]],
        kb: [[-7, pY], [-8, pY / 2 - 3], [-9, -11]], kd: [[7, pY], [8, pY / 2 - 3], [9, -11]], angkat: -4 },
      jongkokRaih: { lb: [[-bx + 3, bY + 2], [bx - 2, bY + 12], [bx + 8, bY + 18]], ld: [[bx - 2, bY + 2], [bx + 14, bY + 2], [bx + 30, bY - 2]],
        kb: [[-6, pY], [8, pY - 4], [-2, -16]], kd: [[6, pY], [16, pY - 6], [10, -16]], naik: 14, miring: 6 },
      dudukLantai: { duduk: true, lb: [[-bx + 3, bY + 2], [bx - 4, bY + 14], [bx + 8, bY + 18]], ld: [[bx - 2, bY + 2], [bx + 8, bY + 12], [bx + 20, bY + 14]],
        kb: [[-6, pY], [12, pY + 2], [-2, pY + 10]], kd: [[6, pY], [22, pY + 4], [8, pY + 12]], naik: 24 },
      /* duduk di tanah, lutut kanan naik, kedua tangan di sepatu (titik dihitung dari posisi tujuan setelah naik dan miring) */
      ikatSepatu: { duduk: true, lb: [[-bx + 3, bY + 2], [2, -55], [17, -45]], ld: [[bx - 2, bY + 2], [22, -57], [24, -45]],
        kb: [[-6, pY], [14, -38.5], [2, -34]], kd: [[6, pY], [14.5, -51.5], [24, -38.5]], naik: 28, miring: 6, kakiDepan: true },
      minum: { lb: [[-bx, bY + 2], [-bx - 3, bY + L], [-bx - 2, bY + L * 2]], ld: [[bx, bY + 2], [bx + 8, bY + 10], [8, bY - 14]],
        kb: [[-7, pY], [-8, pY / 2 - 2], [-9, -7]], kd: [[7, pY], [8, pY / 2 - 2], [9, -7]] },
      /* posisi start: badan condong, kaki depan ditekuk, kaki belakang lurus ke belakang, kedua kaki di tanah */
      siapLari: { lb: [[-bx + 3, bY + 2], [-bx - 6, bY + 10], [-bx - 12, bY + 4]], ld: [[bx - 2, bY + 2], [bx + 8, bY + 14], [bx + 14, bY + 26]],
        kb: [[-5, pY], [-12, -22], [-24.5, -6]], kd: [[6, pY], [21, -30], [26, -19]], miring: 14, naik: 6 }
    };
    return p[nama] || p.berdiri;
  }

  function wajahAnak(K, ekspresi, arah3) {
    var y = K.kY + 1, s = K.kR / 22.5, o = arah3 * 3.5 * s;
    var e = ekspresi || 'senyum';
    var out = elips(-10 * s + o, y + 9 * s, 4 * s, 2.4 * s, C.koral, 0, 0, ' opacity=".5"') + elips(13 * s + o, y + 9 * s, 4 * s, 2.4 * s, C.koral, 0, 0, ' opacity=".5"');
    if (e === 'tutup') {
      out += path('M' + f(-8 * s + o) + ',' + f(y + 1) + ' q' + f(3.5 * s) + ',' + f(-5 * s) + ' ' + f(7 * s) + ',0', 'none', 2.4 * s) +
        path('M' + f(5 * s + o) + ',' + f(y + 1) + ' q' + f(3.5 * s) + ',' + f(-5 * s) + ' ' + f(7 * s) + ',0', 'none', 2.4 * s);
    } else {
      var ry = e === 'kaget' ? 4.2 : 3.4;
      [-4.5, 8.5].forEach(function (mx) {
        out += elips(mx * s + o, y, 2.7 * s, ry * s, T) + lingkar(mx * s + o - 0.9 * s, y - 1.3 * s, 1.05 * s, C.putih);
      });
    }
    var mx0 = 2 * s + o, my = y + 10 * s;
    if (e === 'senang' || e === 'tutup') out += path('M' + f(mx0 - 5 * s) + ',' + f(my - 1.5 * s) + ' q' + f(5 * s) + ',' + f(8 * s) + ' ' + f(10 * s) + ',0 z', '#7B3048', 1.8 * s);
    else if (e === 'kaget') out += elips(mx0, my + 0.5 * s, 2.6 * s, 3.2 * s, '#7B3048', 1.6 * s);
    else if (e === 'teriak') out += elips(mx0, my + 0.5 * s, 4.2 * s, 4.6 * s, '#7B3048', 1.8 * s) + elips(mx0, my + 2.6 * s, 2.4 * s, 1.5 * s, C.koral);
    else if (e === 'fokus') out += path('M' + f(mx0 - 3.5 * s) + ',' + f(my) + ' h' + f(7 * s), 'none', 2.2 * s);
    else out += path('M' + f(mx0 - 4.5 * s) + ',' + f(my - 1 * s) + ' q' + f(4.5 * s) + ',' + f(4.5 * s) + ' ' + f(9 * s) + ',0', 'none', 2.2 * s);
    return out;
  }

  /* rambut: bagian belakang (sebelum kepala) dan depan (sesudah kepala) */
  function rambutAnak(gaya, K, belakang) {
    var y = K.kY, r = K.kR, s = r / 22.5, R = C.rambut;
    var B = '', D = '';
    function sk(d) { return d; }
    var tudung = 'M' + f(-r - 1) + ',' + f(y + 2) + ' C' + f(-r - 2) + ',' + f(y - r * 0.95) + ' ' + f(-r * 0.5) + ',' + f(y - r * 1.12) + ' 0,' + f(y - r * 1.12) +
      ' C' + f(r * 0.6) + ',' + f(y - r * 1.12) + ' ' + f(r + 2) + ',' + f(y - r * 0.9) + ' ' + f(r + 1) + ',' + f(y + 2) +
      ' C' + f(r * 0.7) + ',' + f(y - r * 0.42) + ' ' + f(r * 0.2) + ',' + f(y - r * 0.55) + ' ' + f(-r * 0.15) + ',' + f(y - r * 0.5) +
      ' C' + f(-r * 0.55) + ',' + f(y - r * 0.45) + ' ' + f(-r * 0.85) + ',' + f(y - r * 0.3) + ' ' + f(-r - 1) + ',' + f(y + 2) + ' Z';
    var kilau = path('M' + f(-r * 0.55) + ',' + f(y - r * 0.82) + ' q' + f(r * 0.3) + ',' + f(-r * 0.2) + ' ' + f(r * 0.6) + ',' + f(-r * 0.15), 'none', 2.6 * s, '#6B5266');
    if (belakang) {
      B += lingkar(0, y, r + 1.5, R, 3.5 * s);
      if (gaya === 'kuncir') B += elips(-r - 6, y + 2, 7 * s, 10 * s, R, 3.2 * s, T, ' transform="rotate(-25 ' + f(-r - 6) + ' ' + f(y + 2) + ')"') + elips(r + 6, y + 2, 7 * s, 10 * s, R, 3.2 * s, T, ' transform="rotate(25 ' + f(r + 6) + ' ' + f(y + 2) + ')"');
      if (gaya === 'poni') B += path('M' + f(-r - 3) + ',' + f(y) + ' L' + f(-r - 2) + ',' + f(y + r * 0.85) + ' L' + f(r + 2) + ',' + f(y + r * 0.85) + ' L' + f(r + 3) + ',' + f(y) + ' Z', R, 3.2 * s) + kotak(r * 0.35, y - r * 0.75, 11 * s, 6 * s, 3 * s, C.kuning, 2.2 * s);
      if (gaya === 'sanggul') B += lingkar(-r * 0.62, y - r * 0.72, 9 * s, R, 3.2 * s);
      if (gaya === 'kuncirTopi') B += elips(-r - 7, y + 6, 6.5 * s, 13 * s, R, 3 * s, T, ' transform="rotate(20 ' + f(-r - 7) + ' ' + f(y + 6) + ')"');
      if (/^jilbab/.test(gaya)) {
        var WJ = { jilbab: [C.putih, C.bajuBayang], jilbabUngu: [C.lavender, C.lavenderTua], jilbabBiru: [C.langit, C.langitTua] }[gaya];
        var wj = WJ[0], wjb = WJ[1];
        B = path('M' + f(-r - 4) + ',' + f(y) + ' C' + f(-r - 5) + ',' + f(y - r * 1.3) + ' ' + f(r + 5) + ',' + f(y - r * 1.3) + ' ' + f(r + 4) + ',' + f(y) +
          ' C' + f(r + 6) + ',' + f(y + r * 0.8) + ' ' + f(r + 11) + ',' + f(y + r * 1.25) + ' ' + f(r + 6) + ',' + f(y + r * 1.5) +
          ' L' + f(-r - 6) + ',' + f(y + r * 1.5) + ' C' + f(-r - 11) + ',' + f(y + r * 1.25) + ' ' + f(-r - 6) + ',' + f(y + r * 0.8) + ' ' + f(-r - 4) + ',' + f(y) + ' Z', wj, 3.4 * s) +
          path('M' + f(r + 2) + ',' + f(y + r * 0.6) + ' C' + f(r + 6) + ',' + f(y + r * 1.0) + ' ' + f(r + 7) + ',' + f(y + r * 1.3) + ' ' + f(r + 3) + ',' + f(y + r * 1.45), 'none', 4 * s, wjb);
      }
      if (gaya === 'keriting') { for (var a = 0; a < 12; a++) { var t = a / 12 * Math.PI * 2; B += lingkar(Math.cos(t) * r * 0.95, y - 2 + Math.sin(t) * r * 0.95, 7.5 * s, R, 3 * s); } B += lingkar(0, y, r, R); }
      return B;
    }
    switch (gaya) {
      case 'kuncir':
        D += path(tudung, R, 3.2 * s) + kilau + lingkar(-r - 1, y - 4, 3.2 * s, C.merah, 1.8 * s) + lingkar(r + 1, y - 4, 3.2 * s, C.merah, 1.8 * s);
        break;
      case 'kuncirTopi':
        D += path(tudung, R, 3.2 * s) +
          path('M' + f(-r - 2) + ',' + f(y - r * 0.35) + ' C' + f(-r - 2) + ',' + f(y - r * 1.25) + ' ' + f(r + 2) + ',' + f(y - r * 1.25) + ' ' + f(r + 2) + ',' + f(y - r * 0.35) + ' Z', C.koral, 3 * s) +
          path('M' + f(r * 0.2) + ',' + f(y - r * 0.38) + ' Q' + f(r * 1.2) + ',' + f(y - r * 0.5) + ' ' + f(r * 1.55) + ',' + f(y - r * 0.18) + ' L' + f(r * 0.4) + ',' + f(y - r * 0.2) + ' Z', C.koralTua, 2.6 * s);
        break;
      case 'pendek': case 'rapi': case 'balita': case 'sanggul':
        D += path(tudung, R, 3.2 * s) + kilau;
        if (gaya === 'rapi') D += path('M' + f(r * 0.1) + ',' + f(y - r * 1.05) + ' q' + f(-r * 0.2) + ',' + f(r * 0.3) + ' ' + f(-r * 0.25) + ',' + f(r * 0.55), 'none', 2 * s, '#6B5266');
        break;
      case 'jabrik':
        D += path('M' + f(-r - 1) + ',' + f(y + 1) + ' L' + f(-r - 2) + ',' + f(y - r * 0.7) + ' L' + f(-r * 0.62) + ',' + f(y - r * 0.82) + ' L' + f(-r * 0.6) + ',' + f(y - r * 1.38) +
          ' L' + f(-r * 0.18) + ',' + f(y - r * 1.0) + ' L' + f(r * 0.12) + ',' + f(y - r * 1.5) + ' L' + f(r * 0.42) + ',' + f(y - r * 1.02) + ' L' + f(r * 0.85) + ',' + f(y - r * 1.32) +
          ' L' + f(r * 0.85) + ',' + f(y - r * 0.82) + ' L' + f(r + 3) + ',' + f(y - r * 0.6) + ' L' + f(r + 1) + ',' + f(y + 1) +
          ' C' + f(r * 0.7) + ',' + f(y - r * 0.42) + ' ' + f(r * 0.2) + ',' + f(y - r * 0.55) + ' ' + f(-r * 0.15) + ',' + f(y - r * 0.5) +
          ' C' + f(-r * 0.55) + ',' + f(y - r * 0.45) + ' ' + f(-r * 0.85) + ',' + f(y - r * 0.3) + ' ' + f(-r - 1) + ',' + f(y + 1) + ' Z', R, 3.2 * s) + kilau;
        break;
      case 'keriting':
        for (var b2 = 0; b2 < 7; b2++) { var t2 = Math.PI * (1.05 + b2 / 6 * 0.9); D += lingkar(Math.cos(t2) * r * 0.78, y - 3 + Math.sin(t2) * r * 0.78, 7.5 * s, R, 3 * s); }
        for (var b3 = 0; b3 < 7; b3++) { var t3 = Math.PI * (1.05 + b3 / 6 * 0.9); D += lingkar(Math.cos(t3) * r * 0.78, y - 3 + Math.sin(t3) * r * 0.78, 7.5 * s, R); }
        D += path('M' + f(-r * 0.9) + ',' + f(y - r * 0.35) + ' Q0,' + f(y - r * 0.95) + ' ' + f(r * 0.9) + ',' + f(y - r * 0.35), 'none', 4.5 * s, C.langitTua);
        break;
      case 'poni':
        D += path('M' + f(-r - 2) + ',' + f(y + 1) + ' C' + f(-r - 2) + ',' + f(y - r * 0.95) + ' ' + f(-r * 0.5) + ',' + f(y - r * 1.12) + ' 0,' + f(y - r * 1.12) +
          ' C' + f(r * 0.6) + ',' + f(y - r * 1.12) + ' ' + f(r + 2) + ',' + f(y - r * 0.9) + ' ' + f(r + 2) + ',' + f(y + 1) +
          ' L' + f(r * 0.86) + ',' + f(y - r * 0.32) + ' L' + f(-r * 0.86) + ',' + f(y - r * 0.32) + ' Z', R, 3.2 * s) + kilau + kotak(r * 0.35, y - r * 0.75, 11 * s, 6 * s, 3 * s, C.kuning, 2.2 * s);
        break;
      case 'kepang':
        D += path(tudung, R, 3.2 * s) + kilau;
        for (var kp = 0; kp < 4; kp++) D += elips(-r * 0.86 - kp * 0.6, y + r * 0.55 + kp * 9 * s, 5.4 * s, 6.2 * s, R, 2.6 * s);
        D += lingkar(-r * 0.86 - 2.6, y + r * 0.55 + 33 * s, 3 * s, C.kuning, 1.8 * s) + path('M' + f(-r * 0.86 - 5) + ',' + f(y + r * 0.55 + 36 * s) + ' l2,7 l3,-6 l3,6', R, 2 * s);
        break;
      case 'jilbab': case 'jilbabUngu': case 'jilbabBiru':
        D += path('M' + f(-r * 0.62) + ',' + f(y - r * 0.62) + ' Q' + f(r * 0.1) + ',' + f(y - r * 0.92) + ' ' + f(r * 0.78) + ',' + f(y - r * 0.5), 'none', 2.2 * s,
          { jilbab: C.bajuBayang, jilbabUngu: C.lavenderTua, jilbabBiru: C.langitTua }[gaya]);
        break;
    }
    return D;
  }

  /* pakaian (preset PAKAIAN): atasan, bawahan, kerah, motif. P = pose (untuk rok panjang saat duduk). */
  function baju(pk, K, belakang, P) {
    var bY = K.bahuY, wY = K.pinggangY, pY = K.panggulY, lb = K.lebarBadan;
    var badan = 'M' + f(-lb + 3) + ',' + f(bY - 2) + ' C' + f(-lb - 1) + ',' + f(bY) + ' ' + f(-lb - 2) + ',' + f(bY + 6) + ' ' + f(-lb - 1) + ',' + f(bY + 12) +
      ' L' + f(-lb + 1) + ',' + f(wY + 3) + ' L' + f(lb - 1) + ',' + f(wY + 3) + ' L' + f(lb + 1) + ',' + f(bY + 12) +
      ' C' + f(lb + 2) + ',' + f(bY + 6) + ' ' + f(lb + 1) + ',' + f(bY) + ' ' + f(lb - 3) + ',' + f(bY - 2) + ' Z';
    var rok = 'M' + f(-lb + 1) + ',' + f(wY) + ' L' + f(lb - 1) + ',' + f(wY) + ' L' + f(lb + 6) + ',' + f(pY + 6) + ' C' + f(lb * 0.4) + ',' + f(pY + 9) + ' ' + f(-lb * 0.4) + ',' + f(pY + 9) + ' ' + f(-lb - 6) + ',' + f(pY + 6) + ' Z';
    var rokPanjang = 'M' + f(-lb + 1) + ',' + f(wY) + ' L' + f(lb - 1) + ',' + f(wY) + ' L' + f(lb + 7) + ',-12 C' + f(lb * 0.4) + ',-9 ' + f(-lb * 0.4) + ',-9 ' + f(-lb - 7) + ',-12 Z';
    var celana = 'M' + f(-lb + 1) + ',' + f(wY) + ' L' + f(lb - 1) + ',' + f(wY) + ' L' + f(lb + 2) + ',' + f(pY + 6) + ' L2,' + f(pY + 6) + ' L0,' + f(pY - 1) + ' L-2,' + f(pY + 6) + ' L' + f(-lb - 2) + ',' + f(pY + 6) + ' Z';
    if (P && P.duduk) {
      /* rok panjang saat duduk mengikuti paha lalu jatuh ke betis */
      var lutut = P.kd[1], telapakY = P.kd[2][1];
      rokPanjang = 'M' + f(-lb + 1) + ',' + f(wY) + ' L' + f(lb - 1) + ',' + f(wY) + ' L' + f(lutut[0] + 7) + ',' + f(pY - 7) +
        ' L' + f(lutut[0] + 9) + ',' + f(telapakY - 5) + ' L' + f(lutut[0] - 12) + ',' + f(telapakY - 5) + ' L' + f(lutut[0] - 12) + ',' + f(pY + 10) + ' L' + f(-lb - 3) + ',' + f(pY + 10) + ' Z';
    }
    var rokD = pk.bawahan === 'rok' ? rok : pk.bawahan === 'rokPanjang' ? rokPanjang : celana;
    var gelap = pk.bawah === C.merah ? C.merahBayang : 'rgba(58,42,79,.25)';
    var bawahan = path(rokD, pk.bawah, 3.4) + (rokD === rok ? path('M' + f(-lb * 0.45) + ',' + f(wY + 4) + ' L' + f(-lb * 0.6) + ',' + f(pY + 6) + ' M' + f(lb * 0.45) + ',' + f(wY + 4) + ' L' + f(lb * 0.6) + ',' + f(pY + 6), 'none', 1.8, gelap) : '');
    var atasan = path(badan, pk.atas, 3.4) + path('M' + f(lb - 4) + ',' + f(bY + 4) + ' L' + f(lb - 3) + ',' + f(wY + 2), 'none', 5, 'rgba(142,124,195,.3)');
    if (pk.motif === 'batik') atasan += [[-8, bY + 10], [6, bY + 16], [-4, bY + 28], [9, bY + 34], [-10, bY + 40]].map(function (q) { return lingkar(q[0], q[1], 3.4, C.coklatTua) + lingkar(q[0], q[1], 1.3, C.kuningMuda); }).join('');
    if (pk.motif === 'belang') atasan += path('M' + f(-lb) + ',' + f(bY + 10) + ' h' + f(lb * 2) + ' M' + f(-lb) + ',' + f(bY + 18) + ' h' + f(lb * 2), 'none', 3.2, C.putih);
    if (pk.motif === 'bunga') {
      atasan += [[-8, bY + 12], [7, bY + 20], [-3, bY + 34]].map(function (q) { return lingkar(q[0], q[1], 2.6, C.putih); }).join('');
      if (pk.bawahan === 'rokPanjang') bawahan += [[-10, wY + 14], [8, wY + 26], [-4, wY + 40], [10, wY + 52]].map(function (q) { return lingkar(q[0], q[1], 2.6, C.putih); }).join('');
    }
    if (pk.motif === 'garis') atasan += path('M' + f(-lb + 2) + ',' + f(bY + 2) + ' L' + f(-lb + 1) + ',' + f(wY) + ' M' + f(lb - 2) + ',' + f(bY + 2) + ' L' + f(lb - 1) + ',' + f(wY), 'none', 2.6, C.putih);
    if (!belakang) {
      if (pk.kerah === 'seragam') atasan += path('M-7,' + f(bY - 2) + ' L0,' + f(bY + 6) + ' L7,' + f(bY - 2), 'none', 2.4) +
        path('M-2,' + f(bY + 5) + ' L2,' + f(bY + 5) + ' L3,' + f(bY + 16) + ' L0,' + f(bY + 19) + ' L-3,' + f(bY + 16) + ' Z', C.merah, 1.8);
      if (pk.kerah === 'polo') atasan += path('M-8,' + f(bY - 2) + ' L-1,' + f(bY + 5) + ' L-4,' + f(bY + 8) + ' Z M8,' + f(bY - 2) + ' L1,' + f(bY + 5) + ' L4,' + f(bY + 8) + ' Z', C.krem, 2) + lingkar(0, bY + 10, 1.6, T) + lingkar(0, bY + 15, 1.6, T);
      if (pk.kerah === 'olahraga') atasan += path('M-8,' + f(bY - 1) + ' Q0,' + f(bY + 7) + ' 8,' + f(bY - 1), 'none', 3.6, C.hijau);
      if (pk.kerah === 'v') atasan += path('M-7,' + f(bY - 1) + ' L0,' + f(bY + 8) + ' L7,' + f(bY - 1), 'none', 3.4, C.koralTua);
    }
    if (pk.celemek && !belakang) {
      atasan += path('M' + f(-lb + 5) + ',' + f(bY + 8) + ' L' + f(lb - 5) + ',' + f(bY + 8) + ' L' + f(lb + 1) + ',' + f(wY + 22) + ' L' + f(-lb - 1) + ',' + f(wY + 22) + ' Z', C.krem, 2.8) +
        path('M' + f(-lb + 5) + ',' + f(bY + 8) + ' Q0,' + f(bY - 6) + ' ' + f(lb - 5) + ',' + f(bY + 8), 'none', 2.4, C.krem) + kotak(-7, wY + 2, 14, 9, 3, C.koralMuda, 1.8);
    }
    return bawahan + atasan;
  }

  function lenganAnak(pts, tk, K, lengan, pk) {
    var panjang = pk.lengan === 'panjang';
    var d1 = polyline(pts);
    var a = pts[0], b = pts[1];
    var lengkung = panjang ? pts : [a, [a[0] + (b[0] - a[0]) * 0.55, a[1] + (b[1] - a[1]) * 0.55]];
    var u = pts[pts.length - 1];
    return path(d1, 'none', lengan + 7, T) + path(polyline(lengkung), 'none', lengan + 9, T) +
      path(d1, 'none', lengan, tk.kulit) + path(polyline(lengkung), 'none', lengan + 2.5, pk.atas) +
      lingkar(u[0], u[1], K.tangan, tk.kulit, 3);
  }
  function kakiAnak(pts, tk, K, pk) {
    var u = pts[pts.length - 1], k = pts[pts.length - 2];
    var kaos = [[k[0] + (u[0] - k[0]) * 0.55, k[1] + (u[1] - k[1]) * 0.55], u];
    var warnaKaki = pk.kaki || (pk.bawahan === 'celanaPanjang' ? pk.bawah : pk.bawahan === 'rokPanjang' ? pk.bawah : tk.kulit);
    var out = path(polyline(pts), 'none', K.kaki + 7, T) + path(polyline(pts), 'none', K.kaki, warnaKaki) +
      (pk.kaus ? path(polyline(kaos), 'none', K.kaki, C.putih) : '');
    var rx = K.kaki * 0.95, ry = K.kaki * 0.58;
    if (pk.alas === 'kaki') out += elips(u[0] + 3, u[1] + 2.5, rx * 0.9, ry, tk.kulit, 2.6) + path('M' + f(u[0] + 7) + ',' + f(u[1] + 1) + ' l0,3', 'none', 1.4);
    else if (pk.alas === 'sandal') out += elips(u[0] + 3, u[1] + 4, rx * 1.05, ry * 0.55, C.koral, 2.2) + elips(u[0] + 3, u[1] + 1.5, rx * 0.85, ry * 0.8, tk.kulit, 2.4) + path('M' + f(u[0]) + ',' + f(u[1] + 1) + ' l6,0', 'none', 2.6, C.koralTua);
    else out += elips(u[0] + 3, u[1] + 2.5, rx, ry, pk.alas || T, 2.6) + elips(u[0] + 1, u[1] + 0.5, 2.6, 1.3, pk.alas === C.putih ? C.lavenderMuda : '#6B5A85');
    return out;
  }

  /* barang yang dipegang tangan depan (opsi.pegang) dan helm di kepala (opsi.helm) */
  function barang(nama, x, y, s) {
    var isi = '';
    switch (nama) {
      case 'gunting':
        isi = path('M0,0 L20,-16 M0,0 L22,-8', 'none', 6, T) + path('M0,0 L20,-16 M0,0 L22,-8', 'none', 3, '#D9DCE8') + lingkar(-5, 3, 4.5, 'none', 5, T) + lingkar(-5, 3, 4.5, 'none', 2.6, C.koral) + lingkar(1, 8, 4.5, 'none', 5, T) + lingkar(1, 8, 4.5, 'none', 2.6, C.koral);
        break;
      case 'pisau':
        isi = path('M0,0 L24,-14 L22,-8 Z', '#D9DCE8', 2.4) + path('M0,0 L-8,5', 'none', 6, T) + path('M0,0 L-8,5', 'none', 3.4, C.coklatTua);
        break;
      case 'jepit':
        isi = path('M0,0 L14,-6 M0,0 L14,-1', 'none', 4.4, T) + path('M0,0 L14,-6 M0,0 L14,-1', 'none', 2, C.koral);
        break;
      case 'gelas':
        isi = path('M-6,-14 L6,-14 L5,4 L-5,4 Z', 'rgba(221,242,251,.95)', 2.4) + path('M-5,-6 L5,-6 L4.5,3 L-4.5,3 Z', C.langit);
        break;
      case 'botol':
        isi = kotak(-7, -22, 14, 26, 4, C.lavender, 2.4) + kotak(-3, -29, 6, 7, 1.5, C.koral, 2) + kotak(-7, -15, 14, 10, 1, C.putih, 1.4) + lingkar(-2, -11, 2.2, C.langit, 1) + lingkar(3, -8, 1.6, C.langit, 1);
        break;
      case 'hp':
        isi = kotak(-5, -16, 11, 20, 3, '#3A2A4F', 2) + kotak(-3, -13, 7, 12, 1.5, C.langit, 0);
        break;
      case 'tali':
        isi = path('M-4,0 q-9,-8 -2,-11 q5,-1 6,8 q4,-9 9,-6 q5,4 -7,9 M-1,1 l-5,9 M1,1 l6,8', 'none', 4.4, T) + path('M-4,0 q-9,-8 -2,-11 q5,-1 6,8 q4,-9 9,-6 q5,4 -7,9 M-1,1 l-5,9 M1,1 l6,8', 'none', 2, C.putih);
        break;
      case 'kertas':
        isi = path('M-2,-14 L18,-12 L16,8 L-4,6 Z', C.krem, 2.2) + path('M2,-6 L13,-5 M1,0 L12,1', 'none', 1.6, C.lavender);
        break;
      case 'bola':
        isi = lingkar(0, -6, 9, C.kuning, 2.6) + path('M-9,-6 Q0,-11 9,-6', 'none', 2, C.koralTua);
        break;
      case 'helm':
        isi = path('M-11,0 C-11,-16 11,-16 11,0 Z', C.koral, 2.6) + path('M-13,0 L13,0', 'none', 3.4);
        break;
    }
    return g('translate(' + f(x) + ',' + f(y) + ') scale(' + (s || 1) + ')', isi);
  }
  function helmKepala(K, warna) {
    var y = K.kY, r = K.kR;
    return path('M' + f(-r - 3) + ',' + f(y - r * 0.15) + ' C' + f(-r - 3) + ',' + f(y - r * 1.45) + ' ' + f(r + 3) + ',' + f(y - r * 1.45) + ' ' + f(r + 3) + ',' + f(y - r * 0.15) + ' Z', warna || C.koral, 3.2) +
      path('M' + f(-r - 5) + ',' + f(y - r * 0.12) + ' L' + f(r + 7) + ',' + f(y - r * 0.2), 'none', 4.2) +
      path('M' + f(-r * 0.4) + ',' + f(y - r * 1.05) + ' q' + f(r * 0.3) + ',' + f(-r * 0.12) + ' ' + f(r * 0.6) + ',' + f(-r * 0.05), 'none', 3, 'rgba(255,255,255,.7)') +
      path('M' + f(-r * 0.85) + ',' + f(y) + ' Q' + f(-r * 0.6) + ',' + f(y + r * 0.85) + ' ' + f(r * 0.1) + ',' + f(y + r * 0.95), 'none', 2.2);
  }

  function rangkaKursi() {
    return lingkar(-2, -26, 22, 'none', 7, '#7A6E96') + path('M-22,-74 L-16,-40 L22,-40 L28,-8', 'none', 9, T) + path('M-22,-74 L-16,-40 L22,-40 L28,-8', 'none', 4.5, C.langitTua) +
      path('M-26,-76 L-18,-76', 'none', 6, T) + lingkar(28, -6, 6, '#6B5A85', 3);
  }
  function rodaKursi() {
    return lingkar(-6, -24, 24, 'none', 9, T) + lingkar(-6, -24, 24, 'none', 5, C.koral) + lingkar(-6, -24, 18.5, 'none', 2, C.koralTua) +
      path('M-6,-42 L-6,-6 M-24,-24 L12,-24 M-18.7,-36.7 L6.7,-11.3 M-18.7,-11.3 L6.7,-36.7', 'none', 1.8, C.lavender) + lingkar(-6, -24, 4, C.lavenderMuda, 2);
  }

  /* tokoh(id, pose, opsi): opsi.ekspresi, opsi.arah (1 kanan, -1 kiri), opsi.timpa (titik pose) */
  function tokoh(id, pose, opsi) {
    opsi = opsi || {};
    var tk = TOKOH[id];
    var K = kerangka(tk);
    var P = poseAnak(pose, K);
    if (opsi.timpa) for (var k in opsi.timpa) P[k] = opsi.timpa[k];
    var belakang = !!P.belakang;
    var arah3 = P.depan ? 0 : 1;
    var out = '';
    /* Tegar selalu duduk di kursi roda: kaki memakai pose duduk, lengan mengikuti pose yang diminta */
    var kursi = !!tk.kursiRoda;
    if (kursi) { var dk = poseAnak('dudukSamping', K); P.kb = dk.kb; P.kd = dk.kd; P.miring = 0; P.angkat = 0; P.naik = 0; P.belakang = false; P.depan = false; }
    if (kursi) {
      /* duduk di kursi roda: panggul di atas dudukan (y -40) */
      out += bayangTanah(36, 6, 2, 0);
    } else out += bayangTanah(tk.dewasa ? 30 : 24, 5, 0, 0);
    var badanSeluruh = '';
    var naik = kursi ? -40 - K.panggulY - 2 : (P.naik || P.angkat || 0);
    var pk = pakaianOf(tk, opsi), tl = K.tebalLengan || K.lengan * 0.72;
    if (opsi.celemek) pk.celemek = true;
    var tangan = P.ld[P.ld.length - 1];
    var pegang = opsi.pegang ? barang(opsi.pegang, tangan[0] + 2, tangan[1] - 2, tk.dewasa ? 1.15 : 1) : '';
    if (P.belakang) {
      badanSeluruh += kakiAnak(P.kb, tk, K, pk) + kakiAnak(P.kd, tk, K, pk) + baju(pk, K, true, P) +
        lenganAnak(P.lb, tk, K, tl, pk) + lenganAnak(P.ld, tk, K, tl, pk) + rambutAnak(tk.rambut, K, true) + (opsi.helm ? helmKepala(K, opsi.helm) : '');
    } else {
      /* P.kakiDepan: kaki depan digambar di depan badan (lutut terangkat saat duduk) */
      badanSeluruh += lenganAnak(P.lb, tk, K, tl, pk) + kakiAnak(P.kb, tk, K, pk) + (P.kakiDepan ? '' : kakiAnak(P.kd, tk, K, pk)) + baju(pk, K, false, P) + (P.kakiDepan ? kakiAnak(P.kd, tk, K, pk) : '') +
        rambutAnak(tk.rambut, K, true) +
        (/^jilbab/.test(tk.rambut) ? elips(2, K.kY + 3, K.kR * 0.8, K.kR * 0.86, tk.kulit, 2.8) : lingkar(0, K.kY, K.kR, tk.kulit, 3.4) +
          elips(-K.kR * 0.55, K.kY + 4, K.kR * 0.45, K.kR * 0.62, '#000', 0, 0, ' opacity=".05"')) +
        rambutAnak(tk.rambut, K, false) + wajahAnak(K, opsi.ekspresi, arah3) +
        (tk.kumis ? path('M' + f(-4) + ',' + f(K.kY + 8) + ' q' + f(7) + ',' + f(-4) + ' ' + f(14) + ',0 q' + f(-7) + ',' + f(3) + ' ' + f(-14) + ',0', C.rambut, 1.6) : '') +
        (tk.kacamata ? g('', [-4.5, 8.5].map(function (mx) { return lingkar(mx + 3.5, K.kY + 1, 6.4, 'rgba(255,255,255,.25)', 2.2); }).join('') + path('M5,' + f(K.kY) + ' h3', 'none', 2.2)) : '') +
        (opsi.helm ? helmKepala(K, opsi.helm) : '') +
        (opsi.topi ? path('M' + f(-K.kR - 2) + ',' + f(K.kY - K.kR * 0.3) + ' C' + f(-K.kR - 2) + ',' + f(K.kY - K.kR * 1.3) + ' ' + f(K.kR + 2) + ',' + f(K.kY - K.kR * 1.3) + ' ' + f(K.kR + 2) + ',' + f(K.kY - K.kR * 0.3) + ' Z', opsi.topi, 3) +
          path('M' + f(K.kR * 0.2) + ',' + f(K.kY - K.kR * 0.34) + ' Q' + f(K.kR * 1.2) + ',' + f(K.kY - K.kR * 0.46) + ' ' + f(K.kR * 1.55) + ',' + f(K.kY - K.kR * 0.14) + ' L' + f(K.kR * 0.4) + ',' + f(K.kY - K.kR * 0.16) + ' Z', opsi.topi, 2.6) : '') +
        (opsi.taliLepas ? path('M' + f(P.kd[2][0] + 2) + ',' + f(P.kd[2][1]) + ' q8,6 4,12 q-6,4 2,8 M' + f(P.kd[2][0] - 2) + ',' + f(P.kd[2][1]) + ' q-8,8 -2,14', 'none', 2.4, C.krem) : '') +
        lenganAnak(P.ld, tk, K, tl, pk) + pegang;
    }
    var tubuh = g('translate(0,' + f(naik) + ')' + (P.miring ? ' rotate(' + P.miring + ' 0 ' + f(K.panggulY) + ')' : ''), badanSeluruh);
    if (kursi) out += rangkaKursi() + tubuh + rodaKursi();
    else out += tubuh;
    return g(opsi.arah === -1 ? 'scale(-1,1)' : '', out);
  }

  /* ---------------- benda adegan ---------------- */
  function rantai(x1, y1, x2, y2) {
    var d = 'M' + f(x1) + ',' + f(y1) + ' L' + f(x2) + ',' + f(y2);
    return path(d, 'none', 7, T) + path(d, 'none', 3.6, '#B9B2CF', ' stroke-dasharray="5 3" stroke-linecap="butt"');
  }
  function dudukanAyun(x, y, rot) {
    return g('translate(' + f(x) + ',' + f(y) + ') rotate(' + f(rot || 0) + ')', kotak(-24, -5, 48, 10, 5, C.koral, 3.4) + kotak(-19, -3.5, 30, 3, 1.5, C.koralMuda));
  }
  /* ayunan rusak: rantai kanan putus, dudukan tergantung miring dari rantai kiri */
  function ayunanRusak(xKiri, xKanan, yAtas, yDuduk) {
    return rantai(xKanan, yAtas, xKanan + 2, yAtas + 62) + g('translate(' + f(xKanan + 2) + ',' + f(yAtas + 66) + ')', path('M-4,-4 l4,6 l3,-5', 'none', 2.6)) +
      rantai(xKiri, yAtas, xKiri + 4, yDuduk) + dudukanAyun(xKiri + 10, yDuduk + 22, 68);
  }
  function pecahanKaca(x, y) {
    var keping = [
      'M-24,4 L-14,-12 L-6,2 Z', 'M-2,6 L8,-16 L16,4 Z', 'M18,8 L28,-4 L32,10 Z', 'M-12,12 L-4,6 L2,14 Z'
    ];
    return g('translate(' + f(x) + ',' + f(y) + ')', elips(2, 10, 38, 7, C.lavender, 0, 0, ' opacity=".25"') +
      keping.map(function (d) { return path(d, '#DDF4FB', 2.6); }).join('') + path('M-17,-4 L-13,-8 M7,-8 L10,-12', 'none', 2.2, C.putih) +
      kilauBintang(-14, -20, 7) + kilauBintang(12, -26, 9) + kilauBintang(30, -12, 6));
  }
  function kilauBintang(x, y, r) {
    return path('M' + f(x) + ',' + f(y - r) + ' Q' + f(x + r * 0.18) + ',' + f(y - r * 0.18) + ' ' + f(x + r) + ',' + f(y) + ' Q' + f(x + r * 0.18) + ',' + f(y + r * 0.18) + ' ' + f(x) + ',' + f(y + r) +
      ' Q' + f(x - r * 0.18) + ',' + f(y + r * 0.18) + ' ' + f(x - r) + ',' + f(y) + ' Q' + f(x - r * 0.18) + ',' + f(y - r * 0.18) + ' ' + f(x) + ',' + f(y - r) + ' Z', C.putih, 1.6, C.kuningTua);
  }
  function bola(x, y, r) {
    return g('translate(' + f(x) + ',' + f(y) + ')', lingkar(0, 0, r, C.kuning, 3) + path('M' + f(-r) + ',0 Q0,' + f(-r * 0.5) + ' ' + f(r) + ',0', 'none', 2.4, C.koralTua) + path('M0,' + f(-r) + ' Q' + f(r * 0.4) + ',0 0,' + f(r), 'none', 2.4, C.koralTua));
  }
  function keranjang(x, y) {
    return g('translate(' + f(x) + ',' + f(y) + ')', bayangTanah(30, 5, 0, 0) + path('M-26,-40 L26,-40 L20,0 L-20,0 Z', C.coklat, 3.4) +
      path('M-24,-27 L24,-27 M-22,-14 L22,-14 M-10,-40 L-8,0 M8,-40 L7,0', 'none', 2.2, C.sisikTepi) + elips(0, -40, 26, 6, C.coklatTua, 3.4));
  }
  /* ---------------- properti kecil untuk gambar kartu dan adegan aman ---------------- */
  function garisTebal(d, warna, tebal) { return path(d, 'none', tebal + 7, T) + path(d, 'none', tebal, warna); }
  /* rangka ayunan kuning tampak depan: kaki A di kedua ujung, palang di yAtas */
  function rangkaAyun(xKiri, xKanan, yAtas, yTanah) {
    var d = 'M' + f(xKiri - 30) + ',' + yTanah + ' L' + xKiri + ',' + yAtas + ' L' + f(xKiri + 30) + ',' + yTanah +
      ' M' + f(xKanan - 30) + ',' + yTanah + ' L' + xKanan + ',' + yAtas + ' L' + f(xKanan + 30) + ',' + yTanah;
    return garisTebal(d, C.kuning, 7) + garisTebal('M' + f(xKiri - 6) + ',' + yAtas + ' H' + f(xKanan + 6), C.kuning, 7);
  }
  /* pita pengaman kuning-terong (dipasang Bu Guru di ayunan rusak) */
  function pita(x1, y1, x2, y2) {
    var d = 'M' + f(x1) + ',' + f(y1) + ' L' + f(x2) + ',' + f(y2);
    return path(d, 'none', 13, T) + path(d, 'none', 8, C.kuning) + path(d, 'none', 8, T, ' stroke-dasharray="7 7" stroke-linecap="butt"');
  }
  /* perosotan tampak samping menghadap kanan; asal = kaki tangga di tanah */
  function perosotan(x, y, s) {
    return g('translate(' + f(x) + ',' + f(y) + ') scale(' + (s || 1) + ')',
      garisTebal('M8,0 L44,-112 M24,0 L58,-104 M86,0 L86,-112', C.lavenderTua, 5) +
      garisTebal('M2,-1 L36,-112 M20,-1 L52,-108', C.hijau, 5) + path('M12,-26 L28,-26 M18,-52 L36,-52 M26,-78 L44,-78', 'none', 4, C.hijauTua) +
      path('M36,-116 L96,-116 L96,-104 L36,-104 Z', C.lavender, 3.4) +
      path('M28,-120 L66,-168 L104,-120 Z', C.kuning, 3.6) +
      path('M92,-114 C120,-110 130,-70 156,-36 C170,-16 186,-10 204,-10 L206,6 C180,8 160,-2 144,-24 C122,-56 110,-92 92,-96 Z', C.koral, 3.6) +
      path('M100,-104 C122,-98 132,-64 154,-34', 'none', 3, C.koralMuda));
  }
  /* pagar tinggi hijau; asal = kiri bawah */
  function pagarTinggi(x, y, w, h) {
    var d = '';
    for (var i = 0; i <= w; i += 18) d += 'M' + f(x + i) + ',' + y + ' V' + f(y - h) + ' ';
    return garisTebal(d, C.hijau, 4) + garisTebal('M' + f(x - 4) + ',' + f(y - h + 6) + ' H' + f(x + w + 4) + ' M' + f(x - 4) + ',' + f(y - h * 0.45) + ' H' + f(x + w + 4), C.hijauTua, 4);
  }
  /* panjatan rendah berbentuk kubah; asal = tengah bawah */
  function kubah(x, y, w, h) {
    var d = 'M' + f(x - w / 2) + ',' + y + ' Q' + f(x - w / 2) + ',' + f(y - h * 1.3) + ' ' + x + ',' + f(y - h) + ' Q' + f(x + w / 2) + ',' + f(y - h * 1.3) + ' ' + f(x + w / 2) + ',' + y +
      ' M' + f(x - w / 4) + ',' + y + ' Q' + f(x - w / 5) + ',' + f(y - h * 1.1) + ' ' + x + ',' + f(y - h) + ' Q' + f(x + w / 5) + ',' + f(y - h * 1.1) + ' ' + f(x + w / 4) + ',' + y +
      ' M' + f(x - w * 0.47) + ',' + f(y - h * 0.4) + ' Q' + x + ',' + f(y - h * 0.62) + ' ' + f(x + w * 0.47) + ',' + f(y - h * 0.4);
    return garisTebal(d, C.hijau, 5);
  }
  /* bak pasir kayu; asal = kiri bawah */
  function bakPasir(x, y, w) {
    return path('M' + f(x + 8) + ',' + f(y - 30) + ' Q' + f(x + w / 2) + ',' + f(y - 50) + ' ' + f(x + w - 8) + ',' + f(y - 30) + ' Z', '#F3DDB0', 3) +
      kotak(x, y - 30, w, 30, 6, C.coklat, 3.6) + path('M' + f(x + 6) + ',' + f(y - 16) + ' H' + f(x + w - 6), 'none', 2.4, C.sisikTepi);
  }
  function ember(x, y, warna) {
    return g('translate(' + f(x) + ',' + f(y) + ')', path('M-14,-26 L14,-26 L10,0 L-10,0 Z', warna || C.koral, 3.2) + path('M-12,-26 Q0,-44 12,-26', 'none', 2.6));
  }
  function pengki(x, y) {
    return g('translate(' + f(x) + ',' + f(y) + ')', path('M-18,-4 L16,-4 L22,8 L-22,8 Z', C.hijau, 3.2) + garisTebal('M0,-4 L0,-34', C.coklat, 4));
  }
  /* garis gerak cepat di belakang tokoh */
  function garisCepat(x, y) {
    return path('M' + f(x) + ',' + f(y) + ' h-26 M' + f(x - 6) + ',' + f(y + 14) + ' h-34 M' + f(x) + ',' + f(y + 28) + ' h-22', 'none', 4, C.lavender);
  }
  /* jejak titik-titik (jalur aman) */
  function jejak(d) { return path(d, 'none', 5, C.hijauTua, ' stroke-dasharray="2 12"'); }
  /* tanda centang hijau kecil (Teladan sudah ditemukan, jawaban benar) */
  function centang(x, y, r) {
    r = r || 18;
    return g('translate(' + f(x) + ',' + f(y) + ')', lingkar(0, 0, r, C.hijau, 3.4) + path('M' + f(-r * 0.45) + ',0 L' + f(-r * 0.1) + ',' + f(r * 0.38) + ' L' + f(r * 0.5) + ',' + f(-r * 0.36), 'none', r * 0.24, C.krem));
  }

  function awan(x, y, s) {
    return g('translate(' + f(x) + ',' + f(y) + ') scale(' + (s || 1) + ')', path('M-60,10 C-70,-8 -46,-22 -30,-12 C-24,-34 10,-38 18,-16 C34,-26 58,-14 52,6 C64,10 60,24 44,24 L-48,24 C-66,24 -70,14 -60,10 Z', C.putih, 0, 0, ' opacity=".92"') +
      path('M-48,24 L44,24 C54,24 60,18 56,12 C40,18 -40,18 -58,14 C-62,20 -56,24 -48,24 Z', C.langitMuda, 0, 0, ' opacity=".9"'));
  }
  function burung(x, y, s) {
    return g('translate(' + f(x) + ',' + f(y) + ') scale(' + (s || 1) + ')', path('M-12,0 Q-6,-8 0,0 Q6,-8 12,0', 'none', 3, C.lavenderTua));
  }
  function kupu(x, y, warna) {
    return g('translate(' + f(x) + ',' + f(y) + ')', elips(-6, -3, 6, 8, warna || C.kuning, 2, T, ' transform="rotate(-25 -6 -3)"') + elips(6, -3, 6, 8, warna || C.kuning, 2, T, ' transform="rotate(25 6 -3)"') + elips(0, 0, 1.8, 6, T));
  }
  function layang(x, y, s, warna1, warna2, rot) {
    return g('translate(' + f(x) + ',' + f(y) + ') rotate(' + (rot || 0) + ') scale(' + (s || 1) + ')',
      path('M0,-34 L24,0 L0,40 L-24,0 Z', warna1, 3.4) + path('M0,-34 L24,0 L0,0 Z', warna2) + path('M0,-34 L24,0 L0,40 L-24,0 Z M0,-34 L0,40 M-24,0 L24,0', 'none', 2.6) +
      path('M0,40 C10,60 -12,74 2,92 C14,108 -8,118 4,134', 'none', 3, warna2) +
      [[6, 58], [-6, 80], [8, 104]].map(function (q) { return path('M' + q[0] + ',' + q[1] + ' l-7,-4 l0,8 z M' + q[0] + ',' + q[1] + ' l7,-4 l0,8 z', warna1, 1.8); }).join(''));
  }

  /* ---------------- ikon antarmuka (kotak 48x48, garis Terong) ---------------- */
  function ikon(nama, ukuran) {
    var s = (ukuran || 48) / 48, isi = '';
    switch (nama) {
      case 'peta':
        isi = path('M6,12 L17,8 L31,13 L42,9 L42,37 L31,41 L17,36 L6,40 Z', C.krem, 3.4) + path('M17,8 L17,36 M31,13 L31,41', 'none', 3) +
          path('M8,26 C14,22 20,30 26,24 C30,20 36,26 40,22', 'none', 2.4, C.hijauTua, ' stroke-dasharray="3 3"') +
          path('M31,6 C25,6 22,11 24,15 L31,25 L38,15 C40,11 37,6 31,6 Z', C.koral, 3) + lingkar(31, 12.5, 2.6, C.krem);
        break;
      case 'suara':
        isi = path('M8,19 L15,19 L25,10 L25,38 L15,29 L8,29 Z', C.krem, 3.4) + path('M31,17 Q36,24 31,31 M36,12 Q45,24 36,36', 'none', 3.6);
        break;
      case 'senyap':
        isi = path('M8,19 L15,19 L25,10 L25,38 L15,29 L8,29 Z', C.krem, 3.4) + path('M31,18 L42,30 M42,18 L31,30', 'none', 4.2);
        break;
      case 'gerigi':
        var d = '';
        for (var i = 0; i < 8; i++) {
          var a0 = (i / 8) * Math.PI * 2, a1 = a0 + 0.22, a2 = a0 + 0.56, a3 = a0 + 0.78;
          d += (i ? ' L' : 'M') + f(24 + Math.cos(a0) * 14) + ',' + f(24 + Math.sin(a0) * 14) + ' L' + f(24 + Math.cos(a1) * 19) + ',' + f(24 + Math.sin(a1) * 19) +
            ' L' + f(24 + Math.cos(a2) * 19) + ',' + f(24 + Math.sin(a2) * 19) + ' L' + f(24 + Math.cos(a3) * 14) + ',' + f(24 + Math.sin(a3) * 14);
        }
        isi = path(d + ' Z', C.krem, 3.4) + lingkar(24, 24, 6, C.lavenderMuda, 3);
        break;
      case 'layarPenuh':
        isi = path('M8,17 L8,8 L17,8 M31,8 L40,8 L40,17 M40,31 L40,40 L31,40 M17,40 L8,40 L8,31', 'none', 4.2);
        break;
      case 'info':
        isi = lingkar(24, 24, 18, C.krem, 3.4) + lingkar(24, 15, 3, T) + path('M24,22 L24,34', 'none', 5);
        break;
      case 'buku':
        isi = path('M24,12 C18,8 10,8 6,10 L6,38 C10,36 18,36 24,40 C30,36 38,36 42,38 L42,10 C38,8 30,8 24,12 Z', C.krem, 3.4) + path('M24,12 L24,40', 'none', 3);
        break;
      case 'orang':
        isi = lingkar(24, 17, 8, C.krem, 3.4) + path('M10,40 C10,30 16,27 24,27 C32,27 38,30 38,40 Z', C.krem, 3.4);
        break;
      case 'mata':
        isi = path('M5,24 C12,13 36,13 43,24 C36,35 12,35 5,24 Z', C.krem, 3.4) + lingkar(24, 24, 7.5, C.langitTua, 3) + lingkar(24, 24, 3, T) + lingkar(21.5, 21.5, 1.6, C.putih);
        break;
      case 'bohlam':
        isi = path('M24,7 C15,7 10,14 10,21 C10,27 14,30 17,33 L17,37 L31,37 L31,33 C34,30 38,27 38,21 C38,14 33,7 24,7 Z', C.kuning, 3.4) + path('M18,41 L30,41', 'none', 3.4) + path('M20,24 Q24,18 28,24', 'none', 2.4, C.kuningTua);
        break;
      case 'telapak':
        isi = g('translate(2,2) scale(.44)', telapak(C.krem, 6.5));
        break;
      case 'mainkan':
        isi = path('M16,10 L38,24 L16,38 Z', C.krem, 4);
        break;
      case 'centang':
        isi = path('M10,25 L20,35 L38,13', 'none', 7, C.krem);
        break;
      /* ikon jurus di Hasil Belajarku */
      case 'helm':
        isi = path('M8,32 C8,17 16,9 25,9 C34,9 41,17 41,32 Z', C.kuning, 3.4) + path('M4,31 H45 C45,36 43,39 39,39 H9 C6,39 4,36 4,31 Z', C.kuning, 3.4) + path('M22,13 C20,19 20,25 21,30', 'none', 3);
        break;
      case 'menjauh':
        isi = lingkar(14, 13, 6.5, C.krem, 3.2) + path('M5,40 C5,29 9,24 14,24 C19,24 23,29 23,40 Z', C.krem, 3.2) + path('M28,24 H43 M36,16 L44,24 L36,32', 'none', 4.6);
        break;
      case 'aturan':
        isi = lingkar(24, 24, 19, C.hijau, 3.4) + path('M14,24.5 L21,31.5 L34,17', 'none', 5, C.krem);
        break;
      case 'beritahu':
        isi = lingkar(16, 19, 7, C.krem, 3.2) + path('M4,42 C4,32 9,28 16,28 C23,28 28,32 28,42 Z', C.krem, 3.2) + path('M28,5 H45 V20 H37 L32,25 V20 H28 Z', C.krem, 3.2) + path('M33,12.5 H40', 'none', 3);
        break;
      case 'panah':
        isi = path('M14,8 L34,24 L14,40', 'none', 8, C.lavenderTua);
        break;
      case 'kunci':
        isi = path('M16,22 V15 C16,7 32,7 32,15 V22', 'none', 4.4) + kotak(10, 21, 28, 21, 6, C.lavenderMuda, 3.4) + lingkar(24, 31, 3, T);
        break;
      case 'kembali':
        isi = path('M30,10 L14,24 L30,38', 'none', 7);
        break;
      case 'jempol':
        isi = path('M14,22 L22,22 L26,8 C30,6 33,9 32,14 L30,22 L38,22 C42,22 43,27 40,29 C43,31 42,35 38,36 C40,38 38,42 34,42 L22,42 Q14,42 14,36 Z', C.kuning, 3.4) + kotak(6, 21, 9, 22, 3, C.kuningTua, 3);
        break;
      case 'bintang':
        isi = path('M24,5 L29.5,17 L42,18.5 L32.5,27 L35.5,40 L24,33.5 L12.5,40 L15.5,27 L6,18.5 L18.5,17 Z', C.kuning, 3.4);
        break;
    }
    return g('scale(' + f(s) + ')', isi);
  }
  /* sisik kecil untuk Papan Sisik dan penghitung (kotak 40x46) */
  function sisikIkon(keadaan, w) {
    var s = (w || 40) / 40;
    var isi = '';
    var d = 'M4,6 C4,30 12,42 20,42 C28,42 36,30 36,6 C28,2 12,2 4,6 Z';
    if (keadaan === 'kosong') isi = path(d, 'rgba(255,248,234,.7)', 2.6, C.lavender, ' stroke-dasharray="5 4"');
    else {
      var w1 = keadaan === 'perak' ? [C.perak, C.perakTepi, C.putih] : [C.emas, C.emasTepi, C.emasKilau];
      isi = path(d, w1[0], 3.2, T) + path('M10,12 C10,26 14,33 19,36', 'none', 3.4, w1[2]) + path('M8,8 C16,5 24,5 32,8', 'none', 2.2, w1[1]);
    }
    return g('scale(' + f(s) + ')', isi);
  }

  /* Panel bertepi bawah bergelombang seperti sisik trenggiling (motif HUD dan panel). */
  function panelSisik(w, h, isi, gelombang) {
    var n = Math.max(3, Math.round(w / (gelombang || 30))), lw = w / n, d = 'M24,0 L' + f(w - 24) + ',0 Q' + f(w) + ',0 ' + f(w) + ',24 L' + f(w) + ',' + f(h - 10);
    for (var i = n - 1; i >= 0; i--) d += ' Q' + f(lw * i + lw / 2) + ',' + f(h + 8) + ' ' + f(lw * i) + ',' + f(h - 10);
    d += ' L0,24 Q0,0 24,0 Z';
    return g('translate(0,7)', path(d, C.lavender, 0, 0, ' opacity=".35"')) + path(d, isi || C.krem, 4);
  }
  /* Papan Sisik: 6 slot tempat ini (5 bahaya + Momen Tahan) dan penghitung total */
  /* nSlot: 6 untuk tempat utama (slot ke-6 = Momen, bertanda telapak); 3 untuk tempat TAMBAHAN (digeser ke tengah) */
  function papanSisik(daftar, jumlah, total, nSlot) {
    var out = panelSisik(452, 82, C.krem, 32), n = nSlot || 6, x0 = 20 + (6 - n) * 24;
    for (var i = 0; i < n; i++) {
      var k = daftar[i] || 'kosong';
      out += g('translate(' + (x0 + i * 48) + ',14)', sisikIkon(k, 38));
      if (n === 6 && i === 5 && k === 'kosong') out += g('translate(' + (20 + i * 48 + 9.5) + ',22) scale(.19)', telapak(C.lavender, 0));
    }
    out += path('M318,14 L318,66', 'none', 3, C.lavender, ' stroke-dasharray="4 5"');
    out += g('translate(332,16) scale(.82)', sisikIkon('emas', 40)) +
      '<text x="374" y="52" font-family="Grandstander, sans-serif" font-weight="900" font-size="30" fill="' + T + '" data-maxw="72">' + jumlah + '/' + total + '</text>';
    return out;
  }

  /* tangan penunjuk: ujung telunjuk di (0,0), tangan di bawah kanan */
  function tanganPenunjuk() {
    var kulit = '#FFD9B3';
    var bentuk = function (isi, sw) {
      return kotak(-8, -2, 16, 46, 8, isi, sw) + kotak(6, 26, 15, 30, 7.5, isi, sw) + kotak(18, 30, 14, 28, 7, isi, sw) + kotak(29, 36, 12, 24, 6, isi, sw) +
        '<rect x="-24" y="40" width="14" height="30" rx="7" transform="rotate(-40 -17 55)" fill="' + isi + '"' + garis(sw) + '/>' + kotak(-10, 38, 50, 44, 18, isi, sw);
    };
    return g('rotate(-18)', bentuk(T, 9) + bentuk(kulit, 0) + path('M4,30 L4,40 M19,44 L19,50', 'none', 2.2, '#E3A97A') + kotak(-12, 70, 54, 18, 7, C.koral, 3.6));
  }

  return {
    C: C, svg: svg, g: g, path: path, lingkar: lingkar, elips: elips, kotak: kotak, f: f,
    tara: tara, tokoh: tokoh, TOKOH: TOKOH, telapak: telapak, lencana: lencana, satuSisik: satuSisik, sisikIkon: sisikIkon,
    ayunanRusak: ayunanRusak, rantai: rantai, dudukanAyun: dudukanAyun, pecahanKaca: pecahanKaca, kilauBintang: kilauBintang,
    bola: bola, keranjang: keranjang, awan: awan, burung: burung, kupu: kupu, layang: layang, ikon: ikon, tanganPenunjuk: tanganPenunjuk,
    barang: barang, PAKAIAN: PAKAIAN,
    panelSisik: panelSisik, papanSisik: papanSisik, garisTebal: garisTebal, rangkaAyun: rangkaAyun, pita: pita, perosotan: perosotan,
    pagarTinggi: pagarTinggi, kubah: kubah, bakPasir: bakPasir, ember: ember, pengki: pengki, garisCepat: garisCepat, jejak: jejak, centang: centang,
    bayangTanah: bayangTanah, uid: uid
  };
})();
