# Net Sec Quiz 🛡️

Georgia Tech–branded quiz experience for the OMSCS CS6262 cohort, built with smooth motion and thoughtful accessibility.

## Features ✨

- Topic filter that builds options directly from `meta.topic` values in `public/questions.json`
- Smart question count selector (5/10/20/33) with automatic 5-question sessions for topic-specific drills
- One-tap **New Session** reshuffle, animated question transitions, and keyboard shortcuts (1-9 + Enter)

## Edit questions ✏️

- File: `public/questions.json`
- Each item:
  - `id`: string | number
  - `questionText`: string
  - `options`: string[] (2+)
  - `correctAnswer`: string[] (allows radio or checkbox questions)
  - `answerType`: `'radio' | 'checkbox'`
  - `meta` (optional): `{ sourceFile?: string; pageNumber?: number; topic?: string; week?: number }`

VS Code validates edits via `public/questions.schema.json`.

## Run locally 💻

```powershell
npm install
npm run dev
```

Then open http://localhost:5173

## Build 🏗️

```powershell
npm run build
npm run preview
```

## Deploy to Netlify 🚀

- Connect the repo in Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- netlify.toml is included for SPA routing

## Stack 🧱

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion

## UX details 🎨

- Keyboard shortcuts: 1-9 to pick, Enter to confirm
- Accessible focus styles
- Mobile-friendly layout

## Contributing 🤝

1. Fork or clone https://github.com/daveymason/net-sec-quiz
2. Add or update question sets in `public/questions.json` (schema above) and run `npm run build`
3. Open a pull request so the cohort can benefit from the new material

## Thank you 🙏

A big thank you to the TA's who kept us sane with the projects. 