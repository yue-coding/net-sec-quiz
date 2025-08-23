How to add images to questions

1) Put your image files under `public/images/` (you can create subfolders). Example: `public/images/ddos-taxonomy-1.png`.

2) In `public/questions.json`, add the optional fields on a question:

{
  // ...existing question fields
  "image": "/images/ddos-taxonomy-1.png",
  "imageAlt": "DOS Taxonomy: match types to descriptions"
}

Notes
- Paths are from the site root because Vite serves `public/` at `/`.
- Prefer PNG or WebP; keep width <= 1600px to save bandwidth.
- You can add 10+ images at once—just drop them in `public/images/` and reference as needed; no code changes required.
- Images show on both the quiz question and the review screen.
