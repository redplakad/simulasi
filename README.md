# Simulasi Pencairan Kredit

Aplikasi React dengan TailwindCSS untuk simulasi pencairan kredit yang responsive dan modern.

## Fitur

- **Form Input Lengkap**: Meliputi data debitur, jumlah pengajuan, jangka waktu, rate, dan biaya-biaya
- **Dropdown Dinamis**: Pilihan pekerjaan berubah sesuai jenis asuransi yang dipilih
- **Perhitungan Akurat**: Menggunakan formula anuitas untuk menghitung angsuran
- **Responsive Design**: Desain yang optimal untuk desktop dan mobile
- **UI Modern**: Menggunakan TailwindCSS dengan komponen yang bersih dan mudah dipahami

## Komponen Utama

### Form Input
- Nama Debitur
- Tanggal Lahir
- Jumlah Pengajuan
- Jangka Waktu (bulan)
- Rate (%)
- Biaya Provisi (dropdown: 1%, 1.5%, 2%, 2.5%, 3%)
- Jenis Asuransi (Askrida/Jamkrida)
- Pekerjaan (berubah sesuai jenis asuransi)
- Produk Asuransi (khusus untuk Askrida)
- Jenis Pengikatan Notaris
- Biaya Notaris

### Hasil Perhitungan
- Jumlah Pencairan Bersih
- Total Angsuran per Bulan
- Total Pembayaran Akhir
- Detail breakdown biaya

## Teknologi

- **React 18** - Library JavaScript untuk membangun UI
- **Vite** - Build tool yang cepat untuk development
- **TailwindCSS** - Framework CSS utility-first
- **JavaScript (ES6+)** - Language utama

## Instalasi dan Menjalankan

### Prerequisites
- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### Langkah-langkah

1. Install dependencies:
   ```bash
   npm install
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser dan akses `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Struktur Proyek

```
simulasi/
├── public/          # Static assets
├── src/
│   ├── App.jsx      # Komponen utama aplikasi
│   ├── index.css    # TailwindCSS imports
│   └── main.jsx     # Entry point
├── index.html       # HTML template
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Logika Perhitungan

### Rate Asuransi berdasarkan Pekerjaan

**Askrida:**
- PNS, TNI/POLRI, BUMN/BUMD, Pegawai BPR, Sertif PNS: 0.65%
- Kartap Swasta, PPPK/Honorer, Kepala Desa, Perangkat Desa: 0.55%
- PA+ND (Tanpa PHK): Semua pekerjaan 0.55%

**Jamkrida:**
- PNS/TNI/POLRI/Peg BUMN/D: 0.55%
- Pegawai Swasta: 0.55%
- Honorer, TKK, P3K, THL: 0.65%
- Pensiun (usia > 56): 0.75%

### Formula Perhitungan

1. **Biaya Provisi** = Jumlah Pengajuan × (Biaya Provisi % / 100)
2. **Premi Asuransi** = Jumlah Pengajuan × (Rate Asuransi % / 100)
3. **Pencairan Bersih** = Jumlah Pengajuan - Biaya Provisi - Biaya Notaris - Premi Asuransi
4. **Angsuran per Bulan** = Menggunakan formula anuitas
5. **Total Pembayaran** = Angsuran per Bulan × Jangka Waktu

## Contributing

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/fitur-baru`)
3. Commit perubahan (`git commit -am 'Tambah fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request

## License

MIT License - lihat file LICENSE untuk detail lengkap.
