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
          saffron: "#D35400",
          saffronDark: "#B84300",
          saffronLight: "#FFF3E0",
          gold: "#C89B3C",
          goldLight: "#FDF7EB",
          maroon: "#781822",
          maroonDark: "#5A0D15",
          sacredRed: "#9E1B32",
          terracotta: "#B23A22",
          sandstone: "#FBF8F3",
          sandstoneDark: "#EFE6D5",
          sandstoneBorder: "#E8DFC8",
          deepNavy: "#0B192C",
          templeGray: "#1E201E",
          ivory: "#FFFFFF"
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Rozha One"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'temple': '0 10px 25px -5px rgba(200, 155, 60, 0.15), 0 8px 10px -6px rgba(120, 24, 34, 0.1)',
        'sacred': '0 4px 20px -2px rgba(211, 84, 0, 0.25)',
      }
    },
  },
  plugins: [],
}

