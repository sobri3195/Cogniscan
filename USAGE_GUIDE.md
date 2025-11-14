# Panduan Penggunaan - Rontgen/CT-Scan AI Interpreter

## 📋 Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Mengatur API Key](#mengatur-api-key)
3. [Membuat Interpretasi Baru](#membuat-interpretasi-baru)
4. [Melihat dan Mengelola Riwayat](#melihat-dan-mengelola-riwayat)
5. [Tips dan Best Practices](#tips-dan-best-practices)

---

## 1. Persiapan Awal

### Mendapatkan OpenAI API Key

1. Kunjungi [OpenAI Platform](https://platform.openai.com/api-keys)
2. Login atau daftar akun OpenAI
3. Buat API Key baru
4. Salin API Key (dimulai dengan `sk-...`)
5. **Penting:** Simpan API Key dengan aman, tidak akan ditampilkan lagi

### Menjalankan Aplikasi

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

Aplikasi akan buka di browser pada `http://localhost:3000`

---

## 2. Mengatur API Key

### Langkah-langkah:

1. **Buka Menu Settings**
   - Klik menu "⚙️ Settings" di navigation bar

2. **Input API Key**
   - Paste API Key OpenAI Anda di field "OpenAI API Key"
   - Gunakan tombol 👁️ Show/Hide untuk melihat/menyembunyikan key

3. **Pilih Model AI**
   - Recommended: `GPT-4O Mini` (cepat & ekonomis)
   - Alternatif: `GPT-4O` atau `GPT-4 Turbo` (lebih detail, lebih mahal)

4. **Atur Preferensi Lainnya**
   - Batas ukuran upload (default: 5MB)
   - Tema (Light/Dark)
   - Bahasa (Indonesia/English)

5. **Simpan Pengaturan**
   - Klik tombol "💾 Simpan Pengaturan"
   - Tunggu notifikasi "✓ Tersimpan!"

---

## 3. Membuat Interpretasi Baru

### A. Input Data Pemeriksaan

1. **Klik "➕ Buat Baru"** atau **"+ Buat Interpretasi Baru"**

2. **Pilih Area Pemeriksaan** (wajib)
   - Thorax (Foto Dada)
   - Kepala (CT Brain)
   - Ginjal
   - Abdomen
   - Tulang/Ortopedi
   - Lainnya

3. **Isi Data Pasien** (opsional tapi disarankan)
   - Usia pasien (contoh: 45)
   - Jenis kelamin
   - Catatan klinis singkat (contoh: "Pasien mengeluh nyeri dada, riwayat merokok")

### B. Upload Gambar

1. **Klik "📁 Pilih Gambar"**
   - Format: JPG atau PNG
   - Ukuran: Maksimal sesuai setting (default 5MB)

2. **Preview & Adjust**
   - Gunakan **🔍+ Zoom In** untuk memperbesar
   - Gunakan **🔍- Zoom Out** untuk memperkecil
   - Gunakan **🔄 Rotate** untuk memutar 90°
   - Gunakan **↺ Reset View** untuk reset semua

### C. Interpretasi AI

#### Opsi 1: Cek Kualitas Gambar (Opsional)

1. **Klik "🔍 Cek Kualitas Gambar"**
2. Tunggu proses (~5-10 detik)
3. Review hasil penilaian kualitas:
   - Kecerahan & kontras
   - Kejelasan detail anatomi
   - Positioning
   - Artifacts

#### Opsi 2: Interpretasi Langsung

1. **Klik "🤖 Interpretasi dengan AI"**
2. Tunggu proses (~15-30 detik)
   - Loading indicator akan muncul
   - Progress text menunjukkan status
3. Setelah selesai, otomatis redirect ke halaman detail

---

## 4. Melihat dan Mengelola Riwayat

### Dashboard

**Menu: 📊 Dashboard**
- Lihat statistik hari ini & minggu ini
- Monitor tingkat kekhawatiran
- Quick access ke 5 interpretasi terakhir

### Halaman Riwayat

**Menu: 📋 Riwayat**

#### Filter & Pencarian

1. **Filter by Area Pemeriksaan**
   - Dropdown: Semua Area, Thorax, Kepala, dll.

2. **Filter by Tingkat Risiko**
   - Dropdown: Semua Tingkat, Rendah, Sedang, Tinggi

3. **Filter by Tanggal**
   - Dari Tanggal: Pilih tanggal mulai
   - Sampai Tanggal: Pilih tanggal akhir

4. **Pencarian Cepat**
   - Ketik keyword (area, diagnosis, dll.)

5. **Reset Filter**
   - Klik "Reset Filter" untuk clear semua filter

#### Aksi pada Interpretasi

- **Lihat**: Buka detail lengkap
- **Hapus**: Hapus interpretasi (dengan konfirmasi)

### Halaman Detail

**Akses: Klik "Lihat Detail" dari Dashboard atau Riwayat**

#### Apa yang Bisa Dilakukan:

1. **Preview Gambar**
   - Zoom, rotate gambar medis
   - Reset view

2. **Baca Interpretasi Lengkap**
   - Formatted result dari AI
   - Semua findings & recommendations

3. **Tambah/Edit Catatan Staf**
   - Klik "✏️ Edit Catatan"
   - Tulis observasi tambahan
   - Klik "Simpan Catatan"

4. **Export Hasil**
   - **📋 Salin**: Copy interpretasi ke clipboard
   - **💾 Download**: Download sebagai file .txt

---

## 5. Tips dan Best Practices

### Untuk Kualitas Interpretasi Terbaik

#### Upload Gambar Berkualitas

✅ **DO:**
- Gunakan gambar dengan resolusi tinggi
- Pastikan exposure yang baik (tidak terlalu terang/gelap)
- Upload gambar yang jelas dan tajam
- Posisi anatomis yang benar

❌ **DON'T:**
- Gambar blur atau pecah
- Screenshot dengan kualitas rendah
- Gambar dengan banyak artifacts
- Foto miring atau tidak proper

#### Isi Data Pasien

✅ **Recommended:**
- Isi usia pasien (membantu konteks interpretasi)
- Isi jenis kelamin (penting untuk beberapa kondisi)
- Tulis catatan klinis yang relevan:
  - Keluhan utama
  - Riwayat penyakit
  - Trauma/accident jika ada

Contoh catatan klinis yang baik:
```
"Pasien laki-laki 52 tahun, keluhan batuk produktif 2 minggu, 
demam hilang timbul, riwayat merokok 20 tahun, 
pemeriksaan fisik: ronki basah basal bilateral"
```

#### Pilih Area Pemeriksaan yang Tepat

Pastikan pilih area yang sesuai dengan gambar:
- **Thorax**: Foto dada PA/AP/Lateral
- **Kepala (CT Brain)**: CT scan kepala
- **Ginjal**: BNO (foto polos abdomen untuk urolithiasis)
- **Abdomen**: Foto abdomen/USG abdomen
- **Tulang**: Foto rontgen extremitas/spine

### Interpretasi Hasil AI

#### Memahami Tingkat Kekhawatiran

🟢 **Rendah (Low)**
- Temuan minor atau normal variants
- Tidak ada tanda emergency
- Follow-up rutin cukup

🟡 **Sedang (Medium)**
- Ada temuan abnormal
- Perlu evaluasi lebih lanjut
- Monitoring diperlukan

🔴 **Tinggi (High)**
- Temuan signifikan/urgent
- Potensial emergency
- Perlu konsultasi segera dengan dokter

#### Catatan Penting

⚠️ **DISCLAIMER PENTING:**

> **Interpretasi AI adalah alat bantu, BUKAN diagnosis final.**
> 
> - Hasil HARUS ditinjau oleh radiolog/dokter profesional
> - Jangan gunakan sebagai dasar keputusan medis tunggal
> - Untuk kondisi emergency, segera konsultasi dengan dokter
> - AI dapat membuat error - verifikasi manual wajib dilakukan

### Keamanan Data

#### API Key Security

- ✅ Simpan API Key dengan aman
- ✅ Jangan share API Key ke orang lain
- ✅ Rotate API Key secara berkala
- ❌ Jangan commit API Key ke version control
- ❌ Jangan screenshot settings dengan API Key visible

#### Data Pasien

- ✅ Informasi pasien bersifat opsional
- ✅ Data disimpan lokal (browser localStorage)
- ✅ Tidak ada transmisi ke server eksternal (kecuali OpenAI untuk interpretasi)
- ✅ Gunakan "Hapus Semua Data" jika sharing komputer

### Troubleshooting

#### "API Key belum diatur"
→ Pergi ke Settings dan input API Key OpenAI

#### "Gagal melakukan interpretasi"
→ Cek:
- API Key valid dan memiliki credit
- Koneksi internet stabil
- Ukuran file tidak melebihi batas
- Format file JPG/PNG

#### "Format file harus JPG atau PNG"
→ Convert gambar ke format yang didukung

#### "Ukuran file maksimal X MB"
→ Compress gambar atau tingkatkan limit di Settings

#### Hasil interpretasi tidak sesuai
→ Pastikan:
- Area pemeriksaan dipilih dengan benar
- Gambar berkualitas baik
- Data klinis informatif

---

## 🎓 Tutorial Singkat

### Workflow Standar (5 Menit)

1. **Setup** (1x saja)
   ```
   Settings → Input API Key → Simpan
   ```

2. **Buat Interpretasi**
   ```
   Buat Baru → 
   Pilih Area → 
   Isi Data Pasien → 
   Upload Gambar → 
   (Opsional: Cek Kualitas) → 
   Interpretasi AI → 
   Tunggu Hasil
   ```

3. **Review & Export**
   ```
   Baca Hasil → 
   Tambah Catatan Staf → 
   Salin/Download
   ```

4. **Manajemen**
   ```
   Lihat Riwayat → 
   Filter by Area/Tanggal → 
   Review Interpretasi Lama
   ```

---

## 📞 Support

Jika ada pertanyaan atau masalah:
- Baca dokumentasi di README.md
- Check FEATURES.md untuk daftar fitur lengkap
- Review troubleshooting section di atas

---

**Selamat Menggunakan!** 🎉

Sistem ini dirancang untuk membantu tenaga medis dalam interpretasi awal gambar radiologi.
Selalu konsultasikan dengan profesional medis untuk keputusan akhir.
