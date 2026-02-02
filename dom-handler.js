export function updateClock() {
    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + 
                    String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = timeStr;
}

export async function captureResult() {
    const target = document.getElementById('detail');
    if (target.style.display === 'none') return alert("Pilih tanggal dulu!");
    
    const canvas = await html2canvas(target);
    const link = document.createElement('a');
    link.download = 'hasil-ramalan.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
}


