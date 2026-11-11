/* Aktor: tiap pose SVG (js/engine/seni.js) dirasterkan sekali menjadi gambar (Blob URL), lalu digerakkan dengan transform CSS.
   Alasan (GDD bagian 16): satu Tara berisi sekitar 600 elemen SVG karena sisiknya; sebagai gambar, gerak tiap frame hanya
   mengubah transform satu elemen, jadi tetap lancar di HP murah. Gerak diam (putaran) dijalankan loop JS sehingga dunia
   bisa dibekukan saat BERHENTI dan disalin apa adanya ke Kaca Pembesar.
   Titik asal aktor = titik jangkar gambar (kaki tokoh, atau poros ayunan). */
(function (root) {
  var NS = 'http://www.w3.org/2000/svg';
  var cache = {};
  /* kotak gambar (viewBox) per jenis, cukup lebar untuk semua pose */
  var KOTAK = { anak: [-90, -200, 180, 216], dewasa: [-95, -250, 190, 266], tara: [-150, -262, 296, 280], kursi: [-90, -200, 190, 216] };

  function svgUtuh(isi, k) {
    return '<svg xmlns="' + NS + '" viewBox="' + k.join(' ') + '" width="' + k[2] + '" height="' + k[3] + '">' + isi + '</svg>';
  }
  /* gambar(kunci, buat, kotak): buat() mengembalikan isi SVG. Hasilnya { url, kotak }. */
  function gambar(kunci, buat, kotak) {
    var c = cache[kunci];
    if (c) return c;
    var s = svgUtuh(buat(), kotak);
    var url;
    try { url = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' })); }
    catch (e) { url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); }
    c = cache[kunci] = { url: url, kotak: kotak, kunci: kunci };
    return c;
  }
  /* Tara punya satu set gambar per keadaan sisik dan perlengkapan. Hanya dua keadaan terakhir disimpan; Blob keadaan lama
     dibebaskan supaya memori HP murah tidak terus bertambah selama permainan (gambar yang sedang tampil tetap utuh). */
  var taraTerakhir = [];
  function bersihTara(tanda) {
    if (taraTerakhir[0] === tanda) return;
    taraTerakhir = [tanda].concat(taraTerakhir.filter(function (x) { return x !== tanda; })).slice(0, 2);
    Object.keys(cache).forEach(function (k) {
      var c = cache[k];
      if (c.tanda == null || taraTerakhir.indexOf(c.tanda) >= 0) return;
      if (c.url.slice(0, 5) === 'blob:') { try { URL.revokeObjectURL(c.url); } catch (e) { } }
      delete cache[k];
    });
  }
  function kotakTokoh(id) {
    var tk = Seni.TOKOH[id];
    return tk.dewasa ? KOTAK.dewasa : tk.kursiRoda ? KOTAK.kursi : KOTAK.anak;
  }
  var Gambar = {
    gambar: gambar,
    tokoh: function (id, pose, eks, timpaKunci, timpa) {
      return gambar('t|' + id + '|' + pose + '|' + (eks || '') + '|' + (timpaKunci || ''), function () {
        return Seni.tokoh(id, pose, { ekspresi: eks, timpa: timpa });
      }, kotakTokoh(id));
    },
    /* tokoh dengan opsi lengkap (pakaian, warna, alas, pegang, helm, celemek, timpa) */
    orang: function (id, pose, opsi) {
      opsi = opsi || {};
      return gambar('o|' + id + '|' + pose + '|' + JSON.stringify(opsi), function () { return Seni.tokoh(id, pose, opsi); }, kotakTokoh(id));
    },
    /* Tara: sisik (24 keadaan) dan perlengkapan ikut menentukan gambar */
    tara: function (pose, o) {
      o = o || {};
      /* sisik ekor (T5) selalu diambil dari simpanan bila tidak diberikan */
      if (!o.ekor && root.Save && Save.daftarEkor) { var o2 = {}, kk; for (kk in o) o2[kk] = o[kk]; o2.ekor = Save.daftarEkor(); o = o2; }
      function kode(a) { return (a || []).map(function (x) { return x ? x.charAt(0) : '-'; }).join(''); }
      var tanda = kode(o.sisik) + '|' + kode(o.ekor) + '|' + (o.perlengkapan || []).join(',') + '|' + (o.topi ? 'topi' : '');
      bersihTara(tanda);
      var c = gambar('tara|' + pose + '|' + (o.kedip ? 1 : 0) + '|' + tanda, function () {
        return Seni.tara(pose, o);
      }, KOTAK.tara);
      c.tanda = tanda;
      return c;
    },
    /* semua gambar yang sudah dibuat didekode lebih dulu supaya tidak tersendat saat pertama tampil */
    pramuat: function (daftar) {
      return Promise.all(daftar.map(function (g) {
        var im = new Image();
        im.src = g.url;
        return im.decode ? im.decode().catch(function () { }) : Promise.resolve();
      }));
    },
    jumlah: function () { return Object.keys(cache).length; }
  };

  function Aktor(induk, o) {
    o = o || {};
    var el = document.createElement('div');
    el.className = 'aktor' + (o.kelas ? ' ' + o.kelas : '');
    if (o.id) el.dataset.aktor = o.id;
    var img = document.createElement('img');
    img.alt = ''; img.draggable = false; img.decoding = 'async';
    el.appendChild(img);
    induk.appendChild(el);
    this.el = el; this.img = img; this.id = o.id;
    this.x = o.x || 0; this.y = o.y || 0; this.s = o.s || 1; this.arah = o.arah || 1;
    this.dx = 0; this.dy = 0; this.rot = 0; this.rx = 0; this.sx = 1; this.sy = 1; this.alpha = o.alpha == null ? 1 : o.alpha;
    this.putar = null; this.t = Math.random() * 10; this.bingkai = '';
    if (o.z != null) el.style.zIndex = o.z;
    if (o.g) this.pakai(o.g);
    this.atur();
  }
  Aktor.prototype.pakai = function (g) {
    if (!g || this.g === g) return this;
    this.g = g;
    var k = g.kotak, im = this.img;
    im.src = g.url;
    im.style.left = k[0] + 'px'; im.style.top = k[1] + 'px'; im.style.width = k[2] + 'px'; im.style.height = k[3] + 'px';
    return this;
  };
  Aktor.prototype.atur = function () {
    var t = 'translate(' + (this.x + this.dx).toFixed(1) + 'px,' + (this.y + this.dy).toFixed(1) + 'px)';
    if (this.rx) t += ' perspective(900px) rotateX(' + this.rx.toFixed(2) + 'deg)';
    if (this.rot) t += ' rotate(' + this.rot.toFixed(2) + 'deg)';
    t += ' scale(' + (this.s * this.sx * this.arah).toFixed(3) + ',' + (this.s * this.sy).toFixed(3) + ')';
    this.el.style.transform = t;
    this.el.style.opacity = this.alpha;
    return this;
  };
  Aktor.prototype.tampil = function (on) { this.el.style.display = on === false ? 'none' : ''; return this; };
  /* langkah putaran diam; dt dalam detik */
  Aktor.prototype.jalankan = function (dt) {
    if (!this.putar) return;
    this.t += dt;
    this.putar(this.t, this);
    this.atur();
  };
  /* berjalan ke (x2, y2) dengan siklus pose. bingkai: daftar gambar (mis. jalan, jalan2, jalan3, jalan2). Promise. */
  Aktor.prototype.jalanKe = function (x2, y2, ms, bingkai, diam) {
    var a = this, x1 = a.x, y1 = a.y, lalu = -1, simpan = a.putar;
    a.putar = null;
    if (Math.abs(x2 - x1) > 2) a.arah = x2 > x1 ? 1 : -1;
    a.dy = 0; a.rot = 0;
    return Tween.run(ms, function (e, k) {
      a.x = x1 + (x2 - x1) * e; a.y = y1 + (y2 - y1) * e;
      var i = Math.floor(k * ms / 140) % bingkai.length;
      if (i !== lalu) { lalu = i; a.pakai(bingkai[i]); }
      a.atur();
    }, Ease.linear).then(function () { if (diam) a.pakai(diam); a.putar = simpan; a.atur(); });
  };
  Aktor.prototype.hapus = function () { if (this.el.parentNode) this.el.parentNode.removeChild(this.el); };

  root.Gambar = Gambar;
  root.Aktor = Aktor;
})(window);
