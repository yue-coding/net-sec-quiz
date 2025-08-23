# Net Sec Quiz

A fast, responsive quiz app with delightful motion.

## Edit questions

- File: `public/questions.json`
- Each item:
  - id: string
  - prompt: string
  - choices: string[] (2+)
  - answerIndex: number (0-based)
  - explanation?: string
  - tag?: string
  - difficulty?: easy|medium|hard

VS Code will validate against `public/questions.schema.json`.

## Run locally

```powershell
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```powershell
npm run build
npm run preview
```

## Deploy to Netlify

- Connect the repo in Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- netlify.toml is included for SPA routing

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion

## UX details

- Keyboard shortcuts: 1-9 to pick, Enter to confirm
- Accessible focus styles
- Mobile-friendly layout