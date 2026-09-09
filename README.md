# 🚀 PHP Compiler & Interactive IDE

> **PHP Compiler For Eternity Global Innovation PHP Course Class !!**  
> Developed for seamless, in-browser PHP compilation and live preview.

An ultra-modern, high-performance, mobile-responsive **PHP Compiler & Playground** built with **Next.js**, **React**, and **Vanilla CSS**. Features a browser execution engine capable of running mixed **PHP**, **HTML**, **CSS**, and **JavaScript**, multi-file virtual tabs with individual file downloads, Monaco Editor with rich syntax highlighting & autocomplete, and a clean **Trust Blue** light theme.

[![Open on GitHub](https://img.shields.io/badge/GitHub-devfahimbd%2Fphpcompilor-2563eb?style=flat-square&logo=github)](https://github.com/devfahimbd/phpcompilor)
[![PHP](https://img.shields.io/badge/PHP-8.3-777bb4?style=flat-square&logo=php)](https://php.net)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## ✨ Features

- ⚡ **Full Mixed-Code Execution**: Write standard PHP (`<?php ... ?>`, `<?= ... ?>`) alongside HTML5, CSS styles, and JavaScript scripts—everything compiles and renders seamlessly!
- 📁 **Multi-File Virtual Tabs**: Create virtual files (`index.php`, `data.php`, `style.css`, `script.js`), switch between tabs, rename files, and include files using `include 'data.php'`.
- 💾 **Per-File & ZIP Downloads**: Direct download button on every file tab, plus a one-click **Download All (ZIP)** export option.
- 🎨 **Trust Blue Light Theme**: Clean, distraction-free aesthetic crafted with crisp whites (`#ffffff`, `#f8fafc`), Trust Blue primary accents (`#2563eb`), and refined micro-animations.
- 💡 **Monaco Code Editor**: Powered by the same editor engine as VS Code and Antigravity IDE:
  - Custom PHP syntax highlighting (keywords, functions, strings, tags, variables).
  - Built-in suggestions & snippet autocomplete for PHP tags, control loops, standard library functions, and superglobals.
  - Bracket pair colorization, line numbers, code folding, and document formatting.
- 📱 **100% Mobile Responsive**: Dedicated bottom tab bar for mobile screens to toggle between Code Editor and Live Preview with zero friction.
- 🌐 **Netlify & Static Hosting Ready**: Client-side execution architecture allows zero-server deployments on Netlify, Vercel, or GitHub Pages.
- 🔗 **GitHub Integration**: Direct repository button in the top navigation bar linking to [https://github.com/devfahimbd/phpcompilor](https://github.com/devfahimbd/phpcompilor).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/)
- **Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Packaging & Archives**: [JSZip](https://stuk.github.io/jszip/)
- **Visuals**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Modern Vanilla CSS with CSS Custom Properties

---

## 🚀 Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/devfahimbd/phpcompilor.git
cd phpcompilor
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start compiling PHP code!

---

## ☁️ Deploy to Netlify

This project is built to deploy on **Netlify** effortlessly:

1. Connect your repository on [Netlify](https://app.netlify.com/).
2. Build command: `npm run build`
3. Publish directory: `.next` (or default Next.js build setup with `@netlify/plugin-nextjs`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
