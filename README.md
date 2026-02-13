# 💕 Valentine's Day & 1st Anniversary — Bisman Kaur
### React 18 + TypeScript + Tailwind CSS + Framer Motion

---

## 🚀 Run Locally (3 Steps)

### Prerequisites
- **Node.js v18+** → [nodejs.org](https://nodejs.org)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# → http://localhost:5173
```

### Build & Deploy
```bash
npm run build        # creates /dist folder
npm run preview      # preview production build
```

**Deploy free on Vercel / Netlify:** just drag the `/dist` folder!

---

## ✨ All Features

| Feature | Details |
|---|---|
| 🎬 **Loading Screen** | Animated hearts intro with progress bar |
| 🏠 **Hero** | Shimmer name, anniversary ribbon badge, floating hearts |
| 🎮 **3 Games** | Catch Hearts · NO Button Trap · Love Quiz |
| 📸 **Photo Gallery** | Polaroid frames, hover quotes, click-to-open modal |
| 🎁 **Surprise Me** | 9 unique surprises (letter, confetti, wedding predictor, countdown, midnight mode, puzzle...) |
| 💌 **Love Letter** | Animated glassmorphism love letter |
| 🌟 **Anniversary** | Dark cinematic section, starfield, 8 reasons |
| 🌙 **Midnight Mode** | Full site dark theme toggle (via Surprise button!) |
| 🎵 **Music Player** | Web Audio API ambient piano, bottom-right 🎶 button |
| 🔮 **Easter Egg** | Type "i love you ajay" → fireworks + secret message! |

---

## 🎮 Games

### Game 1: Catch My Heart
Click falling hearts to collect 20 within 60 seconds!
Final message: *"You already caught my heart forever 💘"*

### Game 2: Are You Mine Forever?
Try to click the NO button — it runs away! 😂
After 8 attempts the NO button disappears entirely.

### Game 3: Love Quiz
5 questions about your relationship.
Final message: *"You know us perfectly. Marry me someday? 😏"*

---

## 📸 Adding Real Photos

In `src/App.tsx`, find the `PHOTOS` array and update each item.
In the `PhotoGallery` component, replace the placeholder div with:

```tsx
<img
  src="/photos/photo1.jpg"
  alt="Our memory"
  style={{ width:"100%", height:220, objectFit:"cover" }}
/>
```

Put photos in the `/public/photos/` folder.

---

## 🔮 Easter Egg
She types **"i love you ajay"** on the keyboard → fireworks explode + big "I love you more ❤️" message appears!

---

## 🛠 Tech Stack
| Library | Version | Use |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 11.3 | Animations |
| Web Audio API | native | Ambient music |

---

Made with ❤️ for **Bisman Kaur** · February 14, 2026
