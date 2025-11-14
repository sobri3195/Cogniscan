# Rontgen/CT-Scan AI Interpreter - Admin Panel

Admin panel berbasis web untuk interpretasi gambar Rontgen dan CT-Scan menggunakan AI (OpenAI GPT-4 Vision).

## 🎯 Fitur Utama

### 1. Dashboard Admin
- Ringkasan jumlah interpretasi (hari ini / minggu ini)
- Statistik tingkat kekhawatiran AI (rendah / sedang / tinggi)
- Riwayat 5 interpretasi terakhir
- Status layanan AI

### 2. Buat Interpretasi Baru
**A. Input Data Pemeriksaan:**
- Area pemeriksaan: Thorax, Abdomen, Ginjal, Kepala (CT Brain), Tulang/Ortopedi, Lainnya
- Data pasien opsional: Usia, Jenis Kelamin, Catatan Klinis

**B. Upload & Preview Gambar:**
- Upload gambar (JPG/PNG)
- Tools: Zoom, Rotate, Pan, Reset
- Validasi kualitas dan ukuran file

**C. Aksi AI:**
- Cek Kualitas Gambar (opsional)
- Interpretasi dengan AI

### 3. Hasil Interpretasi AI
Format interpretasi berdasarkan area pemeriksaan:

**Thorax (Foto Dada):**
- Identitas & Teknik (Proyeksi, KV, Simetri, Inspirasi)
- Jaringan Lunak & Tulang
- Mediastinum (Trakea, Jantung)
- Parenkim Paru
- Impresi & Diagnosis

**CT Brain:**
- Soft Tissue & Bone Window
- Brain Parenchyma
- Ventricular System
- Cisterna Basalis
- Midline Shift

**Ginjal/Abdomen:**
- Struktur ginjal
- Batu ginjal
- Obstruksi & Hidronefrosis
- Vesika Urinaria

### 4. Riwayat Interpretasi
- Tabel daftar interpretasi
- Filter: Area, Tingkat risiko, Rentang tanggal
- Pencarian cepat
- Detail interpretasi

### 5. Halaman Detail
- Preview gambar dengan tools
- Interpretasi lengkap
- Catatan staf (editable)
- Salin & Download hasil

### 6. Pengaturan Sistem
- Input API Key OpenAI
- Pilih model AI
- Batas ukuran upload
- Tema & Bahasa

## 🚀 Instalasi & Menjalankan

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- OpenAI API Key

### Instalasi

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## 🔑 Konfigurasi API Key

1. Buka menu **Settings**
2. Masukkan OpenAI API Key Anda
3. Pilih model AI (recommended: GPT-4O Mini)
4. Simpan pengaturan

Dapatkan API Key dari: https://platform.openai.com/api-keys

## 📦 Teknologi yang Digunakan

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **OpenAI API** - AI Image Interpretation
- **LocalStorage** - Data Persistence

## 🔒 Keamanan & Privasi

- Tidak menggunakan login/autentikasi
- API Key disimpan lokal di browser (localStorage)
- Gambar medis hanya dikirim ke OpenAI untuk interpretasi
- Data interpretasi disimpan lokal, tidak ke server eksternal
- Informasi pasien bersifat opsional

## ⚠️ Disclaimer

**Interpretasi ini otomatis oleh AI dan bukan diagnosis medis.**

Hasil interpretasi harus ditinjau dan dikonfirmasi oleh dokter atau radiolog profesional. Sistem ini adalah alat bantu dan tidak menggantikan penilaian klinis profesional.

## 📝 Lisensi

ISC

## 👨‍💻 Kontributor

Dikembangkan untuk Cogniscan

---

**Catatan:** Pastikan untuk menjaga kerahasiaan API Key dan data pasien sesuai regulasi privasi medis yang berlaku.
