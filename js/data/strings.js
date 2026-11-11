/* Semua teks Tara Siaga di satu tempat agar mudah ditinjau guru (CLAUDE.md bagian 2).
   Kalimat yang dibacakan dibuat pendek: maksimal 8 kata per kalimat (GDD bagian 11). Balon menampilkan satu kalimat per tampilan.
   Isi keselamatan per tempat ada di STR.tempat; letak, jawaban, dan tag ada di config/tempat.js. */
window.STR = {
  judul: { a: 'Tara', b: 'Siaga', pita: 'Ayo Bermain Aman!', lengkap: 'Tara Siaga: Ayo Bermain Aman!', balon: 'Ayo jadi Tim Siaga!', ajak: 'Ayo jadi Tim Siaga bersama Tara!' },
  putar: 'Putar perangkatmu supaya mendatar, ya.',
  muat: 'Memuat',
  muatTahu: 'Tahukah kamu? ',
  muatTips: [
    'Trenggiling menggulung badannya saat ada bahaya.',
    'Trenggiling hewan dilindungi di Indonesia.',
    'Sebelum bermain, lihat dulu apakah mainannya bagus.',
    'Berhenti, Lihat, Pikir. Itu jurus Tim Siaga!',
    'Memberi tahu orang dewasa itu berani dan benar.'
  ],
  tombol: {
    mulai: 'MULAI', info: 'Informasi', referensi: 'Referensi', pengembang: 'Pengembang', lanjut: 'Lanjut', ulangi: 'Main lagi',
    tutup: 'Tutup', ya: 'Ya', tidak: 'Tidak', peta: 'Peta', hasil: 'Hasil Belajarku', guru: 'Untuk Guru', tahan: 'TAHAN!', judul: 'Layar Judul', lagu: 'Lagu Siaga'
  },
  ikon: {
    pengaturan: 'Pengaturan', layarPenuh: 'Layar penuh', keluarPenuh: 'Keluar dari layar penuh', fsDitolak: 'Layar penuh tidak bisa dibuka di sini.',
    suaraNyala: 'Matikan semua suara', suaraMati: 'Nyalakan semua suara', peta: 'Peta Kampung', dengar: 'Dengar lagi'
  },
  pengaturan: {
    judul: 'Pengaturan', nyala: 'Nyala', mati: 'Mati',
    musik: 'Musik', efek: 'Efek suara', suara: 'Suara Tara dan narasi', suaraCatatan: 'Bila mati, tulisan tetap tampil.',
    santai: 'Mode Santai', santaiCatatan: 'Momen Tahan lebih lambat.', kurangi: 'Kurangi animasi', kurangiCatatan: 'Diatur oleh perangkat ini.',
    kursi: 'Gerak di Kursi', kursiCatatan: 'Untuk kelas yang sempit.',
    muridBaru: 'Pemain baru', muridBaruCatatan: 'Menghapus progres di perangkat ini.', bukaSemua: 'Buka semua tempat', bukaSemuaCatatan: 'Pawai Siaga ikut terbuka.', hapus: 'Hapus progres', yakin: 'Ketuk lagi untuk hapus'
  },
  keluar: { judul: 'Kembali ke Peta?', isi: 'Sisik yang sudah didapat tetap tersimpan.' },

  /* Ritme Siaga (GDD 3.1) */
  ritme: { berhenti: 'Berhenti', lihat: 'Lihat', pikir: 'Pikir', ucapBerhenti: 'Berhenti!' },

  /* ucapan Tara yang umum */
  tara: {
    halo: 'Halo, aku Tara!',
    ajak: 'Ayo bantu Tim Siaga.',
    hook: 'Ada yang berbahaya. Ketuk!',
    cari: 'Temukan yang berbahaya, ya.',
    endus: 'Hmm, Tara mencium sesuatu.',
    sudahAman: 'Yang ini sudah aman.',
    pilihKartu: 'Ketuk satu kartu.',
    tunjukKartu: 'Yang ini caranya.',
    sisik: 'Hore, sisik emas!',
    sisikPerak: 'Hore, sisik perak!',
    lihatLagi: 'Lihat lagi, ya.',
    momenSiap: 'Siapkan tanganmu.',
    tekanTahan: 'Tekan TAHAN kalau berbahaya!',
    ulangAkhir: 'Ayo kita ingat lagi!',
    hampir: 'Hampir! Ayo tekan TAHAN bersama.',
    tahanBagus: 'Tepat sekali!',
    semuaKetemu: 'Semua bahaya sudah aman.'
  },

  /* balasan umum per keluarga pengecoh (GDD 7.3) */
  keluarga: {
    HATI: ['Hmm, hati-hati saja belum cukup.'],
    CEPAT: ['Kalau terburu-buru, kita mudah celaka.'],
    SEBENTAR: ['Sebentar, sedikit, atau nanti, tetap berbahaya.'],
    DIAM: ['Memberi tahu orang dewasa itu berani dan benar.'],
    SENDIRI: ['Untuk hal ini, kita perlu orang dewasa.'],
    IKUT: ['Walau seru, tetap berbahaya.']
  },

  /* Kartu Kilat: satu situasi serupa sesudah dibantu (GDD 7.2) */
  kilat: { tanya: 'Aman atau tahan?', aman: 'Aman', tahan: 'Tahan', benarAman: 'Betul, itu aman.', benarTahan: 'Betul, itu harus ditahan.' },

  /* Tempat Aman */
  aman: { judul: '{nama} Aman!', bintang: 'Kamu dapat {n} bintang!', hadiah: 'Perlengkapan baru!', bintangKet: ['Tempat selesai', 'Benar pada coba pertama', 'TAHAN! tepat waktu'], bintangKetTanpaMomen: ['Tempat selesai', 'Benar pada coba pertama', 'Semua benar sekali coba'] },

  /* Lagu Siaga bervokal (TAMBAHAN; lirik dari docs/ASET-PROMPT.md B6, perlu disetujui guru PJOK) */
  lagu: {
    judul: 'Lagu Siaga', putar: 'Putar lagu', henti: 'Berhenti', reff: 'Reff (diulang)',
    gerak: [['telapak', 'Berhenti', 'telapak ke depan'], ['mata', 'Lihat', 'tangan di atas mata'], ['bohlam', 'Pikir', 'telunjuk di pelipis'], ['jempol', 'Aman', 'dua jempol']],
    bait: [
      ['Berhenti, lihat, pikir!', 'Berhenti, lihat, pikir!', 'Bersama Tara siaga,', 'Kita main aman!'],
      ['Ayunan rusak? Jangan dipakai,', 'Beri tahu Bu Guru, ya!', 'Panci panas? Ayo menjauh,', 'Orang dewasa yang memasak.'],
      ['Naik motor? Pakai helm!', 'Mau menyeberang? Lihat dulu:', 'Lihat kanan, lihat kiri,', 'Lihat kanan lagi, ya!'],
      ['Lantai licin? Jalan pelan.', 'Berenang? Ada orang dewasa.', 'Mau berlari? Pemanasan!', 'Tali sepatu? Ikat dulu!']
    ],
    musikMati: 'Musik sedang mati. Nyalakan di Pengaturan, ya.'
  },

  /* Bahan cetak untuk guru (TAMBAHAN): kartu diskusi per tempat dan lembar mewarnai */
  cetak: {
    tombolDiskusi: 'Cetak kartu diskusi', tombolMewarnai: 'Cetak lembar mewarnai',
    judulDiskusi: 'Kartu Diskusi Tara Siaga',
    pengantar: 'Bacakan pertanyaan, beri waktu murid menjawab, lalu ulangi kalimat aturan bersama. Satu kartu untuk satu pertemuan.',
    pertanyaan: 'Pertanyaan pemantik', aturan: 'Kalimat aturan (diucapkan bersama)', gerakan: 'Gerakan: Berhenti = telapak ke depan, Lihat = tangan di atas mata, Pikir = telunjuk di pelipis, Aman = dua jempol.',
    tanya: {
      t1: ['Mainan apa di taman sekolah kita yang perlu dicek dulu?', 'Kenapa kita antre saat main perosotan?', 'Apa yang kamu lakukan bila melihat ayunan rusak?'],
      t2: ['Benda apa di rumahmu yang hanya boleh dipakai orang dewasa?', 'Bagaimana cara aman berjalan di lantai basah?', 'Bolehkah minum dari botol yang kamu temukan?'],
      t3: ['Bagaimana urutan menyeberang yang aman?', 'Kenapa kita memakai helm saat naik motor?', 'Apa yang kamu lakukan bila bolamu masuk ke jalan?'],
      t4: ['Kenapa kita pemanasan sebelum berolahraga?', 'Siapa yang harus menemani saat kita berenang?', 'Apa yang kamu lakukan bila tali sepatumu lepas?'],
      t5: ['Ke mana kita pergi saat ada petir?', 'Kenapa kita menjauh dari sungai saat hujan?', 'Apa yang kamu lakukan bila melihat kabel jatuh?']
    },
    umumJudul: 'Untuk semua tempat',
    umum: ['Pernahkah kamu melihat hal seperti ini? Ceritakan.', 'Mana yang aman, mana yang perlu ditahan? Kenapa?'],
    polaJudul: 'Pola pikir keliru yang sering muncul, dan cara membahasnya',
    judulMewarnai: 'Warnai, lalu ceritakan: kenapa ini aman?',
    catatanGuru: 'Isi perlu ditinjau guru PJOK sebelum dipakai di kelas.'
  },

  /* Peta Kampung */
  peta: {
    judul: 'Peta Kampung', pilih: 'Pilih tempat bermain.', segera: 'Segera dibuka', kunci: 'Terkunci', terkunci: 'Selesaikan keempat tempat dulu.',
    tempat: { t1: 'Taman Bermain', t2: 'Rumah Sari', t3: 'Jalan ke Sekolah', t4: 'Lapangan dan Kolam', t5: 'Hari Hujan', pawai: 'Pawai Siaga' }
  },

  /* Hasil Belajarku (GDD bagian 10) */
  hasil: {
    judul: 'Hasil Belajarku', sisik: '{n} dari 24 sisik', sudah: 'Sudah bisa', terus: 'Terus berlatih', belum: 'Belum dicoba', latih: 'Yang ini, ayo terus berlatih!',
    jurus: {
      'mata-jeli': ['Mata Jeli', 'Aku bisa menemukan hal berbahaya.'],
      'menjauh': ['Menjauh', 'Aku menjauh dari benda berbahaya.'],
      'pelindung': ['Pakai Pelindung', 'Aku memakai helm dan sandal.'],
      'berhenti': ['Berhenti', 'Aku berhenti dulu, lalu berpikir.'],
      'beritahu': ['Beri Tahu Orang Dewasa', 'Aku memberi tahu orang dewasa.'],
      'aturan': ['Ikuti Aturan Main', 'Aku antre dan ikut aturan bermain.']
    },
    gerakan: 'Gerakan kelas: Berhenti = telapak ke depan, Lihat = tangan di atas mata, Pikir = telunjuk di pelipis, Aman = dua jempol.'
  },

  /* Catatan untuk Guru (tanpa data pribadi) */
  guru: {
    judul: 'Catatan untuk Guru', kolomTp: 'Tujuan pembelajaran', kolomBukti: 'Benar coba pertama', kolomBantu: 'Bantuan tertinggi',
    tp: {
      'kenali-bahaya': 'TP1 Menunjuk situasi berbahaya',
      'pilih-aman': 'TP2 Memilih tindakan aman',
      'berhenti-pikir': 'TP3 Berhenti sebelum berisiko',
      'minta-bantuan': 'TP4 Memberi tahu orang dewasa',
      'aturan-main': 'TP5 Aturan aman bermain'
    },
    bantu: ['Tanpa bantuan', 'Dorongan ringan', 'Bagian penting disorot', 'Ditunjukkan caranya'],
    momen: 'Momen Tahan: {n} dari {m} ditekan tepat waktu.',
    menyeberang: 'Ayo Menyeberang: {s}.', menyeberangStatus: { tepat: 'urutan tepat tanpa bantuan', bantu: 'urutan tepat dengan bantuan', '': 'belum dimainkan' },
    pawai: 'Pawai Siaga: {b} dari {n} benar pada coba pertama.', transfer: 'Situasi baru (transfer): {t}.', transferBenar: 'benar', transferBantu: 'dibantu',
    pola: 'Pola pikir yang perlu didiskusikan:',
    polaKosong: 'Belum ada pilihan keliru. Bagus!',
    ulang: 'Perlu diulang:', ulangLain: 'dan {n} lainnya',
    situasi: {
      't1-ayunan': 'ayunan rusak', 't1-lari': 'lewat depan ayunan', 't1-dorong': 'mendorong di tangga', 't1-kaca': 'pecahan kaca', 't1-pagar': 'memanjat pagar tinggi', 't1-momen': 'melompat dari perosotan',
      't2-stopkontak': 'stopkontak', 't2-gunting': 'gunting jadi mainan', 't2-botol': 'botol cairan pembersih', 't2-panci': 'panci di kompor', 't2-basah': 'lantai basah', 't2-momen': 'kursi bertumpuk',
      't3-motor': 'knalpot motor', 't3-layang': 'layang-layang di kabel', 't3-got': 'tepi got', 't3-helm': 'motor tanpa helm', 't3-seberang': 'menyeberang di zebra cross', 't3-momen': 'bola ke jalan',
      't4-bola': 'bola dekat kaca', 't4-lari': 'pemanasan', 't4-tali': 'tali sepatu lepas', 't4-masuk': 'kolam tanpa penjaga', 't4-licin': 'berlari di tepi kolam', 't4-momen': 'kolam dalam',
      't5-sungai': 'sungai deras', 't5-petir': 'bermain saat petir', 't5-kabel': 'kabel listrik jatuh',
      'transfer-korek': 'korek api', 'transfer-sumur': 'sumur terbuka', 'transfer-jendela': 'tangan keluar jendela',
      'transfer-sepeda': 'helm sepeda', 'transfer-sabuk': 'sabuk pengaman', 'transfer-lutut': 'pelindung lutut'
    },
    pemantik: {
      HATI: '"Kapan hati-hati saja tidak cukup?" (benda rusak, panas, listrik, air dalam)',
      CEPAT: '"Kenapa kita berhenti dulu walau sedang buru-buru?"',
      SEBENTAR: '"Apakah bahaya hilang kalau hanya sebentar?"',
      DIAM: 'Yakinkan murid: memberi tahu orang dewasa tidak membuatnya dimarahi.',
      SENDIRI: '"Benda apa yang harus dibereskan orang dewasa?" (pecahan kaca, kabel, api)',
      IKUT: 'Latih kalimat menolak: "Aku tidak mau, itu berbahaya."'
    },
    namaKeluarga: { HATI: 'Kalau hati-hati, boleh', CEPAT: 'Cepat-cepat saja', SEBENTAR: 'Sebentar saja', DIAM: 'Diam supaya tidak dimarahi', SENDIRI: 'Bisa sendiri', IKUT: 'Ikut teman, seru' },
    mode: 'Mode Santai: {s}. Lama bermain: {m} menit.',
    catatan: 'Gim tidak menyimpan nama atau data pribadi. Data hanya ada di perangkat ini.'
  },

  /* Informasi, Referensi, Pengembang (pola Kafe Cilik; tanpa tautan keluar) */
  info: {
    info: {
      judul: 'Informasi',
      tab: { tujuan: 'Tujuan', cara: 'Cara Main', misi: 'Tempat' },
      pengantar: 'Bantu Tara dan Tim Siaga menemukan bahaya, lalu memilih cara yang aman.',
      identitas: [['Mata Pelajaran', 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)'], ['Topik', 'Situasi Berisiko dan Keselamatan']],
      tujuanJudul: 'Tujuan Pembelajaran',
      tujuan: 'Murid mampu mengenali situasi berisiko di sekitarnya, lalu memilih tindakan aman untuk menjaga keselamatan diri dan teman.',
      cara: [
        'Amati adegan, lalu ketuk hal yang berbahaya.',
        'Tara menggulung: Berhenti. Kaca pembesar: Lihat. Kartu: Pikir.',
        'Ketuk kartu cara yang aman. Benar = Sisik Emas untuk Tara.',
        'Ada juga perilaku aman (Teladan). Ketuk untuk mendengarnya.',
        'Saat teman bergerak lambat, tekan TAHAN! sebelum terlambat.'
      ],
      caraCatatan: 'Tidak ada game over. Salah memilih? Tara memberi petunjuk. Semua petunjuk dibacakan.',
      caraGuru: 'Untuk guru: tekan lama judul Pengaturan 2 detik (atau tahan tombol G) untuk Buka semua tempat dan Pemain baru. Kartu diskusi dan lembar mewarnai bisa dicetak dari Untuk Guru; Lagu Siaga ada di Hasil Belajarku.',
      misiJudul: 'Lima tempat, bisa dimainkan terpisah:',
      misi: [
        ['Taman Bermain', 'Ayunan, perosotan, pagar, bak pasir.'],
        ['Rumah Sari', 'Kompor, stopkontak, gunting, lantai basah.'],
        ['Jalan ke Sekolah', 'Motor, got, kabel listrik, menyeberang.'],
        ['Lapangan dan Kolam', 'Pemanasan, tali sepatu, kolam renang.'],
        ['Hari Hujan (tambahan)', 'Sungai deras, petir, kabel jatuh.']
      ],
      misiCatatan: 'Kumpulkan 24 sisik, lalu ikut Pawai Siaga!'
    },
    referensi: {
      judul: 'Referensi',
      tab: { sumber: 'Sumber Materi', ka: 'Kecerdasan Artifisial' },
      sumberPengantar: 'Sumber materi gim ini:',
      sumber: [
        ['Prof. Caly Setiawan, Ph.D., dkk. (2025).', 'Panduan Mata Pelajaran Pendidikan Jasmani, Olahraga, dan Kesehatan Fase A-F.', 'Badan Standar, Kurikulum, dan Asesmen Pendidikan, Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.'],
        ['Badan Standar, Kurikulum, dan Asesmen Pendidikan (2025).', 'Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran.', 'Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.']
      ],
      topik: 'Topik: Situasi Berisiko dan Keselamatan (unit Kesehatan dan Keselamatan).',
      huruf: 'Huruf Grandstander (The Grandstander Project Authors) dan Andika (SIL International), lisensi SIL Open Font License.',
      kaPengantar: 'Pengembang memakai kecerdasan artifisial (KA) sebagai alat bantu.',
      ka: [
        ['Gambar', 'Latar dibuat dengan ChatGPT (OpenAI), lalu diolah program.'],
        ['Musik', 'Musik latar dan Lagu Siaga (vokal AI) dibuat dengan Suno.'],
        ['Kode dan teks', 'Disusun dengan bantuan Claude (Anthropic).'],
        ['Pemeriksaan', 'Diuji otomatis. Pengembang bertanggung jawab atas isinya.'],
        ['Saat bermain', 'Tanpa KA, tanpa internet, dan tidak mengirim data apa pun.']
      ],
      kaRujukanJudul: 'Rujukan',
      kaRujukan: ['Purwarianti, A., dkk. (2025).', 'Panduan Pemanfaatan Kecerdasan Artifisial untuk Guru PAUD, Pendidikan Dasar, dan Pendidikan Menengah.', 'Jakarta: Pusat Kurikulum dan Pembelajaran & Pusat Standar dan Kebijakan Pendidikan.']
    },
    pengembang: {
      judul: 'Pengembang',
      /* satu halaman per pengembang, berpindah dengan tombol panah */
      orang: [
        { foto: 'pengembang', fotoAlt: 'Foto Jamaluddin', nama: 'Jamaluddin', baris: ['UPTD SMPN 2 Robatal', 'jamaluddin551@guru.smp.belajar.id', 'Instagram: @tretanjamal', 'Tahun pembuatan: 2026'],
          daftarJudul: 'Prestasi dan Pengalaman',
          daftar: [
            'Narasumber Digitalisasi Pembelajaran Kemendikdasmen',
            'Guru Pejuang Digital',
            'Juara 1 Lomba Inovasi Guru SMP Kabupaten Sampang 2026',
            'Juara 1 Guru Inspiratif SMP Kabupaten Sampang 2026',
            'Komunitas Belajar Terbaik BLPT Kemendikdasmen 2024'
          ] },
        { foto: 'pengembang-2', fotoAlt: 'Foto Rimawan Haritzah', nama: 'Rimawan Haritzah, S.Pd.', baris: ['Guru SD Negeri Kauman Bantul', 'Tahun pembuatan: 2026'] }
      ],
      sebelum: 'Pengembang sebelumnya', berikut: 'Pengembang berikutnya', halaman: 'Pengembang {i} dari {n}'
    }
  },

  /* ===== Isi tempat. Kunci bahaya sama dengan config/tempat.js ===== */
  tempat: {
    t1: {
      nama: 'Taman Bermain',
      masuk: 'Ini taman bermain sekolah.',
      hadiah: 'Peluit',
      area: { ayunan: 'Ayunan kiri dan Sari', lari: 'Ayunan kanan dan Lala', dorong: 'Tangga perosotan', kaca: 'Bak pasir', pagar: 'Pagar tinggi', panjat: 'Panjatan rendah', bola: 'Tegar dan keranjang' },
      bahaya: {
        ayunan: {
          lihat: ['Rantai ayunan putus.', 'Sari mau duduk di situ.'],
          tanya: 'Apa yang sebaiknya Sari lakukan?',
          kartu: { guru: 'Panggil Bu Guru', duduk: 'Duduk pelan-pelan saja', diam: 'Diam saja, takut dimarahi' },
          balas: { duduk: 'Rantainya putus, jadi bisa jatuh.', diam: 'Bu Guru perlu tahu ayunannya rusak.' },
          aman: 'Terima kasih sudah memberi tahu!',
          aturan: 'Aku tidak memakai ayunan yang rusak.'
        },
        dorong: {
          lihat: ['Mereka saling dorong di tangga.'],
          tanya: 'Apa yang sebaiknya Raka lakukan?',
          kartu: { antre: 'Antre satu per satu', dorong: 'Dorong supaya cepat', ikut: 'Ikut dorong, seru!' },
          balas: { dorong: 'Didorong di tangga bisa jatuh.', ikut: 'Tangga tinggi bukan tempat bercanda.' },
          aman: 'Antre itu aman dan adil.',
          aturan: 'Aku antre di tangga perosotan.'
        },
        lari: {
          lihat: ['Lala lari di depan ayunan.', 'Dina sedang berayun.'],
          tanya: 'Apa yang sebaiknya Lala lakukan?',
          kartu: { jauh: 'Lewat jauh dari ayunan', cepat: 'Lari cepat lewat depan', hati: 'Lewat depan sambil hati-hati' },
          balas: { cepat: 'Ayunan bisa mengenai Lala.', hati: 'Ayunan tetap bisa mengenai Lala.' },
          aman: 'Lewat jauh dari ayunan. Aman!',
          aturan: 'Aku lewat jauh dari ayunan.'
        },
        kaca: {
          lihat: ['Ada pecahan kaca di pasir.'],
          tanya: 'Apa yang sebaiknya kita lakukan?',
          kartu: { guru: 'Jangan sentuh, panggil Bu Guru', ambil: 'Ambil sendiri lalu buang', diam: 'Diam saja, terus main' },
          balas: { ambil: 'Pecahan kaca bisa melukai tangan.', diam: 'Teman lain bisa terluka.' },
          aman: 'Terima kasih, Ibu bersihkan, ya.',
          aturan: 'Aku tidak menyentuh pecahan kaca.'
        },
        pagar: {
          lihat: ['Ayu memanjat pagar tinggi.'],
          tanya: 'Apa yang sebaiknya Ayu lakukan?',
          kartu: { turun: 'Turun, main di panjatan rendah', hati: 'Terus memanjat sambil hati-hati', cepat: 'Panjat cepat-cepat' },
          balas: { hati: 'Pagar setinggi itu bisa membuat jatuh.', cepat: 'Memanjat cepat-cepat lebih mudah jatuh.' },
          aman: 'Panjatan rendah lebih aman.',
          aturan: 'Aku tidak memanjat pagar tinggi.'
        }
      },
      momen: {
        siap: 'Lihat Raka!',
        lihat: ['Raka mau melompat dari atas!'],
        tanya: 'Apa yang sebaiknya Raka lakukan?',
        kartu: { duduk: 'Meluncur duduk, kaki di depan', lompat: 'Lompat saja, seru!', pelan: 'Lompat pelan-pelan' },
        balas: { lompat: 'Melompat dari atas bisa jatuh.', pelan: 'Melompat pelan pun tetap berbahaya.' },
        aman: 'Meluncur sambil duduk. Aman!',
        aturan: 'Aku meluncur sambil duduk.'
      },
      teladan: {
        panjat: ['Itu aman.', 'Sekar memanjat panjatan rendah.'],
        bola: ['Itu aman.', 'Tegar main di tanah lapang.']
      },
      kilat: {
        ayunan: 'Ayunan bagus, Dina duduk berpegangan.',
        dorong: 'Raka mendorong teman di tangga.',
        lari: 'Lala lewat jauh dari ayunan.',
        kaca: 'Bima memungut pecahan kaca.',
        pagar: 'Ayu bermain di panjatan rendah.',
        momen: 'Bima mau melompat dari tangga.'
      },
      /* alasan singkat Kartu Kilat dan papan Pawai: dibacakan saat salah dan sesudah benar */
      alasan: { ayunan: 'Ayunannya tidak rusak, Dina berpegangan.', lari: 'Ayunan tidak bisa mengenai Lala.', dorong: 'Mendorong di tangga bisa membuat jatuh.', kaca: 'Pecahan kaca bisa melukai tangan.', pagar: 'Panjatannya rendah, cocok untuk anak.', momen: 'Melompat dari tangga bisa membuat jatuh.' }
    },
    t2: {
      nama: 'Rumah Sari',
      masuk: 'Ini rumah Sari.',
      hadiah: 'Kotak P3K',
      area: { prakarya: 'Dina dan Ibu', stopkontak: 'Bima dan stopkontak', gunting: 'Raka dan gunting', dispenser: 'Sekar dan dispenser', botol: 'Sari dan botol', panci: 'Kompor dan Nino', basah: 'Kamar mandi dan Lala' },
      bahaya: {
        panci: {
          lihat: ['Pancinya panas sekali.', 'Nino meraih gagangnya.'],
          tanya: 'Apa yang sebaiknya Nino lakukan?',
          kartu: { jauh: 'Menjauh dari kompor', pegang: 'Pegang gagang pelan-pelan', bantu: 'Bantu angkat pancinya' },
          balas: { pegang: 'Panci panas bisa melukai tangan.', bantu: 'Panci panas itu tugas orang dewasa.' },
          aman: 'Terima kasih, Nino. Tunggu di sana, ya.',
          aturan: 'Aku menjauh dari kompor yang menyala.'
        },
        stopkontak: {
          lihat: ['Bima mau mencolok stopkontak.'],
          tanya: 'Apa yang sebaiknya Bima lakukan?',
          kartu: { jauh: 'Jauhkan tangan dari stopkontak', sebentar: 'Colok sebentar saja', diam: 'Colok diam-diam, tidak ketahuan' },
          balas: { sebentar: 'Listrik bisa menyetrum walau sebentar.', diam: 'Walau tidak ketahuan, listrik tetap berbahaya.' },
          aman: 'Tangan jauh dari stopkontak. Aman!',
          aturan: 'Aku tidak memainkan stopkontak.'
        },
        gunting: {
          lihat: ['Raka main pedang-pedangan pakai gunting.'],
          tanya: 'Apa yang sebaiknya Raka lakukan?',
          kartu: { taruh: 'Taruh, main yang lain', pelan: 'Main pelan-pelan saja', lari: 'Bawa sambil berlari' },
          balas: { pelan: 'Gunting itu tajam sekali.', lari: 'Benda tajam bisa melukai saat berlari.' },
          aman: 'Gunting untuk menggunting kertas.',
          aturan: 'Aku tidak bermain dengan benda tajam.'
        },
        basah: {
          lihat: ['Lantainya basah dan licin.', 'Lala lari tanpa sandal.'],
          tanya: 'Apa yang sebaiknya Lala lakukan?',
          kartu: { pelan: 'Jalan pelan, pakai sandal', lari: 'Lari supaya cepat selesai', lompat: 'Lompat-lompat di air, seru!' },
          balas: { lari: 'Lantai licin membuat mudah terpeleset.', lompat: 'Air di lantai membuat licin.' },
          aman: 'Pakai sandal, jalan pelan. Aman!',
          aturan: 'Aku berjalan pelan di lantai basah.'
        },
        botol: {
          lihat: ['Botol ini berisi cairan pembersih.', 'Sari pikir itu air minum.'],
          tanya: 'Apa yang sebaiknya Sari lakukan?',
          kartu: { tanya: 'Tanya orang dewasa dulu', cicip: 'Cicipi sedikit saja', cium: 'Cium baunya dari dekat' },
          balas: { cicip: 'Botol ini bukan minuman. Tanya orang dewasa dulu.', cium: 'Baunya pun bisa membuat sakit. Tanya orang dewasa dulu.' },
          aman: 'Itu sabun, bukan minuman. Terima kasih sudah bertanya.',
          aturan: 'Aku bertanya dulu sebelum minum.'
        }
      },
      momen: {
        siap: 'Lihat Nino!',
        lihat: ['Nino naik kursi bertumpuk!'],
        tanya: 'Apa yang sebaiknya Nino lakukan?',
        kartu: { minta: 'Minta tolong orang dewasa', pelan: 'Naik pelan-pelan saja', lompat: 'Lompat untuk meraihnya' },
        balas: { pelan: 'Kursi bertumpuk mudah roboh.', lompat: 'Melompat dari kursi bisa jatuh.' },
        aman: 'Ini kuenya. Terima kasih sudah minta tolong.',
        aturan: 'Aku minta tolong mengambil barang tinggi.'
      },
      teladan: {
        prakarya: ['Itu aman.', 'Dina menggunting kertas sambil duduk.'],
        dispenser: ['Itu aman.', 'Sekar ambil air dari keran biru.', 'Keran merah airnya panas.']
      },
      kilat: {
        panci: 'Ayah memasak, Nino menunggu di meja.',
        stopkontak: 'Nino memasukkan jari ke stopkontak.',
        gunting: 'Ayu menggunting kertas sambil duduk.',
        basah: 'Bima berlari di kamar mandi.',
        botol: 'Sari minum dari gelas air.',
        momen: 'Raka naik meja untuk ambil mainan.'
      },
      /* alasan singkat Kartu Kilat dan papan Pawai: dibacakan saat salah dan sesudah benar */
      alasan: { stopkontak: 'Stopkontak bisa menyetrum.', gunting: 'Menggunting sambil duduk itu aman.', botol: 'Itu air minum di gelas.', panci: 'Nino menunggu jauh dari kompor.', basah: 'Lantai basah itu licin.', momen: 'Naik meja bisa membuat jatuh.' }
    },
    t3: {
      nama: 'Jalan ke Sekolah',
      masuk: 'Ayo berangkat ke sekolah.',
      masukB: 'Sekarang di depan sekolah.',
      hadiah: 'Rompi terang',
      area: { motor: 'Motor Ayah dan Sari', layang: 'Layang-layang dan kabel', tengah: 'Sekar jauh dari got', got: 'Raka di tepi got', helm: 'Lala dan motor Paman', seberang: 'Dina di tepi jalan', trotoar: 'Tegar dan ibunya' },
      bahaya: {
        motor: {
          lihat: ['Knalpot motor panas sekali.', 'Sari mau naik dari sini.'],
          tanya: 'Apa yang sebaiknya Sari lakukan?',
          kartu: { kiri: 'Naik jauh dari knalpot', cepat: 'Naik dari sini saja, cepat', sentuh: 'Sentuh knalpot sebentar' },
          balas: { cepat: 'Knalpot panas bisa melukai kaki.', sentuh: 'Knalpot tetap panas walau sebentar.' },
          aman: 'Pintar! Naik dari sisi yang aman.',
          aturan: 'Aku menjauhi knalpot motor.'
        },
        got: {
          lihat: ['Raka berjalan di tepi got.'],
          tanya: 'Apa yang sebaiknya Raka lakukan?',
          kartu: { jauh: 'Jalan menjauh dari got', lompat: 'Lompati gotnya, seru!', tepi: 'Jalan di tepi sambil hati-hati' },
          balas: { lompat: 'Bisa terpeleset ke dalam got.', tepi: 'Tepi got licin dan sempit.' },
          aman: 'Jalan jauh dari got. Aman!',
          aturan: 'Aku berjalan jauh dari got.'
        },
        layang: {
          lihat: ['Layang-layangnya tersangkut di kabel listrik.'],
          tanya: 'Apa yang sebaiknya Bima lakukan?',
          kartu: { biar: 'Biarkan, beri tahu orang dewasa', tarik: 'Tarik talinya kuat-kuat', panjat: 'Panjat tiangnya pelan-pelan' },
          balas: { tarik: 'Kabel listrik sangat berbahaya.', panjat: 'Tiang listrik bukan untuk dipanjat.' },
          aman: 'Terima kasih. Biar petugas listrik yang ambil.',
          aturan: 'Aku menjauhi kabel listrik.'
        },
        helm: {
          lihat: ['Lala mau naik motor tanpa helm.'],
          tanya: 'Apa yang sebaiknya Lala lakukan?',
          kartu: { helm: 'Pakai helm dulu', dekat: 'Tidak usah, kan dekat', topi: 'Pakai topi saja' },
          balas: { dekat: 'Jarak dekat pun perlu helm.', topi: 'Topi tidak melindungi kepala.' },
          aman: 'Helm dipakai, talinya dikunci. Ayo!',
          aturan: 'Aku memakai helm saat naik motor.'
        },
        seberang: {
          lihat: ['Dina mau menyeberang di sini.', 'Zebra cross ada di sana.'],
          tanya: 'Apa yang sebaiknya Dina lakukan?',
          kartu: { zebra: 'Lewat zebra cross bersama Ibu', lari: 'Lari menyeberang cepat-cepat', sendiri: 'Menyeberang sendiri saja' },
          balas: { lari: 'Kendaraan bisa datang tiba-tiba.', sendiri: 'Anak menyeberang bersama orang dewasa.' },
          aman: 'Ayo, kita lewat zebra cross.',
          aturan: 'Aku menyeberang di zebra cross bersama orang dewasa.'
        }
      },
      momen: {
        siap: 'Lihat Ayu!',
        lihat: ['Bola Ayu masuk ke jalan!'],
        tanya: 'Apa yang sebaiknya Ayu lakukan?',
        kartu: { minta: 'Berhenti, panggil orang dewasa', kejar: 'Kejar bolanya cepat-cepat', lihat: 'Kejar sambil lihat-lihat' },
        balas: { kejar: 'Kendaraan bisa datang tiba-tiba.', lihat: 'Berlari ke jalan tetap berbahaya.' },
        aman: 'Ibu ambilkan bolanya. Terima kasih menunggu.',
        aturan: 'Aku tidak mengejar bola ke jalan.'
      },
      teladan: {
        tengah: ['Itu aman.', 'Sekar berjalan jauh dari got.'],
        trotoar: ['Itu aman.', 'Tegar menunggu di trotoar.']
      },
      kilat: {
        motor: 'Bima menyentuh knalpot motor.',
        got: 'Sekar berjalan jauh dari got.',
        layang: 'Raka memanjat tiang listrik.',
        helm: 'Sari memakai helm di motor.',
        seberang: 'Lala ke zebra cross bersama Ibu.',
        momen: 'Bima mengejar bola ke jalan.'
      },
      /* alasan singkat Kartu Kilat dan papan Pawai: dibacakan saat salah dan sesudah benar */
      alasan: { motor: 'Knalpot motor panas sekali.', layang: 'Tiang dan kabel listrik berbahaya.', got: 'Sekar jauh dari tepi got.', helm: 'Helm melindungi kepala.', seberang: 'Lala menyeberang bersama orang dewasa.', momen: 'Kendaraan bisa datang tiba-tiba.' }
    },
    t4: {
      nama: 'Lapangan dan Kolam',
      masuk: 'Ini lapangan dan kolam renang.',
      hadiah: 'Topi pelindung matahari',
      area: { bola: 'Bima dan bola', lari: 'Raka di lintasan', tali: 'Sari di lintasan', ikat: 'Lala duduk', istirahat: 'Tegar di tenda', masuk: 'Ayu di tepi kolam', licin: 'Dina di tepi kolam' },
      bahaya: {
        lari: {
          lihat: ['Raka mau langsung lari kencang.'],
          tanya: 'Apa yang sebaiknya Raka lakukan?',
          kartu: { pemanasan: 'Pemanasan dulu', menang: 'Langsung lari biar menang', nanti: 'Pemanasan nanti saja' },
          balas: { menang: 'Tanpa pemanasan, otot bisa sakit.', nanti: 'Pemanasan dilakukan sebelum berlari.' },
          aman: 'Ayo, kita pemanasan bersama!',
          aturan: 'Aku pemanasan sebelum berolahraga.'
        },
        tali: {
          lihat: ['Tali sepatu Sari lepas.'],
          tanya: 'Apa yang sebaiknya Sari lakukan?',
          kartu: { ikat: 'Ikat dulu, atau minta tolong', lari: 'Lari saja, nanti juga beres', pelan: 'Lari pelan-pelan saja' },
          balas: { lari: 'Tali lepas bisa membuat tersandung.', pelan: 'Tersandung bisa terjadi walau pelan.' },
          aman: 'Talinya terikat. Siap berlari!',
          aturan: 'Aku mengikat tali sepatu dulu.'
        },
        bola: {
          lihat: ['Bima main bola dekat jendela kaca.'],
          tanya: 'Apa yang sebaiknya Bima lakukan?',
          kartu: { tengah: 'Main di tengah lapangan', pelan: 'Tendang pelan-pelan saja', situ: 'Main di situ, kan seru' },
          balas: { pelan: 'Kaca bisa pecah dan melukai.', situ: 'Dekat jendela kaca berbahaya.' },
          aman: 'Main di tengah lapangan. Aman!',
          aturan: 'Aku bermain bola jauh dari kaca.'
        },
        masuk: {
          lihat: ['Belum ada orang dewasa di kolam.'],
          tanya: 'Apa yang sebaiknya Ayu lakukan?',
          kartu: { tunggu: 'Tunggu penjaga kolam', sendiri: 'Berenang sendiri, aku sudah bisa', sebentar: 'Masuk sebentar saja' },
          balas: { sendiri: 'Berenang harus diawasi orang dewasa.', sebentar: 'Sebentar di kolam pun berbahaya.' },
          aman: 'Kakak sudah di sini. Ayo berenang!',
          aturan: 'Aku berenang bila diawasi orang dewasa.'
        },
        licin: {
          lihat: ['Dina berlari di tepi kolam.'],
          tanya: 'Apa yang sebaiknya Dina lakukan?',
          kartu: { jalan: 'Jalan pelan, jangan berlari', cepat: 'Lari supaya cepat masuk air', hati: 'Lari sambil hati-hati' },
          balas: { cepat: 'Tepi kolam licin sekali.', hati: 'Berlari di tepi kolam mudah terpeleset.' },
          aman: 'Jalan pelan di tepi kolam, ya.',
          aturan: 'Aku berjalan pelan di tepi kolam.'
        }
      },
      momen: {
        siap: 'Lihat Sekar!',
        lihat: ['Sekar mau melompat ke bagian dalam!'],
        tanya: 'Apa yang sebaiknya Sekar lakukan?',
        kartu: { dangkal: 'Masuk di bagian dangkal', teman: 'Lompat saja, kan ada teman', napas: 'Lompat sambil tahan napas' },
        balas: { teman: 'Bagian dalam berbahaya untuk anak.', napas: 'Air dalam tetap berbahaya.' },
        aman: 'Masuk lewat tangga di bagian dangkal.',
        aturan: 'Aku berenang di bagian dangkal.'
      },
      teladan: {
        ikat: ['Itu aman.', 'Lala mengikat tali sepatunya dulu.'],
        istirahat: ['Itu aman.', 'Tegar minum dan beristirahat.']
      },
      kilat: {
        lari: 'Sekar pemanasan sebelum berlari.',
        tali: 'Raka berlari dengan tali lepas.',
        bola: 'Bima menendang bola ke kaca.',
        masuk: 'Lala berenang ditemani penjaga.',
        licin: 'Ayu berjalan pelan di tepi kolam.',
        momen: 'Raka melompat ke kolam dalam.'
      },
      /* alasan singkat Kartu Kilat dan papan Pawai: dibacakan saat salah dan sesudah benar */
      alasan: { bola: 'Bola bisa memecahkan kaca.', lari: 'Pemanasan membuat badan siap.', tali: 'Tali lepas bisa membuat tersandung.', masuk: 'Ada penjaga yang mengawasi.', licin: 'Ayu berjalan pelan, tidak berlari.', momen: 'Kolam dalam berbahaya untuk anak.' }
    },
    /* T5 Hari Hujan (TAMBAHAN): 3 bahaya, tanpa Momen Tahan dan Teladan */
    t5: {
      nama: 'Hari Hujan',
      masuk: 'Hujan turun. Tetap siaga, ya!',
      hadiah: 'Jas hujan',
      area: { sungai: 'Raka di tepi sungai', petir: 'Sari dan Dina di lapangan', kabel: 'Nino dan kabel listrik' },
      bahaya: {
        sungai: {
          lihat: ['Air sungai naik dan deras.', 'Raka mau main air.'],
          tanya: 'Apa yang sebaiknya Raka lakukan?',
          kartu: { jauh: 'Menjauh dari sungai', pinggir: 'Main di pinggir saja', teman: 'Ikut teman main air' },
          balas: { pinggir: 'Tepi sungai licin, kamu bisa terpeleset.', teman: 'Arus sungai yang deras sangat kuat.' },
          aman: 'Raka menjauh dari sungai. Aman!',
          aturan: 'Saat hujan, aku menjauh dari sungai.'
        },
        petir: {
          lihat: ['Ada kilat di langit.', 'Sari dan Dina masih di lapangan.'],
          tanya: 'Apa yang sebaiknya mereka lakukan?',
          kartu: { masuk: 'Masuk ke dalam bangunan', pohon: 'Berteduh di bawah pohon', sebentar: 'Main sebentar lagi' },
          balas: { pohon: 'Pohon bukan tempat berlindung dari petir.', sebentar: 'Petir bisa datang kapan saja.' },
          aman: 'Masuk ke rumah. Aman dari petir!',
          aturan: 'Saat petir, aku masuk ke bangunan.'
        },
        kabel: {
          lihat: ['Kabel listrik jatuh ke genangan.', 'Nino mau melompatinya.'],
          tanya: 'Apa yang sebaiknya Nino lakukan?',
          kartu: { jauh: 'Menjauh, panggil orang dewasa', lompat: 'Lompati genangannya', pindah: 'Pindahkan kabelnya sendiri' },
          balas: { lompat: 'Air di dekat kabel bisa menyetrum.', pindah: 'Kabel listrik itu tugas orang dewasa.' },
          aman: 'Terima kasih, Nino. Ayah telepon petugas listrik.',
          aturan: 'Aku menjauhi kabel yang jatuh.'
        }
      },
      teladan: {},
      kilat: {
        sungai: 'Bima melihat hujan dari teras.',
        petir: 'Raka main layangan saat petir.',
        kabel: 'Sekar memegang tiang listrik basah.'
      },
      /* alasan singkat Kartu Kilat dan papan Pawai: dibacakan saat salah dan sesudah benar */
      alasan: { sungai: 'Bima berteduh, jauh dari sungai.', petir: 'Saat petir, kita masuk ke bangunan.', kabel: 'Tiang listrik basah bisa menyetrum.' }
    }
  },

  /* Ayo Menyeberang (GDD 6.2). Urutan untuk lalu lintas lajur kiri: lihat kanan, kiri, lalu kanan lagi. Ubah di sini bila guru ingin rumusan lain. */
  menyeberang: {
    judul: 'Ayo Menyeberang!',
    tombol: { berhenti: 'Berhenti', kanan: 'Lihat kanan', kiri: 'Lihat kiri', seberang: 'Menyeberang' },
    urut: ['berhenti', 'kanan', 'kiri', 'kanan', 'seberang'],
    ajak: 'Bantu Dina menyeberang, ya.',
    urutan: 'Berhenti, lihat kanan, kiri, lalu kanan lagi.',
    putaran: ['Jalan sepi. Ayo mulai!', 'Ada motor di jalan.', 'Perhatikan baik-baik, ya.'],
    langkah: { berhenti: 'Berhenti di tepi jalan.', kanan: 'Lihat ke kanan.', kiri: 'Lihat ke kiri.', kanan2: 'Lihat ke kanan lagi.', seberang: 'Ayo menyeberang, bergandengan.' },
    kosong: 'Jalan kosong.',
    tunggu: 'Tunggu, ada motor.',
    tungguAngkot: 'Tunggu, ada angkot.',
    lihatLagi: 'Sudah lewat. Lihat lagi, ya.',
    salahUrut: 'Berhenti dulu, lalu lihat.',
    salahLangkah: 'Hmm, ikuti urutannya.',
    sampai: 'Hore, sampai dengan aman!',
    selesai: 'Kamu pintar menyeberang!'
  },

  /* Gerak Siaga (GDD 6.3): murid ikut bergerak sungguhan; gim tidak memeriksa gerakan */
  gerak: {
    judul: 'Gerak Siaga!',
    ajak: 'Ayo berdiri dan bergerak bersama Tara!',
    ajakKursi: 'Duduk tegak, ayo bergerak bersama Tara!',
    gerakan: [
      { nama: 'Jalan di tempat', ucap: 'Jalan di tempat!' },
      { nama: 'Putar bahu', ucap: 'Putar bahu ke depan dan belakang!' },
      { nama: 'Gulung Trenggiling', ucap: 'Jongkok peluk lutut, lalu berdiri tinggi!' },
      { nama: 'Patung!', ucap: 'Bergerak bebas. Saat Tara menggulung, diam!' }
    ],
    gerakanKursi: [
      { nama: 'Putar bahu', ucap: 'Putar bahu ke depan dan belakang!' },
      { nama: 'Tepuk lutut', ucap: 'Tepuk lutut bersama!' },
      { nama: 'Peluk lutut', ucap: 'Peluk lutut, lalu duduk tegak!' },
      { nama: 'Patung!', ucap: 'Gerakkan tangan. Saat Tara menggulung, diam!' }
    ],
    patung: 'Patung!',
    bebas: 'Bergerak lagi!',
    sudah: 'Sudah!',
    lewati: 'Lewati',
    selesai: 'Hebat! Badan sudah siap.'
  },

  /* Pawai Siaga (GDD 6.5): papan Aman atau Tahan */
  pawai: {
    judul: 'Pawai Siaga',
    mulai: 'Ayo ikut Pawai Siaga!',
    tanya: 'Aman atau tahan?',
    aman: 'Aman', tahan: 'Tahan',
    benarAman: 'Betul, itu aman!',
    benarTahan: 'Betul, tahan dulu.',
    salah: 'Lihat lagi, ya.',
    tunjuk: 'Perhatikan gambarnya.',
    penutup: 'Kampung kita aman!',
    perakEmas: 'Sisik perak jadi emas!',
    transfer: {
      korek: { kalimat: 'Nino bermain korek api.', jawab: 'tahan', cara: 'Korek api hanya untuk orang dewasa.', alasan: 'Api bisa membakar.' },
      sumur: { kalimat: 'Raka bermain di dekat sumur terbuka.', jawab: 'tahan', cara: 'Aku menjauhi sumur terbuka.', alasan: 'Sumur terbuka sangat dalam.' },
      jendela: { kalimat: 'Tangan Bima keluar jendela angkot.', jawab: 'tahan', cara: 'Tangan tetap di dalam kendaraan.', alasan: 'Tangan di luar jendela berbahaya.' },
      sepeda: { kalimat: 'Sari bersepeda memakai helm.', jawab: 'aman', alasan: 'Helm melindungi kepala.' },
      sabuk: { kalimat: 'Dina memakai sabuk pengaman di mobil.', jawab: 'aman', alasan: 'Sabuk menjaga badan tetap di kursi.' },
      lutut: { kalimat: 'Ayu memakai pelindung lutut.', jawab: 'aman', alasan: 'Pelindung lutut menjaga lututmu.' }
    }
  }
};
