/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'primary-hover': '#1a1a1a',
        secondary: '#888888',
        muted: '#AAAAAA',
        light: '#FAFAFA',
        nude: '#F3EDE8',
        border: '#E5E5E5',
        'border-dark': '#333333',
        sale: '#8B0000',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['var(--font-josefin)', 'sans-serif'],
        body: ['var(--font-lato)', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.15em',
        'wide-title': '0.2em',
        logo: '0.25em',
      },
    },
  },
  plugins: [],
}
