import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    tanggalLahir: '',
    jenisAsuransi: '',
    pekerjaan: '',
    produkAsuransi: '',
    jumlahPengajuan: '',
    jangkaWaktu: '',
    biayaProvisi: '',
    biayaNotaris: '',
    jenisPengikatan: '',
    pelunasan: ''
  })

  const [calculation, setCalculation] = useState(null)

  const pekerjaanOptions = {
    'Askrida': [
      { value: 'PNS/POLRI/TNI', label: 'PNS/POLRI/TNI', rate: 0.24 },
      { value: 'Honorer', label: 'Honorer', rate: 0.36 },
      { value: 'Pensiunan PNS/POLRI/TNI', label: 'Pensiunan PNS/POLRI/TNI', rate: 0.36 },
      { value: 'Karyawan BUMN', label: 'Karyawan BUMN', rate: 0.36 },
      { value: 'Karyawan Swasta', label: 'Karyawan Swasta', rate: 0.48 },
      { value: 'Pensiunan BUMN', label: 'Pensiunan BUMN', rate: 0.48 },
      { value: 'Pensiunan Swasta', label: 'Pensiunan Swasta', rate: 0.48 },
      { value: 'Dokter', label: 'Dokter', rate: 0.36 },
      { value: 'Notaris', label: 'Notaris', rate: 0.36 },
      { value: 'Wiraswasta', label: 'Wiraswasta', rate: 0.60 },
      { value: 'Lainnya', label: 'Lainnya', rate: 0.60 }
    ],
    'Jamkrida': [
      { value: 'PNS', label: 'PNS', rate: 0.50 },
      { value: 'Honorer', label: 'Honorer', rate: 0.60 },
      { value: 'POLRI', label: 'POLRI', rate: 0.50 },
      { value: 'TNI', label: 'TNI', rate: 0.50 },
      { value: 'Pensiunan PNS', label: 'Pensiunan PNS', rate: 0.80 },
      { value: 'Pensiunan POLRI', label: 'Pensiunan POLRI', rate: 0.80 },
      { value: 'Pensiunan TNI', label: 'Pensiunan TNI', rate: 0.80 },
      { value: 'Karyawan BUMN', label: 'Karyawan BUMN', rate: 0.60 },
      { value: 'Karyawan Swasta', label: 'Karyawan Swasta', rate: 0.80 },
      { value: 'Pensiunan BUMN', label: 'Pensiunan BUMN', rate: 1.00 },
      { value: 'Pensiunan Swasta', label: 'Pensiunan Swasta', rate: 1.00 },
      { value: 'Dokter', label: 'Dokter', rate: 0.60 },
      { value: 'Notaris', label: 'Notaris', rate: 0.60 },
      { value: 'Wiraswasta', label: 'Wiraswasta', rate: 1.20 }
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

  // Fungsi untuk format tanggal menjadi dd/mm/yyyy
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '-'
    
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateLoan = () => {
    const jumlahPengajuan = parseFloat(parseFormattedNumber(formData.jumlahPengajuan)) || 0
    const biayaProvisiValue = parseFloat(formData.biayaProvisi) || 0
    const biayaNotaris = parseFloat(parseFormattedNumber(formData.biayaNotaris)) || 0
    const pelunasan = parseFloat(parseFormattedNumber(formData.pelunasan)) || 0
    const jangkaWaktu = parseFloat(formData.jangkaWaktu) || 0

    if (jumlahPengajuan <= 0) {
      alert('Masukkan jumlah pengajuan yang valid')
      return
    }

    // Hitung biaya provisi
    const biayaProvisi = jumlahPengajuan * (biayaProvisiValue / 100)

    // Hitung premi asuransi
    let premiAsuransi = 0
    const rate = getAsuransiRate()
    
    if (formData.jenisAsuransi === 'Askrida') {
      const jangkaWaktuTahun = jangkaWaktu / 12
      premiAsuransi = jumlahPengajuan * (rate / 100) * jangkaWaktuTahun
    } else {
      premiAsuransi = jumlahPengajuan * (rate / 100)
    }

    // Hitung angsuran bulanan (anuitas)
    const bungaBulanan = (biayaProvisiValue / 100) / 12
    const angsuranBulanan = (jumlahPengajuan * bungaBulanan * Math.pow(1 + bungaBulanan, jangkaWaktu)) / 
                           (Math.pow(1 + bungaBulanan, jangkaWaktu) - 1)

    // Hitung tabungan wajib (3%)
    const tabunganWajib = jumlahPengajuan * 0.03

    // Hitung cadangan angsuran (1x angsuran)
    const cadanganAngsuran = angsuranBulanan

    // Hitung total biaya
    const totalBiaya = biayaProvisi + premiAsuransi + biayaNotaris + pelunasan + tabunganWajib + cadanganAngsuran

    // Hitung total dana diterima
    const totalDanaDiterima = jumlahPengajuan - totalBiaya

    setCalculation({
      jumlahPengajuan,
      biayaProvisi,
      premiAsuransi,
      biayaNotaris,
      pelunasan,
      angsuranBulanan,
      tabunganWajib,
      cadanganAngsuran,
      totalBiaya,
      totalDanaDiterima
    })
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
          margin: 0.5in;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
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
            height: auto;
            overflow: hidden;
            page-break-inside: avoid;
          }
          .print-table {
            width: 90% !important;
            margin: 0 auto !important;
            border-collapse: collapse !important;
            page-break-inside: avoid;
          }
          .print-table td {
            padding: 8px 12px !important;
            border-bottom: 1px solid #e5e7eb !important;
            page-break-inside: avoid;
          }
          .print-table td:first-child {
            text-align: left !important;
          }
          .print-table td:last-child {
            text-align: right !important;
          }
          .print-area h2, .print-area h3 {
            margin: 10px 0 !important;
            page-break-after: avoid;
          }
          .print-area .space-y-6 > * + * {
            margin-top: 15px !important;
          }
          .print-area .mt-8 {
            margin-top: 20px !important;
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Simulasi Pencairan Kredit
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Hitung estimasi dana yang akan diterima
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Data Pengajuan</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Jenis Asuransi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Asuransi
                  </label>
                  <select
                    name="jenisAsuransi"
                    value={formData.jenisAsuransi}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Jenis Asuransi</option>
                    {jenisAsuransiOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Pekerjaan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pekerjaan
                  </label>
                  <select
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleInputChange}
                    disabled={!formData.jenisAsuransi}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">
                      {formData.jenisAsuransi ? 'Pilih Pekerjaan' : 'Pilih Jenis Asuransi terlebih dahulu'}
                    </option>
                    {pekerjaanOptions[formData.jenisAsuransi]?.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Produk Asuransi - Hanya tampil jika Askrida */}
                {formData.jenisAsuransi === 'Askrida' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Produk Asuransi
                    </label>
                    <select
                      name="produkAsuransi"
                      value={formData.produkAsuransi}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih Produk Asuransi</option>
                      {produkAsuransiOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Jumlah Pengajuan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Pengajuan
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                    <input
                      type="text"
                      name="jumlahPengajuan"
                      value={formData.jumlahPengajuan}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Jangka Waktu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jangka Waktu (Bulan)
                  </label>
                  <input
                    type="number"
                    name="jangkaWaktu"
                    value={formData.jangkaWaktu}
                    onChange={handleInputChange}
                    placeholder="12"
                    min="1"
                    max="240"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Biaya Provisi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Provisi
                  </label>
                  <select
                    name="biayaProvisi"
                    value={formData.biayaProvisi}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Biaya Provisi</option>
                    {biayaProvisiOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Biaya Notaris */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Notaris
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                    <input
                      type="text"
                      name="biayaNotaris"
                      value={formData.biayaNotaris}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Jenis Pengikatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Pengikatan
                  </label>
                  <select
                    name="jenisPengikatan"
                    value={formData.jenisPengikatan}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Jenis Pengikatan</option>
                    {jenisPengikatanOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Pelunasan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pelunasan (Opsional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                    <input
                      type="text"
                      name="pelunasan"
                      value={formData.pelunasan}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={calculateLoan}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Hitung Simulasi
                </button>
                {calculation && (
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
                  >
                    Print
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Hasil Perhitungan */}
          <div className="bg-white rounded-lg shadow-lg p-6 print-area">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hasil Perhitungan</h2>
            
            {calculation ? (
              <div className="space-y-6">
                {/* Data Nasabah - Format sesuai gambar */}
                <div className="space-y-3">
                  <table className="w-full print-table border-collapse">
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 w-1/3 text-left">Nama</td>
                        <td className="py-2 px-3 text-sm text-gray-900 border-b border-gray-200 text-right">{formData.namaLengkap}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Tanggal Lahir & Usia</td>
                        <td className="py-2 px-3 text-sm text-gray-900 border-b border-gray-200 text-right">
                          {formatDateToDDMMYYYY(formData.tanggalLahir)} ({calculateAge(formData.tanggalLahir)} tahun)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Pengajuan</td>
                        <td className="py-2 px-3 text-sm text-gray-900 border-b border-gray-200 text-right">{formatCurrency(calculation.jumlahPengajuan)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Jangka Waktu</td>
                        <td className="py-2 px-3 text-sm text-gray-900 border-b border-gray-200 text-right">{formData.jangkaWaktu} bulan</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Bunga</td>
                        <td className="py-2 px-3 text-sm text-gray-900 border-b border-gray-200 text-right">{formData.biayaProvisi}% per tahun</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium text-left">Angsuran</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right">{formatCurrency(calculation.angsuranBulanan)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Hasil Perhitungan - Format sesuai gambar */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Hasil Perhitungan</h3>
                  <table className="w-full print-table border-collapse">
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Plafond</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right border-b border-gray-200">{formatCurrency(calculation.jumlahPengajuan)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Biaya Provisi ({formData.biayaProvisi}%)</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right border-b border-gray-200">{formatCurrency(calculation.biayaProvisi)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Biaya Notaris</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right border-b border-gray-200">{formatCurrency(calculation.biayaNotaris)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Premi Asuransi ({formData.jenisAsuransi})</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right border-b border-gray-200">{formatCurrency(calculation.premiAsuransi)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Tabungan Wajib (3%)</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right border-b border-gray-200">{formatCurrency(calculation.tabunganWajib)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Cadangan Angsuran (1x)</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right border-b border-gray-200">{formatCurrency(calculation.cadanganAngsuran)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm text-gray-700 font-medium border-b border-gray-200 text-left">Pelunasan</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right border-b border-gray-200">{formatCurrency(calculation.pelunasan)}</td>
                      </tr>
                      <tr className="border-t-2 border-gray-400">
                        <td className="py-3 px-3 text-sm text-gray-900 font-bold bg-gray-50 text-left">Total Biaya</td>
                        <td className="py-3 px-3 text-sm text-gray-900 font-bold text-right bg-gray-50">
                          {formatCurrency(calculation.totalBiaya)}
                        </td>
                      </tr>
                      <tr className="bg-green-100">
                        <td className="py-3 px-3 text-sm text-green-800 font-bold text-left">Total Dana Diterima</td>
                        <td className="py-3 px-3 text-sm text-green-800 font-bold text-right">
                          {formatCurrency(calculation.totalDanaDiterima)}
                        </td>
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
