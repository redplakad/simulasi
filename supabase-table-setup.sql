-- SQL script to create the simulasi_kredit table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS simulasi_kredit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    produk_kredit VARCHAR(50),
    tanggal_lahir DATE,
    jenis_asuransi VARCHAR(50),
    pekerjaan VARCHAR(100),
    produk_asuransi VARCHAR(100),
    jumlah_pengajuan DECIMAL(15,2),
    jangka_waktu INTEGER,
    bunga DECIMAL(8,4),
    biaya_provisi DECIMAL(8,4),
    biaya_notaris DECIMAL(15,2),
    jenis_pengikatan VARCHAR(50),
    pelunasan DECIMAL(15,2),
    -- Hasil perhitungan
    hasil_biaya_provisi DECIMAL(15,2),
    hasil_premi_asuransi DECIMAL(15,2),
    hasil_angsuran_bulanan DECIMAL(15,2),
    hasil_tabungan_wajib DECIMAL(15,2),
    hasil_cadangan_angsuran DECIMAL(15,2),
    hasil_total_biaya DECIMAL(15,2),
    hasil_total_dana_diterima DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_simulasi_kredit_created_at ON simulasi_kredit(created_at);

-- Create an index on nama_lengkap for searching
CREATE INDEX IF NOT EXISTS idx_simulasi_kredit_nama ON simulasi_kredit(nama_lengkap);

-- Enable Row Level Security (RLS) for security
ALTER TABLE simulasi_kredit ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow insert for all users" ON simulasi_kredit;
DROP POLICY IF EXISTS "Allow select for all users" ON simulasi_kredit;

-- Create a policy to allow anyone to insert data (for the simulation app)
CREATE POLICY "Allow insert for all users" ON simulasi_kredit
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Create a policy to allow reading data (optional - you can modify this based on your needs)
CREATE POLICY "Allow select for all users" ON simulasi_kredit
FOR SELECT TO anon, authenticated
USING (true);
