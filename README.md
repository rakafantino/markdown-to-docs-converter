# Markdown to Document Converter

Sebuah aplikasi web modern yang memungkinkan Anda mengkonversi dokumen Markdown ke format PDF dan DOCX dengan mudah. Dibangun menggunakan Next.js 15, TypeScript, dan shadcn/ui dengan dukungan dark mode.

## ✨ Fitur Utama

- **Konversi Multi-Format**: Konversi Markdown ke PDF dan DOCX
- **Live Preview**: Preview real-time dengan 3 mode tampilan:
  - Live Preview (styling default)
  - PDF Style Preview (tampilan seperti PDF)
  - DOCX Style Preview (tampilan seperti dokumen Word)
- **Dark Mode**: Dukungan penuh untuk tema gelap dan terang
- **Modern UI**: Interface yang bersih dan responsif menggunakan shadcn/ui
- **Syntax Highlighting**: Dukungan untuk code blocks dengan highlighting
- **Responsive Design**: Tampilan optimal di desktop dan mobile

## 🚀 Demo

Aplikasi ini mendukung berbagai elemen Markdown:

- **Headers** (H1, H2, H3)
- **Text formatting** (bold, italic)
- **Lists** (ordered dan unordered)
- **Code blocks** dengan syntax highlighting
- **Blockquotes** dengan styling yang konsisten
- **Links** dan formatting lainnya

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Markdown Processing**: remark dan remark-html
- **PDF Generation**: jsPDF dengan html2canvas
- **DOCX Generation**: html-to-docx
- **File Handling**: file-saver
- **Icons**: Lucide React

## 📦 Instalasi

### Prerequisites

- Node.js 18+
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/rakafantino/markdown-to-docs-converter.git
   cd markdown-to-docs-converter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Jalankan development server**

   ```bash
   npm run dev
   ```

4. **Buka aplikasi**
   Akses `http://localhost:3000` di browser Anda

## 🎯 Cara Penggunaan

### 1. Input Markdown

- Ketik atau paste konten Markdown di textarea sebelah kiri
- Preview akan muncul secara real-time di sebelah kanan

### 2. Pilih Format Preview

- **Live Preview**: Tampilan default dengan styling web
- **PDF Style**: Preview bagaimana dokumen akan terlihat dalam format PDF
- **DOCX Style**: Preview bagaimana dokumen akan terlihat dalam format Word

### 3. Konversi Dokumen

- Masukkan nama file yang diinginkan
- Klik tombol "Convert to PDF" atau "Convert to DOCX"
- File akan otomatis terdownload

### 4. Dark Mode

- Klik toggle di pojok kanan atas untuk beralih antara tema terang dan gelap
- Semua preview mode mendukung dark mode dengan kontras yang optimal

## 📁 Struktur Project

```
markdown-to-docs-converter/
├── src/
│   ├── app/
│   │   ├── api/convert/          # API endpoint untuk konversi
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main page component
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── theme-provider.tsx    # Theme context provider
│   │   └── theme-toggle.tsx      # Dark mode toggle
│   └── lib/
│       └── utils.ts              # Utility functions
├── public/                       # Static assets
├── components.json               # shadcn/ui configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json                 # Dependencies dan scripts
```

## 🔧 Scripts yang Tersedia

```bash
# Development
npm run dev          # Jalankan development server

# Production
npm run build        # Build aplikasi untuk production
npm run start        # Jalankan production server

# Code Quality
npm run lint         # Jalankan ESLint
npm run lint:fix     # Fix ESLint errors otomatis
```

## 🎨 Kustomisasi

### Mengubah Styling Preview

Anda dapat mengkustomisasi styling untuk preview PDF dan DOCX di file `src/app/page.tsx`:

```typescript
// PDF Preview Styling
if (previewFormat === "pdf") {
  return `<style>
    .pdf-preview { /* Custom PDF styles */ }
  </style><div class="pdf-preview">${processedContent}</div>`;
}

// DOCX Preview Styling
if (previewFormat === "docx") {
  return `<style>
    .docx-preview { /* Custom DOCX styles */ }
  </style><div class="docx-preview">${processedContent}</div>`;
}
```

### Menambah Tema Baru

Untuk menambah tema baru, edit file `tailwind.config.js` dan tambahkan warna custom di bagian `theme.extend.colors`.

## 🐛 Troubleshooting

### Build Warnings

Jika Anda melihat warning tentang multiple lockfiles:

```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
```

Ini adalah warning normal dan tidak mempengaruhi fungsionalitas aplikasi.

### Module 'encoding' Not Found

Warning tentang module 'encoding' di html-to-docx adalah normal dan tidak mempengaruhi konversi DOCX.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch untuk fitur baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lengkap.

## 👨‍💻 Author

Dibuat dengan ❤️ oleh [Raka Fantino](https://github.com/rakafantino)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [remark](https://remark.js.org/) - Markdown processor

---

**Catatan**: Aplikasi ini dioptimalkan untuk penggunaan modern browser dengan dukungan ES6+.
