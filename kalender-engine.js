export function getPasaran(date) {
    const pasaranArr = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const base = Date.UTC(1900, 0, 1); // Senin Pahing
    const target = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = Math.floor((target - base) / (1000 * 60 * 60 * 24));
    return pasaranArr[(((diff + 1) % 5) + 5) % 5];
}

export function getWuku(date) {
    const wukuArr = ["Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit", "Warigagung", "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir", "Mandasiya", "Julungpujut", "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala", "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"];
    const baseWuku = Date.UTC(2024, 4, 19); // Minggu Sinta
    const target = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = Math.floor((target - baseWuku) / (1000 * 60 * 60 * 24));
    const index = Math.floor((((diff % 210) + 210) % 210) / 7);
    return wukuArr[index];
}
