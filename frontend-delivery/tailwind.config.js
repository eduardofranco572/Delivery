/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
        colors: {
            background: 'var(--color-background)',
            card: 'rgb(var(--color-card) / <alpha-value>)',
            primary: 'rgb(var(--color-primary) / <alpha-value>)',
            green: 'var(--color-green)',
            subtext: 'var(--color-subtext)',
            gray: 'var(--color-gray)', 
        },
        backgroundImage: {
            'brand-gradient': 'var(--gradient-brand)'
        },
        keyframes: {
            'slide-in-right': {
                '0%': { transform: 'translateX(100%)' },
                '100%': { transform: 'translateX(0)' }
            },
            'scale-x-in': {
                '0%': { transform: 'scaleX(0)' },
                '100%': { transform: 'scaleX(1)' }
            }
        },
        animation: {
            'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
            'scale-x-in': 'scale-x-in forwards'
        }
    },
  },
  plugins: [],
}