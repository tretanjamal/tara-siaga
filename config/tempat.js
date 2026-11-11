/* Data tempat (GDD 6.1 dan 11). Teks ada di js/data/strings.js (STR.tempat), di sini hanya letak, jawaban, dan tag.
   Koordinat logis 1280x720, diukur dari latar final (mockup Fase 0, GDD 12.7).
   area: [x, y, w, h] kotak ketuk (min. 120x120, jarak min. 16); lensa: titik adegan di tengah Kaca Pembesar;
   sorot: [x, y, r] bagian berisiko yang berdenyut (petunjuk tingkat 2).
   kartu: k = kunci teks dan gambar; benar + jurus, atau keluarga pengecoh (GDD 7.3). cadangan = kartu ke-3 (hanya saat adaptif naik).
   tag: tujuan pembelajaran (TP1 kenali-bahaya, TP2 pilih-aman, TP3 berhenti-pikir, TP4 minta-bantuan, TP5 aturan-main).
   kilat: jawaban Kartu Kilat (situasi serupa sesudah dibantu): 'aman' atau 'tahan'. */
window.TEMPAT = {
  urut: ['t1', 't2', 't3', 't4'],
  /* tempat TAMBAHAN: tidak ikut syarat Pawai Siaga dan 24 sisik punggung; sisiknya di ekor Tara */
  tambahan: ['t5'],
  /* jurus -> tag TP tambahan (semua bahaya juga kenali-bahaya dan pilih-aman) */
  tagJurus: { beritahu: 'minta-bantuan', berhenti: 'berhenti-pikir', aturan: 'aturan-main', menjauh: '', pelindung: '' },

  t1: {
    latar: 'latar-t1-taman', musik: 'taman', hadiah: 'hadiah-peluit', perlengkapan: 'peluit', kartu: 2,
    slot: ['ayunan', 'lari', 'dorong', 'kaca', 'pagar', 'momen'],
    bahaya: [
      { id: 'ayunan', area: [40, 280, 198, 236], lensa: [150, 418], sorot: [236, 362, 26], kilat: 'aman',
        kartu: [{ k: 'guru', benar: true, jurus: 'beritahu' }, { k: 'duduk', keluarga: 'HATI' }, { k: 'diam', keluarga: 'DIAM', cadangan: true }] },
      { id: 'lari', area: [254, 300, 146, 290], lensa: [290, 470], sorot: [282, 520, 34], kilat: 'aman',
        kartu: [{ k: 'jauh', benar: true, jurus: 'menjauh' }, { k: 'cepat', keluarga: 'CEPAT' }, { k: 'hati', keluarga: 'HATI', cadangan: true }] },
      { id: 'dorong', area: [456, 318, 148, 212], lensa: [526, 430], sorot: [530, 442, 26], kilat: 'tahan',
        kartu: [{ k: 'antre', benar: true, jurus: 'aturan' }, { k: 'dorong', keluarga: 'CEPAT' }, { k: 'ikut', keluarga: 'IKUT', cadangan: true }] },
      { id: 'kaca', area: [622, 500, 130, 122], lensa: [687, 545], sorot: [687, 572, 34], kilat: 'tahan',
        kartu: [{ k: 'guru', benar: true, jurus: 'beritahu' }, { k: 'ambil', keluarga: 'SENDIRI' }, { k: 'diam', keluarga: 'DIAM', cadangan: true }] },
      { id: 'pagar', area: [1124, 250, 148, 212], lensa: [1170, 370], sorot: [1190, 300, 30], kilat: 'aman',
        kartu: [{ k: 'turun', benar: true, jurus: 'berhenti' }, { k: 'hati', keluarga: 'HATI' }, { k: 'cepat', keluarga: 'CEPAT', cadangan: true }] }
    ],
    /* Momen Tahan (GDD 6.4): Raka di puncak perosotan bersiap melompat.
       gerak: lama gerak lambat sampai titik bahaya (detik adegan); beku: membeku sendiri sekian detik sebelum titik bahaya. */
    momen: { id: 'momen', lensa: [640, 330], sorot: [690, 350, 28], kilat: 'tahan', gerak: 5, beku: 1, gerakSantai: 6, bekuSantai: 2,
      kartu: [{ k: 'duduk', benar: true, jurus: 'berhenti' }, { k: 'lompat', keluarga: 'IKUT' }, { k: 'pelan', keluarga: 'HATI', cadangan: true }] },
    teladan: [
      { id: 'panjat', area: [896, 336, 166, 164] },
      { id: 'bola', area: [1092, 496, 180, 200] }
    ]
  },

  /* T2 Rumah Sari: rumah potong (teras, ruang tengah, dapur, kamar mandi); tujuh titik berjajar 120 px berjarak 16 px */
  t2: {
    latar: 'latar-t2-rumah', musik: 'rumah', hadiah: 'hadiah-p3k', perlengkapan: 'p3k', kartu: 3,
    slot: ['stopkontak', 'gunting', 'botol', 'panci', 'basah', 'momen'],
    bahaya: [
      { id: 'stopkontak', area: [358, 380, 120, 220], lensa: [420, 490], sorot: [400, 470, 22], kilat: 'tahan',
        kartu: [{ k: 'jauh', benar: true, jurus: 'menjauh' }, { k: 'sebentar', keluarga: 'SEBENTAR' }, { k: 'diam', keluarga: 'DIAM', tanpaKeluarga: true, cadangan: true }] },
      { id: 'gunting', area: [494, 380, 120, 220], lensa: [554, 480], sorot: [578, 440, 26], kilat: 'aman',
        kartu: [{ k: 'taruh', benar: true, jurus: 'berhenti' }, { k: 'pelan', keluarga: 'HATI' }, { k: 'lari', keluarga: 'CEPAT', cadangan: true }] },
      { id: 'botol', area: [766, 380, 120, 220], lensa: [826, 470], sorot: [842, 452, 24], kilat: 'aman',
        kartu: [{ k: 'tanya', benar: true, jurus: 'beritahu' }, { k: 'cicip', keluarga: 'SEBENTAR' }, { k: 'cium', keluarga: 'HATI', cadangan: true }] },
      { id: 'panci', area: [902, 340, 120, 260], lensa: [950, 440], sorot: [960, 392, 30], kilat: 'aman',
        kartu: [{ k: 'jauh', benar: true, jurus: 'menjauh' }, { k: 'pegang', keluarga: 'HATI' }, { k: 'bantu', keluarga: 'SENDIRI', cadangan: true }] },
      { id: 'basah', area: [1038, 380, 200, 220], lensa: [1130, 520], sorot: [1150, 588, 34], kilat: 'tahan',
        kartu: [{ k: 'pelan', benar: true, jurus: 'pelindung' }, { k: 'lari', keluarga: 'CEPAT' }, { k: 'lompat', keluarga: 'IKUT', cadangan: true }] }
    ],
    momen: { id: 'momen', lensa: [610, 420], sorot: [606, 470, 34], kilat: 'tahan', gerak: 5, beku: 1, gerakSantai: 6, bekuSantai: 2,
      kartu: [{ k: 'minta', benar: true, jurus: 'beritahu' }, { k: 'pelan', keluarga: 'HATI' }, { k: 'lompat', keluarga: 'CEPAT', cadangan: true }] },
    teladan: [
      { id: 'prakarya', area: [222, 380, 120, 220] },
      { id: 'dispenser', area: [630, 360, 120, 240] }
    ]
  },

  /* T3 Jalan ke Sekolah: dua babak (gang, lalu depan sekolah), ditambah Ayo Menyeberang sebelum Momen Tahan */
  t3: {
    latar: 'latar-t3a-gang', musik: 'jalan', hadiah: 'hadiah-rompi', perlengkapan: 'rompi', kartu: 3,
    slot: ['motor', 'layang', 'got', 'helm', 'seberang', 'momen'],
    babak: [
      { latar: 'latar-t3a-gang', bahaya: ['motor', 'layang', 'got'], teladan: ['tengah'] },
      { latar: 'latar-t3b-sekolah', bahaya: ['helm', 'seberang'], teladan: ['trotoar'], sela: 'menyeberang' }
    ],
    bahaya: [
      { id: 'motor', area: [420, 380, 260, 220], lensa: [560, 520], sorot: [612, 528, 30], kilat: 'tahan',
        kartu: [{ k: 'kiri', benar: true, jurus: 'menjauh' }, { k: 'cepat', keluarga: 'CEPAT' }, { k: 'sentuh', keluarga: 'SEBENTAR', cadangan: true }] },
      { id: 'layang', area: [696, 110, 134, 410], lensa: [760, 230], sorot: [752, 118, 30], kilat: 'tahan',
        kartu: [{ k: 'biar', benar: true, jurus: 'beritahu' }, { k: 'tarik', keluarga: 'SENDIRI' }, { k: 'panjat', keluarga: 'HATI', cadangan: true }] },
      { id: 'got', area: [1060, 450, 160, 220], lensa: [1110, 580], sorot: [1150, 640, 30], kilat: 'aman',
        kartu: [{ k: 'jauh', benar: true, jurus: 'menjauh' }, { k: 'lompat', keluarga: 'IKUT' }, { k: 'tepi', keluarga: 'HATI', cadangan: true }] },
      { id: 'helm', area: [216, 400, 230, 220], lensa: [340, 520], sorot: [392, 504, 26], kilat: 'aman',
        kartu: [{ k: 'helm', benar: true, jurus: 'pelindung' }, { k: 'dekat', keluarga: 'SEBENTAR' }, { k: 'topi', keluarga: 'HATI', tanpaKeluarga: true, cadangan: true }] },
      { id: 'seberang', area: [500, 420, 140, 200], lensa: [640, 520], sorot: [570, 610, 28], kilat: 'aman',
        kartu: [{ k: 'zebra', benar: true, jurus: 'aturan' }, { k: 'lari', keluarga: 'CEPAT' }, { k: 'sendiri', keluarga: 'SENDIRI', cadangan: true }] }
    ],
    momen: { id: 'momen', lensa: [360, 450], sorot: [400, 470, 30], kilat: 'tahan', gerak: 5, beku: 1, gerakSantai: 6, bekuSantai: 2,
      kartu: [{ k: 'minta', benar: true, jurus: 'beritahu' }, { k: 'kejar', keluarga: 'CEPAT' }, { k: 'lihat', keluarga: 'HATI', cadangan: true }] },
    teladan: [
      { id: 'tengah', area: [846, 440, 150, 170] },
      { id: 'trotoar', area: [1060, 450, 180, 170] }
    ]
  },

  /* T4 Lapangan dan Kolam: baris atas (jendela kaca, tenda, kolam) dan baris bawah (lintasan) */
  t4: {
    latar: 'latar-t4-lapangan', musik: 'lapangan', hadiah: 'hadiah-topi', perlengkapan: 'topi', kartu: 3,
    slot: ['bola', 'lari', 'tali', 'masuk', 'licin', 'momen'],
    bahaya: [
      { id: 'bola', area: [100, 196, 230, 230], lensa: [210, 330], sorot: [180, 250, 34], kilat: 'tahan',
        kartu: [{ k: 'tengah', benar: true, jurus: 'menjauh' }, { k: 'pelan', keluarga: 'HATI' }, { k: 'situ', keluarga: 'IKUT', cadangan: true }] },
      { id: 'lari', area: [216, 442, 128, 180], lensa: [280, 540], sorot: [290, 560, 30], kilat: 'aman',
        kartu: [{ k: 'pemanasan', benar: true, jurus: 'aturan' }, { k: 'menang', keluarga: 'CEPAT' }, { k: 'nanti', keluarga: 'SEBENTAR', cadangan: true }] },
      { id: 'tali', area: [360, 442, 128, 180], lensa: [420, 550], sorot: [430, 598, 22], kilat: 'tahan',
        kartu: [{ k: 'ikat', benar: true, jurus: 'aturan' }, { k: 'lari', keluarga: 'SEBENTAR' }, { k: 'pelan', keluarga: 'HATI', cadangan: true }] },
      { id: 'masuk', area: [716, 196, 150, 230], lensa: [1060, 290], sorot: [1150, 186, 34], kilat: 'aman',
        kartu: [{ k: 'tunggu', benar: true, jurus: 'aturan' }, { k: 'sendiri', keluarga: 'SENDIRI' }, { k: 'sebentar', keluarga: 'SEBENTAR', cadangan: true }] },
      { id: 'licin', area: [1060, 440, 180, 180], lensa: [1120, 560], sorot: [1150, 612, 30], kilat: 'aman',
        kartu: [{ k: 'jalan', benar: true, jurus: 'aturan' }, { k: 'cepat', keluarga: 'CEPAT' }, { k: 'hati', keluarga: 'HATI', cadangan: true }] }
    ],
    momen: { id: 'momen', lensa: [1040, 380], sorot: [1100, 420, 34], kilat: 'tahan', gerak: 5, beku: 1, gerakSantai: 6, bekuSantai: 2,
      kartu: [{ k: 'dangkal', benar: true, jurus: 'aturan' }, { k: 'teman', keluarga: 'IKUT' }, { k: 'napas', keluarga: 'HATI', cadangan: true }] },
    teladan: [
      { id: 'istirahat', area: [540, 196, 160, 230] },
      { id: 'ikat', area: [504, 442, 128, 180] }
    ]
  },
  /* T5 Hari Hujan (TAMBAHAN, GDD 6.1): 3 bahaya, 3 kartu, tanpa Momen Tahan dan Teladan. Bintang: selesai, 2 dari 3 benar, semua benar. */
  t5: {
    latar: 'latar-t5-hujan', musik: 'hujan', hadiah: 'hadiah-jashujan', perlengkapan: 'jashujan', kartu: 3,
    slot: ['sungai', 'petir', 'kabel'],
    bahaya: [
      { id: 'sungai', area: [236, 372, 160, 220], lensa: [290, 462], sorot: [212, 560, 36], kilat: 'aman',
        kartu: [{ k: 'jauh', benar: true, jurus: 'menjauh' }, { k: 'pinggir', keluarga: 'HATI' }, { k: 'teman', keluarga: 'IKUT', cadangan: true }] },
      { id: 'petir', area: [430, 360, 250, 232], lensa: [430, 390], sorot: [338, 262, 30], kilat: 'tahan',
        kartu: [{ k: 'masuk', benar: true, jurus: 'aturan' }, { k: 'pohon', keluarga: 'HATI', tanpaKeluarga: true }, { k: 'sebentar', keluarga: 'SEBENTAR', cadangan: true }] },
      { id: 'kabel', area: [1040, 360, 224, 232], lensa: [1080, 500], sorot: [1166, 600, 32], kilat: 'tahan',
        kartu: [{ k: 'jauh', benar: true, jurus: 'beritahu' }, { k: 'lompat', keluarga: 'IKUT' }, { k: 'pindah', keluarga: 'SENDIRI', cadangan: true }] }
    ],
    momen: null,
    teladan: []
  }
};
