/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0C831F",
          greenDark: "#086518",
          greenLight: "#E8F5E9",
          yellow: "#F8CB46",
          yellowLight: "#FFF3C4",
          yellowPale: "#FFFBEA",
          dark: "#1F1F1F",
          muted: "#666666",
          lightMuted: "#8F8F8F",
          border: "#E8E8E8",
          bg: "#F7F8F7",
          cardBg: "#FFFFFF",
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.06)',
        'blinkit': '0 4px 16px rgba(12, 131, 31, 0.15)',
        'float': '0 10px 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
