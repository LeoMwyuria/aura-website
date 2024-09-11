/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right, #DA58CD, #585DDA)',
      },
      colors: {
        'custom-blue': '#DFF0FC',
        'custom-purple': '#DA58CD',
        'custom-dot': '#585DDA',
        'custom-gray': '#D0D0D0', 
        'custom-white': '#FFFFFF', 
        'leaderboard-first':'#693F00',
        'leaderboard-first-bg': '#FFD02B',
        'leaderboard-first-border':'#FFA800',
        'leaderboard-second':'#4B5256',
        'leaderboard-second-bg':'#CCD8DF',
        'leaderboard-second-border':'#ABB4B9',
        'leaderboard-third': '#B76E00',
        'leaderboard-third-bg':'#7F4006',
        'leaderboard-third-border':'#603A0E',
        'login-btn-default':'#B9BAE1',
        'login-btn-active':'#585DDA',
        

      },
      boxShadow: {
        'custom': '0px 0px 8px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
