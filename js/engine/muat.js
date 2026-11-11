/* Layar muat (brief: bilah terisi sisik): logo, bilah berisi 12 sisik yang menyala satu per satu, bola Tara menggelinding
   di atasnya, dan satu "Tahukah kamu?". Pola dari Kafe Cilik: tampil minimal MIN ms, kemajuan tidak pernah mundur. */
(function (root) {
  var MIN = U.TEST && !/[?&]muat=1/.test(location.search) ? 0 : 1600, el = null, t0 = 0, nilai = 0, N = 12;
  var Muat = {
    buka: function () {
      t0 = performance.now(); nilai = 0;
      var tips = STR.muatTips, S = Seni, C = S.C, sisik = '';
      for (var i = 0; i < N; i++) sisik += S.g('translate(' + (40 + i * 46) + ',22)', '<g class="muat-sisik" data-i="' + i + '">' + S.sisikIkon('kosong', 36) + '</g>');
      el = U.h('div', '',
        '<div class="muat-logo">' + S.svg(720, 150, S.g('translate(40,20) scale(.62)', S.lencana(60, 60, 60)) +
          '<text x="132" y="110" font-family="Grandstander, sans-serif" font-weight="900" font-size="96" fill="' + C.kuning + '" stroke="' + C.terong + '" stroke-width="12" stroke-linejoin="round" paint-order="stroke">' + UI.esc(STR.judul.a + ' ' + STR.judul.b) + '</text>') + '</div>' +
        '<div class="muat-bilah">' + S.svg(640, 90, S.kotak(14, 14, 612, 62, 31, C.krem, 4) + sisik) +
          '<div class="muat-bola">' + S.svg(120, 140, S.g('translate(60,128) scale(.5)', S.tara('bola'))) + '</div></div>' +
        '<div class="muat-teks"></div>' +
        '<div class="muat-tip"><b>' + UI.esc(STR.muatTahu) + '</b>' + UI.esc(tips[Math.floor(Math.random() * tips.length)]) + '</div>');
      el.id = 'muat';
      Stage.el.appendChild(el);
      Muat.atur(0);
    },
    /* k: 0 sampai 1 */
    atur: function (k) {
      if (!el) return;
      nilai = Math.max(nilai, k);
      var n = Math.round(nilai * N);
      Array.prototype.forEach.call(el.querySelectorAll('.muat-sisik'), function (g, i) {
        if (i < n && !g.dataset.emas) { g.dataset.emas = 1; g.innerHTML = Seni.sisikIkon('emas', 36); }
      });
      var bola = el.querySelector('.muat-bola');
      bola.style.transform = 'translateX(' + (nilai * 540) + 'px) rotate(' + (nilai * 720) + 'deg)';
      el.querySelector('.muat-teks').textContent = STR.muat + '... ' + Math.round(nilai * 100) + '%';
    },
    tunggu: function () { return new Promise(function (ok) { setTimeout(ok, Math.max(0, MIN - (performance.now() - t0))); }); },
    tutup: function () {
      if (!el) return;
      var e = el;
      el = null;
      if (!MIN) { e.remove(); return; }
      e.classList.add('tutup');
      setTimeout(function () { e.remove(); }, 420);
    }
  };
  root.Muat = Muat;
})(window);
