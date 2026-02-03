/**
 * KALENDER JAWA MODERN - VERSI FINAL FIX 2026
 * Dengan PWA Support dan Fitur Cari Tanggal
 */

// PWA Detection and Setup
console.log('Kalender Jawa PWA v2.0 dengan Fitur Cari Tanggal');

// Check if running in standalone mode
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Running as PWA');
    // Add standalone specific features
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // App came to foreground
            console.log('App resumed');
        }
    });
}

// Network status
let isOnline = navigator.onLine;

// ==========================================
// SISTEM TOKEN - VERSI TUNGGAL
// ==========================================

// Fungsi untuk load token database dari localStorage admin
function loadTokenDatabase() {
    try {
        const adminDatabase = localStorage.getItem('kalender_token_database');
        if (adminDatabase) {
            const tokens = JSON.parse(adminDatabase);
            
            // Convert ke format yang kompatibel
            const convertedTokens = {};
            
            for (const [token, data] of Object.entries(tokens)) {
                convertedTokens[token] = {
                    expiry: data.expiry,
                    package: data.package,
                    created: data.created
                };
            }
            
            // Gabungkan dengan token default
            return {
                ...convertedTokens,
                "DEMO123": { expiry: "2026-03-01", package: "1 Bulan", created: "2026-02-01" },
                "TIUS2026": { expiry: "2026-12-31", package: "1 Tahun", created: "2026-01-01" }
            };
        }
    } catch (error) {
        console.error("Error loading token database:", error);
    }
    
    // Fallback ke token default
    return {
        "DEMO123": { expiry: "2026-03-01", package: "1 Bulan", created: "2026-02-01" },
        "TIUS2026": { expiry: "2026-12-31", package: "1 Tahun", created: "2026-01-01" },
        "VIP999": { expiry: "9999-12-31", package: "Unlimited", created: "2026-01-15" }
    };
}

// DEKLARASI TUNGGAL DAFTAR_TOKEN_AKTIF
const DAFTAR_TOKEN_AKTIF = loadTokenDatabase();

// ==========================================
// KONSTANTA & DATA REFERENSI LENGKAP
// ==========================================
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const NEPTU_HARI = { 'Minggu': 5, 'Senin': 4, 'Selasa': 3, 'Rabu': 7, 'Kamis': 8, 'Jumat': 6, 'Sabtu': 9 };
const NEPTU_PASARAN = { 'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8, 'Legi': 5 };

const DATA_SIFAT_PASARAN = {
    'KLIWON': 'Pandai bicara dan bergaul, periang, ambisius, urakan, kurang bisa membalas budi, setia pada janji, ceroboh memilih makanan, banyak selamat dan doanya.',
    'LEGI': 'Bertanggung jawab, murah hati, enak dalam pergaulan, selalu gembira seperti tidak pernah susah, sering kena fitnah, kuat tidak tidur malam hari, berhati-hati namun sering bingung sendiri, bicaranya berisi. Banyak keberuntungan dan kesialannya.',
    'PAHING': 'Selalu ingin memiliki (barang), kesungguhannya penuh perhitungan untuk mendapatkan untung, suka menolong, mandiri, kuat lapar, banyak musuhnya, kalau tersinggung menakutkan marahnya, suka kebersihan. Sering kena tipu dan kalau kehilangan jarang bisa menemukan kembali.',
    'PON': 'Bicaranya banyak diterima orang, suka tinggal di rumah, tidak mau memakan yang bukan kepunyaannya sendiri, suka marah kepada keluarganya, jalan pikirannya sering berbeda dengan pandangan umum. Suka berbantahan, berani kepada atasan. Rejekinya cukup.',
    'WAGE': 'Menarik tetapi angkuh, setia dan penurut, malas mencari nafkah perlu dibantu orang lain, kaku hati, tidak bisa berpikir panjang, sering gelap pikiran dan mendapat fitnah.'
};

const DATA_SIFAT_HARI = {
    'Minggu': 'Tekun, mandiri dan berwibawa.',
    'Senin': 'Selalu berubah, indah dan selalu mendapatkan simpati.',
    'Selasa': 'Pemarah dan pencemburu serta luas pergaulannya.',
    'Rabu': 'Pendiam, pemomong dan penyabar.',
    'Kamis': 'Sangar menakutkan.',
    'Jumat': 'Energik dan mengagumkan.',
    'Sabtu': 'Membuat orang merasa senang dan susah ditebak.'
};

const NASIB_AHLI_WARIS = { 
    1: { nama: "Gunung", arti: "Kehidupan yang mulia bagi ahli waris." },
    2: { nama: "Guntur", arti: "Ahli waris akan mendapatkan kesulitan." },
    3: { nama: "Segoro", arti: "Kemudahan dalam mencari rezeki." },
    0: { nama: "Asat", arti: "Kesulitan dalam mendapatkan rezeki." }
};

const PEMBAGI_5 = {
    1: { 
        nama: "Sri", 
        arti: "Murah rezeki dan hidup makmur.",
        aktivitas_baik: [
            "Memulai usaha dagang atau bisnis baru",
            "Menanam tanaman pangan (padi, palawija)",
            "Menyimpan uang atau investasi",
            "Membuka toko atau tempat usaha"
        ],
        saran: "Sangat baik untuk urusan finansial dan kelimpahan materi."
    },
    2: { 
        nama: "Lungguh", 
        arti: "Mendapatkan kedudukan, pangkat, atau kehormatan.",
        aktivitas_baik: [
            "Melamar pekerjaan atau kenaikan jabatan",
            "Pelantikan pengurus atau organisasi",
            "Pindah rumah baru",
            "Membangun pondasi rumah"
        ],
        saran: "Fokus pada pengembangan karier dan status sosial."
    },
    3: { 
        nama: "Gendhong", 
        arti: "Mapan secara lahiriah dan sangat dihargai masyarakat.",
        aktivitas_baik: [
            "Mengadakan pesta pernikahan",
            "Membeli kendaraan atau aset besar",
            "Menerima tamu penting",
            "Menjalin kerjasama (MoU) dengan pihak luar"
        ],
        saran: "Waktu yang tepat untuk memperkuat hubungan sosial dan aset."
    },
    4: { 
        nama: "Loro", 
        arti: "Sering menghadapi rintangan kesehatan atau ujian hidup.",
        aktivitas_baik: [
            "Berdoa dan meditasi (pendekatan diri pada Tuhan)",
            "Pengobatan atau cek kesehatan",
            "Membersihkan rumah (ruwat lingkungan)",
            "Bersedekah untuk menolak bala"
        ],
        saran: "Hindari memulai proyek besar; fokus pada pemulihan dan ketenangan."
    },
    0: { 
        nama: "Pati", 
        arti: "Banyak hambatan berat, perlu kehati-hatian ekstra.",
        aktivitas_baik: [
            "Introspeksi diri dan perencanaan matang",
            "Menyelesaikan hutang-piutang",
            "Kegiatan spiritual/keagamaan",
            "Puasa atau tirakat"
        ],
        saran: "Sangat disarankan untuk menunda keputusan krusial atau hajatan besar."
    }
    };

const DATA_BULAN_JAWA = [
    { nama: "Sura", status: "Tidak Baik", naas: [6, 11, 13, 14, 17, 18, 27], taliWangke: "Rabu Pahing" },
    { nama: "Sapar", status: "Tidak Baik", naas: [1, 10, 12, 20, 22], taliWangke: "Kamis Pon" },
    { nama: "Mulud", status: "Tidak Baik", naas: [1, 3, 8, 10, 13, 15, 20, 23], taliWangke: "Jumat Wage" },
    { nama: "Bakdamulud", status: "Baik", naas: [10, 15, 16, 20, 25, 28], taliWangke: "Sabtu Kliwon" },
    { nama: "Jumadilawal", status: "Tidak Baik", naas: [1, 5, 10, 11, 16, 26, 28], taliWangke: "Senin Kliwon" },
    { nama: "Jumadilakir", status: "Kurang Baik", naas: [4, 10, 11, 14, 18, 21], taliWangke: "Selasa Legi" },
    { nama: "Rejeb", status: "Tidak Baik", naas: [2, 11, 12, 13, 14, 18, 22, 27], taliWangke: "Rabu Pahing" },
    { nama: "Ruwah", status: "Baik", naas: [4, 12, 13, 19, 24, 26, 28], taliWangke: "Kamis Pon" },
    { nama: "Pasa", status: "Tidak Baik", naas: [7, 9, 10, 15, 20, 21, 24, 25], taliWangke: "Jumat Wage" },
    { nama: "Syawal", status: "Sangat Tidak Baik", naas: [2, 10, 17, 20, 27], taliWangke: "Sabtu Kliwon" },
    { nama: "Dulkaidah", status: "Cukup Baik", naas: [2, 6, 11, 12, 13, 21, 22, 24, 28], taliWangke: "Senin Kliwon" },
    { nama: "Besar", status: "Sangat Baik", naas: [1, 6, 10, 13, 20, 23, 25], taliWangke: "Selasa Wage" }
];

const DATA_SIKLUS_TAHUN = [
    { 
        nama: "Alip", 
        makna: "Ada-ada (Niat)", 
        deskripsi: "Melambangkan permulaan. Waktunya manusia mulai menanam niat, ide, atau tekad untuk melakukan sesuatu yang baik. Tahun ini merupakan awal dari siklus Windu, di mana semua dimulai dari niat yang tulus dan murni." 
    },
    { 
        nama: "Ehe", 
        makna: "Tumandang (Bekerja)", 
        deskripsi: "Melambangkan realisasi. Setelah ada niat di tahun Alip, tahun ini adalah waktunya mulai bergerak dan bertindak. Tahun Ehe mengajarkan tentang pentingnya aksi nyata dan kerja keras untuk mewujudkan apa yang telah diniatkan." 
    },
    { 
        nama: "Jimawal", 
        makna: "Gawe (Pekerjaan)", 
        deskripsi: "Melambangkan proses. Pekerjaan mulai terlihat bentuknya dan menuntut ketekunan untuk menyelesaikannya. Tahun ini adalah tahun pengembangan dan penyempurnaan dari apa yang telah dimulai sebelumnya." 
    },
    { 
        nama: "Je", 
        makna: "Lelakon (Peristiwa/Nasib)", 
        deskripsi: "Melambangkan ujian. Dalam proses bekerja, manusia pasti menemui cobaan atau dinamika hidup sebagai ujian mental. Tahun Je mengajarkan tentang kesabaran dan ketabahan dalam menghadapi tantangan hidup." 
    },
    { 
        nama: "Dal", 
        makna: "Urip (Hidup)", 
        deskripsi: "Melambangkan keberadaan. Tahun ini dianggap sakral (Tahun Duda). Waktunya merenungi hakikat hidup dan hubungan dengan Sang Pencipta. Tahun Dal adalah tahun spiritualitas dan pencarian makna hidup yang lebih dalam." 
    },
    { 
        nama: "Be", 
        makna: "Bola-bali (Kembali/Konsisten)", 
        deskripsi: "Melambangkan keteguhan. Mengajarkan manusia untuk tetap konsisten pada kebaikan meskipun sudah melalui berbagai ujian. Tahun Be adalah tahun evaluasi dan komitmen untuk tetap pada jalan yang benar." 
    },
    { 
        nama: "Wawu", 
        makna: "Marang (Arah/Tujuan)", 
        deskripsi: "Melambangkan fokus. Menjelang akhir siklus, manusia diingatkan untuk kembali focus pada tujuan akhir hidup agar tidak tersesat. Tahun Wawu adalah tahun penentuan arah dan prioritas hidup." 
    },
    { 
        nama: "Jimakir", 
        makna: "Suwung (Kosong/Selesai)", 
        deskripsi: "Melambangkan akhir dan evaluasi. Fase untuk melepaskan keterikatan duniawi dan mengevaluasi apa yang telah dilakukan. Tahun Jimakir adalah tahun penyelesaian dan persiapan untuk siklus baru." 
    }
];

const WINDU_LIST = ["Kuntara", "Sangara", "Sancaya", "Adi"];

// ==========================================
// DATA LENGKAP YANG DIBUTUHKAN
// ==========================================

const DB_IMLEK = {
     1940: { m: 2, d: 8, shio: "Naga" },
  1941: { m: 1, d: 27, shio: "Ular" },
  1942: { m: 2, d: 15, shio: "Kuda" },
  1943: { m: 2, d: 5, shio: "Kambing" },
  1944: { m: 1, d: 25, shio: "Monyet" },
  1945: { m: 2, d: 13, shio: "Ayam" },
  1946: { m: 2, d: 2, shio: "Anjing" },
  1947: { m: 1, d: 22, shio: "Babi" },
  1948: { m: 2, d: 10, shio: "Tikus" },
  1949: { m: 1, d: 29, shio: "Kerbau" },
  1950: { m: 2, d: 17, shio: "Macan" },
  1951: { m: 2, d: 6, shio: "Kelinci" },
  1952: { m: 1, d: 27, shio: "Naga" },
  1953: { m: 2, d: 14, shio: "Ular" },
  1954: { m: 2, d: 3, shio: "Kuda" },
  1955: { m: 1, d: 24, shio: "Kambing" },
  1956: { m: 2, d: 12, shio: "Monyet" },
  1957: { m: 1, d: 31, shio: "Ayam" },
  1958: { m: 2, d: 18, shio: "Anjing" },
  1959: { m: 2, d: 8, shio: "Babi" },
  1960: { m: 1, d: 28, shio: "Tikus" },
  1961: { m: 2, d: 15, shio: "Kerbau" },
  1962: { m: 2, d: 5, shio: "Macan" },
  1963: { m: 1, d: 25, shio: "Kelinci" },
  1964: { m: 2, d: 13, shio: "Naga" },
  1965: { m: 2, d: 2, shio: "Ular" },
  1966: { m: 1, d: 21, shio: "Kuda" },
  1967: { m: 2, d: 9, shio: "Kambing" },
  1968: { m: 1, d: 30, shio: "Monyet" },
  1969: { m: 2, d: 17, shio: "Ayam" },
  1970: { m: 2, d: 6, shio: "Anjing" },
  1971: { m: 1, d: 27, shio: "Babi" },
  1972: { m: 2, d: 15, shio: "Tikus" },
  1973: { m: 2, d: 3, shio: "Kerbau" },
  1974: { m: 1, d: 23, shio: "Macan" },
  1975: { m: 2, d: 11, shio: "Kelinci" },
  1976: { m: 1, d: 31, shio: "Naga" },
  1977: { m: 2, d: 18, shio: "Ular" },
  1978: { m: 2, d: 7, shio: "Kuda" },
  1979: { m: 1, d: 28, shio: "Kambing" },
  1980: { m: 2, d: 16, shio: "Monyet" },
  1981: { m: 2, d: 5, shio: "Ayam" },
  1982: { m: 1, d: 25, shio: "Anjing" },
  1983: { m: 2, d: 13, shio: "Babi" },
  1984: { m: 2, d: 2, shio: "Tikus" },
  1985: { m: 2, d: 20, shio: "Kerbau" },
  1986: { m: 2, d: 9, shio: "Macan" },
  1987: { m: 1, d: 29, shio: "Kelinci" },
  1988: { m: 2, d: 17, shio: "Naga" },
  1989: { m: 2, d: 6, shio: "Ular" },
  1990: { m: 1, d: 27, shio: "Kuda" },
  1991: { m: 2, d: 15, shio: "Kambing" },
  1992: { m: 2, d: 4, shio: "Monyet" },
  1993: { m: 1, d: 23, shio: "Ayam" },
  1994: { m: 2, d: 10, shio: "Anjing" },
  1995: { m: 1, d: 31, shio: "Babi" },
  1996: { m: 2, d: 19, shio: "Tikus" },
  1997: { m: 2, d: 7, shio: "Kerbau" },
  1998: { m: 1, d: 28, shio: "Macan" },
  1999: { m: 2, d: 16, shio: "Kelinci" },
  2000: { m: 2, d: 5, shio: "Naga" },
  2001: { m: 1, d: 24, shio: "Ular" },
  2002: { m: 2, d: 12, shio: "Kuda" },
  2003: { m: 2, d: 1, shio: "Kambing" },
  2004: { m: 1, d: 22, shio: "Monyet" },
  2005: { m: 2, d: 9, shio: "Ayam" },
  2006: { m: 1, d: 29, shio: "Anjing" },
  2007: { m: 2, d: 18, shio: "Babi" },
  2008: { m: 2, d: 7, shio: "Tikus" },
  2009: { m: 1, d: 26, shio: "Kerbau" },
  2010: { m: 2, d: 14, shio: "Macan" },
  2011: { m: 2, d: 3, shio: "Kelinci" },
  2012: { m: 1, d: 23, shio: "Naga" },
  2013: { m: 2, d: 10, shio: "Ular" },
  2014: { m: 1, d: 31, shio: "Kuda" },
  2015: { m: 2, d: 19, shio: "Kambing" },
  2016: { m: 2, d: 8, shio: "Monyet" },
  2017: { m: 1, d: 28, shio: "Ayam" },
  2018: { m: 2, d: 16, shio: "Anjing" },
  2019: { m: 2, d: 5, shio: "Babi" },
    2020: { m: 1, d: 25, shio: "Tikus" },
    2021: { m: 2, d: 12, shio: "Kerbau" },
    2022: { m: 2, d: 1, shio: "Macan" },
    2023: { m: 1, d: 22, shio: "Kelinci" },
    2024: { m: 2, d: 10, shio: "Naga" },
    2025: { m: 1, d: 29, shio: "Ular" },
    2026: { m: 2, d: 17, shio: "Kuda" },
    2027: { m: 2, d: 6, shio: "Kambing" },
    2028: { m: 1, d: 26, shio: "Monyet" },
    2029: { m: 2, d: 13, shio: "Ayam" },
    2030: { m: 2, d: 3, shio: "Anjing" }
};

// DATA PRANATA MANGSA LENGKAP
const DATA_MANGSA = {
    1: { 
        nama: "Kasa (Kartika)", 
        deskripsi: "Mangsa Kasa berlangsung sekitar 41 hari, biasanya dimulai tanggal 22 Juni dan berakhir 1 Agustus. Pada mangsa ini, pohon randu, mangga, dan dadap mulai berbunga. Tanaman padi mulai menghijau, daun jati mulai gugur, hujan mulai jarang turun, dan udara terasa kering. Burung-burung mulai membuat sarang. Musim ini ditandai dengan angin berhembus dari timur dan selatan." 
    },
    2: { 
        nama: "Karo", 
        deskripsi: "Mangsa Karo berlangsung sekitar 23 hari, dari tanggal 2 Agustus hingga 24 Agustus. Pada mangsa ini, pohon asem mulai berdaun muda, padi mulai berbunga, burung manyar mulai bersarang, ulat mulai banyak terlihat, dan buah-buahan mulai masak. Angin bertiup dari arah timur." 
    },
    3: { 
        nama: "Katelu (Katiga)", 
        deskripsi: "Mangsa Katelu berlangsung sekitar 24 hari, dari tanggal 25 Agustus hingga 17 September. Pada mangsa ini, pohon dadap mulai meranggas, buah lerak mulai masak, belalang mulai menetas, dan ular mulai banyak terlihat. Angin bertiup dari arah utara." 
    },
    4: { 
        nama: "Kapat", 
        deskripsi: "Mangsa Kapat berlangsung sekitar 25 hari, dari tanggal 18 September hingga 12 Oktober. Pada mangsa ini, bunga kenanga mulai bermekaran, burung-burung kecil mulai menetas, padi mulai menguning, dan buah kapuk mulai masak. Musim ini juga dikenal sebagai musim buah-buahan. Angin bertiup dari arah barat." 
    },
    5: { 
        nama: "Kalima", 
        deskripsi: "Mangsa Kalima berlangsung sekitar 27 hari, dari tanggal 13 Oktober hingga 8 November. Pada mangsa ini, pohon randu mulai meluruhkan daunnya, bunga cempaka bermekaran, padi mulai dipanen, dan musim hujan mulai datang. Angin bertiup dari arah barat daya." 
    },
    6: { 
        nama: "Kanem", 
        deskripsi: "Mangsa Kanem berlangsung sekitar 43 hari, dari tanggal 9 November hingga 21 Desember. Pada mangsa ini, hujan mulai turun dengan derasnya, pohon kapuk mulai berbunga, padi gadis mulai ditanam, dan udara mulai dingin. Ini adalah puncak musim penghujan. Angin bertiup dari arah barat laut." 
    },
    7: { 
        nama: "Kapitu", 
        deskripsi: "Mangsa Kapitu berlangsung sekitar 43 hari, dari tanggal 22 Desember hingga 2 Februari. Pada mangsa ini, banyak sungai yang meluap, pohon mangga mulai berbunga, cengkeh mulai dipetik, dan hujan masih sering turun. Angin bertiup dari arah barat dan utara." 
    },
    8: { 
        nama: "Kawolu", 
        deskripsi: "Mangsa Kawolu berlangsung sekitar 27 hari, dari tanggal 3 Februari hingga 28 Februari. Pada mangsa ini, pohon kapuk mulai gugur daunnya, cengkeh mulai banyak dipetik, padi mulai ditanam di sawah, dan hujan mulai berkurang. Angin bertiup dari arah timur laut." 
    },
    9: { 
        nama: "Kasanga", 
        deskripsi: "Mangsa Kasanga berlangsung sekitar 25 hari, dari tanggal 1 Maret hingga 25 Maret. Pada mangsa ini, pohon asem mulai berbunga, burung manyar mulai bersarang di pohon yang tinggi, dan angin mulai bertiup kencang. Musim ini dikenal sebagai musim angin ribut. Angin bertiup dari arah timur." 
    },
    10: { 
        nama: "Kasadasa", 
        deskripsi: "Mangsa Kasadasa berlangsung sekitar 24 hari, dari tanggal 26 Maret hingga 18 April. Pada mangsa ini, pohon randu mulai berdaun, ulat mulai banyak terlihat, dan buah-buahan mulai masak. Musim panas mulai terasa. Angin bertiup dari arah selatan." 
    },
    11: { 
        nama: "Dhesta", 
        deskripsi: "Mangsa Dhesta berlangsung sekitar 23 hari, dari tanggal 19 April hingga 11 Mei. Pada mangsa ini, pohon mangga mulai berbuah, padi di sawah mulai tinggi, dan udara terasa panas. Musim kemarau mulai terasa. Angin bertiup dari arah tenggara." 
    },
    12: { 
        nama: "Sadha", 
        deskripsi: "Mangsa Sadha berlangsung sekitar 41 hari, dari tanggal 12 Mei hingga 21 Juni. Pada mangsa ini, pohon jati mulai berdaun, padi mulai menguning, dan buah kapuk mulai merekah. Ini adalah puncak musim kemarau. Angin bertiup dari arah timur." 
    }
};

// DATA WATAK NEPTU LENGKAP
const DATA_WATAK_NEPTU = {
    5: { 
        watak: "Watak Pendiam: Orang dengan neptu 5 cenderung pendiam, tetapi memiliki pemikiran yang dalam. Mereka adalah pemikir yang analitis dan sering kali menjadi penengah dalam konflik. Dalam pekerjaan, mereka teliti dan hati-hati. Hubungan sosial mereka terbatas tetapi berkualitas. Kelemahan: Terkadang terlalu tertutup dan sulit mengungkapkan perasaan." 
    },
    6: { 
        watak: "Watak Cerdik: Orang dengan neptu 6 memiliki kecerdasan di atas rata-rata dan kemampuan analisis yang tajam. Mereka pandai dalam strategi dan perencanaan. Dalam bisnis, mereka cenderung sukses karena perhitungan yang matang. Sosial: Mudah bergaul tetapi selektif. Kelemahan: Terkadang terlalu kritis terhadap orang lain." 
    },
    7: { 
        watak: "Watak Misterius: Orang dengan neptu 7 memiliki aura misterius dan sering kali menarik perhatian. Mereka memiliki sisi spiritual yang kuat dan intuisi yang tajam. Dalam kehidupan, mereka sering mengalami hal-hal yang tidak terduga. Bakat: Memiliki kemampuan seni atau metafisika. Kelemahan: Mudah terjebak dalam pikiran sendiri." 
    },
    8: { 
        watak: "Watak Sukses Materi: Orang dengan neptu 8 memiliki bakat dalam hal materi dan finansial. Mereka adalah pengusaha yang handal dan investor yang cerdas. Kehidupan mereka cenderung mapan dan stabil. Sosial: Dihormati karena kesuksesan mereka. Kelemahan: Terkadang terlalu materialistis." 
    },
    9: { 
        watak: "Watak Bijaksana: Orang dengan neptu 9 adalah orang yang bijaksana dan sering dimintai nasihat. Mereka memiliki kharisma alami dan dihormati di masyarakat. Dalam kepemimpinan, mereka adil dan bijaksana. Spiritual: Memiliki pemahaman spiritual yang dalam. Kelemahan: Terkadang terlalu idealis." 
    },
    10: { 
        watak: "Watak Pemimpin: Orang dengan neptu 10 adalah pemimpin alami. Mereka memiliki keberanian dan tanggung jawab yang besar. Dalam organisasi, mereka sering menjadi penentu kebijakan. Karir: Cenderung menduduki posisi pimpinan. Kelemahan: Terkadang terlalu dominan." 
    },
    11: { 
        watak: "Watak Kreatif: Orang dengan neptu 11 memiliki kreativitas yang tinggi dan inovasi yang luar biasa. Mereka adalah pionir dalam bidang mereka. Seni dan teknologi adalah bidang yang cocok untuk mereka. Sosial: Populer karena ide-ide brilian mereka. Kelemahan: Terkadang tidak praktis." 
    },
    12: { 
        watak: "Watak Setia: Orang dengan neptu 12 sangat setia dan bertanggung jawab. Mereka adalah teman dan partner yang dapat diandalkan. Dalam hubungan, mereka komitmen tinggi. Pekerjaan: Dapat diandalkan dan konsisten. Kelemahan: Terkadang terlalu kaku." 
    },
    13: { 
        watak: "Watak Transformator: Orang dengan neptu 13 adalah agen perubahan. Mereka memiliki kemampuan untuk mengubah situasi sulit menjadi peluang. Kehidupan mereka penuh dengan transformasi. Spiritual: Memahami siklus kehidupan dan kematian. Kelemahan: Rentan terhadap perubahan mood." 
    },
    14: { 
        watak: "Watak Pekerja Keras: Orang dengan neptu 14 adalah pekerja keras yang pantang menyerah. Mereka mencapai kesuksesan melalui usaha dan ketekunan. Fisik: Kuat dan tahan banting. Sosial: Dihormati karena kerja keras mereka. Kelemahan: Terkadang lupa waktu istirahat." 
    },
    15: { 
        watak: "Watak Humanis: Orang dengan neptu 15 sangat peduli pada sesama. Mereka adalah filantropis dan aktivis sosial. Kehidupan mereka diabdikan untuk membantu orang lain. Empati: Sangat tinggi terhadap penderitaan orang lain. Kelemahan: Terkadang mengabaikan diri sendiri." 
    },
    16: { 
        watak: "Watak Visioner: Orang dengan neptu 16 memiliki visi jauh ke depan. Mereka adalah perencana strategis yang hebat. Masa depan: Selalu mempersiapkan masa depan dengan matang. Inovasi: Selalu mencari cara baru. Kelemahan: Terkadang kurang realistis." 
    },
    17: { 
        watak: "Watak Petualang: Orang dengan neptu 17 memiliki jiwa petualang yang kuat. Mereka menyukai tantangan dan hal baru. Perjalanan: Sering melakukan perjalanan jauh. Adaptasi: Cepat beradaptasi dengan lingkungan baru. Kelemahan: Terkadang tidak stabil." 
    },
    18: { 
        watak: "Watak Filosofis: Orang dengan neptu 18 adalah pemikir filosofis yang mendalam. Mereka sering merenungkan makna kehidupan. Kebijaksanaan: Memiliki pemahaman hidup yang dalam. Spiritual: Mendekati kehidupan dengan pandangan spiritual. Kelemahan: Terkadang terlalu kontemplatif." 
    }
};

// ==========================================
// DATA WUKU EKSTERNAL
// ==========================================
let DATA_WUKU = {}; // Akan diisi dari file eksternal

// DATA SRI JATI LENGKAP
const TABEL_SRIJATI = {
    5: [
        { usia: "0-8 tahun", nilai: 4, fase: "Masa Kanak-kanak" },
        { usia: "9-16 tahun", nilai: 6, fase: "Masa Remaja" },
        { usia: "17-24 tahun", nilai: 7, fase: "Masa Awal Dewasa" },
        { usia: "25-32 tahun", nilai: 8, fase: "Masa Produktif" },
        { usia: "33-40 tahun", nilai: 9, fase: "Puncak Karir" },
        { usia: "41-48 tahun", nilai: 7, fase: "Masa Stabil" },
        { usia: "49-56 tahun", nilai: 6, fase: "Masa Persiapan Pensiun" },
        { usia: "57-64 tahun", nilai: 5, fase: "Masa Pensiun" }
    ],
    6: [
        { usia: "0-8 tahun", nilai: 3, fase: "Masa Kanak-kanak" },
        { usia: "9-16 tahun", nilai: 5, fase: "Masa Remaja" },
        { usia: "17-24 tahun", nilai: 6, fase: "Masa Awal Dewasa" },
        { usia: "25-32 tahun", nilai: 7, fase: "Masa Produktif" },
        { usia: "33-40 tahun", nilai: 8, fase: "Puncak Karir" },
        { usia: "41-48 tahun", nilai: 9, fase: "Masa Keemasan" },
        { usia: "49-56 tahun", nilai: 7, fase: "Masa Stabil" },
        { usia: "57-64 tahun", nilai: 6, fase: "Masa Pensiun" }
    ],
    7: [
       { usia: "0-6 tahun", nilai: 4, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 1, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 4, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 1, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 0, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 2, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
      
    ],
    8: [
        { usia: "0-6 tahun", nilai: 4, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 1, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 0, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 1, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 0, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 3, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 7, fase: "Masa Persiapan Pensiun" },
    ],
    9: [
        { usia: "0-6 tahun", nilai: 2, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 5, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 1, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 0, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 4, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 1, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
    ],
    10: [
       { usia: "0-6 tahun", nilai: 1, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 0, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 4, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 1, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 1, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 3, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    ],
    11: [
        { usia: "0-6 tahun", nilai: 2, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 4, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 1, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 1, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 8, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 1, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
    { usia: "61-66 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
    ],
    12: [
        { usia: "0-6 tahun", nilai: 0, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 5, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 1, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 0, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 4, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 0, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    { usia: "61-66 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    { usia: "67-72 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
    ],
    13: [
        { usia: "0-6 tahun", nilai: 3, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 1, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 0, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 5, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 0, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 1, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 5, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
    { usia: "61-66 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
    { usia: "67-72 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
     { usia: "73-78 tahun", nilai: 5, fase: "Masa Persiapan Pensiun" },
    ],
    14: [
        { usia: "0-6 tahun", nilai: 1, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 0, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 1, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 4, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 0, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 0, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    { usia: "61-66 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
    { usia: "67-72 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
     { usia: "73-78 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
     { usia: "79-84 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    ],
    15: [
       { usia: "0-6 tahun", nilai: 2, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 0, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 1, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 1, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 5, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 2, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 5, fase: "Masa Persiapan Pensiun" },
    { usia: "61-66 tahun", nilai: 5, fase: "Masa Persiapan Pensiun" },
    { usia: "67-72 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
     { usia: "73-78 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
     { usia: "79-84 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
     { usia: "85-90 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
    ],
    16: [
       { usia: "0-6 tahun", nilai: 0, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 3, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 1, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 2, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 0, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 1, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 8, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 7, fase: "Masa Persiapan Pensiun" },
    { usia: "61-66 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
    { usia: "67-72 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
     { usia: "73-78 tahun", nilai: 7, fase: "Masa Persiapan Pensiun" },
     { usia: "79-84 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
     { usia: "85-90 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
     { usia: "91-96 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
    ],
    17: [
        { usia: "0-6 tahun", nilai: 1, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 1, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 0, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 5, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 0, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 1, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 5, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
    { usia: "61-66 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
    { usia: "67-72 tahun", nilai: 2, fase: "Masa Persiapan Pensiun" },
     { usia: "73-78 tahun", nilai: 5, fase: "Masa Persiapan Pensiun" },
     { usia: "79-84 tahun", nilai: 5, fase: "Masa Persiapan Pensiun" },
     { usia: "85-90 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
     { usia: "91-96 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
     { usia: "97-102 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    ],
    18: [
       { usia: "0-6 tahun", nilai: 2, fase: "Masa Kanak-kanak" },
        { usia: "7-12 tahun", nilai: 5, fase: "Masa Remaja" },
        { usia: "13-18 tahun", nilai: 1, fase: "Masa Awal Dewasa" },
        { usia: "19-24 tahun", nilai: 0, fase: "Masa Produktif" },
        { usia: "25-30 tahun", nilai: 4, fase: "Puncak Karir" },
        { usia: "31-36 tahun", nilai: 1, fase: "Masa Stabil" },
        { usia: "37-42 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
      { usia: "43-48 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
       { usia: "49-54 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
    { usia: "55-60 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    { usia: "61-66 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
    { usia: "67-72 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
     { usia: "73-78 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
     { usia: "79-84 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
     { usia: "85-90 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
     { usia: "91-96 tahun", nilai: 4, fase: "Masa Persiapan Pensiun" },
     { usia: "97-102 tahun", nilai: 0, fase: "Masa Persiapan Pensiun" },
      { usia: "103-108 tahun", nilai: 1, fase: "Masa Persiapan Pensiun" },
    ]
};

const SRI_JATI_DESC = {
    1: "Masa sangat sulit, banyak tantangan dan rintangan. Perlu kesabaran dan ketekunan ekstra.",
    2: "Masa sulit, tetapi ada sedikit kemajuan. Tetap perlu kerja keras dan tidak mudah menyerah.",
    3: "Masa stabil dengan tantangan yang wajar. Mulai ada perkembangan meski perlahan.",
    4: "Masa mulai membaik dengan perkembangan yang nyata. Peluang mulai terbuka.",
    5: "Masa cukup baik dengan rejeki yang stabil. Kehidupan mulai nyaman.",
    6: "Masa baik dengan perkembangan karir dan finansial. Banyak peluang yang terbuka.",
    7: "Masa sangat baik dengan keberuntungan finansial. Waktu yang tepat untuk investasi.",
    8: "Masa keemasan dengan sukses dalam bisnis dan karir. Puncak prestasi.",
    9: "Masa puncak kesuksesan dengan segala keberlimpahan. Waktu terbaik dalam hidup."
};

let current = new Date();
const TODAY = new Date();

// ==========================================
// FUNGSI LOGIKA DASAR
// ==========================================

function getPasaran(date) {
    const base = new Date(1900, 0, 1);
    const diff = Math.floor((date.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    return PASARAN[(((diff + 1) % 5) + 5) % 5];
}

function getZodiak(date) {
    const d = date.getDate(); const m = date.getMonth() + 1;
    if ((m == 3 && d >= 21) || (m == 4 && d <= 19)) return "Aries";
    if ((m == 4 && d >= 20) || (m == 5 && d <= 20)) return "Taurus";
    if ((m == 5 && d >= 21) || (m == 6 && d <= 20)) return "Gemini";
    if ((m == 6 && d >= 21) || (m == 7 && d <= 22)) return "Cancer";
    if ((m == 7 && d >= 23) || (m == 8 && d <= 22)) return "Leo";
    if ((m == 8 && d >= 23) || (m == 9 && d <= 22)) return "Virgo";
    if ((m == 9 && d >= 23) || (m == 10 && d <= 22)) return "Libra";
    if ((m == 10 && d >= 23) || (m == 11 && d <= 21)) return "Scorpio";
    if ((m == 11 && d >= 22) || (m == 12 && d <= 21)) return "Sagittarius";
    if ((m == 12 && d >= 22) || (m == 1 && d <= 19)) return "Capricorn";
    if ((m == 1 && d >= 20) || (m == 2 && d <= 18)) return "Aquarius";
    return "Pisces";
}

function getLunarShio(date) {
    try {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        
        let imlekM, imlekD, shioTahunIni;
        
        if (DB_IMLEK && DB_IMLEK[y]) {
            imlekM = DB_IMLEK[y].m;
            imlekD = DB_IMLEK[y].d;
            shioTahunIni = DB_IMLEK[y].shio;
        } else {
            const shios = ["Monyet", "Ayam", "Anjing", "Babi", "Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing"];
            shioTahunIni = shios[y % 12];
            imlekM = 2; imlekD = 5;
        }

        const tglImlek = new Date(y, imlekM - 1, imlekD);
        const isSudahImlek = date >= tglImlek;

        const diffTime = Math.abs(date - tglImlek);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let lunarDay = isSudahImlek ? (diffDays % 30) + 1 : 30 - (diffDays % 30);
        if (lunarDay < 1) lunarDay = 1;
        if (lunarDay > 30) lunarDay = 30;
        
        let shioFinal = isSudahImlek ? shioTahunIni : 
                       (DB_IMLEK && DB_IMLEK[y-1] ? DB_IMLEK[y-1].shio : shioTahunIni);

        return {
            full: `${lunarDay} - ${isSudahImlek ? Math.floor(diffDays/30)+1 : 12} - ${y + 551}`,
            shio: shioFinal,
            ramalan: "Gunakan energi hari ini dengan bijaksana."
        };
    } catch (error) {
        console.error("Error in getLunarShio:", error);
        return {
            full: "1 - 1 - 2575",
            shio: "Tikus",
            ramalan: "Data lunar sedang diproses."
        };
    }
}

function getWuku(date) {
    const wukuList = ["Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit", "Wariagung", "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir", "Mandasiya", "Julungpujut", "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala", "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"];
    const refDate = new Date(2026, 0, 25); 
    const diffDays = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    let wukuIndex = (20 + Math.floor(diffDays / 7)) % 30;
    while (wukuIndex < 0) wukuIndex += 30;
    return wukuList[wukuIndex];
}

function getTanggalJawa(date) {
    const refDate = new Date(2026, 0, 28); 
    const refTglJawa = 9;
    const refBulanIdx = 7; 
    const refTahunJawa = 1959;
    const diffDays = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    let totalHariJawa = refTglJawa + diffDays;
    let bulanIdx = refBulanIdx;
    let tahunJawa = refTahunJawa;
    let tglJawa = totalHariJawa;
    while (tglJawa > 30) { tglJawa -= 30; bulanIdx = (bulanIdx + 1) % 12; if (bulanIdx === 0) tahunJawa++; }
    while (tglJawa <= 0) { tglJawa += 30; bulanIdx = (bulanIdx - 1 + 12) % 12; if (bulanIdx === 11) tahunJawa--; }
    return { tanggal: tglJawa, bulan: DATA_BULAN_JAWA[bulanIdx], tahun: tahunJawa };
}

function getSiklusBesar(tahunJawa) {
    // Referensi: 1959 AJ (2026 Masehi) adalah Tahun DAL
    const REF_TAHUN_JAWA = 1959; 
    const REF_TAHUN_IDX = 4; // Indeks 4 adalah DAL dalam DATA_SIKLUS_TAHUN
    const REF_WINDU_IDX = 2; // Sancaya

    const diffYears = tahunJawa - REF_TAHUN_JAWA;

    let tahunIdx = (REF_TAHUN_IDX + diffYears) % 8;
    while (tahunIdx < 0) tahunIdx += 8;

    let winduIdx = (REF_WINDU_IDX + Math.floor(diffYears / 8)) % 4;
    while (winduIdx < 0) winduIdx += 4;

    return {
        tahun: DATA_SIKLUS_TAHUN[tahunIdx],
        windu: WINDU_LIST[winduIdx]
    };
}

function getMangsaInfo(date) {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    let id = 12; 
    if ((d >= 22 && m == 6) || (m == 7) || (d <= 1 && m == 8)) id = 1;
    else if (d >= 2 && m == 8 && d <= 25) id = 2;
    else if ((d >= 26 && m == 8) || (d <= 18 && m == 9)) id = 3;
    else if ((d >= 19 && m == 9) || (d <= 13 && m == 10)) id = 4;
    else if ((d >= 14 && m == 10) || (d <= 9 && m == 11)) id = 5;
    else if ((d >= 10 && m == 11) || (d <= 22 && m == 12)) id = 6;
    else if ((d >= 23 && m == 12) || (m == 1) || (d <= 3 && m == 2)) id = 7;
    else if (m == 2 && d >= 4) id = 8;
    else if (m == 3 && d <= 26) id = 9;
    else if ((d >= 27 && m == 3) || (d <= 19 && m == 4)) id = 10;
    else if ((d >= 20 && m == 4) || (d <= 12 && m == 5)) id = 11;
    return DATA_MANGSA[id] || { nama: "Tidak Diketahui", deskripsi: "Data mangsa tidak tersedia" };
}

function getArahMeditasi(neptu) {
    const map = {
        7: "Kulon - Barat", 8: "Lor - Utara", 9: "Wetan - Timur", 10: "Kidul - Selatan",
        11: "Kulon - Barat", 12: "Lor - Utara", 13: "Wetan - Timur", 14: "Kidul - Selatan",
        15: "Kulon - Barat", 16: "Lor - Utara", 17: "Wetan - Timur", 18: "Kidul - Selatan"
    };
    return map[neptu] || "Pusat";
}

function hitungUsiaLengkap(birthDate) {
    let now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    if (days < 0) {
        months--;
        let lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return `${years} Tahun, ${months} Bulan, ${days} Hari`;
}

// ==========================================
// SISTEM LOAD DATA WUKU DARI EKSTERNAL
// ==========================================

// Fungsi untuk memuat data wuku dari file eksternal
function loadWukuData() {
    return new Promise((resolve, reject) => {
        // Cek apakah data sudah ada di window (jika file sudah dimuat sebelumnya)
        if (window.DATA_WUKU && Object.keys(window.DATA_WUKU).length > 0) {
            DATA_WUKU = window.DATA_WUKU;
            console.log('Data Wuku ditemukan di window.DATA_WUKU');
            resolve(DATA_WUKU);
            return;
        }
        
        // Jika belum ada, load file eksternal
        const script = document.createElement('script');
        script.src = 'data-wuku.js?v=' + Date.now(); // Cache buster
        script.onload = function() {
            if (window.DATA_WUKU) {
                DATA_WUKU = window.DATA_WUKU;
                console.log('Data Wuku berhasil dimuat dari file eksternal:', Object.keys(DATA_WUKU).length, 'wuku');
                resolve(DATA_WUKU);
            } else {
                console.error('Data Wuku tidak ditemukan setelah script dimuat');
                reject(new Error('Data Wuku tidak ditemukan'));
            }
        };
        script.onerror = function() {
            console.error('Gagal memuat file data-wuku.js');
            reject(new Error('Gagal memuat file data-wuku.js'));
        };
        
        document.head.appendChild(script);
    });
}

// ==========================================
// MODAL TOKEN YANG DIPERBAIKI
// ==========================================

function showTokenModal() {
    // Hapus modal yang sudah ada jika ada
    const existingModal = document.getElementById('tokenModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div id="tokenModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <h2 style="color: #D30000; margin-top: 0;">🔑 Akses Premium Kalender Jawa</h2>
                <p>Untuk mengakses fitur lengkap, masukkan token atau hubungi admin.</p>
                
                <div style="background: #f0f7ff; padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <h3 style="margin-top: 0;">📦 Pilihan Paket:</h3>
                    <ul style="padding-left: 20px;">
                        <li><strong>💰 1 Bulan</strong> - Rp 25.000</li>
                        <li><strong>💰 3 Bulan</strong> - Rp 60.000 (Hemat Rp 15.000)</li>
                        <li><strong>💰 1 Tahun</strong> - Rp 220.000 (Hemat Rp 80.000)</li>
                       
                    </ul>
                </div>
                
                <input type="text" 
                       id="tokenInput" 
                       placeholder="Masukkan token Anda" 
                       style="
                           width: 100%;
                           padding: 12px;
                           margin: 15px 0;
                           border: 2px solid #ddd;
                           border-radius: 8px;
                           font-size: 16px;
                       ">
                
                <div style="display: flex; gap: 10px; margin: 20px 0;">
                    <button onclick="submitToken()" style="
                        flex: 1;
                        background: #D30000;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                    ">✅ Submit Token</button>
                    
                    <button onclick="closeTokenModal()" style="
                        flex: 1;
                        background: #666;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                    ">❌ Batal</button>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 5px solid #ffc107;">
                    <h4 style="margin-top: 0;">📞 Hubungi Admin untuk Token:</h4>
                    <p>WhatsApp: <a href="https://wa.me/6285117021168?text=Halo%20admin,%20saya%20ingin%20membeli%20token%20Kalender%20Jawa" 
                                   target="_blank" 
                                   style="color: #25D366; font-weight: bold;">
                        0851-1702-1168
                    </a></p>
                    <p style="font-size: 0.9em; color: #666; margin-bottom: 0;">
                        
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('tokenInput').focus();
}

function closeTokenModal() {
    const modal = document.getElementById('tokenModal');
    if (modal) {
        modal.remove();
    }
}

function submitToken() {
    const tokenInput = document.getElementById('tokenInput');
    if (!tokenInput) return;
    
    const token = tokenInput.value.trim().toUpperCase();
    
    if (!token) {
        alert("Silakan masukkan token!");
        return;
    }
    
    if (checkTokenLogic(token)) {
        localStorage.setItem('kalender_token_tius', token);
        
        // Get package info
        const tokenData = DAFTAR_TOKEN_AKTIF[token];
        let message = "✅ Token berhasil diaktifkan!";
        if (tokenData) {
            message += `\nPaket: ${tokenData.package}`;
            message += `\nBerlaku hingga: ${tokenData.expiry}`;
        }
        
        alert(message);
        closeTokenModal();
        location.reload(); // Reload untuk update UI
    } else {
        alert("❌ Token tidak valid atau sudah expired!\n\nSilakan hubungi admin untuk token baru.");
    }
}

// ==========================================
// LOGIKA TOKEN
// ==========================================

function checkTokenLogic(token) {
    if (!token) return false;

    const tokenData = DAFTAR_TOKEN_AKTIF[token];
    
    if (!tokenData) {
        // Refresh token database jika token tidak ditemukan
        const refreshedTokens = loadTokenDatabase();
        if (refreshedTokens[token]) {
            // Update DAFTAR_TOKEN_AKTIF dengan token baru
            DAFTAR_TOKEN_AKTIF[token] = refreshedTokens[token];
            return checkTokenLogic(token); // Cek ulang
        }
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(tokenData.expiry);

    return today <= expiryDate; // Token masih berlaku
}

// ==========================================
// FITUR CARI TANGGAL (TAMBAHAN BARU)
// ==========================================

function initDateSearch() {
    // Set nilai default input tanggal ke hari ini
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const searchInput = document.getElementById('dateSearchInput');
    if (searchInput) {
        searchInput.value = todayStr;
        
        // REVISI: Bulan Desember adalah index 11
        // Gunakan format YYYY-MM-DD secara manual agar lebih aman dari masalah timezone ISO
        searchInput.max = "2100-12-31"; 
        searchInput.min = "1900-01-01";
    }
    
    // Set event listener untuk tombol cari
    const searchBtn = document.getElementById('searchDateBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchDate);
    }
    
    // Set event listener untuk Enter di input
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDate();
            }
        });
    }
    
    console.log('Fitur Cari Tanggal telah diinisialisasi hingga tahun 2100');
}

function searchDate() {
    const searchInput = document.getElementById('dateSearchInput');
    if (!searchInput || !searchInput.value) {
        alert("Silakan pilih tanggal terlebih dahulu!");
        return;
    }
    
    const selectedDate = new Date(searchInput.value + 'T00:00:00');
    if (isNaN(selectedDate.getTime())) {
        alert("Tanggal yang dimasukkan tidak valid!");
        return;
    }
    
    // Set calendar ke bulan yang dicari
    current = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    generateCalendar();
    
    // Highlight tanggal yang dicari
    highlightSearchedDate(selectedDate);
    
    // Tampilkan detail jika token valid
    const savedToken = localStorage.getItem('kalender_token_tius');
    if (savedToken && checkTokenLogic(savedToken)) {
        updateDetail(selectedDate, getPasaran(selectedDate));
    } else {
        showTokenModal();
    }
    
    // Scroll ke detail section
    const detailSection = document.getElementById('detail');
    if (detailSection) {
        detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function highlightSearchedDate(date) {
    // Hapus highlight sebelumnya
    document.querySelectorAll('.calendar-day').forEach(cell => {
        cell.classList.remove('searched-date');
    });
    
    // Highlight tanggal yang dicari
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    
    // Cari cell yang sesuai dengan tanggal yang dicari
    const cells = document.querySelectorAll('.calendar-day');
    cells.forEach(cell => {
        const cellDateNum = parseInt(cell.querySelector('.date-num')?.textContent);
        if (cellDateNum === d && 
            current.getFullYear() === y && 
            current.getMonth() === m) {
            cell.classList.add('searched-date');
            
            // Tambahkan indikator visual
            const indicator = document.createElement('div');
            indicator.className = 'search-indicator';
            indicator.innerHTML = '🔍';
            indicator.style.cssText = `
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: 10px;
                background: #D30000;
                color: white;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            cell.style.position = 'relative';
            cell.appendChild(indicator);
        }
    });
}

// ==========================================
// RENDER KALENDER (DIMODIFIKASI UNTUK SUPPORT SEARCH)
// ==========================================

function generateCalendar() {
    const grid = document.getElementById('calendar');
    const mNav = document.getElementById('monthYearNav');
    if (!grid) return;
    
    grid.innerHTML = '';
    const y = current.getFullYear();
    const m = current.getMonth();
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    mNav.innerText = `${namaBulan[m]} ${y}`;

    // Header hari
    HARI.forEach((h, i) => {
        const el = document.createElement('div');
        el.innerText = h.substring(0, 3);
        el.className = 'header-day' + (i === 0 ? ' sunday-red' : '');
        grid.appendChild(el);
    });

    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(y, m, d);
        const p = getPasaran(dateObj);
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        
        if (dateObj.getDay() === 0) cell.classList.add('sunday-red');
        if (dateObj.toDateString() === TODAY.toDateString()) cell.classList.add('today-highlight');
        
        cell.innerHTML = `<div class="date-num">${d}</div><div class="pasaran-text">${p}</div>`;
        
        cell.onclick = () => {
            const savedToken = localStorage.getItem('kalender_token_tius');
            
            if (savedToken && checkTokenLogic(savedToken)) {
                // Update input search dengan tanggal yang dipilih
                const searchInput = document.getElementById('dateSearchInput');
                if (searchInput) {
                    const selectedDateStr = dateObj.toISOString().split('T')[0];
                    searchInput.value = selectedDateStr;
                }
                
                document.querySelectorAll('.calendar-day').forEach(c => c.classList.remove('selected-day'));
                cell.classList.add('selected-day');
                updateDetail(dateObj, p);
            } else {
                showTokenModal();
            }
        };
        grid.appendChild(cell);
    }
    
    // Setelah render, cek apakah ada tanggal yang sedang dicari
    const searchInput = document.getElementById('dateSearchInput');
    if (searchInput && searchInput.value) {
        const searchedDate = new Date(searchInput.value + 'T00:00:00');
        if (!isNaN(searchedDate.getTime()) && 
            searchedDate.getFullYear() === y && 
            searchedDate.getMonth() === m) {
            setTimeout(() => highlightSearchedDate(searchedDate), 100);
        }
    }
}

// ==========================================
// UPDATE DETAIL LENGKAP (TIDAK BERUBAH)
// ==========================================

async function updateDetail(date, pasaran) {
    try {
        const detailDiv = document.getElementById('detail');
        if (!detailDiv) {
            console.error("Element #detail tidak ditemukan");
            return;
        }

        const h = HARI[date.getDay()];
        const wetonKey = `${h} ${pasaran}`;
        
        const nHari = NEPTU_HARI[h] || 0;
        const nPasaran = NEPTU_PASARAN[pasaran] || 0;
        const neptu = nHari + nPasaran;
        
        const wukuName = getWuku(date);
        const infoJawa = getTanggalJawa(date);
        const siklusBesar = getSiklusBesar(infoJawa.tahun);
        const mangsa = getMangsaInfo(date);
        const zodiak = getZodiak(date);
        const lunar = getLunarShio(date);
        const nasibKematian = NASIB_AHLI_WARIS[neptu % 4] || NASIB_AHLI_WARIS[0];
        const nasib5 = PEMBAGI_5[neptu % 5] || PEMBAGI_5[0];
        const arahMeditasi = getArahMeditasi(neptu);
        const usia = hitungUsiaLengkap(date);
        
        const sifatHariIni = DATA_SIFAT_HARI[h] || "-";
        const sifatPasaranIni = DATA_SIFAT_PASARAN[pasaran.toUpperCase()] || "-";

        const watakNeptu = DATA_WATAK_NEPTU[neptu] || null;
        const namaBulanMasehi = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const tglMasehiLengkap = `${date.getDate()} ${namaBulanMasehi[date.getMonth()]} ${date.getFullYear()}`;

        // Ambil data wuku dari file eksternal
        let teksWuku = "Detail wuku sedang dimuat...";
        try {
            // Cek apakah data wuku sudah dimuat
            if (Object.keys(DATA_WUKU).length === 0) {
                // Jika belum, tunggu sampai dimuat
                await loadWukuData();
            }
            
            if (DATA_WUKU[wukuName]) {
                teksWuku = DATA_WUKU[wukuName];
            } else {
                teksWuku = `Data untuk wuku ${wukuName} tidak ditemukan.`;
            }
        } catch (error) {
            console.error('Error loading wuku data:', error);
            teksWuku = `Gagal memuat data wuku ${wukuName}.`;
        }
        
        const dataSriJati = TABEL_SRIJATI[neptu] || [];

        const isNaas = infoJawa.bulan.naas.includes(infoJawa.tanggal);
        const isTaliWangke = (wetonKey === infoJawa.bulan.taliWangke);

        let warningNaas = "";
        if (isNaas || isTaliWangke) {
            warningNaas = `<div style="background:#ffebee; color:#c62828; padding:12px; border-radius:8px; margin-bottom:15px; border-left:5px solid #d32f2f; font-size:0.85rem;">
                <strong>⚠️ PERINGATAN HARI NAAS</strong><br>
                ${isNaas ? `• Tanggal ${infoJawa.tanggal} ${infoJawa.bulan.nama} dilarang untuk hajat.<br>` : ""}
                ${isTaliWangke ? `• Hari ini Tali Wangke (${infoJawa.bulan.taliWangke}).` : ""}
            </div>`;
        }

        // Buat tabel Sri Jati
        let tabelHtml = `<table style="width:100%; border-collapse: collapse; margin-top:10px; font-size:0.85rem; border:1px solid #ddd;">
            <thead><tr style="background:#f9f9f9;">
                <th style="border:1px solid #ddd; padding:8px; text-align:center;">Usia</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:center;">Fase</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:center;">Nilai</th>
                <th style="border:1px solid #ddd; padding:8px; text-align:center;">Keterangan</th>
            </tr></thead><tbody>`;

        if (dataSriJati.length > 0) {
            dataSriJati.forEach(item => {
                const skor = item.nilai || 0;
                const rangeUsia = item.usia || "-";
                const fase = item.fase || "-";
                const deskripsi = SRI_JATI_DESC[skor] || "Data tidak tersedia";
                
                let color = "#333";
                if (skor >= 7) color = "#2e7d32";
                else if (skor >= 5) color = "#ff9800";
                else color = "#d32f2f";
                
                tabelHtml += `<tr>
                    <td style="border:1px solid #ddd; padding:8px; text-align:center; font-weight:bold;">${rangeUsia}</td>
                    <td style="border:1px solid #ddd; padding:8px;">${fase}</td>
                    <td style="border:1px solid #ddd; padding:8px; text-align:center; color:${color}; font-weight:bold; font-size:1.1em;">${skor}</td>
                    <td style="border:1px solid #ddd; padding:8px;">${deskripsi}</td>
                </tr>`;
            });
        } else {
            tabelHtml += `<tr><td colspan="4" style="text-align:center; padding:15px; color:#999;">Data siklus Sri Jati untuk neptu ${neptu} tidak tersedia</td></tr>`;
        }
        tabelHtml += `</tbody></table>`;

        // Tampilkan detail lengkap
        detailDiv.style.display = 'block';
        detailDiv.innerHTML = `
            <div id="printableArea" class="card-result" style="background:#fff; padding:25px; border-radius:12px; border:1px solid #eee; box-shadow: 0 4px 15px rgba(0,0,0,0.08); color:#000; max-width:800px; margin:0 auto;">
                ${warningNaas}
                
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:15px; margin-bottom:20px;">
                    <div>
                        <h2 style="color:#D30000; margin:0 0 5px 0; border-bottom:2px solid #D30000; display:inline-block; font-size:1.8em;">${wetonKey}</h2>
                        <p style="margin:5px 0 0; font-size:1.15rem; font-weight:bold; color:#333;">📅 ${tglMasehiLengkap}</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button onclick="copyToClipboard()" style="background:#D30000; color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:8px;">
                            📋 Salin Hasil
                        </button>
                        <button onclick="shareWhatsApp()" style="background:#25D366; color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:8px;">
                            📱 Share WA
                        </button>
                    </div>
                </div>
                
                <!-- Informasi Dasar -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:15px; margin-bottom:20px;">
                    <div style="background:#fff3e0; padding:15px; border-radius:8px; border:1px solid #ffe0b2;">
                        <h3 style="margin-top:0; color:#e65100; font-size:1em;">🏮 Kalender Imlek</h3>
                        <p style="margin:8px 0; font-size:0.9rem;"><strong>Tanggal:</strong> ${lunar.full}</p>
                        <p style="margin:8px 0; font-size:0.9rem;"><strong>Shio:</strong> ${lunar.shio}</p>
                        <p style="margin:8px 0; font-size:0.85rem; font-style:italic; color:#666;">${lunar.ramalan}</p>
                    </div>
                    
                    <div style="background:#e8f5e9; padding:15px; border-radius:8px; border:1px solid #c8e6c9;">
                        <h3 style="margin-top:0; color:#2e7d32; font-size:1em;">✨ Siklus Windu</h3>
                        <p style="margin:8px 0; font-size:0.9rem;"><strong>Tahun:</strong> ${siklusBesar.tahun.nama}</p>
                        <p style="margin:8px 0; font-size:0.9rem;"><strong>Makna:</strong> ${siklusBesar.tahun.makna}</p>
                        <p style="margin:8px 0; font-size:0.9rem;"><strong>Windu:</strong> ${siklusBesar.windu}</p>
                    </div>
                    
                    <div style="background:#f0f7ff; padding:15px; border-radius:8px; border:1px solid #cfe2ff;">
                        <h3 style="margin-top:0; color:#084298; font-size:1em;">⏳ Usia & Meditasi</h3>
                        <p style="margin:8px 0; font-size:0.9rem;"><strong>Usia Saat Ini:</strong> ${usia}</p>
                        <p style="margin:8px 0; font-size:0.9rem;"><strong>Arah Meditasi:</strong> ${arahMeditasi}</p>
                        <p style="margin:8px 0; font-size:0.9rem;"><strong>Zodiak:</strong> ${zodiak}</p>
                    </div>
                </div>
                
                <!-- Kalender Jawa -->
                <div style="background:#fff9f9; padding:20px; border-radius:10px; margin-bottom:20px; border:1px solid #ffeded;">
                    <h3 style="color:#d30000; margin-top:0; border-bottom:2px solid #ffcccc; padding-bottom:8px;">🌙 Kalender Jawa</h3>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                        <div>
                            <p style="margin:10px 0; font-size:0.95rem;"><strong>Tanggal:</strong> ${infoJawa.tanggal} ${infoJawa.bulan.nama} ${infoJawa.tahun} AJ</p>
                            <p style="margin:10px 0; font-size:0.95rem;"><strong>Status Bulan:</strong> 
                                <span style="color:${infoJawa.bulan.status.includes('Baik') ? '#2e7d32' : '#c62828'}; font-weight:bold;">
                                    ${infoJawa.bulan.status}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p style="margin:10px 0; font-size:0.9rem;"><strong>Tanggal Naas:</strong> ${infoJawa.bulan.naas.join(', ')}</p>
                            <p style="margin:10px 0; font-size:0.9rem;"><strong>Tali Wangke:</strong> ${infoJawa.bulan.taliWangke}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Perhitungan Neptu -->
                <div style="background:#f8f9fa; padding:20px; border-radius:10px; margin-bottom:20px; border:1px solid #e9ecef;">
                    <h3 style="color:#333; margin-top:0; border-bottom:2px solid #ddd; padding-bottom:8px;">🔢 Perhitungan Neptu</h3>
                    <div style="font-family: monospace; font-size:1rem; background:#fff; padding:15px; border-radius:8px; border:1px solid #ddd;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span>Hari ${h}</span>
                            <span>= ${nHari}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span>Pasaran ${pasaran}</span>
                            <span>= ${nPasaran}</span>
                        </div>
                        <div style="border-top:2px solid #333; margin:10px 0; padding-top:10px; display:flex; justify-content:space-between; font-weight:bold; font-size:1.1em;">
                            <span>TOTAL NEPTU</span>
                            <span>= ${neptu}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Karakter Hari & Pasaran -->
                <div style="margin-bottom:20px;">
                    <h3 style="color:#e65100; margin-top:0; border-bottom:2px solid #ffe0b2; padding-bottom:8px;">🎭 Karakter Hari & Pasaran</h3>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
                        <div style="background:#fff8e1; padding:15px; border-radius:8px; border:1px solid #ffe0b2;">
                            <h4 style="margin-top:0; color:#e65100; font-size:0.95rem;">Sifat Hari ${h}</h4>
                            <p style="margin:0; font-size:0.9rem; line-height:1.5;">${sifatHariIni}</p>
                        </div>
                        <div style="background:#fff8e1; padding:15px; border-radius:8px; border:1px solid #ffe0b2;">
                            <h4 style="margin-top:0; color:#e65100; font-size:0.95rem;">Sifat Pasaran ${pasaran}</h4>
                            <p style="margin:0; font-size:0.9rem; line-height:1.5;">${sifatPasaranIni}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Watak Neptu -->
                ${watakNeptu ? `
                <div style="margin-bottom:20px; padding:20px; border:1px solid #e1bee7; border-radius:10px; background:#f3e5f5;">
                    <h3 style="color:#7b1fa2; margin-top:0; border-bottom:2px solid #d1c4e9; padding-bottom:8px;">🌟 Watak Neptu ${neptu}</h3>
                    <p style="font-size:0.95rem; line-height:1.6; color:#4a148c; margin:0;">${watakNeptu.watak}</p>
                </div>
                ` : ""}
                
                <!-- Nasib Pembagi 5 -->
                <div style="background:#e8f5e9; padding:20px; border-radius:10px; margin-bottom:20px; border:1px solid #c8e6c9;">
    <h3 style="color:#2e7d32; margin-top:0; border-bottom:2px solid #a5d6a7; padding-bottom:8px;">
        💎 Nasib Hidup: ${nasib5.nama}
    </h3>
    
    <p style="font-weight:bold; margin-bottom:5px; color:#1b5e20;">Makna:</p>
    <p style="font-size:0.95rem; line-height:1.6; margin:0 0 15px;">${nasib5.arti}</p>

    <p style="font-weight:bold; margin-bottom:5px; color:#1b5e20;">Aktivitas yang Disarankan:</p>
    <ul style="font-size:0.9rem; line-height:1.5; margin:0 0 15px; padding-left:20px;">
        ${nasib5.aktivitas_baik.map(item => `<li>${item}</li>`).join('')}
    </ul>

    <div style="background:rgba(255,255,255,0.5); padding:10px; border-radius:5px; border-left:4px solid #2e7d32;">
        <p style="font-size:0.9rem; font-style:italic; margin:0;"><strong>Saran:</strong> ${nasib5.saran}</p>
    </div>
</div>
                
                <!-- Nasib Kematian -->
                <div style="background:#fffcf0; padding:20px; border-radius:10px; margin-bottom:20px; border-left:4px solid #f1c40f;">
                    <h3 style="color:#856404; margin-top:0; border-bottom:2px solid #ffecb5; padding-bottom:8px;">🪦 Nasib Kematian (Ahli Waris)</h3>
                    <p style="font-size:1.1rem; font-weight:bold; margin:10px 0 5px; color:#d30000;">${nasibKematian.nama}</p>
                    <p style="font-size:0.95rem; font-style:italic; margin:0; color:#666;">"${nasibKematian.arti}"</p>
                </div>
                
                <!-- Pranata Mangsa -->
                ${mangsa ? `
                <div style="background:#f0f7ff; padding:20px; border-radius:10px; margin-bottom:20px; border:1px solid #cfe2ff;">
                    <h3 style="color:#084298; margin-top:0; border-bottom:2px solid #b3d7ff; padding-bottom:8px;">🌾 Pranata Mangsa: ${mangsa.nama}</h3>
                    <p style="font-size:0.95rem; line-height:1.6; margin:10px 0 0;">${mangsa.deskripsi}</p>
                </div>
                ` : ""}
                
                <!-- Analisis Wuku -->
                <div style="margin-bottom:20px; padding:20px; border:1px solid #d1c4e9; border-radius:10px; background:#f5f2ff;">
                    <h3 style="color:#5e35b1; margin-top:0; border-bottom:2px solid #b39ddb; padding-bottom:8px;">🛡️ Analisis Wuku ${wukuName}</h3>
                    <div style="font-size:0.95rem; line-height:1.6; margin:10px 0 0;">${teksWuku}</div>
                </div>
                
                <!-- Siklus Sri Jati -->
                <div style="margin-bottom:10px;">
                    <h3 style="color:#D30000; margin-top:0; border-bottom:2px solid #ffcccc; padding-bottom:8px;">📈 Siklus Sri Jati (Rejeki & Nasib)</h3>
                    <p style="font-size:0.9rem; color:#666; margin-bottom:15px;">Berikut adalah perjalanan rejeki dan nasib berdasarkan neptu ${neptu}:</p>
                    ${dataSriJati.length > 0 ? tabelHtml : `<p style='color:#999; padding:20px; text-align:center; background:#f9f9f9; border-radius:8px;'>Data siklus Sri Jati untuk neptu ${neptu} tidak tersedia</p>`}
                </div>
                
                <!-- Deskripsi Siklus Tahun -->
                <div style="margin-top:25px; padding:20px; background:#f8f9fa; border-radius:10px; border:1px solid #e9ecef;">
                    <h3 style="color:#333; margin-top:0; border-bottom:2px solid #ddd; padding-bottom:8px;">📖 Filosofi Siklus Tahun ${siklusBesar.tahun.nama}</h3>
                    <p style="font-size:0.95rem; line-height:1.6; margin:10px 0 0; font-style:italic;">"${siklusBesar.tahun.deskripsi}"</p>
                </div>
            </div>
        `;
        
        detailDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error("Error in updateDetail:", error);
        const detailDiv = document.getElementById('detail');
        if (detailDiv) {
            detailDiv.innerHTML = `
                <div style="color:#d32f2f; padding:30px; text-align:center; background:#ffebee; border-radius:10px; border:1px solid #ffcdd2;">
                    <h3 style="margin-top:0;">⚠️ Terjadi Kesalahan</h3>
                    <p>Error: ${error.message}</p>
                    <p>Silakan refresh halaman atau coba lagi nanti.</p>
                    <button onclick="location.reload()" style="margin-top:15px; padding:10px 20px; background:#D30000; color:white; border:none; border-radius:5px; cursor:pointer;">
                        🔄 Refresh Halaman
                    </button>
                </div>
            `;
        }
    }
}

// ==========================================
// FITUR SALIN & SHARE (TIDAK BERUBAH)
// ==========================================

function copyToClipboard() {
    const detailArea = document.getElementById('printableArea');
    if (!detailArea) return alert("Data tidak ditemukan!");

    const clone = detailArea.cloneNode(true);
    const buttons = clone.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());

    const textToCopy = "*HASIL LENGKAP CEK WETON JAWA*\n" + 
                       "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" + 
                       clone.innerText.trim() + 
                       "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                       "_Kalender Jawa Modern - by Tius_";

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("✅ Hasil berhasil disalin ke clipboard!");
    }).catch(err => {
        alert("❌ Gagal menyalin teks.");
    });
}

function shareWhatsApp() {
    const detailArea = document.getElementById('printableArea');
    if (!detailArea) {
        alert("Data tidak ditemukan!");
        return;
    }

    let content = detailArea.innerText
        .replace(/📋 Salin Hasil|📱 Share WA/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    const header = "*HASIL LENGKAP CEK WETON JAWA*\n" + 
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    const footer = "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" + 
                   "_Kalender Jawa Modern - by Tius_\n" +
                   "www.kalenderjawa.com";
    
    const finalText = header + content + footer;

    window.open("https://wa.me/?text=" + encodeURIComponent(finalText), "_blank");
}

// ==========================================
// FUNGSI CARI WETON (LAMA)
// ==========================================

function searchWeton() {
    const input = document.getElementById('dateInput');
    if (!input || !input.value) {
        alert("Silakan pilih tanggal terlebih dahulu!");
        return;
    }
    
    const target = new Date(input.value);
    current = new Date(target.getFullYear(), target.getMonth(), 1);
    
    generateCalendar();
    
    const savedToken = localStorage.getItem('kalender_token_tius');
    if (savedToken && checkTokenLogic(savedToken)) {
        updateDetail(target, getPasaran(target));
    } else {
        showTokenModal();
    }
}

// ==========================================
// INITIAL START (DIMODIFIKASI)
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    // Preload data wuku di background
    loadWukuData().then(() => {
        console.log('Data Wuku siap digunakan');
    }).catch(error => {
        console.error('Gagal memuat data wuku:', error);
    });
    
    // Inisialisasi kalender
    generateCalendar();
    
    // Inisialisasi fitur cari tanggal
    initDateSearch();
    
    // Tampilkan detail untuk hari ini jika token valid
    const savedToken = localStorage.getItem('kalender_token_tius');
    if (savedToken && checkTokenLogic(savedToken)) {
        updateDetail(TODAY, getPasaran(TODAY));
    } else {
        // Tampilkan info bahwa token dibutuhkan
        const detailDiv = document.getElementById('detail');
        if (detailDiv) {
            detailDiv.innerHTML = `
                <div style="text-align:center; padding:40px 20px; background:#f8f9fa; border-radius:12px; border:2px dashed #ddd;">
                    <h3 style="color:#D30000; margin-top:0;">🔐 Akses Premium</h3>
                    <p style="margin-bottom:20px;">Untuk melihat detail lengkap weton, Anda perlu mengaktifkan token.</p>
                    <button onclick="showTokenModal()" style="
                        background:#D30000; 
                        color:white; 
                        border:none; 
                        padding:12px 30px; 
                        border-radius:8px; 
                        font-weight:bold; 
                        cursor:pointer;
                        font-size:1em;
                    ">
                        🔑 Aktifkan Token
                    </button>
                    <p style="margin-top:20px; color:#666; font-size:0.9em;">
                        Klik tanggal di kalender untuk mulai menggunakan.
                    </p>
                </div>
            `;
        }
    }

    const prev = document.getElementById('prevMonth');
    const next = document.getElementById('nextMonth');
    
    if(prev) prev.onclick = () => { 
        current.setMonth(current.getMonth() - 1); 
        generateCalendar(); 
    };
    if(next) next.onclick = () => { 
        current.setMonth(current.getMonth() + 1); 
        generateCalendar(); 
    };
});





