import { LevelId, LevelMeta, QuizQuestion } from './types';

export const LEVELS_META: Record<LevelId, LevelMeta> = {
  1: {
    id: 1,
    name: 'Hutan Cokelat',
    subtitle: 'Pentingnya Sarapan',
    theme: 'Mengapa sarapan penting sebelum berangkat sekolah',
    description:
      'Jelajahi hutan rumput, seberangi jembatan sungai, kumpulkan 10 bola cokelat, dan temukan 3 simbol manfaat sarapan!',
    collectibleLabel: 'Bola Cokelat',
    collectibleTarget: 10,
    symbolLabels: ['Energi', 'Konsentrasi', 'Semangat'],
    introDialog: {
      speaker: 'Malki',
      lines: [
        'Halo Bobo Balls! Sebentar lagi jam masuk sekolah nih!',
        'Ayo jelajahi Hutan Cokelat bersama. Kumpulkan 10 Bola Cokelat dan temukan 3 simbol penting: Energi, Konsentrasi, dan Semangat!',
        'Nanti di ujung hutan, kita akan menjawab kuis tentang manfaat sarapan agar gerbang menuju Lembah Gizi terbuka!',
      ],
    },
    outroDialog: 'Hebat! Kamu sudah paham mengapa sarapan bikin tubuh bertenaga dan fokus belajar di kelas!',
    accentColor: '#16A34A',
    bgGradient: 'from-sky-400 via-emerald-400 to-green-600',
  },
  2: {
    id: 2,
    name: 'Lembah Gizi',
    subtitle: 'Ciri Makanan Bergizi',
    theme: 'Mengenal karbohidrat, protein, sayur, dan buah',
    description:
      'Lompati platform bergerak, hindari Monster Permen, kumpulkan 4 simbol gizi seimbang, lalu susun menu sarapan beragam!',
    collectibleLabel: 'Buah Segar',
    collectibleTarget: 8,
    symbolLabels: ['Karbohidrat', 'Protein', 'Sayuran', 'Buah'],
    introDialog: {
      speaker: 'Malki',
      lines: [
        'Selamat datang di Lembah Gizi! Di sini banyak buah, sayur, dan makanan bergizi.',
        'Hati-hati dengan Monster Permen yang manis berlebihan! Kamu bisa melompatinya atau menginjak bagian atasnya.',
        'Kumpulkan 4 simbol gizi: Karbohidrat, Protein, Sayuran, dan Buah, lalu susun menu sarapan sehatmu!',
      ],
    },
    outroDialog: 'Keren sekali! Menu sarapan bergizi harus beragam agar tubuh mendapat energi, zat pembangun, dan vitamin!',
    accentColor: '#F59E0B',
    bgGradient: 'from-amber-300 via-lime-400 to-emerald-500',
  },
  3: {
    id: 3,
    name: 'Pabrik Energen',
    subtitle: 'Alternatif Sarapan Praktis',
    theme: 'Sarapan praktis dan membaca label informasi gizi',
    description:
      'Jelajahi ban berjalan dan mesin pengemas, kumpulkan 5 kemasan Energen, baca label pangan, dan padukan sarapan praktis!',
    collectibleLabel: 'Kemasan Energen',
    collectibleTarget: 5,
    symbolLabels: ['Label Gizi', 'Sarapan Praktis'],
    introDialog: {
      speaker: 'Malki',
      lines: [
        'Wah, kita sampai di Pabrik Energen yang cerah! Hati-hati saat melangkah di atas ban berjalan (conveyor belt) ya.',
        'Kumpulkan 5 Kemasan Energen yang tersebar di pabrik ini dan temukan 2 simbol pengetahuan pangan.',
        'Ingat: Energen bisa jadi bagian dari sarapan praktis saat terburu-buru, tetapi tetap perlu dilengkapi makanan bergizi lainnya!',
      ],
    },
    outroDialog: 'Pintar! Membaca label pangan membantumu memilih makanan sehat, dan Energen paling baik dipadukan dengan buah atau telur!',
    accentColor: '#EA580C',
    bgGradient: 'from-orange-300 via-amber-400 to-orange-600',
  },
  4: {
    id: 4,
    name: 'Kastil Rasa Lapar',
    subtitle: 'Melawan Rasa Lapar & Malas',
    theme: 'Mengalahkan Energen Jahat dengan pengetahuan gizi',
    description:
      'Hadapi boss Energen Jahat di kastil ungu berpetir! Hindari 3 serangan dan selesaikan tantangan edukasi untuk mengalahkannya!',
    collectibleLabel: 'Kristal Energi',
    collectibleTarget: 6,
    symbolLabels: ['Tahan Lapar', 'Anti Lemas', 'Fokus Penuh'],
    introDialog: {
      speaker: 'Malki',
      lines: [
        'Bobo Balls, di depan kita adalah Kastil Rasa Lapar! Boss ENERGEN JAHAT menyebarkan rasa lapar, lemas, dan sulit konsentrasi!',
        'Untuk mengalahkannya, hindari serangannya lalu sentuh Kristal Tantangan dan jawab pertanyaan gizi dengan benar!',
        'Setiap jawaban benar akan mengurangi nyawa Energi Jahat. Ayo kita kalahkan bersama!',
      ],
    },
    outroDialog: 'Horeee! ENERGEN JAHAT berhasil dikalahkan! Sekarang semua anak siap sarapan sehat sebelum sekolah!',
    accentColor: '#7C3AED',
    bgGradient: 'from-purple-700 via-indigo-800 to-slate-900',
  },
};

export const LEVEL_QUIZZES: Record<LevelId, QuizQuestion[]> = {
  1: [
    {
      id: 'l1-q1',
      question: 'Mengapa siswa kelas 5 SD perlu sarapan sebelum berangkat ke sekolah?',
      options: [
        'Agar tubuh punya energi dan otak lebih fokus belajar di kelas',
        'Supaya bisa tidur lebih lama di dalam kelas',
        'Agar tidak perlu membawa buku pelajaran',
      ],
      correctIndex: 0,
      explanationCorrect:
        'Benar! Sarapan mengisi kembali energi tubuh setelah tidur semalaman sehingga kita semangat dan mudah berkonsentrasi.',
      explanationWrong:
        'Kurang tepat. Sarapan bukan untuk membuat mengantuk, melainkan memberi energi bagi tubuh dan otak agar siap belajar!',
    },
    {
      id: 'l1-q2',
      question: 'Apa yang sering terjadi jika seseorang melewatkan sarapan di pagi hari?',
      options: [
        'Menjadi lebih cepat berlari saat olahraga',
        'Perut terasa lapar, tubuh lemas, dan sulit berkonsentrasi',
        'Nilai ulangan otomatis menjadi sempurna',
      ],
      correctIndex: 1,
      explanationCorrect:
        'Tepat sekali! Tanpa sarapan, cadangan energi menipis sehingga kita mudah lemas, lapar, dan sulit fokus mendengarkan guru.',
      explanationWrong:
        'Coba pikirkan lagi! Kalau perut kosong sejak pagi, tubuh kekurangan energi sehingga justru terasa lemas dan sulit fokus.',
    },
    {
      id: 'l1-q3',
      question: 'Kapan waktu terbaik untuk melakukan sarapan pagi?',
      options: [
        'Setelah pulang sekolah pada sore hari',
        'Tengah malam sebelum tidur',
        'Pagi hari sebelum memulai aktivitas atau berangkat sekolah',
      ],
      correctIndex: 2,
      explanationCorrect:
        'Hebat! Sarapan dilakukan pada pagi hari sebelum beraktivitas agar energi tersedia sejak jam pelajaran pertama.',
      explanationWrong:
        'Belum tepat ya. Sarapan artinya makan di pagi hari sebelum mulai beraktivitas atau pergi ke sekolah.',
    },
  ],
  2: [
    {
      id: 'l2-q1',
      question: 'Manakah kelompok makanan yang menjadi sumber utama karbohidrat pemberi energi?',
      options: [
        'Nasi, roti gandum, jagung, dan kentang',
        'Permen lolipop dan minuman bersoda',
        'Air putih dan es batu saja',
      ],
      correctIndex: 0,
      explanationCorrect:
        'Betul! Nasi, roti, jagung, dan kentang kaya karbohidrat kompleks yang memberi tenaga tahan lama untuk beraktivitas.',
      explanationWrong:
        'Hati-hati! Permen hanya memberi gula berlebih yang cepat habis dan bisa merusak gigi, bukan karbohidrat sehat.',
    },
    {
      id: 'l2-q2',
      question: 'Apa manfaat protein seperti telur, ikan, tempe, dan susu bagi anak usia sekolah?',
      options: [
        'Membuat makanan terasa sangat asin',
        'Membantu pertumbuhan tubuh dan memperbaiki sel yang rusak',
        'Menggantikan kebutuhan air minum setiap hari',
      ],
      correctIndex: 1,
      explanationCorrect:
        'Cerdas! Protein disebut zat pembangun karena membantu otot, tulang, dan tubuh kita tumbuh kuat dan sehat.',
      explanationWrong:
        'Belum pas nih. Protein adalah zat pembangun yang sangat penting bagi pertumbuhan anak kelas 5 SD!',
    },
    {
      id: 'l2-q3',
      question: 'Mengapa kita dianjurkan makan sayur dan buah dalam menu sarapan?',
      options: [
        'Karena mengandung vitamin, mineral, dan serat yang menjaga daya tahan tubuh',
        'Supaya piring terlihat penuh tanpa manfaat',
        'Agar tubuh tidak memerlukan karbohidrat sama sekali',
      ],
      correctIndex: 0,
      explanationCorrect:
        'Mantap! Vitamin, mineral, dan serat dalam sayur serta buah membantu pencernaan lancar dan tubuh tidak mudah sakit.',
      explanationWrong:
        'Coba pilih lagi! Sayur dan buah kaya vitamin serta serat yang menjaga daya tahan tubuh agar tetap bugar.',
    },
  ],
  3: [
    {
      id: 'l3-q1',
      question: 'Hal penting apa yang harus diperiksa pada label kemasan makanan sebelum dikonsumsi?',
      options: [
        'Warna gambar maskot saja',
        'Tanggal kedaluwarsa, informasi nilai gizi, dan takaran saji',
        'Ukuran huruf merek yang paling besar',
      ],
      correctIndex: 1,
      explanationCorrect:
        'Benar! Memeriksa tanggal kedaluwarsa memastikan makanan aman, dan informasi nilai gizi membantu mengetahui kandungannya.',
      explanationWrong:
        'Jangan hanya melihat gambar ya! Yang paling penting adalah tanggal kedaluwarsa dan tabel informasi nilai gizi.',
    },
    {
      id: 'l3-q2',
      question: 'Bagaimana peran minuman sereal praktis seperti Energen dalam pola makan sehat?',
      options: [
        'Dapat menjadi bagian dari sarapan praktis, tetapi bukan pengganti seluruh kebutuhan gizi',
        'Boleh dimakan menggantikan semua sayur, buah, dan lauk setiap hari selamanya',
        'Sebaiknya diminum tengah malam sebagai camilan pengganti tidur',
      ],
      correctIndex: 0,
      explanationCorrect:
        'Tepat! Minuman sereal praktis membantu saat waktu terbatas, namun tetap perlu dilengkapi buah, protein, dan makanan beragam.',
      explanationWrong:
        'Ingat pesan penting level ini: tidak ada satu makanan saja yang cukup menggantikan seluruh kebutuhan gizi seimbang!',
    },
    {
      id: 'l3-q3',
      question: 'Contoh sarapan praktis yang tetap lebih bergizi seimbang jika waktu pagi sangat singkat adalah...',
      options: [
        'Hanya keripik pedas dan minuman bersoda',
        'Minuman sereal hangat ditambah telur rebus dan potongan buah pisang',
        'Tidak makan apa-apa sampai siang hari',
      ],
      correctIndex: 1,
      explanationCorrect:
        'Juara! Memadukan minuman sereal praktis dengan telur (protein) dan pisang (vitamin & serat) membuat sarapan tetap seimbang.',
      explanationWrong:
        'Pilih kombinasi yang cepat disiapkan sekaligus memiliki karbohidrat, protein, dan vitamin dari buah!',
    },
  ],
  4: [
    {
      id: 'l4-q1',
      question: 'Serangan Rasa Lapar datang! Apa kebiasaan terbaik agar perut tidak keroncongan saat upacara atau pelajaran pertama?',
      options: [
        'Bangun lebih awal lalu menyempatkan sarapan bergizi sebelum berangkat',
        'Menahan lapar sampai jam istirahat kedua',
        'Minum sirup manis saja tanpa makanan padat',
      ],
      correctIndex: 0,
      explanationCorrect:
        'Serangan mengenai Energen Jahat! Bangun cukup awal memberi waktu untuk sarapan tenang dan penuh tenaga.',
      explanationWrong:
        'Waspada serangan rasa lapar! Menahan lapar atau hanya minum gula membuat energi cepat turun. Ayo coba jawaban yang lebih tepat!',
    },
    {
      id: 'l4-q2',
      question: 'Energen Jahat mengirim Serangan Tubuh Lemas! Kombinasi makanan apa yang menjaga energi tetap stabil?',
      options: [
        'Karbohidrat, protein, serta sayur atau buah dan minum air putih cukup',
        'Tiga bungkus permen manis warna-warni',
        'Gorengan asin tanpa minum air putih',
      ],
      correctIndex: 0,
      explanationCorrect:
        'Telak! Gizi seimbang membuat pasokan energi tubuh stabil sehingga kamu tidak mudah lemas sepanjang pagi.',
      explanationWrong:
        'Hati-hati, makanan tinggi gula atau garam berlebih tidak menjaga energi stabil. Coba pilih kombinasi gizi seimbang!',
    },
    {
      id: 'l4-q3',
      question: 'Serangan Kabut Sulit Berkonsentrasi! Apa bukti manfaat sarapan sehat bagi otak siswa kelas 5 SD?',
      options: [
        'Lebih fokus menyimak guru, mudah mengingat pelajaran, dan aktif berdiskusi',
        'Menjadi malas membaca buku dan mudah marah',
        'Mengantuk berat sejak pagi hari',
      ],
      correctIndex: 0,
      explanationCorrect:
        'KEMENANGAN! Otak yang mendapat gizi dari sarapan sehat mampu berpikir jernih, fokus, dan berprestasi di sekolah!',
      explanationWrong:
        'Kabut masih menghalangi! Pikirkan manfaat positif sarapan bagi kemampuan berpikir dan fokus belajarmu.',
    },
  ],
};

export interface FoodChoiceItem {
  id: string;
  name: string;
  category: 'karbo' | 'protein' | 'sayur_buah' | 'kurang_sehat';
  emoji: string;
  note: string;
}

export const LEVEL2_FOOD_ITEMS: FoodChoiceItem[] = [
  {
    id: 'nasi',
    name: 'Nasi Hangat',
    category: 'karbo',
    emoji: '🍚',
    note: 'Karbohidrat utama pemberi tenaga pagi!',
  },
  {
    id: 'roti',
    name: 'Roti Gandum',
    category: 'karbo',
    emoji: '🍞',
    note: 'Karbohidrat kaya serat untuk energi tahan lama.',
  },
  {
    id: 'telur',
    name: 'Telur Dadar',
    category: 'protein',
    emoji: '🍳',
    note: 'Protein baik untuk pertumbuhan otot dan otak.',
  },
  {
    id: 'tempe',
    name: 'Tempe / Ikan',
    category: 'protein',
    emoji: '🐟',
    note: 'Sumber protein sehat kaya zat gizi pembangun.',
  },
  {
    id: 'bayam',
    name: 'Tumis Sayur',
    category: 'sayur_buah',
    emoji: '🥦',
    note: 'Vitamin, mineral, dan serat pelindung tubuh.',
  },
  {
    id: 'pisang',
    name: 'Buah Pisang',
    category: 'sayur_buah',
    emoji: '🍌',
    note: 'Vitamin alami dan kalium yang bikin bugar.',
  },
  {
    id: 'permen',
    name: 'Permen Warna',
    category: 'kurang_sehat',
    emoji: '🍭',
    note: 'Terlalu banyak gula tanpa gizi seimbang!',
  },
  {
    id: 'soda',
    name: 'Minuman Soda',
    category: 'kurang_sehat',
    emoji: '🥤',
    note: 'Tinggi gula dan kurang baik untuk sarapan pagi.',
  },
];

export interface LabelFactItem {
  id: string;
  label: string;
  value: string;
  highlight: string;
}

export const LEVEL3_LABEL_FACTS: LabelFactItem[] = [
  {
    id: 'takaran',
    label: 'Takaran Saji',
    value: '1 Sachet (34 g)',
    highlight: 'Menunjukkan ukuran satu kali minum sesuai anjuran.',
  },
  {
    id: 'energi',
    label: 'Energi Total',
    value: '140 kkal',
    highlight: 'Energi awal yang membantu memulai pagi, perlu ditambah makanan lain.',
  },
  {
    id: 'vitamin',
    label: 'Vitamin & Mineral',
    value: 'Vit A, B1, B2, B6, B12, D, E, Kalsium',
    highlight: 'Membantu metabolisme energi, namun serat segar tetap didapat dari buah & sayur.',
  },
  {
    id: 'expired',
    label: 'Baik Digunakan Sebelum',
    value: '12 DES 2027',
    highlight: 'Selalu cek tanggal kedaluwarsa sebelum menyeduh!',
  },
];

export interface PracticalPairingItem {
  id: string;
  name: string;
  emoji: string;
  isHealthyPartner: boolean;
  feedback: string;
}

export const LEVEL3_PAIRING_ITEMS: PracticalPairingItem[] = [
  {
    id: 'energen',
    name: 'Energen Sereal Hangat',
    emoji: '🥣',
    isHealthyPartner: true,
    feedback: 'Pilihan praktis berenergi! Cocok dipadukan dengan lauk protein dan buah segar.',
  },
  {
    id: 'telur_rebus',
    name: 'Telur Rebus',
    emoji: '🥚',
    isHealthyPartner: true,
    feedback: 'Hebat! Menambah protein agar kenyang lebih lama di kelas.',
  },
  {
    id: 'apel',
    name: 'Potongan Apel / Pisang',
    emoji: '🍎',
    isHealthyPartner: true,
    feedback: 'Mantap! Buah melengkapi vitamin dan serat alami yang dibutuhkan tubuh.',
  },
  {
    id: 'keripik',
    name: 'Keripik Pedas Kemasan',
    emoji: '🌶️',
    isHealthyPartner: false,
    feedback: 'Kurang cocok untuk sarapan pagi karena tinggi garam dan bisa bikin sakit perut.',
  },
  {
    id: 'cokelat_permen',
    name: 'Permen Gula Berlebih',
    emoji: '🍬',
    isHealthyPartner: false,
    feedback: 'Terlalu banyak gula! Lebih baik pilih buah segar atau telur rebus.',
  },
];
