/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16231D',
        surface: '#FFFFFF',
        canvas: '#F4F6F3',
        line: '#DCE3DA',
        brand: {
          50: '#EAF6E8',
          100: '#CDEBC8',
          300: '#7FC46F',
          500: '#2F8F3B',
          600: '#256E2E',
          700: '#1C5423',
        },
        signal: {
          orange: '#E5762A',
          amber: '#C98A1E',
          red: '#C4462B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
};
