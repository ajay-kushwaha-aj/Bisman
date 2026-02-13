/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blush:      "#FADADD",
        cream:      "#FFF8F0",
        "deep-rose":"#D63384",
        lavender:   "#E6E6FA",
        "rose-mid": "#E91E8C",
        "rose-dark":"#9b1f3a",
        "rose-lite":"#FFB6C1",
        petal:      "#FDE8EE",
        "gold-warm":"#D4A24A",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        poppins:  ["Poppins", "sans-serif"],
      },
      keyframes: {
        heartbeat: {
          "0%,100%": { transform: "scale(1)" },
          "14%":     { transform: "scale(1.22)" },
          "28%":     { transform: "scale(1)" },
          "42%":     { transform: "scale(1.14)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400% center" },
          "100%": { backgroundPosition: "400% center" },
        },
        floatUp: {
          "0%":   { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "8%":   { opacity: "0.8" },
          "92%":  { opacity: "0.35" },
          "100%": { transform: "translateY(-110vh) rotate(720deg)", opacity: "0" },
        },
        twinkle: {
          "0%,100%": { opacity: "0.15", transform: "scale(1)" },
          "50%":     { opacity: "1",    transform: "scale(1.7)" },
        },
        ribbonFloat: {
          "0%,100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%":     { transform: "translateY(-6px) rotate(-2deg)" },
        },
        goldGlow: {
          "0%,100%": { textShadow: "0 0 20px rgba(212,162,74,.4)" },
          "50%":     { textShadow: "0 0 60px rgba(212,162,74,.9), 0 0 120px rgba(212,162,74,.35)" },
        },
      },
      animation: {
        heartbeat:    "heartbeat 2.5s ease-in-out infinite",
        shimmer:      "shimmer 5s linear infinite",
        "float-up":   "floatUp linear infinite",
        twinkle:      "twinkle 3s ease-in-out infinite",
        "ribbon-float":"ribbonFloat 4s ease-in-out infinite",
        "gold-glow":  "goldGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
