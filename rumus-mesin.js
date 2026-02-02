import { NEPTU_HARI, NEPTU_PASARAN, WUKU_LIST } from './data-primbon.js';

export function getPasaran(date) {
    const listPasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const baseDate = new Date('1900-01-01');
    const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
    return listPasaran[(diffDays % 5 + 5) % 5];
}

export function hitungNeptu(hari, pasaran) {
    return (NEPTU_HARI[hari] || 0) + (NEPTU_PASARAN[pasaran] || 0);
}

export function hitungWuku(date) {
    const baseDate = new Date('1900-01-01');
    const diffWeeks = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24 * 7));
    const indexWuku = (diffWeeks + 1) % 30; // Penyesuaian offset wuku
    return WUKU_LIST[indexWuku];
}


