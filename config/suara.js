/* Suara tiap pembicara lewat speechSynthesis id-ID. Ubah angkanya di sini bila kurang pas setelah didengarkan.
   jenis: p pria, w wanita; suara perangkat yang sejenis didahulukan. pitch: nada bila suaranya sejenis,
   pitchLain: bila perangkat hanya punya suara lawan jenis. rate: kecepatan.
   GDD 13.3: Tara nada 1,15 kecepatan 0,95; narator dan orang dewasa nada 1,0 kecepatan 0,9. Tidak ada setelan ekstrem. */
window.SUARA = {
  namaPria: /david|mark|guy|james|george|daniel|fred|ryan|andrew|brian|christopher|eric|roger|steffan|thomas|andika|ardi|\bmale\b|pria|laki/i,
  narasi: { jenis: 'w', pitch: 1.0, pitchLain: 1.05, rate: 0.9 },
  tokoh: {
    tara: { jenis: 'w', pitch: 1.15, pitchLain: 1.15, rate: 0.95 },   // Tara: riang, sedikit lebih tinggi
    guru: { jenis: 'w', pitch: 1.0, pitchLain: 1.0, rate: 0.9 },      // Bu Guru Ani: hangat dan jelas
    anak: { jenis: 'w', pitch: 1.12, pitchLain: 1.12, rate: 0.95 }    // teman Tim Siaga
  }
};
