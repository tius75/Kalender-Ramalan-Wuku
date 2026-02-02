// Database Unsur & Shio
const BATANG_LANGIT = ["Kayu Positif", "Kayu Negatif", "Api Positif", "Api Negatif", "Tanah Positif", "Tanah Negatif", "Logam Positif", "Logam Negatif", "Air Positif", "Air Negatif"];
const CABANG_BUMI = ["Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi"];

const DATA_RAMALAN_SHIO = {
    "Ular": { ramalan: "Intuisi tajam dalam membaca peluang.", karakter: "Bijaksana dan teliti." },
    "Kuda": { ramalan: "Kecepatan membawa rezeki, tetaplah fokus.", karakter: "Energik dan bebas." },
    "Naga": { ramalan: "Keberuntungan besar dalam karier menanti.", karakter: "Berwibawa dan kuat." }
    // Tambahkan shio lainnya sesuai kebutuhan
};

// Konfigurasi 10 Batang Langit (Heavenly Stems)
const BATANG_LANGIT = [
    "Kayu Positif (Jia)", "Kayu Negatif (Yi)", 
    "Api Positif (Bing)", "Api Negatif (Ding)", 
    "Tanah Positif (Wu)", "Tanah Negatif (Ji)", 
    "Logam Positif (Geng)", "Logam Negatif (Xin)", 
    "Air Positif (Ren)", "Air Negatif (Gui)"
];

// Konfigurasi 12 Cabang Bumi (Earthly Branches)
const CABANG_BUMI = [
    "Tikus (Zi)", "Kerbau (Chou)", "Macan (Yin)", "Kelinci (Mao)", 
    "Naga (Chen)", "Ular (Si)", "Kuda (Wu)", "Kambing (Wei)", 
    "Monyet (Shen)", "Ayam (You)", "Anjing (Xu)", "Babi (Hai)"
];

// Database Ramalan & Karakter Shio Lengkap
const DATA_RAMALAN_SHIO = {
    "Tikus": { ramalan: "Peluang karir baru akan muncul, tetap waspada.", karakter: "Cerdas, hemat, dan pandai bergaul." },
    "Kerbau": { ramalan: "Kesabaran adalah kunci kesuksesan bulan ini.", karakter: "Kuat, tekun, dan dapat diandalkan." },
    "Macan": { ramalan: "Ambil langkah berani, keberuntungan memihak Anda.", karakter: "Berani, kompetitif, dan percaya diri." },
    "Kelinci": { ramalan: "Waktunya untuk istirahatan dan refleksi diri.", karakter: "Lembut, waspada, dan elegan." },
    "Naga": { ramalan: "Energi Anda sedang di puncaknya, manfaatkan baik-baik.", karakter: "Berwibawa, enerjik, dan pemimpin alami." },
    "Ular": { ramalan: "Intuisi tajam dalam membaca peluang keuangan.", karakter: "Bijaksana, tenang, dan teliti." }, //
    "Kuda": { ramalan: "Kecepatan membawa rezeki, namun jangan ceroboh.", karakter: "Energik, bebas, dan mandiri." }, //
    "Kambing": { ramalan: "Harmoni keluarga membawa ketenangan pikiran.", karakter: "Lembut, artistik, dan penuh kasih." },
    "Monyet": { ramalan: "Kreativitas Anda akan menyelesaikan masalah sulit.", karakter: "Cerdik, inovatif, dan penuh akal." },
    "Ayam": { ramalan: "Kerja keras Anda mulai membuahkan hasil nyata.", karakter: "Rajin, teliti, dan perfeksionis." },
    "Anjing": { ramalan: "Kesetiaan Anda akan mendapat balasan setimpal.", karakter: "Jujur, setia, dan tulus." },
    "Babi": { ramalan: "Rezeki melimpah datang dari arah tak terduga.", karakter: "Murah hati, jujur, dan rajin." }
};
