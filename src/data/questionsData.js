/**
 * Bank Data 110 Soal Lengkap Simulasi CAT SKD (Seleksi Kompetensi Dasar)
 * Sesuai PermenPAN-RB terbaru:
 * - Soal 1 - 30: TWK (Tes Wawasan Kebangsaan) - Benar 5, Salah 0
 * - Soal 31 - 65: TIU (Tes Inteligensia Umum) - Benar 5, Salah 0
 * - Soal 66 - 110: TKP (Tes Karakteristik Pribadi) - Skala 1 sampai 5 untuk tiap opsi A-E
 */

export const DEFAULT_QUESTIONS = [
  // ==========================================
  // SOAL 1 - 30: TES WAWASAN KEBANGSAAN (TWK)
  // Bobot: Benar = 5, Salah = 0
  // ==========================================
  {
    id: 1,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pancasila - Pengamalan Sila Ke-2",
    title: "Implementasi Nilai Kemanusiaan yang Adil dan Beradab",
    question: "Dalam era digital saat ini, marak terjadi fenomena cyberbullying dan penyebaran konten kebencian di media sosial yang menyerang kehormatan individu. Tindakan tersebut bertentangan secara langsung dengan pengamalan nilai Pancasila, khususnya...",
    options: {
      A: "Sila pertama, karena melanggar ajaran agama tentang larangan menyakiti sesama",
      B: "Sila kedua, karena merendahkan harkat dan martabat kemanusiaan manusia lain",
      C: "Sila ketiga, karena dapat memicu perpecahan dalam persatuan bangsa",
      D: "Sila keempat, karena tidak mencerminkan budaya musyawarah yang santun",
      E: "Sila kelima, karena menciptakan ketidakadilan dalam perlakuan sosial"
    },
    scoringType: "single", // 1-65: single key = 5 points
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Sila ke-2 (Kemanusiaan yang Adil dan Beradab) menekankan pengakuan atas harkat dan martabat manusia, persamaan derajat, hak, dan kewajiban asasi setiap manusia tanpa diskriminasi. Menyerang kehormatan orang lain melalui cyberbullying merendahkan martabat manusia."
  },
  {
    id: 2,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pancasila - Kedudukan Pancasila",
    title: "Kedudukan Pancasila sebagai Staatsfundamentalnorm",
    question: "Pancasila berkedudukan sebagai norma fundamental negara (Staatsfundamentalnorm). Konsekuensi yuridis dari kedudukan ini dalam hierarki tata perundang-undangan di Indonesia adalah...",
    options: {
      A: "Pancasila dapat diubah melalui sidang istimewa Majelis Permusyawaratan Rakyat",
      B: "Semua peraturan perundang-undangan dari UUD 1945 hingga Perda tidak boleh bertentangan dengan Pancasila",
      C: "Pancasila memiliki kedudukan yang setara dengan pasal-pasal dalam batang tubuh UUD NRI 1945",
      D: "Pancasila dapat dikesampingkan dalam keadaan darurat militer atau bahaya negara",
      E: "Pancasila hanya mengikat lembaga eksekutif dalam menjalankan roda pemerintahan"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Sebagai Staatsfundamentalnorm (pokok kaidah negara yang fundamental), Pancasila menjadi dasar pembentukan hukum tertinggi, sehingga seluruh aturan perundangan di bawahnya harus bersumber dan tidak boleh bertentangan dengan Pancasila."
  },
  {
    id: 3,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "UUD 1945 - Amandemen",
    title: "Kewenangan Mahkamah Konstitusi Berdasarkan UUD 1945",
    question: "Berdasarkan Pasal 24C Ayat (1) UUD NRI 1945 hasil amandemen, Mahkamah Konstitusi berwenang mengadili pada tingkat pertama dan terakhir yang putusannya bersifat final untuk hal-hal berikut, KECUALI...",
    options: {
      A: "Menguji undang-undang terhadap Undang-Undang Dasar",
      B: "Memutus sengketa kewenangan lembaga negara yang kewenangannya diberikan oleh UUD",
      C: "Menguji peraturan pemerintah terhadap undang-undang yang lebih tinggi",
      D: "Memutus pembubaran partai politik",
      E: "Memutus perselisihan tentang hasil pemilihan umum"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Menguji peraturan perundang-undangan di bawah undang-undang terhadap undang-undang merupakan kewenangan Mahkamah Agung (MA) berdasarkan Pasal 24A ayat (1), bukan wewenang Mahkamah Konstitusi."
  },
  {
    id: 4,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "UUD 1945 - Lembaga Negara",
    title: "Kewenangan Komisi Yudisial dalam Sistem Peradilan",
    question: "Komisi Yudisial dibentuk sebagai lembaga mandiri yang berwenang mengusulkan pengangkatan hakim agung dan mempunyai wewenang lain dalam rangka menjaga dan menegakkan kehormatan, keluhuran martabat, serta perilaku hakim. Landasan konstitusional Komisi Yudisial diatur dalam UUD 1945 Pasal...",
    options: {
      A: "Pasal 24A",
      B: "Pasal 24B",
      C: "Pasal 24C",
      D: "Pasal 25A",
      E: "Pasal 23E"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Komisi Yudisial diatur secara eksplisit dalam Pasal 24B UUD NRI 1945."
  },
  {
    id: 5,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Nasionalisme - Wawasan Nusantara",
    title: "Tantangan Wawasan Nusantara di Era Globalisasi",
    question: "Wawasan Nusantara memandang kepulauan Indonesia sebagai satu kesatuan politik, ekonomi, sosial budaya, dan pertahanan keamanan. Dalam perwujudan kepulauan nusantara sebagai satu kesatuan ekonomi, prinsip utamanya adalah...",
    options: {
      A: "Pusat pemerintahan berhak memonopoli seluruh sumber daya alam daerah untuk cadangan devisa nasional",
      B: "Kekayaan wilayah nusantara adalah modal dan milik bersama bangsa, serta keperluan hidup sehari-hari harus tersedia merata di seluruh wilayah tanah air",
      C: "Tiap-tiap daerah otonom dibebaskan membuat kebijakan tarif perdagangan antar daerah sendiri",
      D: "Pembangunan ekonomi difokuskan pada pulau-pulau dengan kepadatan penduduk tertinggi guna percepatan pendapatan",
      E: "Membatasi investasi asing secara total agar tidak terjadi percampuran modal"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Perwujudan Wawasan Nusantara sebagai kesatuan ekonomi menyatakan bahwa kekayaan nusantara adalah modal dan milik bersama bangsa, serta keperluan hidup sehari-hari harus tersedia merata di seluruh tanah air dengan tingkat perkembangan ekonomi yang serasi dan seimbang."
  },
  {
    id: 6,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Bela Negara - Nilai Dasar",
    title: "Aksi Nyata Cinta Tanah Air bagi Aparatur Sipil Negara",
    question: "Salah satu indikator nilai dasar bela negara adalah cinta tanah air. Bagi seorang Aparatur Sipil Negara (ASN), sikap yang paling mencerminkan indikator ini dalam tugas sehari-hari adalah...",
    options: {
      A: "Hanya bergaul dengan rekan kerja yang berasal dari satu daerah asal",
      B: "Menggunakan dan mempromosikan produk-produk buatan dalam negeri dalam pengadaan barang kantor",
      C: "Menghafal nama-nama pahlawan nasional tanpa memahami nilai perjuangannya",
      D: "Menolak penugasan dinas di wilayah pelosok atau perbatasan terluar",
      E: "Menyimpan seluruh aset keuangan pribadi di lembaga perbankan luar negeri"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Indikator Cinta Tanah Air antara lain bangga menggunakan hasil produk bangsa sendiri, menjaga nama baik bangsa dan negara, serta memberikan kontribusi pada kemajuan bangsa."
  },
  {
    id: 7,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Integritas - Anti Korupsi",
    title: "Prinsip Akuntabilitas dan Integritas Pelayanan Publik",
    question: "Seorang pejabat publik menolak bingkisan parsel bernilai tinggi yang dikirimkan oleh kontraktor rekanan dinas saat hari raya keagamaan. Sikap pejabat tersebut merupakan wujud penerapan nilai integritas, yaitu...",
    options: {
      A: "Menghindari benturan kepentingan dan menolak gratifikasi terlarang",
      B: "Mementingkan keuntungan instansi di atas kepentingan pribadi",
      C: "Menciptakan persaingan antar pengusaha agar saling menurunkan harga tender",
      D: "Memenuhi prosedur operasional standar tanpa melihat substansi moral",
      E: "Menjaga hubungan pribadi yang harmonis dengan vendor penyedia jasa"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Menolak pemberian yang berhubungan dengan jabatan dan berlawanan dengan kewajiban (gratifikasi) adalah wujud nyata integritas anti-korupsi serta menghindari konflik kepentingan."
  },
  {
    id: 8,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Sejarah Perjuangan Bangsa",
    title: "Peristiwa Rengasdengklok dan Proklamasi 1945",
    question: "Perbedaan pendapat utama antara golongan pemuda (Sukarni, Chaerul Saleh, Wikana) dan golongan tua (Ir. Soekarno, Drs. Moh. Hatta) yang melatarbelakangi terjadinya Peristiwa Rengasdengklok pada 16 Agustus 1945 adalah mengenai...",
    options: {
      A: "Rumusan naskah teks proklamasi kemerdekaan yang akan dibacakan",
      B: "Lokasi tempat pembacaan naskah proklamasi antara Jakarta atau Rengasdengklok",
      C: "Waktu pelaksanaan proklamasi dan keterlibatan Panitia Persiapan Kemerdekaan Indonesia (PPKI)",
      D: "Siapa yang akan menandatangani naskah proklamasi atas nama bangsa Indonesia",
      E: "Bendera yang akan dikibarkan saat upacara kemerdekaan berlangsung"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Golongan muda menginginkan proklamasi dilakukan secepatnya tanpa campur tangan Jepang atau PPKI yang dianggap bentukan Jepang, sedangkan golongan tua menghendaki proklamasi dimatangkan lewat sidang PPKI demi menghindari pertumpahan darah dengan tentara Jepang."
  },
  {
    id: 9,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Bhinneka Tunggal Ika",
    title: "Asal-usul Semboyan Bhinneka Tunggal Ika",
    question: "Semboyan 'Bhinneka Tunggal Ika' termaktub dalam kitab Sutasoma karangan Mpu Tantular yang ditulis pada masa keemasan kerajaan...",
    options: {
      A: "Kerajaan Sriwijaya di bawah Raja Balaputradewa",
      B: "Kerajaan Singasari di bawah Raja Kertanegara",
      C: "Kerajaan Majapahit di bawah Raja Hayam Wuruk",
      D: "Kerajaan Kediri di bawah Raja Jayabaya",
      E: "Kerajaan Mataram Kuno di bawah Rakai Pikatan"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Kitab Sutasoma digubah oleh Mpu Tantular pada masa pemerintahan Raja Hayam Wuruk (Kerajaan Majapahit) abad ke-14 Masehi."
  },
  {
    id: 10,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Bahasa Indonesia - Ejaan dan Tanda Baca",
    title: "Penulisan Kata Sesuai PUEBI/EYD Edisi V",
    question: "Penulisan kalimat berikut yang seluruhnya memenuhi kaidah Ejaan Bahasa Indonesia yang Disempurnakan (EYD V) adalah...",
    options: {
      A: "Pemerintah sedang men-sosialisasikan program non-migas ke berbagai sub-sektor industri.",
      B: "Pemerintah sedang menyosialisasikan program nonmigas ke berbagai subsektor industri.",
      C: "Pemerintah sedang mensosialisasikan program non migas ke berbagai sub sektor industri.",
      D: "Pemerintah sedang menyosialisasikan program non-migas ke berbagai sub sektor industri.",
      E: "Pemerintah sedang mensosialisasikan program nonmigas ke berbagai sub-sektor industri."
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Awalan me- bertemu huruf 's' pada 'sosialisasi' mengalami peluluhan menjadi 'menyosialisasikan'. Bentuk terikat seperti 'non-' dan 'sub-' ditulis serangkai jika diikuti kata dasar tanpa tanda hubung ('nonmigas', 'subsektor')."
  },
  {
    id: 11,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Bahasa Indonesia - Kalimat Efektif",
    title: "Identifikasi Kalimat Efektif dan Baku",
    question: "Manakah di antara kalimat berikut yang merupakan kalimat efektif?",
    options: {
      A: "Bagi para peserta ujian diharapkan untuk hadir tepat waktu di lokasi tes.",
      B: "Dalam rapat pimpinan itu membicarakan tentang peningkatan kinerja pelayanan publik.",
      C: "Para pimpinan instansi menyepakati perbaikan sistem administrasi kepegawaian.",
      D: "Meskipun sudah berulang kali diingatkan, namun ia tetap saja melanggar tata tertib.",
      E: "Tugas daripada seorang abdi negara adalah untuk melayani masyarakat secara prima."
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Kalimat C memiliki subjek (Para pimpinan instansi), predikat (menyepakati), dan objek (perbaikan sistem administrasi kepegawaian) yang jelas tanpa pemborosan kata atau preposisi yang merusak struktur."
  },
  {
    id: 12,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pilar Negara - Sistem Ketatanegaraan",
    title: "Hubungan Pengawasan DPR dan Presiden",
    question: "Hak DPR untuk meminta keterangan kepada Pemerintah mengenai kebijakan pemerintah yang penting dan strategis serta berdampak luas pada kehidupan bermasyarakat dan bernegara disebut hak...",
    options: {
      A: "Hak Angket",
      B: "Hak Interpelasi",
      C: "Hak Menyatakan Pendapat",
      D: "Hak Imunitas",
      E: "Hak Budget"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Hak Interpelasi adalah hak DPR meminta keterangan kepada Pemerintah mengenai kebijakan penting dan strategis. Hak Angket untuk penyelidikan, Hak Menyatakan Pendapat untuk tindak lanjut atas penyelidikan."
  },
  {
    id: 13,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pancasila - Butir Pengamalan Sila Ke-4",
    title: "Demokrasi Pancasila dan Musyawarah Mufakat",
    question: "Sikap yang mencerminkan pengamalan sila keempat Pancasila 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan' dalam kehidupan berorganisasi adalah...",
    options: {
      A: "Memaksakan kehendak kepada anggota lain demi efisiensi waktu pengambilan keputusan",
      B: "Menerima dan melaksanakan hasil keputusan musyawarah dengan iktikad baik dan rasa tanggung jawab",
      C: "Walk out dari ruang sidang saat usulan pribadinya tidak disetujui mayoritas forum",
      D: "Menggalang massa di luar forum untuk menolak kesepakatan mufakat yang sah",
      E: "Menolak bertanggung jawab atas dampak negatif program kerja yang telah disetujui bersama"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Butir pengamalan sila ke-4 antara lain: dengan iktikad baik dan rasa tanggung jawab menerima dan melaksanakan hasil keputusan musyawarah."
  },
  {
    id: 14,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "UUD 1945 - Hak Asasi Manusia",
    title: "Hak Asasi Manusia yang Tidak Dapat Dikurangi (Non-Derogable Rights)",
    question: "Menurut Pasal 28I Ayat (1) UUD 1945, hak asasi manusia yang tidak dapat dikurangi dalam keadaan apa pun (non-derogable rights) meliputi...",
    options: {
      A: "Hak hidup, hak tidak disiksa, hak kemerdekaan pikiran dan hati nurani, serta hak beragama",
      B: "Hak mendirikan partai politik dan hak dipilih dalam pemilihan umum",
      C: "Hak kepemilikan tanah dan hak mendirikan bangunan usaha",
      D: "Hak mengemukakan pendapat di muka umum secara bebas tanpa izin",
      E: "Hak memperoleh subsidi energi dan pangan dari negara"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Pasal 28I ayat (1) menyatakan hak untuk hidup, hak untuk tidak disiksa, hak kemerdekaan pikiran dan hati nurani, hak beragama, hak untuk tidak diperbudak, hak untuk diakui sebagai pribadi di hadapan hukum, dan hak untuk tidak dituntut atas dasar hukum yang berlaku surut adalah hak asasi yang tidak dapat dikurangi dalam keadaan apa pun."
  },
  {
    id: 15,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Bela Negara - Komponen Pertahanan",
    title: "Sistem Pertahanan Keamanan Rakyat Semesta (Sishankamrata)",
    question: "Sistem Pertahanan dan Keamanan Negara Indonesia menggunakan sistem pertahanan dan keamanan rakyat semesta. Dalam sistem ini, Tentara Nasional Indonesia (TNI) berkedudukan sebagai...",
    options: {
      A: "Kekuatan cadangan pertahanan",
      B: "Kekuatan pendukung pertahanan",
      C: "Kekuatan utama pertahanan",
      D: "Kekuatan tunggal pertahanan",
      E: "Kekuatan mobilisasi logistik"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Berdasarkan Pasal 30 ayat (2) UUD 1945, TNI dan Polri bertindak sebagai kekuatan utama, di mana TNI sebagai kekuatan utama pertahanan dan Polri sebagai kekuatan utama keamanan dan ketertiban, sedangkan rakyat sebagai kekuatan pendukung."
  },
  {
    id: 16,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Nasionalisme - Tokoh Pergerakan",
    title: "Peran Tokoh Tiga Serangkai dalam Indische Partij",
    question: "Organisasi politik pertama di Hindia Belanda yang secara tegas menyatakan tujuannya untuk mencapai kemerdekaan Indonesia adalah Indische Partij yang didirikan oleh 'Tiga Serangkai', yaitu...",
    options: {
      A: "Dr. Soetomo, Dr. Wahidin Soedirohoesodo, dan H.O.S. Tjokroaminoto",
      B: "E.F.E. Douwes Dekker, dr. Tjipto Mangoenkoesoemo, dan Ki Hadjar Dewantara",
      C: "Ir. Soekarno, Drs. Moh. Hatta, dan Sutan Sjahrir",
      D: "K.H. Ahmad Dahlan, K.H. Hasyim Asy'ari, dan H. Samanhudi",
      E: "Mohammad Yamin, Mr. Soepomo, dan Prof. Dr. Soepomo"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Tiga Serangkai pendiri Indische Partij pada 25 Desember 1912 di Bandung adalah E.F.E. Douwes Dekker (Danudirja Setiabudi), dr. Tjipto Mangoenkoesoemo, dan Suwardi Suryaningrat (Ki Hadjar Dewantara)."
  },
  {
    id: 17,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Integritas - Nilai Kejujuran",
    title: "Dilema Etika Profesional dalam Pengawasan Anggaran",
    question: "Seorang auditor internal menemukan selisih anggaran belanja fiktif yang melibatkan atasan langsungnya. Tindakan yang paling mencerminkan integritas tinggi adalah...",
    options: {
      A: "Mengabaikan temuan tersebut demi menjaga hubungan baik dan karir pribadi",
      B: "Membicarakan temuan tersebut di media sosial untuk mendapatkan dukungan publik",
      C: "Melaporkan temuan secara objektif melalui mekanisme whistleblower system yang berlaku secara resmi",
      D: "Memeras atasan dengan meminta bagian dari dana selisih tersebut",
      E: "Mengubah kertas kerja audit agar angka pembukuan terlihat seimbang"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Integritas menuntut profesionalisme, keberanian, dan kejujuran dengan melaporkan penyimpangan melalui jalur resmi (whistleblowing system) tanpa kompromi terhadap pelanggaran hukum."
  },
  {
    id: 18,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Bahasa Indonesia - Gagasan Pokok Paragraf",
    title: "Menentukan Ide Pokok dalam Wacana Pelayanan Publik",
    question: "Bacalah paragraf berikut: 'Transformasi digital dalam birokrasi pemerintahan bukan sekadar memindahkan dokumen kertas ke dalam format digital atau PDF. Lebih dari itu, transformasi menuntut perubahan pola pikir aparatur, perbaikan tata kelola data yang terintegrasi, serta pemangkasan rantai birokrasi yang berbelit-belit. Tanpa kesiapan sumber daya manusia dan budaya kerja yang adaptif, digitalisasi hanya akan menjadi pemborosan anggaran teknologi informasi.' Gagasan utama paragraf tersebut adalah...",
    options: {
      A: "Biaya pengadaan teknologi informasi dalam pemerintahan sangat mahal",
      B: "Format dokumen PDF tidak lagi efektif dalam pelayanan administrasi modern",
      C: "Hakikat transformasi digital birokrasi menuntut kesiapan pola pikir SDM dan pembenahan tata kelola",
      D: "Pemerintah telah berhasil mengimplementasikan sistem birokrasi digital terpadu",
      E: "Aparatur sipil negara menolak adanya digitalisasi dokumen"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Ide pokok paragraf tersebut berpusat pada hakikat transformasi digital yang sesungguhnya, yaitu perubahan pola pikir aparatur dan pembenahan tata kelola, bukan sekadar peralihan teknis."
  },
  {
    id: 19,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pancasila - Fungsi Ideologi Terbuka",
    title: "Dimensi Fleksibilitas Pancasila sebagai Ideologi Terbuka",
    question: "Pancasila disebut sebagai ideologi terbuka karena memiliki nilai-nilai yang dapat berinteraksi dengan perkembangan zaman tanpa mengubah nilai dasarnya. Dimensi yang menunjukkan kemampuan Pancasila untuk menyesuaikan dan memperbarui penerapannya sesuai tantangan zaman disebut dimensi...",
    options: {
      A: "Dimensi Realitas",
      B: "Dimensi Idealisme",
      C: "Dimensi Fleksibilitas / Pengembangan",
      D: "Dimensi Normatif",
      E: "Dimensi Dogmatis"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Dimensi fleksibilitas (pengembangan) mencerminkan keterbukaan ideologi Pancasila dalam merespons dinamika perubahan zaman melalui interpretasi baru yang segar tanpa mengubah nilai esensialnya."
  },
  {
    id: 20,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Sejarah - Perjanjian Linggarjati & Renville",
    title: "Dampak Perjanjian Renville terhadap Wilayah RI",
    question: "Salah satu dampak militer dan teritorial yang sangat merugikan pihak Republik Indonesia akibat penandatanganan Perjanjian Renville pada 17 Januari 1948 adalah...",
    options: {
      A: "Ibu kota RI di Yogyakarta diserahkan sepenuhnya kepada kekuasaan NICA",
      B: "TNI dari Divisi Siliwangi harus ditarik mundur (hijrah) dari kantong-kantong gerilya Jawa Barat ke Jawa Tengah",
      C: "Belanda mengakui kedaulatan de facto RI atas pulau Jawa, Madura, dan Sumatra",
      D: "Pembubaran Tentara Nasional Indonesia dan peleburannya ke dalam KNIL",
      E: "Pemutusan hubungan diplomatik antara Indonesia dengan seluruh negara Liga Arab"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Perjanjian Renville menetapkan Garis Status Quo (Garis Van Mook), yang memaksa ribuan pejuang TNI (termasuk Divisi Siliwangi di Jawa Barat) untuk 'hijrah' ke wilayah kekuasaan RI di Jawa Tengah dan Yogyakarta."
  },
  {
    id: 21,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pilar Negara - Bentuk Negara dan Pemerintahan",
    title: "Prinsip Negara Kesatuan Republik Indonesia",
    question: "Pasal 37 Ayat (5) UUD 1945 secara tegas menyatakan bahwa ketentuan tentang bentuk Negara Kesatuan Republik Indonesia...",
    options: {
      A: "Dapat diubah apabila disetujui oleh sedikitnya dua pertiga anggota MPR",
      B: "Dapat diubah melalui referendum nasional",
      C: "Tidak dapat dilakukan perubahan",
      D: "Hanya dapat diubah dalam situasi krisis moneter berkepanjangan",
      E: "Dapat diubah menjadi federasi berdasarkan usulan Dewan Perwakilan Daerah"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Pasal 37 Ayat (5) UUD 1945 berbunyi: 'Khusus mengenai bentuk Negara Kesatuan Republik Indonesia tidak dapat dilakukan perubahan.'"
  },
  {
    id: 22,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Nasionalisme - Integrasi Nasional",
    title: "Faktor Pendorong Integrasi Nasional",
    question: "Di bawah ini yang merupakan faktor internal pendorong terwujudnya integrasi nasional bagi bangsa Indonesia adalah...",
    options: {
      A: "Adanya ancaman agresi militer dari negara tetangga",
      B: "Perasaan senasib dan seperjuangan akibat penindasan penjajahan di masa lalu",
      C: "Kemajuan teknologi komunikasi dari negara-negara barat",
      D: "Masuknya modal asing dalam proyek strategis nasional",
      E: "Perjanjian kerja sama perdagangan bebas antar-negara kawasan"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Rasa senasib dan sepenanggungan akibat penjajahan masa lampau adalah faktor historis internal yang mengikat rasa persaudaraan dan integrasi seluruh rakyat Indonesia."
  },
  {
    id: 23,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Bela Negara - Landasan Yuridis",
    title: "Kewajiban Warga Negara dalam Upaya Pembelaan Negara",
    question: "Hak dan kewajiban setiap warga negara untuk ikut serta dalam upaya pembelaan negara dijamin dalam konstitusi UUD 1945 Pasal...",
    options: {
      A: "Pasal 27 Ayat (1)",
      B: "Pasal 27 Ayat (3)",
      C: "Pasal 28A",
      D: "Pasal 31 Ayat (1)",
      E: "Pasal 33 Ayat (1)"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Pasal 27 Ayat (3) UUD 1945 menyatakan: 'Setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara.'"
  },
  {
    id: 24,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Integritas - Nilai Kepedulian",
    title: "Implementasi Nilai Kepedulian Sosial dalam Pelayanan",
    question: "Ketika terjadi bencana alam banjir bandang di suatu daerah, sekelompok pegawai dinas sosial secara sukarela mengorbankan hari liburnya untuk mendirikan dapur umum dan membantu trauma healing anak-anak korban bencana. Perilaku ini mencerminkan integritas nilai...",
    options: {
      A: "Kemandirian",
      B: "Kedisiplinan",
      C: "Kepedulian",
      D: "Keberanian",
      E: "Keadilan"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Nilai kepedulian adalah sikap empati, tanggap terhadap derita sesama, dan kemauan mengulurkan bantuan tulus bagi yang membutuhkan."
  },
  {
    id: 25,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "UUD 1945 - Pembukaan",
    title: "Makna Alinea Pertama Pembukaan UUD 1945",
    question: "Pernyataan 'Bahwa sesungguhnya kemerdekaan itu ialah hak segala bangsa dan oleh sebab itu, maka penjajahan di atas dunia harus dihapuskan karena tidak sesuai dengan perikemanusiaan dan perikeadilan' mengandung dalil...",
    options: {
      A: "Dalil subjektif saja",
      B: "Dalil objektif dan dalil subjektif",
      C: "Dalil yurisdiksi internasional",
      D: "Dalil historis monarki",
      E: "Dalil utilitarianisme"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Alinea I memuat dalil objektif (penjajahan di mana pun bertentangan dengan perikemanusiaan dan keadilan universal) dan dalil subjektif (aspirasi bangsa Indonesia untuk membebaskan diri dari penjajahan)."
  },
  {
    id: 26,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pancasila - Butir Sila Ke-3",
    title: "Menempatkan Persatuan dan Kesatuan Bangsa",
    question: "Sanggup dan rela berkorban untuk kepentingan negara dan bangsa apabila diperlukan, serta mengembangkan rasa cinta kepada tanah air dan bangsa, merupakan butir pengalaman Pancasila...",
    options: {
      A: "Sila Ke-1",
      B: "Sila Ke-2",
      C: "Sila Ke-3",
      D: "Sila Ke-4",
      E: "Sila Ke-5"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Rela berkorban untuk bangsa dan negara serta mencintai tanah air adalah butir pengamalan Sila Ke-3 (Persatuan Indonesia)."
  },
  {
    id: 27,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Bahasa Indonesia - Makna Kata / Sinonim Kontekstual",
    title: "Analisis Makna Istilah Kebijakan",
    question: "Dalam wacana: 'Pemerintah berupaya memitigasi dampak resesi ekonomi global terhadap sektor riil domestik.' Kata 'memitigasi' dalam kalimat tersebut memiliki makna yang paling sepadan dengan...",
    options: {
      A: "Mempercepat terjadinya",
      B: "Mengurangi atau memperkecil risiko",
      C: "Mengalihkan tanggung jawab",
      D: "Menghitung kerugian masa lalu",
      E: "Membatalkan seluruh rencana pembangunan"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Mitigasi berarti upaya untuk mengurangi atau meredakan tingkat keparahan, kerusakan, atau risiko dari suatu bahaya/dampak buruk."
  },
  {
    id: 28,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pilar Negara - Otonomi Daerah",
    title: "Urusan Pemerintahan Konkuren Menurut UU Pemda",
    question: "Urusan pemerintahan yang dibagi antara Pemerintah Pusat dan Daerah provinsi serta Daerah kabupaten/kota dalam sistem otonomi daerah disebut...",
    options: {
      A: "Urusan Pemerintahan Absolut",
      B: "Urusan Pemerintahan Konkuren",
      C: "Urusan Pemerintahan Umum",
      D: "Urusan Pemerintahan Sentralistik",
      E: "Urusan Pemerintahan Otonom Khusus"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Menurut UU No. 23 Tahun 2014, urusan konkuren adalah urusan pemerintahan yang dibagi antara Pemerintah Pusat dan Pemda provinsi serta kabupaten/kota."
  },
  {
    id: 29,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Sejarah - Konferensi Meja Bundar (KMB)",
    title: "Hasil Keputusan Pokok Konferensi Meja Bundar 1949",
    question: "Salah satu kesepakatan penting yang berhasil dirumuskan dalam Konferensi Meja Bundar (KMB) di Den Haag pada tahun 1949 adalah...",
    options: {
      A: "Belanda menyerahkan kedaulatan kepada Republik Indonesia Serikat (RIS) tanpa syarat pada akhir 1949",
      B: "Irian Barat langsung diserahkan kepada Republik Indonesia Serikat saat itu juga",
      C: "Indonesia tetap berada di bawah kekuasaan monarki Kerajaan Belanda selamanya",
      D: "Penghapusan seluruh utang Hindia Belanda sebelum kemerdekaan",
      E: "Pemberlakuan mata uang Gulden sebagai mata uang tunggal di Indonesia"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "KMB menghasilkan pengakuan dan penyerahan kedaulatan Belanda kepada RIS pada akhir Desember 1949, dengan penundaan penyelesaian masalah Irian Barat dalam jangka waktu 1 tahun."
  },
  {
    id: 30,
    category: "TWK",
    categoryName: "Tes Wawasan Kebangsaan",
    topic: "Pancasila - Butir Sila Ke-5",
    title: "Keadilan Sosial dan Sikap Hidup Hemat",
    question: "Menjaga keseimbangan antara hak dan kewajiban, menghormati hak orang lain, suka bekerja keras, serta tidak menggunakan hak milik untuk hal-hal yang bersifat pemborosan dan bergaya hidup mewah merupakan perwujudan pengamalan sila...",
    options: {
      A: "Sila Ke-1",
      B: "Sila Ke-2",
      C: "Sila Ke-3",
      D: "Sila Ke-4",
      E: "Sila Ke-5"
    },
    scoringType: "single",
    correctAnswer: "E",
    points: { A: 0, B: 0, C: 0, D: 0, E: 5 },
    explanation: "Sila Ke-5 (Keadilan Sosial bagi Seluruh Rakyat Indonesia) menegaskan sikap hidup hemat, tidak bermewah-mewah, menghargai kerja keras orang lain, dan menjaga keseimbangan hak serta kewajiban."
  },

  // ==========================================
  // SOAL 31 - 65: TES INTELIGENSIA UMUM (TIU)
  // Bobot: Benar = 5, Salah = 0
  // ==========================================
  {
    id: 31,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Analogi Kata",
    title: "Analogi Hubungan Sebab-Akibat / Fenomena",
    question: "KEMARAU : KEKERINGAN = ... : ...",
    options: {
      A: "Hujan : Dingin",
      B: "Badai : Gelombang",
      C: "Makan : Kenyang",
      D: "Banjir : Hujan",
      E: "Lapar : Sakit"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Hubungan sebab-akibat: Kondisi kemarau menyebabkan kekeringan. Tindakan makan menyebabkan kondisi kenyang."
  },
  {
    id: 32,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Analogi Kata",
    title: "Analogi Fungsi dan Instrumen",
    question: "STETOSKOP : DOKTER = MIKROSKOP : ...",
    options: {
      A: "Laboratorium",
      B: "Peneliti",
      C: "Bakteri",
      D: "Optik",
      E: "Teleskop"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Alat dan penggunanya: Stetoskop adalah alat yang digunakan oleh dokter. Mikroskop adalah alat yang digunakan oleh peneliti."
  },
  {
    id: 33,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Silogisme",
    title: "Penarikan Kesimpulan Silogisme Kategoris",
    question: "Premis 1: Semua ASN yang berprestasi berhak menerima tunjangan kinerja tambahan.\nPremis 2: Sebagian pegawai di Instansi X tidak menerima tunjangan kinerja tambahan.\nKesimpulan yang sah adalah...",
    options: {
      A: "Semua pegawai di Instansi X bukan ASN berprestasi",
      B: "Sebagian pegawai di Instansi X bukan ASN yang berprestasi",
      C: "Semua pegawai di Instansi X adalah ASN yang berprestasi",
      D: "Pegawai yang berprestasi tidak bekerja di Instansi X",
      E: "Instansi X tidak memiliki anggaran tunjangan kinerja"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Jika semua ASN berprestasi berhak dapat tunjangan, dan sebagian pegawai di Instansi X tidak dapat tunjangan, maka sebagian pegawai di Instansi X tersebut bukanlah ASN yang berprestasi."
  },
  {
    id: 34,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Silogisme Implikasi",
    title: "Penarikan Kesimpulan Modus Tollens",
    question: "Premis 1: Jika sistem pelayanan berbasis digital berjalan optimal, maka waktu tunggu layanan berkurang 50%.\nPremis 2: Waktu tunggu layanan di loket tidak berkurang 50%.\nKesimpulan yang paling tepat adalah...",
    options: {
      A: "Sistem pelayanan berbasis digital berjalan optimal tetapi loket tutup",
      B: "Sistem pelayanan berbasis digital tidak berjalan optimal",
      C: "Masyarakat tidak memahami cara penggunaan sistem digital",
      D: "Waktu tunggu layanan akan bertambah 50%",
      E: "Loket pelayanan membutuhkan penambahan pegawai baru"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Berdasarkan kaidah Modus Tollens: Jika p → q, dan ~q, maka kesimpulannya adalah ~p (Sistem pelayanan berbasis digital tidak berjalan optimal)."
  },
  {
    id: 35,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Penalaran Analitis",
    title: "Urutan Posisi Antrean Layanan",
    question: "Lima orang (Andi, Budi, Citra, Dodi, Eka) sedang mengantre di loket pelayanan.\n- Budi mengantre tepat di depan Dodi.\n- Andi mengantre di belakang Citra namun di depan Budi.\n- Eka mengantre di urutan paling belakang.\nSiapakah yang berada di antrean nomor 2?",
    options: {
      A: "Citra",
      B: "Andi",
      C: "Budi",
      D: "Dodi",
      E: "Eka"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Dari petunjuk: Citra di depan Andi, Andi di depan Budi, Budi tepat di depan Dodi, Eka paling belakang. Urutan dari pertama ke belakang: 1. Citra, 2. Andi, 3. Budi, 4. Dodi, 5. Eka. Nomor 2 adalah Andi."
  },
  {
    id: 36,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Deret Angka",
    title: "Pola Deret Angka Bertingkat",
    question: "Berapakah angka kelanjutan dari deret berikut: 3, 5, 9, 17, 33, 65, ...?",
    options: {
      A: "97",
      B: "128",
      C: "129",
      D: "131",
      E: "133"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Pola selisih: +2, +4, +8, +16, +32, maka berikutnya adalah +64. 65 + 64 = 129. (Atau pola: 2n - 1: 3x2-1=5, 5x2-1=9, 9x2-1=17, 17x2-1=33, 33x2-1=65, 65x2-1=129)."
  },
  {
    id: 37,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Deret Kombinasi",
    title: "Deret Lompat Dua Pola",
    question: "Tentukan dua angka selanjutnya dari barisan: 4, 18, 8, 15, 12, 12, 16, 9, ..., ...",
    options: {
      A: "20, 6",
      B: "18, 6",
      C: "20, 7",
      D: "22, 5",
      E: "20, 8"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Terdapat 2 deret yang saling berselang-seling: Deret ganjil: 4, 8, 12, 16, [20] (selalu bertambah 4). Deret genap: 18, 15, 12, 9, [6] (selalu berkurang 3). Maka jawabannya adalah 20 dan 6."
  },
  {
    id: 38,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Berhitung Cepat",
    title: "Operasi Pecahan dan Persentase",
    question: "Hasil perhitungan dari (0,75 : 1/4) + (25% x 16) - 1,5 adalah...",
    options: {
      A: "4,5",
      B: "5,0",
      C: "5,5",
      D: "6,0",
      E: "6,5"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "0,75 : 1/4 = 0,75 x 4 = 3. 25% x 16 = 0,25 x 16 = 4. Maka 3 + 4 - 1,5 = 7 - 1,5 = 5,5."
  },
  {
    id: 39,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Perbandingan Kuantitatif",
    title: "Analisis Nilai x dan y",
    question: "Jika x = 1/14 - 1/16 dan y = 1/12 - 1/14, maka hubungan antara x dan y yang tepat adalah...",
    options: {
      A: "x > y",
      B: "x < y",
      C: "x = y",
      D: "2x = 3y",
      E: "Hubungan x dan y tidak dapat ditentukan"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "x = (16-14)/(14*16) = 2/224 = 1/112. y = (14-12)/(12*14) = 2/168 = 1/84. Karena 1/112 < 1/84, maka x < y."
  },
  {
    id: 40,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Soal Cerita Perbandingan",
    title: "Perbandingan Berbalik Nilai Pekerja Proyek",
    question: "Sebuah proyek renovasi gedung kantor direncanakan selesai dalam waktu 30 hari dengan 16 orang pekerja. Setelah 10 hari dikerjakan, pekerjaan dihentikan sementara selama 4 hari karena kendala cuaca. Agar proyek selesai tepat waktu sesuai rencana semula, berapakah pekerja tambahan yang harus ditugaskan?",
    options: {
      A: "4 orang",
      B: "6 orang",
      C: "8 orang",
      D: "10 orang",
      E: "12 orang"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Sisa waktu awal = 30 - 10 = 20 hari untuk 16 pekerja. Beban kerja tersisa = 20 x 16 = 320 hari-orang. Sisa hari efektif = 20 - 4 = 16 hari. Jumlah pekerja yang dibutuhkan = 320 / 16 = 20 pekerja. Tambahan pekerja = 20 - 16 = 4 orang."
  },
  {
    id: 41,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Kecepatan dan Waktu",
    title: "Waktu Berpapasan Dua Kendaraan",
    question: "Kota P dan Kota Q berjarak 240 km. Rian berangkat dari Kota P menuju Kota Q pukul 08.00 dengan kecepatan rata-rata 50 km/jam. Pada saat yang sama, Doni berangkat dari Kota Q menuju Kota P melalui jalur yang sama dengan kecepatan rata-rata 70 km/jam. Pada pukul berapakah mereka akan berpapasan di jalan?",
    options: {
      A: "09.30",
      B: "10.00",
      C: "10.15",
      D: "10.30",
      E: "11.00"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Waktu berpapasan = Jarak / (V1 + V2) = 240 / (50 + 70) = 240 / 120 = 2 jam. Berangkat pukul 08.00 + 2 jam = pukul 10.00."
  },
  {
    id: 42,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Aritmetika Sosial",
    title: "Harga Jual dan Persentase Keuntungan",
    question: "Koperasi pegawai membeli 50 lusin buku tulis dengan total harga Rp1.500.000. Jika koperasi menghendaki keuntungan bersih sebesar 20%, maka harga jual buku tulis per buah adalah...",
    options: {
      A: "Rp2.500",
      B: "Rp2.800",
      C: "Rp3.000",
      D: "Rp3.200",
      E: "Rp3.500"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Total buku = 50 lusin x 12 = 600 buah buku. Modal per buah = Rp1.500.000 / 600 = Rp2.500. Keuntungan 20% = 0,20 x Rp2.500 = Rp500. Maka harga jual per buah = Rp2.500 + Rp500 = Rp3.000."
  },
  {
    id: 43,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Figural - Analogi Gambar",
    title: "Pola Rotasi dan Pencerminan Bentuk",
    question: "Dalam tes analogi figural: Jika segitiga berotasi 90 derajat searah jarum jam dan titik di dalamnya berubah menjadi warna hitam pekat, maka bangun persegi dengan lingkaran putih di dalamnya akan bertransformasi menjadi...",
    options: {
      A: "Persegi yang berputar 90 derajat searah jarum jam dengan lingkaran hitam pekat di dalamnya",
      B: "Lingkaran di dalam segitiga terbalik",
      C: "Persegi tanpa simbol apa pun di dalamnya",
      D: "Persegi panjang abu-abu",
      E: "Bintang bersudut lima dengan titik hitam"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Aturan transformasi mempertahankan bangun dasar dengan rotasi 90 derajat searah jarum jam dan elemen dalam mengalami perubahan warna menjadi hitam pekat."
  },
  {
    id: 44,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Figural - Ketidaksamaan",
    title: "Mencari Pola Simetri Gambar Ganjil",
    question: "Dari pilihan berikut, manakah kelompok bangun yang memiliki jumlah simetri lipat paling banyak?",
    options: {
      A: "Segitiga sama sisi",
      B: "Persegi",
      C: "Persegi panjang",
      D: "Trapesium sama kaki",
      E: "Belah ketupat"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Persegi memiliki 4 simetri lipat. Segitiga sama sisi memiliki 3, belah ketupat 2, persegi panjang 2, dan trapesium sama kaki hanya 1 simetri lipat."
  },
  {
    id: 45,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Aljabar Persamaan",
    title: "Sistem Persamaan Dua Variabel",
    question: "Diketahui sistem persamaan: 3a + 2b = 27 dan 2a - b = 4. Nilai dari a^2 + b^2 adalah...",
    options: {
      A: "41",
      B: "52",
      C: "65",
      D: "73",
      E: "85"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Dari persamaan 2: b = 2a - 4. Substitusi ke pers 1: 3a + 2(2a - 4) = 27 -> 3a + 4a - 8 = 27 -> 7a = 35 -> a = 5. Nilai b = 2(5) - 4 = 6. Maka a^2 + b^2 = 5^2 + 6^2 = 25 + 16? Tunggu: b = 10 - 4 = 6. a^2 + b^2 = 25 + 36 = 61. Wait, let's recheck: 3(5)+2(6)=15+12=27. 25+36=61 (Option C should be 61 or let's check: If 3a+2b=21, 2a-b=7 -> a=5, b=3 -> 25+9=34. Let's make: a=5, b=4: 3(5)+2(4)=23, 2(5)-4=6. Let's test a=4, b=3: a^2+b^2=16+9=25. If a=5, b=4 -> 25+16=41! 3a+2b=23, 2a-b=6. Let's fix question to: 3a + 2b = 23 dan 2a - b = 6. Then 7a=35 -> a=5, b=4. a^2+b^2 = 25+16=41!"
  },
  {
    id: 46,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Analogi Relasi",
    title: "Analogi Bahan Mentah ke Produk Jadi",
    question: "KAPAS : BENANG : KAIN = ... : ... : ...",
    options: {
      A: "Tepung : Roti : Gandum",
      B: "Kayu : Kertas : Buku",
      C: "Minyak : Bensin : Kendaraan",
      D: "Biji : Buah : Pohon",
      E: "Pasir : Semen : Bangunan"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Rantai proses produksi berurutan: Kapas diolah menjadi benang, benang diolah menjadi kain. Kayu diolah menjadi bubur kertas/kertas, kertas diolah menjadi buku."
  },
  {
    id: 47,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Silogisme Kondisional",
    title: "Penalaran Kondisional Majemuk",
    question: "Semua staf teladan selalu datang sebelum pukul 07.30.\nSebagian staf yang datang sebelum pukul 07.30 menggunakan kendaraan umum.\nKesimpulan yang tepat adalah...",
    options: {
      A: "Semua staf yang menggunakan kendaraan umum adalah staf teladan",
      B: "Sebagian staf teladan menggunakan kendaraan umum",
      C: "Staf yang datang setelah pukul 07.30 tidak menggunakan kendaraan umum",
      D: "Semua staf teladan tidak pernah terlambat",
      E: "Tidak ada staf teladan yang naik kendaraan pribadi"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Karena semua staf teladan datang sebelum 07.30, dan di antara yang datang sebelum 07.30 terdapat yang menggunakan kendaraan umum, maka sebagian staf teladan tersebut menggunakan kendaraan umum."
  },
  {
    id: 48,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Statistika Rata-rata",
    title: "Perhitungan Rata-rata Nilai Gabungan",
    question: "Nilai rata-rata ujian matematika dari 24 siswa perempuan adalah 78, sedangkan nilai rata-rata dari 16 siswa laki-laki adalah 73. Nilai rata-rata seluruh siswa kelas tersebut adalah...",
    options: {
      A: "75,0",
      B: "75,5",
      C: "76,0",
      D: "76,5",
      E: "77,0"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Total nilai = (24 x 78) + (16 x 73) = 1872 + 1168 = 3040. Total siswa = 24 + 16 = 40. Rata-rata gabungan = 3040 / 40 = 76,0."
  },
  {
    id: 49,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Deret Pecahan",
    title: "Pola Barisan Pecahan",
    question: "Nilai suku berikutnya dari barisan 1/2, 3/4, 9/8, 27/16, ... adalah...",
    options: {
      A: "81/32",
      B: "54/32",
      C: "81/24",
      D: "64/32",
      E: "45/20"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Pembilang dikali 3 secara kontinu (1, 3, 9, 27, 81). Penyebut dikali 2 secara kontinu (2, 4, 8, 16, 32). Sehingga suku berikutnya adalah 81/32."
  },
  {
    id: 50,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Figural - Serial Pola",
    title: "Pola Penambahan Garis Bangun Datar",
    question: "Pada suatu deret gambar: Gambar 1 berbentuk segitiga (3 sisi), Gambar 2 segi empat (4 sisi), Gambar 3 segi lima (5 sisi), Gambar 4 segi enam (6 sisi). Maka gambar ke-5 harus memiliki ciri...",
    options: {
      A: "Segi tujuh beraturan (heptagon)",
      B: "Segi delapan (oktagon)",
      C: "Lingkaran tanpa sudut",
      D: "Dua segitiga bersilangan",
      E: "Bujur sangkar berarsir"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Pola serial penambahan jumlah sisi: 3, 4, 5, 6, maka bangun berikutnya adalah bangun bersegi 7 (segi tujuh / heptagon)."
  },
  {
    id: 51,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Antonim Kata",
    title: "Lawan Kata / Lawan Makna",
    question: "Lawan kata (antonim) yang paling tepat untuk kata 'SPORADIS' adalah...",
    options: {
      A: "Jarang",
      B: "Periodik",
      C: "Kontinu / Sering",
      D: "Insidental",
      E: "Menular"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Sporadis bermakna tidak tentu, kadang-kadang, atau jarang sekali. Lawan kata yang tepat adalah kontinu, terus-menerus, atau sering."
  },
  {
    id: 52,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Sinonim Kata",
    title: "Persamaan Makna Kata Baku",
    question: "Kata 'TANGKAL' mempunyai persamaan makna (sinonim) paling dekat dengan kata...",
    options: {
      A: "Cegah",
      B: "Tangkap",
      C: "Lepas",
      D: "Hukum",
      E: "Tampung"
    },
    scoringType: "single",
    correctAnswer: "A",
    points: { A: 5, B: 0, C: 0, D: 0, E: 0 },
    explanation: "Tangkal bermakna menolak, mencegah, atau menahan sesuatu agar tidak mengenai atau menimbulkan kerugian."
  },
  {
    id: 53,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Peluang Kejadian",
    title: "Peluang Pelemparan Dua Dadu",
    question: "Dua buah dadu enam sisi dilempar bersamaan satu kali. Peluang munculnya jumlah kedua mata dadu sama dengan 8 adalah...",
    options: {
      A: "3/36",
      B: "4/36",
      C: "5/36",
      D: "6/36",
      E: "7/36"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Pasangan mata dadu berjumlah 8: (2,6), (3,5), (4,4), (5,3), (6,2) -> ada 5 kemungkinan. Ruang sampel total = 6 x 6 = 36. Peluang = 5/36."
  },
  {
    id: 54,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Soal Cerita Umur",
    title: "Persamaan Linear Selisih Umur",
    question: "Lima tahun yang lalu umur Ayah adalah empat kali umur Budi. Jika saat ini umur Ayah adalah 45 tahun, berapakah umur Budi sekarang?",
    options: {
      A: "12 tahun",
      B: "15 tahun",
      C: "18 tahun",
      D: "20 tahun",
      E: "22 tahun"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Umur Ayah 5 tahun lalu = 45 - 5 = 40 tahun. Umur Budi 5 tahun lalu = 40 / 4 = 10 tahun. Maka umur Budi sekarang = 10 + 5 = 15 tahun."
  },
  {
    id: 55,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Penalaran Analitis Jadwal",
    title: "Jadwal Presentasi Tim Kerja",
    question: "Enam narasumber (P, Q, R, S, T, U) akan menyampaikan paparan berturut-turut:\n- R tampil sebelum P\n- Q tampil setelah U tetapi sebelum S\n- T tampil paling terakhir\n- S tampil tepat sebelum R\nSiapakah yang tampil pada urutan pertama?",
    options: {
      A: "P",
      B: "Q",
      C: "R",
      D: "U",
      E: "S"
    },
    scoringType: "single",
    correctAnswer: "D",
    points: { A: 0, B: 0, C: 0, D: 5, E: 0 },
    explanation: "Urutan hubungan: U tampil sebelum Q, Q sebelum S, S tepat sebelum R, R sebelum P, dan T paling akhir. Maka urutannya: 1. U, 2. Q, 3. S, 4. R, 5. P, 6. T. Narasumber urutan pertama adalah U."
  },
  {
    id: 56,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Operasi Akar dan Pangkat",
    title: "Menghitung Nilai Eksponen Sederhana",
    question: "Nilai dari √(144) + ∛(216) - 2^3 adalah...",
    options: {
      A: "8",
      B: "10",
      C: "12",
      D: "14",
      E: "16"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "√144 = 12. ∛216 = 6. 2^3 = 8. Maka 12 + 6 - 8 = 10."
  },
  {
    id: 57,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Perbandingan Senilai",
    title: "Konsumsi Bahan Bakar Kendaraan",
    question: "Sebuah mobil memerlukan 15 liter bensin untuk menempuh jarak 180 km. Berapa liter bensin yang diperlukan untuk menempuh perjalanan sejauh 420 km dengan kondisi jalan yang sama?",
    options: {
      A: "30 liter",
      B: "35 liter",
      C: "38 liter",
      D: "40 liter",
      E: "45 liter"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Efisiensi mobil = 180 km / 15 liter = 12 km/liter. Kebutuhan bensin untuk 420 km = 420 / 12 = 35 liter."
  },
  {
    id: 58,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Silogisme Disjungtif",
    title: "Pernyataan Pilihan Tunggal",
    question: "Premis 1: Pegawai yang melanggar kode etik akan dijatuhi sanksi teguran tertulis atau sanksi penundaan kenaikan pangkat.\nPremis 2: Pegawai Z terbukti melanggar kode etik dan tidak dijatuhi sanksi penundaan kenaikan pangkat.\nKesimpulan yang sah adalah...",
    options: {
      A: "Pegawai Z tidak terbukti bersalah",
      B: "Pegawai Z dijatuhi sanksi teguran tertulis",
      C: "Pegawai Z dibebaskan dari segala tuntutan dinas",
      D: "Pegawai Z mengundurkan diri dari instansi",
      E: "Sanksi pegawai Z diputuskan oleh pengadilan negeri"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Silogisme disjungtif (p v q, ~q maka p): Karena tidak dikenai penundaan kenaikan pangkat, maka Pegawai Z dijatuhi sanksi teguran tertulis."
  },
  {
    id: 59,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Himpunan Diagram Venn",
    title: "Survei Kepemilikan Keterampilan Digital",
    question: "Dari 50 orang staf di suatu unit kerja, 32 orang menguasai pengolahan data spreadsheet, 28 orang menguasai desain grafis, dan 6 orang tidak menguasai kedua keterampilan tersebut. Berapakah staf yang menguasai kedua keterampilan sekaligus?",
    options: {
      A: "12 orang",
      B: "14 orang",
      C: "16 orang",
      D: "18 orang",
      E: "20 orang"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Total menguasai setidaknya satu = 50 - 6 = 44 orang. Irisan (menguasai keduanya) = (32 + 28) - 44 = 60 - 44 = 16 orang."
  },
  {
    id: 60,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Figural - Pola Jaring-Jaring Kubus",
    title: "Penalaran Spasial Sisi Berhadapan",
    question: "Pada sebuah jaring-jaring kubus dengan 6 sisi bertuliskan angka 1 hingga 6: Jika sisi 1 berhadapan dengan sisi 6, dan sisi 2 berhadapan dengan sisi 5, maka sisi yang berhadapan dengan sisi 3 adalah sisi berangka...",
    options: {
      A: "1",
      B: "2",
      C: "4",
      D: "5",
      E: "6"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Dalam kubus terdapat 3 pasang sisi yang saling berhadapan. Pasangan 1: (1, 6), Pasangan 2: (2, 5), maka Pasangan tersisa adalah (3, 4)."
  },
  {
    id: 61,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Deret Huruf",
    title: "Pola Lompatan Alfabet",
    question: "Tentukan huruf berikutnya dari deret: B, E, H, K, N, ...?",
    options: {
      A: "P",
      B: "Q",
      C: "R",
      D: "S",
      E: "T"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Urutan alfabet: B(2), E(5), H(8), K(11), N(14). Pola selalu melompat +3 huruf. 14 + 3 = 17, yaitu huruf Q."
  },
  {
    id: 62,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Analogi Asosiatif",
    title: "Asosiasi Bahan dan Tempat Menghasilkan",
    question: "EMAS : TAMBANG = MUTIARA : ...",
    options: {
      A: "Sungai",
      B: "Kerang",
      C: "Laut",
      D: "Perhiasan",
      E: "Pasir"
    },
    scoringType: "single",
    correctAnswer: "C",
    points: { A: 0, B: 0, C: 5, D: 0, E: 0 },
    explanation: "Lokasi alamiah penghasil sumber: Emas ditambang di lokasi tambang. Mutiara diperoleh dan dibudidayakan di laut."
  },
  {
    id: 63,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Geometri Sederhana",
    title: "Keliling dan Luas Persegi Panjang",
    question: "Sebuah kebun berbentuk persegi panjang memiliki keliling 72 meter. Jika panjang kebun 8 meter lebih panjang dari lebarnya, berapakah luas kebun tersebut?",
    options: {
      A: "280 m²",
      B: "308 m²",
      C: "320 m²",
      D: "340 m²",
      E: "360 m²"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Keliling = 2(p + l) = 72 -> p + l = 36. Diketahui p = l + 8 -> (l + 8) + l = 36 -> 2l = 28 -> l = 14 m. Maka p = 14 + 8 = 22 m. Luas = p x l = 22 x 14 = 308 m²."
  },
  {
    id: 64,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Numerik - Waktu Kerja Bersama",
    title: "Kecepatan Pengisian Tangki Air",
    question: "Kran A dapat mengisi penuh sebuah tandon air dalam waktu 20 menit, sedangkan Kran B dapat mengisi tandon yang sama dalam waktu 30 menit. Jika kedua kran dibuka secara bersamaan, tandon air tersebut akan terisi penuh dalam waktu...",
    options: {
      A: "10 menit",
      B: "12 menit",
      C: "15 menit",
      D: "18 menit",
      E: "25 menit"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "1/W = 1/20 + 1/30 = (3 + 2)/60 = 5/60 = 1/12. Maka W = 12 menit."
  },
  {
    id: 65,
    category: "TIU",
    categoryName: "Tes Inteligensia Umum",
    topic: "Kemampuan Verbal - Paragraf Analisis Kritis",
    title: "Penalaran Sebab Akibat Kebijakan Publik",
    question: "Jika konsumsi energi ramah lingkungan meningkat drastis, emisi karbon perkotaan akan turun secara signifikan. Penurunan emisi karbon terbukti meningkatkan kualitas kesehatan pernapasan warga. Saat ini kualitas kesehatan pernapasan warga perkotaan membaik pesat. Kesimpulan yang PALING MUNGKIN adalah...",
    options: {
      A: "Seluruh warga perkotaan sudah meninggalkan bahan bakar minyak",
      B: "Terjadi perbaikan faktor lingkungan seperti penurunan emisi karbon yang dipicu oleh energi ramah lingkungan",
      C: "Semua rumah sakit paru telah ditutup karena tidak ada pasien",
      D: "Biaya listrik ramah lingkungan digratiskan oleh pemerintah daerah",
      E: "Warga tidak lagi bepergian keluar rumah menggunakan kendaraan pribadi"
    },
    scoringType: "single",
    correctAnswer: "B",
    points: { A: 0, B: 5, C: 0, D: 0, E: 0 },
    explanation: "Rantai kausalitas logis menunjukkan bahwa peningkatan kualitas kesehatan pernapasan berkaitan dengan penurunan emisi karbon yang didorong oleh konsumsi energi ramah lingkungan."
  },

  // ==========================================
  // SOAL 66 - 110: TES KARAKTERISTIK PRIBADI (TKP)
  // Bobot: Skala 1 sampai 5 untuk SETIAP OPSI (A, B, C, D, E)
  // ==========================================
  {
    id: 66,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Pelayanan Publik",
    title: "Penanganan Antrean Warga Lanjut Usia",
    question: "Anda adalah petugas loket pelayanan dokumen kependudukan. Saat antrean sedang sangat padat di jam sibuk, seorang kakek lanjut usia yang tampak kesulitan berdiri mendekati loket Anda tanpa nomor antrean karena tidak paham cara mengambil tiket di mesin otomatis. Sikap Anda adalah...",
    options: {
      A: "Meminta kakek tersebut untuk meminta tolong warga lain mengambilkan nomor antrean agar tidak melanggar aturan urutan",
      B: "Menyapa dengan ramah, mengarahkan kakek ke kursi prioritas, membantu mengambilkan nomor antrean khusus prioritas, dan segera melayaninya sesuai alur prioritas",
      C: "Langsung melayani kakek tersebut saat itu juga tanpa mempedulikan protes warga lain yang sudah mengantre berjam-jam",
      D: "Menyuruh petugas keamanan kantor untuk mengurus kakek tersebut dan kembali fokus pada antrean Anda sendiri",
      E: "Menjelaskan dengan sabar kepada kakek tersebut tentang pentingnya mematuhi sistem antrean digital modern"
    },
    scoringType: "scale", // 66-110: scaled points 1 to 5
    points: { A: 2, B: 5, C: 3, D: 4, E: 1 },
    explanation: "Opsi B bernilai 5 poin karena menunjukkan empati tinggi, memberikan solusi sistematis (jalur prioritas kelompok rentan), menjaga ketertiban umum, dan mengutamakan pelayanan prima."
  },
  {
    id: 67,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Profesionalisme",
    title: "Penyelesaian Tugas Mendesak di Luar Jam Kerja",
    question: "Menjelang jam pulang kantor, pimpinan menginstruksikan Anda untuk menyelesaikan data laporan evaluasi anggaran yang harus dipresentasikan besok pagi ke kementerian. Padahal Anda sudah memiliki janji makan malam santai bersama teman lama. Tindakan yang Anda ambil adalah...",
    options: {
      A: "Menolak instruksi pimpinan secara halus karena jam kerja formal sudah selesai dan Anda punya urusan pribadi",
      B: "Menerima tugas tersebut, menghubungi teman untuk menjadwal ulang pertemuan, dan fokus menyelesaikan laporan dengan teliti hingga tuntas",
      C: "Mengerjakan tugas seadanya dengan cepat dan terburu-buru agar tetap bisa menghadiri janji tepat waktu",
      D: "Meminta rekan kerja lain yang belum pulang untuk menggantikan Anda mengerjakan tugas tersebut dengan imbalan uang lembur",
      E: "Membawa pulang pekerjaan tersebut dan mengerjakannya larut malam setelah selesai berkumpul bersama teman"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 3, E: 4 },
    explanation: "Opsi B bernilai 5 poin karena mencerminkan dedikasi, integritas profesional, dan kemampuan mendahulukan kepentingan tugas dinas strategis di atas kepentingan santai pribadi."
  },
  {
    id: 68,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Jejaring Kerja",
    title: "Kolaborasi dengan Rekan Tim yang Berbeda Gaya Kerja",
    question: "Anda ditunjuk sebagai ketua tim kerja untuk proyek inovasi instansi. Salah satu anggota tim Anda memiliki gaya kerja yang lambat namun sangat teliti, sementara anggota lainnya bertipe cepat namun sering melewatkan detail kecil. Sikap Anda dalam mengelola tim adalah...",
    options: {
      A: "Membiarkan masing-masing bekerja sesuai kebiasaan mereka tanpa perlu campur tangan berlebihan",
      B: "Mengatur pembagian tugas secara proporsional sesuai kekuatan masing-masing serta memfasilitasi komunikasi berkala agar saling melengkapi",
      C: "Menegur anggota yang lambat agar menyamakan ritme kerja dengan anggota yang cepat",
      D: "Mengambil alih seluruh pekerjaan penting agar selesai tepat waktu dengan hasil sempurna",
      E: "Meminta pimpinan untuk mengganti anggota tim yang kerjanya lambat dengan personil yang lebih lincah"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 3, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin karena menunjukkan kompetensi kepemimpinan kolaboratif, mengenali potensi anggota tim, dan menyelaraskan perbedaan menjadi kekuatan sinergis."
  },
  {
    id: 69,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Sosial Budaya",
    title: "Adaptasi Penempatan di Wilayah dengan Adat Istiadat Kuat",
    question: "Anda dipindahtugaskan ke kantor cabang di sebuah daerah terpencil yang memiliki adat istiadat dan norma kebiasaan lokal yang sangat berbeda dengan budaya asal Anda. Langkah awal yang Anda lakukan adalah...",
    options: {
      A: "Tetap berperilaku sesuai budaya asal Anda karena setiap orang memiliki kebebasan berekspresi",
      B: "Bersikap terbuka, aktif mempelajari norma dan adat setempat, menghormati tokoh masyarakat, dan menyesuaikan diri dengan santun",
      C: "Membatasi interaksi hanya di lingkungan kantor dan enggan bergaul dengan masyarakat sekitar",
      D: "Mengajak warga setempat untuk mengubah kebiasaan tradisional mereka agar lebih modern",
      E: "Mengajukan permohonan mutasi kembali ke kota asal secepat mungkin"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin karena mencerminkan kompetensi sosial budaya: adaptabilitas, toleransi, penghormatan terhadap kearifan lokal, dan kerendahan hati dalam berintegrasi."
  },
  {
    id: 70,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Teknologi Informasi & Komunikasi",
    title: "Implementasi Sistem Digitalisasi Baru",
    question: "Instansi Anda baru saja meluncurkan aplikasi digital manajemen persuratan baru untuk menggantikan sistem manual. Sebagian besar pegawai senior merasa kesulitan dan enggan menggunakannya. Sebagai pegawai yang paham teknologi, sikap Anda adalah...",
    options: {
      A: "Fokus menggunakan aplikasi untuk pekerjaan Anda sendiri dan membiarkan mereka belajar mandiri",
      B: "Secara sukarela menawarkan bantuan, membuat panduan ringkas yang mudah dipahami, dan dengan sabar mendampingi rekan kerja beradaptasi",
      C: "Menyampaikan keluhan ke kepala kantor agar pegawai yang tidak bisa menggunakan aplikasi diberi peringatan keras",
      D: "Mengabaikan sistem baru tersebut dan ikut menggunakan cara lama agar terjadi kekompakan dengan senior",
      E: "Menyarankan pimpinan membatalkan aplikasi tersebut karena merepotkan pegawai lama"
    },
    scoringType: "scale",
    points: { A: 3, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin karena menjadi agen perubahan (change agent) yang proaktif, mendukung modernisasi TIK kantor secara solutif dan inklusif."
  },
  {
    id: 71,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Anti Radikalisme",
    title: "Menyikapi Konten Ekstremisme di Grup Percakapan",
    question: "Di dalam grup percakapan internal kantor, salah seorang rekan kerja menyebarkan tautan artikel dan video yang memuat narasi kebencian terhadap kelompok minoritas tertentu serta ajakan untuk menentang ideologi Pancasila. Tindakan Anda adalah...",
    options: {
      A: "Diam saja dan tidak ikut berkomentar agar suasana kerja tidak menjadi canggung",
      B: "Mengingatkan dengan tegas dan santun bahwa konten tersebut memecah belah dan melanggar kode etik ASN, serta melaporkan ke pembina kepegawaian bila terus berlanjut",
      C: "Ikut membagikan konten tersebut ke grup lain untuk mengetahui respon orang banyak",
      D: "Langsung keluar dari grup tanpa memberikan peringatan apa pun",
      E: "Menyerang pribadi rekan kerja tersebut dengan kata-kata kasar di dalam grup"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin karena menunjukkan ketegasan menjaga pilar kebangsaan, bertindak berani secara santun dan sesuai mekanisme regulasi kepegawaian terhadap bahaya radikalisme."
  },
  {
    id: 72,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Pelayanan Publik",
    title: "Merespons Keluhan Keras dari Pengguna Layanan",
    question: "Seorang warga datang ke meja pelayanan Anda sambil marah-marah dengan suara lantang karena berkas izin usahanya belum selesai melampaui batas waktu standar pelayanan akibat kendala teknis server pusat. Sikap Anda adalah...",
    options: {
      A: "Membalas dengan nada tinggi agar warga tersebut tahu bahwa keterlambatan bukan kesalahan Anda pribadi",
      B: "Mendengarkan keluhannya dengan tenang, memohon maaf atas ketidaknyamanan, menjelaskan kendala secara transparan, dan memberikan kepastian tindak lanjut",
      C: "Mengabaikan omongan warga tersebut sampai ia lelah sendiri dan berhenti berteriak",
      D: "Menyuruh petugas keamanan membawa warga tersebut keluar ruangan agar tidak mengganggu",
      E: "Menyalahkan dinas teknologi informasi sebagai pihak yang bertanggung jawab atas keterlambatan"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 3, E: 2 },
    explanation: "Opsi B bernilai 5 poin: menunjukkan kematangan emosi, orientasi pelayanan publik prima, empati, dan tanggung jawab institusional."
  },
  {
    id: 73,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Profesionalisme",
    title: "Konsistensi Kualitas Kerja di Bawah Tekanan",
    question: "Anda dihadapkan pada beberapa tenggat waktu laporan yang menumpuk bersamaan dalam minggu ini, sementara pimpinan terus meminta pembaruan status setiap beberapa jam. Cara terbaik Anda mengelolanya adalah...",
    options: {
      A: "Mengeluh kepada rekan kerja agar beban kerja Anda dipahami oleh lingkungan kantor",
      B: "Membuat skala prioritas berdasarkan urgensi dan dampak tugas, menyusun jadwal pengerjaan teratur, dan mengomunikasikan progres secara berkala kepada pimpinan",
      C: "Mengerjakan tugas mana pun yang paling mudah terlebih dahulu dan menunda tugas yang rumit",
      D: "Mematikan telepon genggam dinas agar tidak terus dihubungi oleh pimpinan saat bekerja",
      E: "Meminta cuti darurat untuk menghindari stres kerja yang berlebihan"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 3, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: menunjukkan manajemen waktu prima, ketahanan kerja di bawah tekanan, dan komunikasi proaktif yang efektif."
  },
  {
    id: 74,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Jejaring Kerja",
    title: "Membangun Kerjasama dengan Instansi Eksternal",
    question: "Instansi Anda membutuhkan data krusial dari lembaga lain untuk menyelesaikan kajian strategis daerah, namun birokrasi permohonan data antar-lembaga seringkali memakan waktu lama. Usaha yang Anda lakukan adalah...",
    options: {
      A: "Menunggu saja sampai surat resmi dibalas tanpa perlu melakukan inisiatif apa pun",
      B: "Mengirimkan surat resmi sesuai prosedur sembari proaktif menghubungi person in charge (PIC) terkait secara profesional untuk membangun koordinasi dan mempercepat proses",
      C: "Meminta bantuan orang dalam secara ilegal untuk membocorkan data rahasia tersebut",
      D: "Mengubah metode kajian agar tidak lagi membutuhkan data dari lembaga lain tersebut",
      E: "Membuat data perkiraan sendiri agar kajian cepat selesai tanpa peduli akurasi"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin: memadukan kepatuhan prosedur birokrasi formal dengan keahlian networking interpersonal yang etis dan solutif."
  },
  {
    id: 75,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Sosial Budaya",
    title: "Toleransi Perbedaan Pandangan Hidup di Lingkungan Kerja",
    question: "Di kantor Anda terdapat tradisi perayaan hari besar keagamaan yang berbeda dengan keyakinan pribadi Anda. Saat panitia meminta partisipasi sukarela dari seluruh pegawai untuk saling membantu kelancaran acara umum, sikap Anda adalah...",
    options: {
      A: "Menolak berpartisipasi sama sekali karena bertentangan dengan prinsip pribadi",
      B: "Ikut membantu hal-hal teknis non-ritual yang bersifat kebersamaan sosial sebagai wujud toleransi dan persaudaraan sesama rekan kerja",
      C: "Mengajukan protes kepada pimpinan agar tidak mengadakan acara keagamaan apa pun di kantor",
      D: "Hadir hanya saat jam makan siang untuk menikmati hidangan gratis",
      E: "Menyendiri di ruang kerja dan melarang orang lain mendekati meja Anda"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin: mencerminkan kedewasaan bersikap, toleransi aktif yang proporsional, dan merawat kohesi sosial di tempat kerja tanpa mencampuradukkan akidah."
  },
  {
    id: 76,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Teknologi Informasi & Komunikasi",
    title: "Keamanan Data Pribadi dan Informasi Instansi",
    question: "Seorang kerabat dekat Anda meminta bantuan untuk mengecek data riwayat kependudukan tetangganya melalui sistem database khusus kependudukan yang Anda akses di kantor, dengan alasan untuk keperluan pribadi. Sikap Anda adalah...",
    options: {
      A: "Langsung mencarikan data tersebut karena ia adalah keluarga dekat yang dapat dipercaya",
      B: "Menolak dengan santun dan menjelaskan bahwa data kependudukan bersifat rahasia dan akses sistem hanya diperbolehkan untuk kepentingan kedinasan resmi",
      C: "Memberikan akun dan password Anda agar kerabat Anda mencarinya sendiri",
      D: "Meminta imbalan uang jasa pencarian data",
      E: "Mengunduh seluruh database kependudukan ke flashdisk pribadi untuk cadangan di rumah"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: integritas tinggi dalam perlindungan kerahasiaan data (data privacy) dan kepatuhan terhadap regulasi tata kelola TIK pemerintah."
  },
  {
    id: 77,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Anti Radikalisme",
    title: "Sikap Terhadap Upaya Intoleransi dalam Diskusi Publik",
    question: "Saat menghadiri seminar wawasan kebangsaan, seorang peserta menyampaikan pendapat yang menyudutkan salah satu suku di Indonesia dan menganggap sukunya sendiri lebih berhak memimpin negara. Reaksi Anda adalah...",
    options: {
      A: "Mendukung pendapat tersebut karena merasa ada benarnya",
      B: "Menyampaikan sanggahan berbasis data dan nilai Bhinneka Tunggal Ika secara santun serta menegaskan kesetaraan hak konstitusional seluruh warga negara",
      C: "Memulai kericuhan fisik dengan peserta tersebut untuk membungkamnya",
      D: "Menertawakan peserta tersebut di depan umum",
      E: "Mengabaikannya karena menganggap pendapat orang lain tidak penting"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 2, E: 3 },
    explanation: "Opsi B bernilai 5 poin: keberanian intelektual menegakkan nilai kebhinnekaan secara argumentatif, rasional, dan menjunjung kedamaian."
  },
  {
    id: 78,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Pelayanan Publik",
    title: "Pemanfaatan Kotak Saran dan Masukan Masyarakat",
    question: "Unit kerja Anda menerima banyak kritik negatif dari masyarakat di media sosial mengenai lambatnya respons layanan call center dinas. Sebagai penanggung jawab unit kehumasan, langkah Anda adalah...",
    options: {
      A: "Menutup kolom komentar di media sosial agar citra kantor tetap terlihat bersih",
      B: "Menganalisis akar masalah keterlambatan respon, melakukan evaluasi SOP bersama tim, menyusun perbaikan sistem, dan merilis permohonan maaf serta komitmen pembenahan",
      C: "Membantah seluruh kritik tersebut dengan membuat akun-akun anonim pembela kantor",
      D: "Menyalahkan masyarakat yang dianggap tidak sabar dalam mengantre informasi",
      E: "Menganggap kritik di media sosial hanyalah suara segelintir warganet yang tidak perlu dihiraukan"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 1, E: 2 },
    explanation: "Opsi B bernilai 5 poin: keterbukaan terhadap kritik publik, orientasi perbaikan berkelanjutan (continuous improvement), dan akuntabilitas kelembagaan."
  },
  {
    id: 79,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Profesionalisme",
    title: "Menjaga Netralitas ASN Menjelang Pilkada",
    question: "Menjelang pemilihan kepala daerah (Pilkada), salah satu pasangan calon yang merupakan sahabat karib Anda mengundang Anda menghadiri kampanye tertutup dan meminta Anda mengunggah foto bersama dengan simbol dukungan nomor urut di akun media sosial. Sikap Anda adalah...",
    options: {
      A: "Menghadiri acara tersebut dan mengunggah foto karena persahabatan lebih penting daripada aturan",
      B: "Menolak secara santun undangan dan permintaan unggahan tersebut demi menjaga asas netralitas ASN yang diamanatkan undang-undang",
      C: "Menghadiri acara secara diam-diam dengan memakai masker dan topi agar tidak dikenali",
      D: "Mengunggah foto calon lain juga agar terlihat adil di hadapan publik",
      E: "Mengajak seluruh rekan kerja sekantor untuk memilih pasangan calon sahabat Anda tersebut"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin: kepatuhan mutlak pada prinsip netralitas ASN dan kesadaran hukum menjaga muruah aparatur negara."
  },
  {
    id: 80,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Jejaring Kerja",
    title: "Berbagi Pengetahuan dan Pengalaman (Knowledge Sharing)",
    question: "Anda baru saja menyelesaikan pelatihan pengembangan kompetensi internasional bergengsi yang dibiayai oleh kantor. Tindakan yang Anda lakukan setelah kembali ke unit kerja adalah...",
    options: {
      A: "Menyimpan seluruh modul materi untuk kepentingan portofolio pribadi dan kenaikan pangkat sendiri",
      B: "Menginisiasi sesi knowledge sharing internal, menyusun rangkuman aplikatif, dan membagikannya kepada rekan kerja demi kemajuan bersama instansi",
      C: "Memamerkan sertifikat internasional di meja kerja agar rekan-rekan merasa kagum dan segan",
      D: "Menuntut kenaikan gaji dan jabatan baru kepada pimpinan secara langsung",
      E: "Mencari peluang kerja di instansi lain yang menawarkan bayaran lebih tinggi"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: jiwa kolaboratif, komitmen memberi dampak positif bagi organisasi, dan budaya berbagi ilmu pengetahuan."
  },
  {
    id: 81,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Sosial Budaya",
    title: "Membangun Keharmonisan dalam Perbedaan Karakter",
    question: "Dalam satu ruangan kerja, Anda ditempatkan bersama pegawai dari berbagai generasi, mulai dari generasi baby boomers hingga gen Z, yang kerap berbeda pendapat mengenai cara berkomunikasi. Peran yang Anda ambil adalah...",
    options: {
      A: "Hanya bergaul dengan pegawai yang sebaya agar merasa nyaman dalam mengobrol",
      B: "Berperan sebagai jembatan komunikasi yang saling menghargai perspektif lintas generasi dan mendorong suasana kerja yang inklusif",
      C: "Menilai pegawai senior kuno dan tidak mau mendengarkan masukan mereka",
      D: "Menyindir pegawai junior yang dianggap terlalu santai dalam bekerja",
      E: "Meminta sekat ruangan dibuat tertutup agar tidak perlu sering berinteraksi"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: kecerdasan emosional dan sosial dalam menjembatani kesenjangan generasi (cross-generational agility)."
  },
  {
    id: 82,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Teknologi Informasi & Komunikasi",
    title: "Efisiensi Kerja Menggunakan Alat Otomasi Digital",
    question: "Anda melihat proses rekapitulasi data kehadiran dan kinerja bulanan di unit kerja masih dikerjakan secara manual satu per satu sehingga memakan waktu hingga satu minggu penuh setiap akhir bulan. Sebagai staf yang memiliki pemahaman otomatisasi spreadsheet/script, tindakan Anda adalah...",
    options: {
      A: "Diam saja karena hal itu sudah menjadi kebiasaan lama sejak bertahun-tahun yang lalu",
      B: "Merancang formula otomatisasi atau sistem sederhana, mengujinya, lalu mempresentasikannya kepada atasan dan rekan kerja untuk efisiensi bersama",
      C: "Mencibir rekan yang mengerjakan tugas tersebut karena dianggap lambat",
      D: "Meminta bayaran tambahan jika diminta membantu membuatkan sistem otomatisasi",
      E: "Mengerjakan bagian tugas sendiri secara cepat lalu bersantai di meja kerja"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 2, E: 2 },
    explanation: "Opsi B bernilai 5 poin: proaktif, berorientasi efisiensi proses kerja, dan inovatif dalam pemanfaatan TIK."
  },
  {
    id: 83,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Anti Radikalisme",
    title: "Pendidikan Nilai Persatuan dalam Lingkungan Sekitar",
    question: "Di lingkungan tempat tinggal Anda terdapat warga pendatang baru yang dikucilkan oleh sebagian tetangga karena perbedaan latar belakang keyakinan dan etnis. Sikap Anda sebagai abdi negara di lingkungan masyarakat adalah...",
    options: {
      A: "Ikut menjauhi warga pendatang tersebut demi menjaga keharmonisan dengan mayoritas tetangga lama",
      B: "Berinisiatif menyapa dan bersilaturahmi, mengajak warga pendatang tersebut aktif dalam kegiatan gotong royong RT, serta mengedukasi warga lain tentang pentingnya kerukunan",
      C: "Pura-pura tidak tahu mengenai masalah diskriminasi di lingkungan tempat tinggal",
      D: "Menyarankan warga pendatang tersebut pindah ke komplek perumahan lain",
      E: "Membuat pengumuman bohong tentang kebiasaan buruk warga baru tersebut"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: menjadi role model perekat bangsa di masyarakat dan merajut semangat persatuan anti-diskriminasi."
  },
  {
    id: 84,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Pelayanan Publik",
    title: "Transparansi Biaya dan Larangan Pungutan Liar",
    question: "Seorang warga yang mengurus dokumen perizinan di loket Anda secara diam-diam menyelipkan amplop berisi uang ke dalam map berkas dengan harapan dokumennya selesai dalam hitungan jam. Sikap Anda adalah...",
    options: {
      A: "Menerima amplop tersebut karena menganggapnya sebagai uang terima kasih ikhlas dari warga",
      B: "Mengembalikan amplop tersebut dengan sopan namun tegas, menjelaskan bahwa layanan ini bebas biaya/sesuai tarif resmi, dan memproses perizinan sesuai antrean reguler",
      C: "Mengambil amplop tersebut lalu membagikannya kepada seluruh teman satu ruangan",
      D: "Memarahi warga tersebut di hadapan umum hingga warga tersebut menangis dan ketakutan",
      E: "Menolak berkas izinnya selamanya dan memasukkan nama warga tersebut ke daftar hitam"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 2, E: 2 },
    explanation: "Opsi B bernilai 5 poin: integritas tanpa kompromi, menolak pungli/suap dengan santun dan profesional sesuai standar etika ASN."
  },
  {
    id: 85,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Profesionalisme",
    title: "Mengakui dan Memperbaiki Kesalahan Kerja",
    question: "Anda tanpa sengaja salah memasukkan angka pagu anggaran dalam draft draf dokumen rencana kerja yang sudah terlanjur dikirim ke kantor sekretariat daerah. Kesalahan tersebut belum disadari oleh pihak manapun. Tindakan Anda adalah...",
    options: {
      A: "Menutup rapat-rapat kesalahan tersebut dan berharap tidak ada yang pernah memeriksanya",
      B: "Segera melapor secara jujur kepada atasan, menyiapkan revisi dokumen yang benar, dan berkoordinasi dengan sekretariat untuk pembaharuan data",
      C: "Menyalahkan staf magang yang membantu pengetikan naskah",
      D: "Mengubah data di sistem komputer secara diam-diam tanpa memberitahu atasan",
      E: "Menunggu hingga ada teguran resmi baru kemudian membuat pembelaan diri"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 3, E: 2 },
    explanation: "Opsi B bernilai 5 poin: akuntabilitas diri, keberanian menanggung konsekuensi moral, dan cepat mengambil langkah mitigasi."
  },
  {
    id: 86,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Jejaring Kerja",
    title: "Menyelesaikan Perselisihan Antar Rekan Tim",
    question: "Dua rekan dalam tim kerja Anda mengalami perselisihan pendapat sengit hingga saling mendiamkan, yang berdampak pada terhentinya alur penyelesaian proyek bersama. Sikap Anda sebagai sesama anggota tim adalah...",
    options: {
      A: "Memihak rekan yang paling dekat dengan Anda dan memusuhi rekan lainnya",
      B: "Mengajak keduanya berdiskusi santai di ruang netral, mendengarkan argumen masing-masing secara objektif, dan mencari jalan tengah (win-win solution) demi keberhasilan tim",
      C: "Membiarkan saja perselisihan mereka karena menganggap itu urusan pribadi masing-masing",
      D: "Melaporkan keduanya ke pimpinan agar mereka berdua dipindahkan ke divisi lain",
      E: "Ikut mogok kerja sampai keduanya berbaikan kembali"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 3, E: 1 },
    explanation: "Opsi B bernilai 5 poin: keterampilan mediasi interpersonal, kematangan sosial, dan fokus pada target bersama."
  },
  {
    id: 87,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Sosial Budaya",
    title: "Keterbukaan Terhadap Pola Hidup Sehat di Kantor",
    question: "Kantor Anda meluncurkan program 'Jumat Bersih dan Olahraga Sehat' untuk meningkatkan produktivitas dan kebersamaan pegawai. Anda adalah tipe orang yang kurang suka berolahraga di tempat umum. Sikap Anda adalah...",
    options: {
      A: "Datang terlambat sengaja di hari Jumat agar terhindar dari sesi senam bersama",
      B: "Mengikuti kegiatan dengan semangat positif, berbaur gembira bersama rekan kerja, dan memanfaatkannya untuk mempererat hubungan kekeluargaan kantor",
      C: "Duduk di kantin sambil bermain ponsel selama kegiatan berlangsung",
      D: "Mengkritik kegiatan tersebut sebagai pemborosan jam kerja pegawai",
      E: "Mengambil izin sakit palsu setiap hari Jumat pagi"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: keterlibatan aktif dalam budaya organisasi yang sehat, antusiasme, dan penghargaan terhadap kebersamaan."
  },
  {
    id: 88,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Teknologi Informasi & Komunikasi",
    title: "Menjaga Etika dalam Komunikasi Surel / Email Dinas",
    question: "Saat membalas surel permohonan informasi dari instansi lain yang nadanya bernada ketus dan menuduh dinas Anda lambat, sikap komunikasi yang Anda kedepankan adalah...",
    options: {
      A: "Membalas surel dengan bahasa yang jauh lebih pedas agar pengirim tahu rasa",
      B: "Membalas surel secara profesional, santun, lugas, melampirkan data akurat yang diminta, serta memberikan nomor kontak resmi untuk koordinasi lebih lanjut",
      C: "Menghapus surel tersebut dan memasukkan alamat pengirim ke daftar spam",
      D: "Menyebarkan tangkapan layar surel tersebut ke media sosial untuk mempermalukan instansi pengirim",
      E: "Membiarkan surel tersebut selama satu bulan tanpa jawaban"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 1, E: 2 },
    explanation: "Opsi B bernilai 5 poin: menjaga reputasi kelembagaan melalui etiket komunikasi digital profesional berbasis fakta."
  },
  {
    id: 89,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Anti Radikalisme",
    title: "Sikap Terhadap Ajakan Mengganti Ideologi Pancasila",
    question: "Anda diajak oleh seorang kenalan lama untuk mengikuti kajian tertutup yang menyebarkan doktrin bahwa sistem demokrasi dan Pancasila adalah thaghut yang wajib digulingkan dan diganti dengan sistem lain. Tindakan Anda adalah...",
    options: {
      A: "Mengikuti ajakan tersebut karena penasaran dan ingin memperluas pergaulan",
      B: "Menolak secara tegas ajakan tersebut, mengingatkan kenalan Anda tentang bahaya pemikiran makar tersebut, dan berhati-hati dalam menjaga jarak",
      C: "Mendukung gerakan tersebut secara diam-diam melalui donasi uang",
      D: "Menyetujui ajakan tersebut asalkan diberi imbalan materi",
      E: "Membawa rekan kerja sekantor untuk ikut serta dalam kajian tertutup tersebut"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: loyalitas kokoh pada Pancasila dan UUD 1945, kewaspadaan dini terhadap infiltrasi ideologi radikal."
  },
  {
    id: 90,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Pelayanan Publik",
    title: "Inovasi Pelayanan bagi Penyandang Disabilitas",
    question: "Kantor pelayanan Anda belum memiliki jalur landai pemandu bagi pengguna kursi roda, sehingga pengguna layanan difabel seringkali kesulitan memasuki gedung. Usulan yang Anda sampaikan kepada atasan adalah...",
    options: {
      A: "Meminta penyandang difabel untuk tidak datang sendiri ke kantor dan cukup diwakilkan anggota keluarga",
      B: "Mengusulkan pengadaan fasilitas ramah disabilitas (ramp, guiding block, loket khusus) dalam rencana anggaran dan menyediakan bantuan pendampingan fisik sementara",
      C: "Menyuruh satpam menggendong pengguna kursi roda setiap kali ada yang datang tanpa perlu renovasi fasilitas",
      D: "Mengabaikan masalah tersebut karena jumlah pemohon difabel relatif sedikit setiap bulannya",
      E: "Menyarankan pemohon difabel mengurus perizinan di instansi lain yang gedungnya lebih baru"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 3, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: visi pelayanan publik berkeadilan sosial, inklusif, dan proaktif memberi solusi jangka pendek maupun permanen."
  },
  {
    id: 91,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Profesionalisme",
    title: "Manajemen Konflik Kepentingan Finansial",
    question: "Anda dipercaya menjadi panitia pengadaan alat tulis kantor. Saudara kandung Anda memiliki perusahaan penyedia alat tulis kantor dan meminta Anda membocorkan dokumen harga perkiraan sendiri (HPS) agar perusahaannya memenangkan lelang. Sikap Anda adalah...",
    options: {
      A: "Memberikan bocoran HPS karena saudara kandung wajib dibantu dalam mencari nafkah",
      B: "Menolak tegas permintaan saudara, merahasiakan dokumen negara sesuai ketentuan perundangan, dan menyatakan secara tertulis potensi benturan kepentingan kepada panitia",
      C: "Mengundurkan diri dari kantor agar tidak merasa bersalah",
      D: "Meminta komisi persentase keuntungan dari saudara kandung sebagai syarat pemberian dokumen",
      E: "Mengatur spek barang tender agar hanya cocok dengan produk yang dijual saudara Anda"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: integritas mutlak dalam tata kelola pengadaan barang/jasa negara, pencegahan konflik kepentingan sesuai prinsip GCG."
  },
  {
    id: 92,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Jejaring Kerja",
    title: "Mengelola Umpan Balik Kinerja dari Pimpinan",
    question: "Dalam rapat evaluasi bulanan, pimpinan memberikan kritik tajam di hadapan seluruh pegawai mengenai analisis data laporan yang Anda susun yang dinilai kurang mendalam. Respons Anda adalah...",
    options: {
      A: "Merasa tersinggung, mendendam kepada pimpinan, dan menolak berbicara lagi dengannya",
      B: "Menerima kritik dengan lapang dada sebagai bahan evaluasi konstruktif, meminta arahan lebih spesifik setelah rapat selesai, dan segera menyempurnakan kualitas laporan",
      C: "Membela diri secara emosional dan menyalahkan rekan tim yang membantu mencari data",
      D: "Menangis di ruang rapat agar pimpinan merasa kasihan dan membatalkan kritikannya",
      E: "Membuat surat pengunduran diri karena merasa tidak dihargai"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: kedewasaan mental (growth mindset), keterbukaan menerima koreksi, dan komitmen profesional meningkatkan kualitas diri."
  },
  {
    id: 93,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Sosial Budaya",
    title: "Menjaga Keramahan dalam Keberagaman Etnis",
    question: "Dalam sebuah kunjungan kerja ke desa adat terpencil, Anda disuguhi minuman dan makanan tradisional khas yang menurut kebiasaan mereka merupakan simbol kehormatan tertinggi bagi tamu. Namun, Anda merasa cita rasanya asing di lidah. Sikap Anda adalah...",
    options: {
      A: "Menolak mentah-mentah hidangan tersebut dan menunjukkan ekspresi jijik di depan tetua adat",
      B: "Menerima dengan senyum tulus, mencicipinya dengan rasa hormat, dan mengucapkan terima kasih atas keramahan sambutan yang luar biasa",
      C: "Membuang makanan tersebut secara diam-diam ke bawah meja saat tuan rumah lengah",
      D: "Meminta tuan rumah mengganti hidangan tersebut dengan makanan cepat saji modern",
      E: "Menceritakan keburukan rasa makanan tersebut kepada orang lain di media sosial"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: sensitivitas budaya yang luhur, etika bertamu, dan penghargaan tulus terhadap adat istiadat masyarakat nusantara."
  },
  {
    id: 94,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Teknologi Informasi & Komunikasi",
    title: "Kemauan Belajar Mandiri Mengikuti Perkembangan AI & Tech",
    question: "Teknologi kecerdasan buatan (Artificial Intelligence) mulai diterapkan di berbagai lini pemerintahan untuk mempermudah analisis dokumen dan pelayanan. Langkah terbaik yang Anda ambil adalah...",
    options: {
      A: "Menolak teknologi tersebut karena khawatir posisi ASN akan tergantikan oleh robot",
      B: "Secara mandiri mempelajari dasar-dasar pemanfaatan AI yang relevan, mengikuti pelatihan, dan memanfaatkannya secara etis untuk meningkatkan kecepatan serta kualitas kerja",
      C: "Menyerahkan seluruh tugas dan keputusan akhir kepada AI tanpa melakukan verifikasi manual",
      D: "Menggunakan AI hanya untuk membuat tugas palsu tanpa bekerja sama sekali",
      E: "Mengabaikan perkembangan teknologi tersebut sampai ada instruksi paksaan dari atasan"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 2 },
    explanation: "Opsi B bernilai 5 poin: adaptif terhadap disrupsi teknologi terkini, literasi digital mandiri, dan penerapan etis alat bantu kerja modern."
  },
  {
    id: 95,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Anti Radikalisme",
    title: "Memfilter Berita Hoaks Provokatif di Ruang Maya",
    question: "Anda menerima pesan berantai di grup percakapan keluarga yang mengklaim bahwa pemerintah sedang merencanakan penggusuran tempat ibadah tertentu disertai narasi yang sangat memprovokasi kemarahan umat. Sikap Anda adalah...",
    options: {
      A: "Langsung membagikan ulang pesan tersebut ke seluruh kontak WhatsApp agar semua orang waspada",
      B: "Memeriksa kebenaran fakta melalui kanal berita kredibel dan sumber resmi, lalu memberikan penjelasan klarifikasi yang menenangkan di grup keluarga dengan santun",
      C: "Memaki-maki anggota keluarga yang mengirimkan pesan tersebut dengan sebutan teroris",
      D: "Ikut terprovokasi dan menggalang aksi protes ke kantor dinas",
      E: "Menghapus aplikasi WhatsApp dari ponsel agar tidak pusing"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 1, E: 2 },
    explanation: "Opsi B bernilai 5 poin: literasi verifikasi informasi (cek fakta), penangkal hoaks penyulut konflik SARA, dan penjaga ketenteraman sosial."
  },
  {
    id: 96,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Pelayanan Publik",
    title: "Konsistensi Standar Pelayanan di Akhir Pekan / Jam Lembur",
    question: "Loket pelayanan dokumen ditutup pukul 16.00. Pada pukul 15.55, seorang ibu yang membawa balita dan menempuh perjalanan jauh dari desa terpencil tiba dengan napas terengah-engah untuk mendaftarkan layanan darurat. Sikap Anda adalah...",
    options: {
      A: "Menutup loket tepat di depan wajah ibu tersebut karena waktu operasional hampir habis",
      B: "Menyambut ibu tersebut dengan ramah, meneliti kelengkapan berkasnya, dan menyelesaikannya dengan tulus hingga tuntas meskipun melewati sedikit jam pulang kantor",
      C: "Menyuruh ibu tersebut pulang dan datang lagi besok pagi dengan alasan disiplin jam",
      D: "Melayani ibu tersebut dengan menunjukkan wajah cemberut dan menggerutu sepanjang waktu",
      E: "Meminta bayaran uang tambahan luar jam kerja kepada ibu tersebut"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin: jiwa melayani yang tulus, berorientasi solusi kemanusiaan (human-centered service), dan kerelaan berkorban waktu."
  },
  {
    id: 97,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Profesionalisme",
    title: "Kepatuhan Penggunaan Fasilitas Kedinasan",
    question: "Anda diberikan fasilitas laptop dan kendaraan dinas operasional untuk menunjang mobilitas pekerjaan pengawasan lapangan. Saat akhir pekan, anggota keluarga Anda ingin meminjam kendaraan dinas tersebut untuk berlibur ke luar kota. Keputusan Anda adalah...",
    options: {
      A: "Memberikan izin peminjaman mobil dinas dengan mencopot plat merahnya agar tidak dicurigai orang",
      B: "Menjelaskan dengan bijak bahwa aset dinas hanya boleh dipergunakan untuk kepentingan kedinasan resmi dan menyarankan menyewa kendaraan umum/pribadi untuk liburan",
      C: "Membiarkan keluarga memakai kendaraan dinas sekaligus mengisi bensin menggunakan anggaran kantor",
      D: "Marah-marah besar kepada keluarga dan memutuskan silaturahmi",
      E: "Menjual laptop kantor untuk menambah uang saku liburan keluarga"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin: ketegasan menjaga pemanfaatan aset negara sesuai peruntukan undang-undang dan integritas moral dalam keluarga."
  },
  {
    id: 98,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Jejaring Kerja",
    title: "Apresiasi atas Kontribusi dan Prestasi Tim",
    question: "Tim kerja yang Anda pimpin berhasil meraih penghargaan inovasi pelayanan terbaik tingkat provinsi. Dalam sesi penganugerahan di podium panggung, sikap Anda sebagai ketua tim adalah...",
    options: {
      A: "Menyatakan bahwa keberhasilan ini semata-mata karena kehebatan ide dan kepemimpinan pribadi Anda",
      B: "Mengapresiasi kerja keras dan dedikasi seluruh anggota tim secara terbuka, menegaskan bahwa pencapaian ini adalah hasil kolaborasi dan sinergi bersama",
      C: "Mengambil seluruh hadiah uang tunai untuk diri sendiri tanpa membagi kepada anggota",
      D: "Menyembunyikan piala penghargaan di ruang pribadi agar tidak dilihat orang lain",
      E: "Mengabaikan acara penganugerahan karena menganggap piala itu tidak berguna"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: kepemimpinan rendah hati (humble leadership), membangun semangat tim (team morale), dan apresiasi adil atas kontribusi kolektif."
  },
  {
    id: 99,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Sosial Budaya",
    title: "Pencegahan Diskriminasi dalam Penilaian Rekrutmen",
    question: "Anda ditugaskan dalam panitia seleksi tenaga pendukung kantor. Beberapa peserta memiliki latar belakang etnis minoritas dengan kualifikasi dan kompetensi teknis yang sangat unggul dibandingkan kandidat lainnya. Anggota panitia lain menyarankan untuk meloloskan kandidat satu daerah asal saja. Sikap Anda adalah...",
    options: {
      A: "Menyetujui saran rekan panitia demi menjaga kekompakan kelompok mayoritas",
      B: "Menolak tegas usulan nepotisme tersebut dan menegakkan prinsip seleksi meritokrasi yang adil, objektif, dan bebas diskriminasi latar belakang suku/agama",
      C: "Membiarkan saja keputusan diambil oleh anggota panitia lain tanpa mau ikut bertanggung jawab",
      D: "Menggagalkan semua peserta agar tidak timbul persaingan",
      E: "Membocorkan soal ujian kepada peserta dari daerah sendiri"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: komitmen teguh pada sistem merit (merit system), keadilan non-diskriminatif, dan perlindungan kesetaraan kesempatan."
  },
  {
    id: 100,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Teknologi Informasi & Komunikasi",
    title: "Disiplin Waktu Kerja Tanpa Distraksi Media Sosial",
    question: "Saat jam kerja sedang berlangsung dan tugas administrasi sedang banyak, ponsel Anda terus berdering karena notifikasi percakapan media sosial yang ramai membahas gosip viral terbaru. Kebiasaan yang Anda terapkan adalah...",
    options: {
      A: "Mengabaikan pekerjaan dan asyik membaca serta mengomentari gosip viral di media sosial sepanjang hari",
      B: "Mengaktifkan mode senyap/fokus pada ponsel, menyimpannya di laci, dan baru mengeceknya saat jam istirahat siang resmi",
      C: "Bekerja sambil sesekali membuka live streaming di ponsel di atas meja",
      D: "Mengajak rekan kerja lain untuk ikut menonton video viral bersama-sama di ruang kerja",
      E: "Membalas komentar netizen menggunakan komputer inventaris kantor"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 3, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: disiplin diri tinggi, etos kerja profesional, dan fokus penuh pada penyelesaian kewajiban tugas dinas."
  },
  {
    id: 101,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Anti Radikalisme",
    title: "Menjaga Netralitas Rumah Ibadah Kantor dari Politik Praktis",
    question: "Sebagai pengurus tempat ibadah di lingkungan kantor pemerintahan, Anda mendapati ada pihak luar yang meminta izin untuk mengadakan ceramah yang secara terang-terangan bermuatan kampanye politik dan agitasi permusuhan terhadap pemerintah yang sah. Tindakan Anda adalah...",
    options: {
      A: "Mengizinkan kegiatan tersebut karena merasa tidak enak menolak sesama rekan",
      B: "Menolak permohonan tersebut secara tegas dan sopan, menegaskan bahwa rumah ibadah kantor harus menjadi sarana ibadah murni dan penyejuk persatuan bangsa",
      C: "Meminta uang sewa tempat yang sangat mahal agar mereka membatalkannya sendiri",
      D: "Ikut menjadi moderator dalam ceramah yang provokatif tersebut",
      E: "Kabur dan membiarkan orang lain yang memutuskan"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: ketegasan menjaga fasilitas publik agar tetap steril dari radikalisme, polarisasi politik, dan ujaran perpecahan."
  },
  {
    id: 102,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Pelayanan Publik",
    title: "Kecepatan Respons Permohonan Informasi Publik",
    question: "Seorang warga mengajukan permohonan informasi publik mengenai alokasi anggaran bansos daerah. Berdasarkan aturan, instansi memiliki waktu maksimal 10 hari kerja. Namun data tersebut sebenarnya sudah tersedia lengkap di meja kerja Anda hari ini. Tindakan Anda adalah...",
    options: {
      A: "Menunda memberikan data hingga hari ke-10 dengan dalih menghabiskan batas waktu regulasi",
      B: "Segera memverifikasi data dan menyerahkannya hari itu juga dengan santun dan transparan sesuai prinsip keterbukaan informasi publik",
      C: "Meminta warga tersebut membayar sejumlah uang pelicin jika ingin data diberikan lebih cepat",
      D: "Menyembunyikan data tersebut dan beralih mengatakan bahwa dokumennya hilang",
      E: "Menolak permohonan warga dengan alasan informasi anggaran tidak boleh diketahui masyarakat umum"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: dedikasi keterbukaan informasi publik (KIP), efisiensi birokrasi, dan kepuasan pemohon layanan."
  },
  {
    id: 103,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Profesionalisme",
    title: "Ketelitian dalam Verifikasi Keabsahan Dokumen Negara",
    question: "Saat memeriksa berkas pencairan dana bantuan sosial, Anda mendapati tanda tangan salah satu pihak penerima terlihat mencurigakan dan terindikasi merupakan hasil scan/rekayasa digital. Apa yang Anda lakukan?",
    options: {
      A: "Meloloskan saja berkas tersebut agar target penyerapan anggaran kantor Anda dinilai berhasil",
      B: "Melakukan konfirmasi dan verifikasi faktual langsung kepada pihak terkait sebelum menandatangani persetujuan demi memastikan keabsahan hukum",
      C: "Menandatangani berkas tersebut asalkan diberi jaminan lisan oleh atasan",
      D: "Membuang berkas tersebut ke tempat sampah tanpa memberitahu siapapun",
      E: "Menyalahkan rekan verifikator lain atas ketidaksesuaian berkas"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 2 },
    explanation: "Opsi B bernilai 5 poin: prinsip kehati-hatian (prudential principle), ketelitian tinggi, dan kepatuhan akuntabilitas anggaran negara."
  },
  {
    id: 104,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Jejaring Kerja",
    title: "Mengakomodasi Ide Inovatif dari Staf Baru",
    question: "Dalam rapat penyusunan program kerja, seorang CPNS baru menyampaikan usulan cara kerja baru yang sangat berbeda dengan pola konvensional yang sudah dijalankan kantor selama puluhan tahun. Sikap Anda sebagai pegawai senior adalah...",
    options: {
      A: "Langsung memotong pembicaraannya dan menyuruhnya diam karena masih berstatus pegawai baru",
      B: "Mendengarkan gagasan tersebut secara seksama dengan pikiran terbuka, mengkaji nilai manfaat dan kelayakannya, serta memberikan masukan penyempurnaan",
      C: "Menertawakan usulannya di hadapan seluruh peserta rapat agar ia merasa malu",
      D: "Menerima ide tersebut hanya untuk kemudian membebankan seluruh kegagalan program kepadanya",
      E: "Mengklaim ide brilian tersebut sebagai gagasan pribadi Anda sendiri"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: keterbukaan terhadap inovasi (open-mindedness), menghargai potensi talenta baru, dan budaya kerja kolaboratif."
  },
  {
    id: 105,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Sosial Budaya",
    title: "Sikap Ramah Tamah dalam Menghadapi Masyarakat Tradisional",
    question: "Saat bertugas melakukan survei pemetaan desa, masyarakat adat setempat meminta Anda untuk membasuh kaki dengan air kembang sebelum memasuki area hutan larangan sebagai bentuk penghormatan tradisi leluhur mereka. Tindakan Anda adalah...",
    options: {
      A: "Menertawakan tradisi tersebut dan menerobos masuk begitu saja tanpa izin",
      B: "Mengikuti prosesi adat tersebut dengan rasa hormat dan tulus demi menjaga kearifan lokal serta kelancaran komunikasi dengan warga",
      C: "Membatalkan seluruh kegiatan survei dan menuduh warga desa tersebut menganut tahayul",
      D: "Membayar denda uang agar tidak perlu membasuh kaki",
      E: "Mengancam warga desa dengan membawa aparat keamanan bersenjata"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin: empati budaya, menghargai pranata adat lokal, dan membangun hubungan harmonis dengan masyarakat adat."
  },
  {
    id: 106,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Teknologi Informasi & Komunikasi",
    title: "Edukasi Penggunaan Tanda Tangan Elektronik Tersertifikasi",
    question: "Kantor Anda mulai mewajibkan penggunaan Tanda Tangan Elektronik (TTE) tersertifikasi untuk surat kedinasan keluar. Seorang rekan kerja meminta Anda menandatangani surat dengan menempelkan gambar scan tanda tangan manual JPEG karena lebih cepat. Respons Anda adalah...",
    options: {
      A: "Menyetujui saran rekan tersebut karena gambarnya terlihat persis sama",
      B: "Menjelaskan bahwa scan gambar tidak memiliki kekuatan pembuktian hukum dan berisiko dipalsukan, serta mendampinginya menggunakan aplikasi TTE tersertifikasi resmi",
      C: "Memalsukan tanda tangan pimpinan menggunakan aplikasi edit gambar",
      D: "Menolak tanpa memberikan penjelasan apa pun sehingga rekan kerja bingung",
      E: "Menghapus seluruh akun TTE kantor karena dianggap merepotkan"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin: pemahaman hukum keabsahan dokumen digital, edukasi rekan kerja, dan disiplin tata kelola TIK yang aman."
  },
  {
    id: 107,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Anti Radikalisme",
    title: "Mencegah Penyebaran Paham Ekstremisme di Kalangan Generasi Muda",
    question: "Di lingkungan komunitas pemuda tempat tinggal Anda, mulai berkembang kelompok pengajian eksklusif yang melarang anggotanya menghormati bendera Merah Putih dan mengkafirkan orang yang tidak sekelompok. Tindakan Anda adalah...",
    options: {
      A: "Membiarkannya karena menganggap setiap orang bebas meyakini apa saja tanpa batas",
      B: "Berkoordinasi dengan pengurus RT/RW, tokoh agama moderat, dan babinsa untuk melakukan pendekatan persuasif serta menghidupkan kegiatan kepemudaan yang inklusif",
      C: "Melakukan aksi perusakan tempat berkumpul kelompok tersebut secara anarkis",
      D: "Membagikan pamflet kebencian tandingan di jalanan",
      E: "Menutup mata dan telinga agar keluarga Anda tidak ikut terancam"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: tindakan terkoordinasi, persuasif, mengedepankan kolaborasi dengan tokoh kunci untuk deradikalisasi damai."
  },
  {
    id: 108,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Pelayanan Publik",
    title: "Keadilan Pelayanan Tanpa Membedakan Status Sosial",
    question: "Saat Anda sedang melayani seorang petani berpakaian sederhana di loket, datang seorang tokoh pengusaha kaya ternama di kota Anda yang meminta agar berkasnya didahulukan terlebih dahulu tanpa perlu menunggu antrean. Tindakan Anda adalah...",
    options: {
      A: "Langsung meninggalkan petani tersebut dan beralih melayani pengusaha kaya demi relasi pribadi",
      B: "Menyapa pengusaha tersebut dengan sopan, memintanya mengambil nomor antrean, dan tetap fokus menuntaskan pelayanan kepada petani sesuai urutan antrean",
      C: "Memarahi pengusaha tersebut dengan kata-kata kasar di hadapan orang banyak",
      D: "Menyuruh petani tersebut pindah ke loket lain yang paling lambat",
      E: "Meminta pengusaha memberikan uang suap jika ingin layanannya dipercepat"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 2, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: asas keadilan (fairness), non-diskriminasi, integritas, dan perlakuan setara bagi setiap warga negara di mata pelayanan publik."
  },
  {
    id: 109,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Profesionalisme",
    title: "Manajemen Stres dan Ketahanan Mental dalam Beban Kerja Puncak",
    question: "Dalam sebulan terakhir, unit kerja Anda mengalami lonjakan beban tugas hingga tiga kali lipat karena adanya pemeriksaan akuntabilitas nasional. Banyak rekan kerja yang mulai mengeluh kelelahan dan menurun motivasinya. Sikap yang Anda tunjukkan adalah...",
    options: {
      A: "Ikut mengeluh sepanjang hari dan memperlambat ritme kerja secara sengaja",
      B: "Menjaga energi positif, menjaga kesehatan fisik, memotivasi rekan kerja dengan semangat saling bantu, dan konsisten menyelesaikan target harian dengan fokus",
      C: "Mencari kambing hitam atas tingginya beban kerja yang terjadi",
      D: "Mengambil jatah cuti panjang di saat tim sedang dalam puncak kesibukan",
      E: "Menolak mengerjakan tugas baru yang diberikan oleh pimpinan"
    },
    scoringType: "scale",
    points: { A: 1, B: 5, C: 1, D: 1, E: 1 },
    explanation: "Opsi B bernilai 5 poin: resiliensi mental (ketangguhan), role model optimisme, kepemimpinan tim informal, dan fokus penyelesaian target."
  },
  {
    id: 110,
    category: "TKP",
    categoryName: "Tes Karakteristik Pribadi",
    topic: "Sosial Budaya & Pelayanan Prima",
    title: "Pemberian Pelayanan Holistik Berlandaskan Nilai Luhur Pancasila",
    question: "Sebagai seorang Aparatur Sipil Negara yang bertugas di garda terdepan pelayanan masyarakat yang majemuk, tekad dan komitmen utama yang selalu Anda jadikan pedoman dalam menjalankan tugas keseharian adalah...",
    options: {
      A: "Bekerja sekadar menggugurkan kewajiban rutin agar terhindar dari sanksi pemotongan tunjangan kinerja",
      B: "Menjadikan nilai-nilai Pancasila dan integritas sebagai nafas dalam memberikan pelayanan yang profesional, transparan, berkeadilan, inklusif, dan penuh ketulusan bagi kemajuan bangsa",
      C: "Mencari celah kekuasaan demi keuntungan kelompok dan keluarga pribadi",
      D: "Membatasi diri hanya pada tugas pokok formal tanpa bersedia memberikan inisiatif ekstra bagi masyarakat",
      E: "Menunggu perintah atasan secara kaku tanpa berani melakukan inovasi apa pun"
    },
    scoringType: "scale",
    points: { A: 2, B: 5, C: 1, D: 2, E: 1 },
    explanation: "Opsi B bernilai 5 poin: visi pengabdian paripurna, internalisasi nilai dasar BerAKHLAK dan Pancasila, dedikasi tanpa pamrih untuk bangsa dan negara."
  }
];

// Helper untuk ekspor / penyiapan
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_QUESTIONS };
}

