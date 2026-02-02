// Simpan sebagai imlek-engine.js
function getLunarImlek(date) {
    // Referensi: 29 Jan 2025 = 12-11-2576 (Tahun Ular)
    const refDate = new Date(2026, 0, 29); 
    const diffTime = date.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const LUNAR_CYCLE = 29.53059;
    
    let totalMonths = Math.floor(diffDays / LUNAR_CYCLE);
    let lDay = Math.floor(diffDays % LUNAR_CYCLE) + 1;
    let lMonth = (totalMonths % 12) + 1;
    let lYear = 2576 + Math.floor(totalMonths / 12);

    if (lDay > 30) { lDay = 1; lMonth++; }
    if (lDay <= 0) { lDay = 29; lMonth--; }
    if (lMonth > 12) { lMonth = 1; lYear++; }
    
    const shios = ["Monyet", "Ayam", "Anjing", "Babi", "Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing"];
    const shio = shios[lYear % 12];

    return { tanggal: lDay, bulan: lMonth, tahun: lYear, shio: shio };
}
