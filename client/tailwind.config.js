/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vedic: {
          saffron: "#FF6F00",
          saffronDark: "#E65100",
          saffronLight: "#FFF3E0",
          gold: "#D4AF37",
          goldLight: "#FBF5E6",
          maroon: "#800020",
          maroonDark: "#4A0012",
          sacredRed: "#C2185B",
          terracotta: "#B23A22",
          sandstone: "#EFE6DD",
          deepNavy: "#0B192C",
          templeGray: "#1E201E",
          ivory: "#FAFAF5"
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Rozha One"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'temple': '0 10px 25px -5px rgba(212, 175, 55, 0.15), 0 8px 10px -6px rgba(128, 0, 32, 0.1)',
        'sacred': '0 4px 20px -2px rgba(230, 81, 0, 0.25)',
      }
    },
  },
  plugins: [],
}

