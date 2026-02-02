export function renderCalendar(month, year) {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // Reset tampilan
    // Logika pembuatan elemen tanggal di sini...
}

export async function exportToJPG() {
    const element = document.getElementById('detail');
    if (!element) return alert("Pilih data terlebih dahulu!");
    
    const canvas = await html2canvas(element, { scale: 2 });
    const link = document.createElement('a');
    link.download = 'hasil-ramalan.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
}

export function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Berhasil disalin!");
    });
}


