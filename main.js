/**
 * KALENDER JAWA MODERN - VERSI FULL DETAIL + TOKEN SYSTEM
 */

// 1. DAFTAR TOKEN (Edit di sini)
const DAFTAR_TOKEN_AKTIF = {
    "TIUS2026": "2026-12-31",
    "VIP-MEMBER": "9999-12-31",
    "COBA": "2026-02-10"
};

// 2. KONSTANTA & DATA (Tetap dipertahankan untuk Detail Lengkap)
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const NEPTU_HARI = { 'Minggu': 5, 'Senin': 4, 'Selasa': 3, 'Rabu': 7, 'Kamis': 8, 'Jumat': 6, 'Sabtu': 9 };
const NEPTU_PASARAN = { 'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8, 'Legi': 5 };
const WINDU_LIST = ["Kuntara", "Sangara", "Sancaya", "Adi"];

let current = new Date();
const TODAY = new Date();

// --- LOGIKA TOKEN ---
function checkTokenLogic(token) {
    if (!token) return false;
    const expiryDateStr = DAFTAR_TOKEN_AKTIF[token.toUpperCase()];
    if (!expiryDateStr) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    return today <= new Date(expiryDateStr);
}

function showTokenModal() {
    const input = prompt("🔐 AKSES TERKUNCI\n\nMasukkan Token untuk melihat Detail Lengkap & Ramalan:");
    if (!input) return;
    const token = input.trim().toUpperCase();
    if (checkTokenLogic(token)) {
        localStorage.setItem('kalender_token_tius', token);
        alert("✅ Token Berhasil! Sekarang Anda bisa melihat detail.");
        location.reload();
    } else {
        alert("❌ Token Salah atau Expired!");
    }
}

// --- FUNGSI DASAR ---
function getPasaran(date) {
    const base = new Date(1900, 0, 1);
    const diff = Math.floor((date.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    return PASARAN[(((diff + 1) % 5) + 5) % 5];
}

function getWuku(date) {
    if(typeof DATA_WUKU === 'undefined') return "Data Wuku Kosong";
    const refDate = new Date(2026, 0, 25); 
    const diffDays = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    const wukuList = Object.keys(DATA_WUKU);
    let idx = (20 + Math.floor(diffDays / 7)) % 30;
    while (idx < 0) idx += 30;
    return wukuList[idx];
}

function getTanggalJawa(date) {
    const refDate = new Date(2026, 0, 28); 
    const diffDays = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    let tgl = 9 + diffDays;
    while(tgl > 30) tgl -= 30;
    while(tgl <= 0) tgl += 30;
    // Data dummy bulan (Anda bisa kembangkan jika ada data-bulan.js)
    return { tanggal: tgl, namaBulan: "Bulan Jawa", tahun: 1959 };
}

// --- RENDER KALENDER ---
function generateCalendar() {
    const grid = document.getElementById('calendar');
    const mNav = document.getElementById('monthYearNav');
    if (!grid) return;
    
    grid.innerHTML = '';
    const y = current.getFullYear();
    const m = current.getMonth();
    const namaBulanMasehi = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    mNav.innerText = `${namaBulanMasehi[m]} ${y}`;

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
            if (checkTokenLogic(savedToken)) {
                document.querySelectorAll('.calendar-day').forEach(c => c.classList.remove('selected-day'));
                cell.classList.add('selected-day');
                updateDetail(dateObj, p);
            } else {
                showTokenModal();
            }
        };
        grid.appendChild(cell);
    }
}

// --- UPDATE DETAIL LENGKAP ---
function updateDetail(date, pasaran) {
    const detailDiv = document.getElementById('detail');
    if (!detailDiv) return;

    const h = HARI[date.getDay()];
    const nHari = NEPTU_HARI[h];
    const nPasaran = NEPTU_PASARAN[pasaran];
    const neptu = nHari + nPasaran;
    const wukuName = getWuku(date);
    const tglJawa = getTanggalJawa(date);

    // Ambil data dari file eksternal (data-wuku.js, data-srijati.js, dll)
    const teksWuku = (typeof DATA_WUKU !== 'undefined') ? DATA_WUKU[wukuName] : "Data wuku tidak dimuat.";
    const watakNeptu = (typeof DATA_WATAK_NEPTU !== 'undefined') ? DATA_WATAK_NEPTU[neptu] : null;
    const dataSriJati = (typeof TABEL_SRIJATI !== 'undefined') ? TABEL_SRIJATI[neptu] : [];

    let sriJatiHtml = `<table style="width:100%; border-collapse:collapse; font-size:12px; margin-top:10px;">
                        <tr style="background:#eee;"><th>Usia</th><th>Nilai</th><th>Nasib</th></tr>`;
    if(dataSriJati.length > 0) {
        dataSriJati.forEach(row => {
            const deskripsi = (typeof SRI_JATI_DESC !== 'undefined') ? SRI_JATI_DESC[row.nilai] : "No Desc";
            sriJatiHtml += `<tr><td>${row.usia} Th</td><td style="color:red; font-weight:bold;">${row.nilai}</td><td>${deskripsi}</td></tr>`;
        });
    }
    sriJatiHtml += `</table>`;

    detailDiv.innerHTML = `
        <div id="printableArea" class="card-result" style="background:#fff; padding:20px; border-radius:12px; border:1px solid #ddd; color:#000;">
            <h2 style="color:#D30000; border-bottom:2px solid #D30000; display:inline-block;">${h} ${pasaran}</h2>
            
            <div style="background:#f9f9f9; padding:10px; border-radius:8px; margin:10px 0;">
                <p><b>📅 Masehi:</b> ${date.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</p>
                <p><b>🌙 Jawa:</b> ${tglJawa.tanggal} ${tglJawa.namaBulan} ${tglJawa.tahun} AJ</p>
                <p><b>🔢 Neptu:</b> ${neptu} (${nHari} + ${nPasaran})</p>
                <p><b>🎭 Wuku:</b> ${wukuName}</p>
            </div>

            <div style="margin-top:20px;">
                <h4 style="color:#D30000;">🛡️ Analisis Wuku ${wukuName}</h4>
                <div style="font-size:13px; line-height:1.5; background:#fffcf0; padding:10px; border-left:4px solid #f1c40f;">${teksWuku}</div>
            </div>

            ${watakNeptu ? `
            <div style="margin-top:20px; background:#f3e5f5; padding:10px; border-radius:8px;">
                <h4 style="color:#7b1fa2; margin:0;">🌟 Watak Neptu ${neptu}</h4>
                <p style="font-size:13px;">${watakNeptu.watak}</p>
            </div>` : ''}

            <div style="margin-top:20px;">
                <h4 style="color:#D30000;">📈 Siklus Rejeki (Sri Jati)</h4>
                ${sriJatiHtml}
            </div>
            
            <button onclick="localStorage.removeItem('kalender_token_tius'); location.reload();" style="margin-top:20px; font-size:10px; color:gray; background:none; border:none; text-decoration:underline; cursor:pointer;">Keluar / Hapus Token</button>
        </div>
    `;
    detailDiv.scrollIntoView({ behavior: 'smooth' });
}

// --- INISIALISASI ---
document.addEventListener("DOMContentLoaded", () => {
    generateCalendar();
    
    const prev = document.getElementById('prevMonth');
    const next = document.getElementById('nextMonth');
    if(prev) prev.onclick = () => { current.setMonth(current.getMonth() - 1); generateCalendar(); };
    if(next) next.onclick = () => { current.setMonth(current.getMonth() + 1); generateCalendar(); };
});
