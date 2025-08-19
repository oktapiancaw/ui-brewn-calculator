
# BREWn - Oxtcoffea ☕

**Personal Coffee Brew Calculator & Catalogs**


Built with [Next.js 15](https://nextjs.org/), [TailwindCSS 4](https://tailwindcss.com/), and Radix UI components for maximum performance and accessibility.

---

## 🚀 Features

- Dynamic brew calculator (gram, ratio, pour)
- Coffee method & recipe catalogs
- Theme switching (light/dark)
- Mobile-friendly UI

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Library**: Radix UI + Lucide Icons
- **Deployment**: Docker-ready

---

## 📦 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/brewn-static-page.git
cd brewn-static-page
````

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker

### Build Docker image

```bash
docker build -t brewn-static-page .
```

### Run Docker container

```bash
docker run -p 3000:3000 brewn-static-page
```

---

## 📁 Project Structure

```
.
├── app/                # Next.js App Router pages/components
├── components/         # Reusable UI components
├── public/             # Static assets
├── styles/             # Tailwind/global CSS
├── next.config.ts      # Next.js configuration
├── Dockerfile          # Production-ready Dockerfile
└── ...
```

---

## 🧪 Lint & Build

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
npm start
```

---

## 📄 License

MIT License © 2025 Oktapian
