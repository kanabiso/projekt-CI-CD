/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '440px': '440px',
        '2px': '2px',
        '1px': '1px',
        '94%': '96%',
        '90%': '85%'
      },
      colors: {
        app: '#1F2937',
      },
    },
    
    screens: {
      'xs': '100px',
      // => @media (min-width: 100px) { ... }
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '810px',
      // => @media (min-width: 768px) { ... }

      'lg': '1040px',
      // => @media (min-width: 1040px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    
  },
  plugins: [],
}

