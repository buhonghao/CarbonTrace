/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          leaf: '#22C55E',      // 环保绿
          earth: '#78350F',     // 大地棕
          sky: '#0EA5E9',       // 天空蓝
          sun: '#F59E0B',       // 阳光黄
          dark: '#0F172A',      // 深色背景
          bg: '#F0FDF4',        // 淡绿背景
          muted: '#64748B',     // 次要文字
        }
      },
      backgroundImage: {
        'gradient-leaf': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'gradient-earth': 'linear-gradient(135deg, #78350F 0%, #92400E 100%)',
        'gradient-sky': 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      }
    },
  },
  plugins: [],
}
