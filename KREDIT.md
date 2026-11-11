# KREDIT: Tara Siaga: Ayo Bermain Aman! (107)

Pengembang:
- Jamaluddin, UPTD SMPN 2 Robatal (Instagram @tretanjamal);
- Rimawan Haritzah, S.Pd., Guru SD Negeri Kauman Bantul.

Dibuat untuk Ruang Murid.
Berkas ini dimulai di Fase 0 (10 November 2026) dan dilengkapi sampai Fase 4.

## Huruf (dibundel di `assets/fonts/`, lisensi SIL Open Font License 1.1)
- **Grandstander** 800 dan 900 (The Grandstander Project Authors, Etcetera Type Co). Diambil dari paket npm `@fontsource/grandstander` 5.3.0 dengan izin kreator. Lisensi: `assets/fonts/OFL-Grandstander.txt`.
- **Andika** 400 dan 700 (SIL International). Disalin dari Kafe Cilik (483). Lisensi: `assets/fonts/OFL-Andika.txt`.

## Gambar
- Latar, key art, dan gambar hadiah dibuat dengan ChatGPT (OpenAI) oleh kreator, 10 November 2026, dari prompt di `docs/ASET-PROMPT.md`. Diolah oleh `tools/proses-aset.py`: dipotong ke 16:9, diperkecil ke 1280x720, disimpan WebP. Layang-layang di `latar-judul` dihapus agar tidak bertabrakan dengan logo.
- Lembar karakter Tara dan lembar tokoh (ChatGPT) hanya dipakai sebagai acuan rancangan dan tidak masuk zip.
- Empat lembar mewarnai (ChatGPT, kreator) untuk bahan cetak guru: diubah ke abu-abu 16 tingkat dan lebar 900 px (`assets/img/mewarnai-*.png`). Hanya tampil saat guru mencetak dari panel Untuk Guru.
- Tara, semua tokoh, benda interaktif, ikon, dan antarmuka digambar dengan kode (SVG).
- `assets/img/pengembang.webp` dan `assets/img/pengembang-2.webp`: foto kedua pengembang untuk panel Pengembang, diserahkan kreator dan dipotong kepala-bahu (`tools/proses-aset.py`).

## Musik
- Musik latar dan jingle dibuat dengan Suno oleh kreator (10 November 2026), dari prompt di `docs/ASET-PROMPT.md`. **Paket Suno dan hak pakainya perlu dilengkapi kreator.**
- Diolah `tools/proses-aset.py` (11 November 2026): 9 musik dipotong menjadi loop 37-52 detik di titik sambung paling mirip (pudar-silang 0,6 detik), 3 jingle dirapikan; semuanya mono 64 kbps, kerasnya disamakan, disimpan sebagai data URI di `js/data/musik_*.js` agar jalan lewat `file://`. Lagu bervokal "Berhenti, Lihat, Pikir" (TAMBAHAN, Fase 3) diputar utuh dari tombol Lagu Siaga di Hasil Belajarku: mono 64 kbps, 91 detik, `js/data/musik_lagu_siaga.js`.
- **Vokal Lagu Siaga dibuat AI (Suno), bukan penyanyi manusia.** Liriknya dari `docs/ASET-PROMPT.md` B6 dan perlu disetujui guru PJOK. Ketentuan Suno untuk lagu bervokal di produk anak perlu diperiksa kreator sebelum terbit.
- Cadangan bila berkas tidak ada: musik sintesis WebAudio "Drumband Cilik" (kode).
- Efek suara: sintesis WebAudio (kode).

## Isi keselamatan
- Sumber materi (tercantum di panel Referensi):
  - Prof. Caly Setiawan, Ph.D., dkk. (2025). *Panduan Mata Pelajaran Pendidikan Jasmani, Olahraga, dan Kesehatan Fase A-F.* Badan Standar, Kurikulum, dan Asesmen Pendidikan, Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.
  - Badan Standar, Kurikulum, dan Asesmen Pendidikan (2025). *Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran.* Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.
- Tindakan aman disusun dari brief kreator dan pengetahuan umum keselamatan anak. Contohnya:
  - menyeberang di zebra cross bersama orang dewasa, dengan urutan lihat kanan, kiri, kanan untuk lajur kiri;
  - masuk ke bangunan saat petir;
  - menjauhi kabel listrik yang jatuh dan memberi tahu orang dewasa;
  - berenang diawasi orang dewasa.
- **Belum dikutip sumber resmi per topik.** Panduan Mata Pelajaran PJOK di atas menjadi rujukan umum. Rujukan per topik perlu dilengkapi dan diperiksa kreator atau guru PJOK sebelum terbit, misalnya imbauan BMKG tentang petir, imbauan PLN tentang kabel jatuh, dan aturan lalu lintas untuk pejalan kaki. Tinjauan independen Fase 4 (subagen KA, bukan guru manusia) menyatakan isinya realistis untuk anak 6-8 tahun.

## Alat pengembangan (tidak ikut zip)
- Playwright (Microsoft, Apache 2.0) untuk uji dan tangkapan layar.
- Pillow, NumPy, miniaudio, lameenc (Python) untuk mengolah aset.
- Kode dan teks disusun dengan bantuan Claude (Anthropic). Pengembang bertanggung jawab atas isinya.
