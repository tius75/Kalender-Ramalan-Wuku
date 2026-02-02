/**
 * MODUL NUMEROLOGI PRO (Bisnis, Jodoh, Hari Baik)
 */

const NUMEROLOGI_ENGINE = {
    reduceNumber: (num, allowMaster = true) => {
        let sum = num;
        while (sum > 9) {
            if (allowMaster && (sum === 11 || sum === 22)) break;
            sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        }
        return sum;
    },

    calculateLifePath: (date) => {
        const d = NUMEROLOGI_ENGINE.reduceNumber(date.getDate());
        const m = NUMEROLOGI_ENGINE.reduceNumber(date.getMonth() + 1);
        const y = NUMEROLOGI_ENGINE.reduceNumber(date.getFullYear());
        const final = NUMEROLOGI_ENGINE.reduceNumber(d + m + y);

        const database = {
            1: {
                karakter: "Pemimpin mandiri dan perintis.",
                bisnis: "Sangat cocok sebagai CEO, wirausaha, atau manajer proyek.",
                jodoh: "Paling serasi dengan angka 3, 5, dan 9.",
                hariBaik: "Minggu dan Senin."
            },
            2: {
                karakter: "Diplomat yang peka dan kooperatif.",
                bisnis: "Bidang konseling, administrasi, atau kemitraan strategis.",
                jodoh: "Paling serasi dengan angka 4, 6, dan 8.",
                hariBaik: "Senin dan Jumat."
            },
            3: {
                karakter: "Komunikator kreatif dan penuh imajinasi.",
                bisnis: "Industri hiburan, pemasaran, atau desain kreatif.",
                jodoh: "Paling serasi dengan angka 1, 5, dan 7.",
                hariBaik: "Selasa dan Kamis."
            },
            4: {
                karakter: "Pembangun yang disiplin dan stabil.",
                bisnis: "Konstruksi, keuangan, hukum, atau teknik.",
                jodoh: "Paling serasi dengan angka 2, 6, dan 8.",
                hariBaik: "Sabtu dan Minggu."
            },
            5: {
                karakter: "Petualang yang fleksibel dan dinamis.",
                bisnis: "Penjualan, pariwisata, media, atau jurnalisme.",
                jodoh: "Paling serasi dengan angka 1, 3, dan 7.",
                hariBaik: "Rabu dan Jumat."
            },
            6: {
                karakter: "Pengayom yang penuh kasih dan tanggung jawab.",
                bisnis: "Kesehatan, pendidikan, kuliner, atau pelayanan sosial.",
                jodoh: "Paling serasi dengan angka 2, 4, dan 8.",
                hariBaik: "Selasa dan Jumat."
            },
            7: {
                karakter: "Pencari kebenaran yang spiritual dan analitis.",
                bisnis: "Penelitian, teknologi, sains, atau filsafat.",
                jodoh: "Paling serasi dengan angka 3, 5, dan 9.",
                hariBaik: "Senin dan Kamis."
            },
            8: {
                karakter: "Eksekutif ambisius dengan otoritas tinggi.",
                bisnis: "Perbankan, investasi, hukum, atau bisnis skala besar.",
                jodoh: "Paling serasi dengan angka 2, 4, dan 6.",
                hariBaik: "Sabtu dan Minggu."
            },
            9: {
                karakter: "Humanis sejati yang idealis dan penyayang.",
                bisnis: "Seni, yayasan amal, pengajaran, atau sastra.",
                jodoh: "Paling serasi dengan angka 1, 3, dan 9.",
                hariBaik: "Selasa dan Kamis."
            },
            11: {
                karakter: "Master Spiritual dengan intuisi tajam.",
                bisnis: "Psikologi, motivator, atau pemimpin spiritual.",
                jodoh: "Serasi dengan semua angka ganjil.",
                hariBaik: "Setiap hari Senin."
            },
            22: {
                karakter: "Master Builder yang mampu mewujudkan mimpi.",
                bisnis: "Arsitektur, pemerintahan, atau organisasi global.",
                jodoh: "Serasi dengan semua angka genap.",
                hariBaik: "Setiap hari Sabtu."
            }
        };

        return { 
            angka: final, 
            ...database[final] || { karakter: "Unik", bisnis: "-", jodoh: "-", hariBaik: "-" } 
        };
    }
};
