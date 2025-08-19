
# BREWn - Oxtcoffea ☕

**Personal Coffee Brew Calculator & Catalogs**

Built with [Next.js 15](https://nextjs.org/), [TailwindCSS 4](https://tailwindcss.com/), and Radix UI components for maximum performance and accessibility.

## ☕ Story

It all started with curiosity—just wanting to know more about coffee: what it is, how to brew it, its history, and the many techniques used by world champions.  

As I went deeper, I realized I needed something to help me brew more **consistently and structured**. That’s when I decided to build a simple website (yes, just a static one!) to guide me through manual brewing.  

This little project helped me solve a few problems:
- I can now **try out champion brewing techniques** directly from my browser.  
- Water measurement follows the correct **coffee-to-water ratio**.  
- I get to **experiment and create my own brewing methods**.  

As someone who tends to forget recipes easily, this site became a kind of **personal reminder and brewing companion**.  

I’m still just a **beginner home brewer**, but through this, I can at least enjoy champion-style coffee—made with my own (still learning) hands.  

Try the prototype 👉 [ui-brewn-calculator.vercel.app](https://ui-brewn-calculator.vercel.app/)


## 🤖 AI Recipe Helper

If you need AI assistance to create a new manual brew recipe, use the prompt in the following format.
The results can be used immediately on the **Make Your Own** page.

```
Give me a medium roast V60 recipe with 15 grams of coffee for a balanced cup, including blooming and multiple pours.

create your result with this format, and dont add anythings else:
{
  "title": "<Method name>",
  "creator": "<Creator of method>",
  "tags": [
    "filter",
    "v60"
  ],
  "coffeeGram": <recommend coffee in gram ::int>,
  "grindSize": "<choose between : 'fine|medium-fine|medium|medium-coarse|coarse'>",
  "roastLevel": "<choose between : 'light|medium-light|medium|medium-dark|dark'>",
  "waterTemp": <water temperature ::int>,
  "schedules": [
    {
      "id": 1,
      "time": <start seconds each schedule ::int>,
      "endTime": <end seconds each schedule ::int>,
      "volume": <how many water ml each schedule ::int>,
      "label": "<a label or name of schedule>"
    }
  ]
}
```


## 📦 Getting Started

### Clone the repository

```bash
git clone https://github.com/oktapiancaw/ui-brewn-calculator.git
cd ui-brewn-calculator
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


## 🐳 Docker

### Build Docker image

```bash
docker build -t ui-brewn-calculator .
```

### Run Docker container

```bash
docker run -p 3000:3000 ui-brewn-calculator
```


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


## 📄 License

MIT License © 2025 Oktapian
