export default function Header() {
  return (
    <header className="bg-gradient-leaf text-white sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 max-w-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">CarbonTrace</h1>
            <p className="text-xs text-white/70">碳足迹计算器</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/70">今日</p>
          <p className="text-lg font-bold">{new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</p>
        </div>
      </div>
    </header>
  )
}
