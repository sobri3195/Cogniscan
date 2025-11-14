# 🚀 Quick Start Guide

## Get Started in 5 Minutes!

### Prerequisites
- Node.js 18+ installed
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

---

## Step 1: Installation

```bash
# Clone the repository
git clone https://github.com/sobri3195/Cogniscan.git
cd Cogniscan

# Install dependencies
npm install
```

---

## Step 2: Run the Application

```bash
# Start development server
npm run dev
```

The application will open in your browser at `http://localhost:3000`

---

## Step 3: Configure API Key

1. Click on **⚙️ Settings** in the navigation bar
2. Paste your OpenAI API Key in the "OpenAI API Key" field
3. Select model: **GPT-4O Mini** (recommended)
4. Click **💾 Simpan Pengaturan**

✅ Done! You're ready to use the application.

---

## Step 4: Create Your First Interpretation

1. Click **➕ Buat Baru** (Create New)
2. Select **Examination Area** (e.g., Thorax)
3. *(Optional)* Fill in patient data
4. Click **📁 Pilih Gambar** to upload an X-ray/CT image
5. Click **🤖 Interpretasi dengan AI**
6. Wait 15-30 seconds for AI analysis
7. Review the results!

---

## 📚 Next Steps

- Read the [Complete Usage Guide](USAGE_GUIDE.md)
- Check out [All Features](FEATURES.md)
- Review [Project Documentation](README.md)

---

## 🆘 Troubleshooting

### "API Key belum diatur"
→ Go to Settings and enter your OpenAI API Key

### Build errors during installation
```bash
# Try cleaning and reinstalling
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# The app will automatically try port 3001, 3002, etc.
# Or you can specify a different port:
PORT=3001 npm run dev
```

---

## 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` folder.

---

## 🎉 You're All Set!

Start interpreting medical images with AI assistance.

**Remember:** Always consult with medical professionals. AI interpretation is a tool, not a replacement for professional diagnosis.

---

**Need Help?** Check the [Usage Guide](USAGE_GUIDE.md) or [README](README.md)
