import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    namaDebitur: '',
    tanggalLahir: '',
    jumlahPengajuan: '',
    jangkaWaktu: '',
    rate: '',
    pelunasan: '',
    biayaProvisi: '1',
    jenisAsuransi: 'Askrida',
    pekerjaan: '',
    produkAsuransi: 'PA+ND+PHK',
    jenisPengikatan: 'Warmeking',
    biayaNotaris: ''
  })

  const [calculation, setCalculation] = useState(null)

  // Data pekerjaan berdasarkan jenis asuransi
  const pekerjaanOptions = {
    Askrida: [
      { value: '1', label: 'PNS', rate: 0.65 },
      { value: '2', label: 'TNI/POLRI', rate: 0.65 },
      { value: '3', label: 'BUMN/BUMD', rate: 0.65 },
      { value: '4', label: 'PEGAWAI BPR', rate: 0.65 },
      { value: '5', label: 'SERTIF PNS', rate: 0.65 },
      { value: '6', label: 'KARTAP SWASTA', rate: 0.55 },
      { value: '7', label: 'PPPK/HONORER/KONTRAK PROV. BANTEN', rate: 0.55 },
      { value: '8', label: 'KEPALA DESA', rate: 0.55 },
      { value: '9', label: 'PERANGKAT DESA', rate: 0.55 }
    ],
    Jamkrida: [
      { value: '1', label: 'PNS/TNI/POLRI/PEG BUMN/D', rate: 0.55 },
      { value: '2', label: 'PEGAWAI SWASTA', rate: 0.55 },
      { value: '3', label: 'HONORER,TKK,P3K, THL', rate: 0.65 },
      { value: '4', label: 'PENSIUAN (KHUSUS USIA > 56)', rate: 0.75 }
    ]
  }

  const biayaProvisiOptions = [
    { value: '1', label: '1%' },
    { value: '1.5', label: '1.5%' },
    { value: '2', label: '2%' },
    { value: '2.5', label: '2.5%' },
    { value: '3', label: '3%' }
  ]

  const jenisAsuransiOptions = ['Askrida', 'Jamkrida']

  const produkAsuransiOptions = [
    { value: 'PA+ND (TANPA PHK)', label: 'PA+ND (TANPA PHK)' },
    { value: 'PA+ND+PHK', label: 'PA+ND+PHK' }
  ]

  const jenisPengikatanOptions = [
    'Warmeking',
    'Legalisasi',
    'Fidusia',
    'SKMHT',
    'APHT'
  ]

  // Fungsi untuk format angka dengan separator ribuan
  const formatNumber = (value) => {
    // Hapus semua karakter non-digit
    const numericValue = value.replace(/\D/g, '')
    // Format dengan separator ribuan
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Fungsi untuk mengubah format angka kembali ke angka biasa
  const parseFormattedNumber = (value) => {
    return value.replace(/\./g, '')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Handle formatting untuk field angka tertentu
    if (name === 'jumlahPengajuan' || name === 'biayaNotaris' || name === 'pelunasan') {
      const formattedValue = formatNumber(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Reset pekerjaan ketika jenis asuransi berubah
    if (name === 'jenisAsuransi') {
      setFormData(prev => ({
        ...prev,
        pekerjaan: ''
      }))
    }
  }

  const getAsuransiRate = () => {
    const selectedPekerjaan = pekerjaanOptions[formData.jenisAsuransi]?.find(
      p => p.value === formData.pekerjaan
    )
    
    if (!selectedPekerjaan) return 0

    // Untuk Askrida, cek produk asuransi
    if (formData.jenisAsuransi === 'Askrida' && formData.produkAsuransi === 'PA+ND (TANPA PHK)') {
      return 0.55
    }

    return selectedPekerjaan.rate
  }

  const getPremiumDescription = () => {
    const rate = getAsuransiRate()
    if (formData.jenisAsuransi === 'Askrida') {
      const jangkaWaktuTahun = (formData.jangkaWaktu || 0) / 12
      return `Premi Asuransi (${rate}% × ${jangkaWaktuTahun.toFixed(1)} tahun):`
    } else {
      return `Premi Asuransi (${rate}%):`
    }
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const calculateLoan = () => {
    const jumlahPengajuan = parseFloat(parseFormattedNumber(formData.jumlahPengajuan)) || 0
    const jangkaWaktu = parseInt(formData.jangkaWaktu) || 0
    const rate = parseFloat(formData.rate) || 0
    const biayaProvisi = parseFloat(formData.biayaProvisi) || 0
    const biayaNotaris = parseFloat(parseFormattedNumber(formData.biayaNotaris)) || 0
    const pelunasan = parseFloat(parseFormattedNumber(formData.pelunasan)) || 0
    const asuransiRate = getAsuransiRate()

    if (jumlahPengajuan <= 0 || jangkaWaktu <= 0) {
      alert('Harap isi jumlah pengajuan dan jangka waktu dengan benar')
      return
    }

    // Hitung angsuran per bulan (menggunakan formula anuitas)
    const monthlyRate = rate / 100 / 12
    const totalAngsuran = jumlahPengajuan * (monthlyRate * Math.pow(1 + monthlyRate, jangkaWaktu)) / 
                         (Math.pow(1 + monthlyRate, jangkaWaktu) - 1)

    // Hitung biaya-biaya
    const biayaProvisiAmount = (jumlahPengajuan * biayaProvisi) / 100
    
    // Hitung premi asuransi berdasarkan jenis asuransi
    let premi = 0
    if (formData.jenisAsuransi === 'Askrida') {
      // Rumus Askrida: (plafond * rate per tahun) * jangka waktu
      // plafond = jumlah pengajuan
      // jw = jangka waktu (tahun) - dikonversi dari bulan ke tahun
      // rate per tahun = hasil perhitungan dari nilai dropdown pekerjaan
      const ratePerTahun = asuransiRate / 100
      const jangkaWaktuTahun = jangkaWaktu / 12 // konversi bulan ke tahun
      premi = (jumlahPengajuan * ratePerTahun) * jangkaWaktuTahun
    } else {
      // Rumus Jamkrida: menggunakan rumus lama (per plafond)
      premi = (jumlahPengajuan * asuransiRate) / 100
    }

    // Hitung biaya tambahan
    const tabunganWajib = (jumlahPengajuan * 3) / 100 // 3% dari plafond
    const cadanganAngsuran = totalAngsuran // 1x angsuran

    // Total biaya
    const totalBiaya = biayaProvisiAmount + biayaNotaris + premi + tabunganWajib + cadanganAngsuran + pelunasan

    // Total dana diterima
    const totalDanaDiterima = jumlahPengajuan - totalBiaya

    // Total pembayaran akhir
    const totalPembayaranAkhir = totalAngsuran * jangkaWaktu

    setCalculation({
      plafond: jumlahPengajuan,
      totalAngsuranPerBulan: totalAngsuran,
      totalPembayaranAkhir: totalPembayaranAkhir,
      biayaProvisiAmount: biayaProvisiAmount,
      premi: premi,
      tabunganWajib: tabunganWajib,
      cadanganAngsuran: cadanganAngsuran,
      pelunasan: pelunasan,
      totalBiaya: totalBiaya,
      totalDanaDiterima: totalDanaDiterima
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Print Styles */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 1in;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .print-table {
            width: 75% !important;
            margin: 0 auto;
          }
          .print:hidden {
            display: none !important;
          }
        }
      `}</style>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 print:hidden">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Simulasi Pencairan Kredit
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Hitung simulasi pencairan kredit dengan mudah dan akurat
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Input */}
          <div className="bg-white shadow-lg rounded-lg p-6 print:hidden">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Debitur</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Debitur */}
              <div>
                <label htmlFor="namaDebitur" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Debitur
                </label>
                <input
                  type="text"
                  id="namaDebitur"
                  name="namaDebitur"
                  value={formData.namaDebitur}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan nama debitur"
                />
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  id="tanggalLahir"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Jumlah Pengajuan */}
              <div>
                <label htmlFor="jumlahPengajuan" className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Pengajuan (Rp)
                </label>
                <input
                  type="text"
                  id="jumlahPengajuan"
                  name="jumlahPengajuan"
                  value={formData.jumlahPengajuan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: 10.000.000"
                />
              </div>

              {/* Jangka Waktu */}
              <div>
                <label htmlFor="jangkaWaktu" className="block text-sm font-medium text-gray-700 mb-1">
                  Jangka Waktu (bulan)
                </label>
                <input
                  type="number"
                  id="jangkaWaktu"
                  name="jangkaWaktu"
                  value={formData.jangkaWaktu}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan jangka waktu dalam bulan"
                />
              </div>

              {/* Rate */}
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan rate dalam persen"
                />
              </div>

              {/* Pelunasan */}
              <div>
                <label htmlFor="pelunasan" className="block text-sm font-medium text-gray-700 mb-1">
                  Pelunasan (Rp)
                </label>
                <input
                  type="text"
                  id="pelunasan"
                  name="pelunasan"
                  value={formData.pelunasan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: 100.000"
                />
              </div>

              {/* Biaya Provisi */}
              <div>
                <label htmlFor="biayaProvisi" className="block text-sm font-medium text-gray-700 mb-1">
                  Biaya Provisi
                </label>
                <select
                  id="biayaProvisi"
                  name="biayaProvisi"
                  value={formData.biayaProvisi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {biayaProvisiOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jenis Asuransi */}
              <div>
                <label htmlFor="jenisAsuransi" className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Asuransi
                </label>
                <select
                  id="jenisAsuransi"
                  name="jenisAsuransi"
                  value={formData.jenisAsuransi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {jenisAsuransiOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pekerjaan */}
              <div>
                <label htmlFor="pekerjaan" className="block text-sm font-medium text-gray-700 mb-1">
                  Pekerjaan
                </label>
                <select
                  id="pekerjaan"
                  name="pekerjaan"
                  value={formData.pekerjaan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih Pekerjaan</option>
                  {pekerjaanOptions[formData.jenisAsuransi]?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.rate}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Jenis Pengikatan Notaris */}
              <div>
                <label htmlFor="jenisPengikatan" className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Pengikatan Notaris
                </label>
                <select
                  id="jenisPengikatan"
                  name="jenisPengikatan"
                  value={formData.jenisPengikatan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {jenisPengikatanOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Biaya Notaris */}
              <div>
                <label htmlFor="biayaNotaris" className="block text-sm font-medium text-gray-700 mb-1">
                  Biaya Notaris (Rp)
                </label>
                <input
                  type="text"
                  id="biayaNotaris"
                  name="biayaNotaris"
                  value={formData.biayaNotaris}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: 500.000"
                />
              </div>

              {/* Produk Asuransi (hanya untuk Askrida) - span 2 kolom */}
              {formData.jenisAsuransi === 'Askrida' && (
                <div className="md:col-span-2">
                  <label htmlFor="produkAsuransi" className="block text-sm font-medium text-gray-700 mb-1">
                    Produk Asuransi
                  </label>
                  <select
                    id="produkAsuransi"
                    name="produkAsuransi"
                    value={formData.produkAsuransi}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {produkAsuransiOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={calculateLoan}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
              >
                Hitung Simulasi
              </button>
              
              {calculation && (
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium"
                >
                  Print Hasil
                </button>
              )}
            </div>
          </div>

          {/* Hasil Perhitungan */}
          <div className="bg-white shadow-lg rounded-lg p-6 print-area">
            {/* Print Header */}
            <div className="hidden print:block mb-6">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                Hasil Simulasi Pencairan Kredit
              </h1>
              <p className="text-center text-gray-600 mt-2">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            {calculation ? (
              <div className="space-y-6">
                {/* Tabel Data Debitur */}
                <div>
                  <table className="w-full print-table">
                    <tbody className="space-y-2">
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Nama</td>
                        <td className="py-2 text-sm font-medium text-right">{formData.namaDebitur || '-'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Tanggal Lahir & Usia</td>
                        <td className="py-2 text-sm font-medium text-right">
                          {formData.tanggalLahir ? 
                            `${formatDateToDDMMYYYY(formData.tanggalLahir)} (${calculateAge(formData.tanggalLahir)} tahun)` : 
                            '-'
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Pengajuan</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(calculation.plafond)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Jangka Waktu</td>
                        <td className="py-2 text-sm font-medium text-right">{formData.jangkaWaktu} bulan</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Bunga</td>
                        <td className="py-2 text-sm font-medium text-right">{formData.rate}% per tahun</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Angsuran</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(calculation.totalAngsuranPerBulan)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tabel Hasil Perhitungan */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hasil Perhitungan</h3>
                  <table className="w-full print-table">
                    <tbody className="space-y-2">
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Plafond</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(calculation.plafond)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Biaya Provisi ({formData.biayaProvisi}%)</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(calculation.biayaProvisiAmount)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Biaya Notaris</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(parseFloat(parseFormattedNumber(formData.biayaNotaris)) || 0)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Premi Asuransi ({formData.jenisAsuransi})</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(calculation.premi)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Tabungan Wajib (3%)</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(calculation.tabunganWajib)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Cadangan Angsuran (1x)</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(calculation.cadanganAngsuran)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-gray-700">Pelunasan</td>
                        <td className="py-2 text-sm font-medium text-right">{formatCurrency(calculation.pelunasan)}</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 text-sm font-semibold text-gray-900">Total Biaya</td>
                        <td className="py-2 text-sm font-semibold text-right">{formatCurrency(calculation.totalBiaya)}</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-2 text-sm font-bold text-green-800">Total Dana Diterima</td>
                        <td className="py-2 text-sm font-bold text-green-800 text-right">{formatCurrency(calculation.totalDanaDiterima)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9c.83 0 1.65-.12 2.41-.34.21-.06.42-.12.62-.19.11-.04.22-.08.33-.12C17.93 19.64 19 17.93 19 16c0-1.66-1.34-3-3-3s-3 1.34-3 3c0 .35.06.69.18 1-.12.21-.29.4-.49.56C11.4 18.47 9.8 19 8 19c-2.21 0-4-1.79-4-4 0-.83.25-1.59.68-2.23"></path>
                  </svg>
                </div>
                <p className="text-gray-500">
                  Isi form di sebelah kiri dan klik "Hitung Simulasi" untuk melihat hasil perhitungan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
