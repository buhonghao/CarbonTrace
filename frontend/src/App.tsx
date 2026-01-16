import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useCarbonStore } from './store/carbonStore'
import Header from './components/Header'
import CarbonGauge from './components/CarbonGauge'
import QuickActions from './components/QuickActions'
import ActivityList from './components/ActivityList'
import AddActivityModal from './components/AddActivityModal'
import StatsPanel from './components/StatsPanel'
import SettingsModal from './components/SettingsModal'

type TabType = 'home' | 'stats' | 'settings'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const { getTodayCarbon, dailyGoal } = useCarbonStore()
  const todayCarbon = getTodayCarbon()

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-lg">
        {activeTab === 'home' && (
          <>
            <CarbonGauge value={todayCarbon} max={dailyGoal} />
            <QuickActions onAdd={() => setShowAddModal(true)} />
            <ActivityList />
          </>
        )}

        {activeTab === 'stats' && <StatsPanel />}
      </main>

      {/* 底部导航 */}
      <nav className="bottom-nav">
        <button
          onClick={() => setActiveTab('home')}
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className="text-xs">首页</span>
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="nav-item"
        >
          <div className="w-12 h-12 -mt-6 bg-gradient-leaf rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
          </svg>
          <span className="text-xs">统计</span>
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          <span className="text-xs">设置</span>
        </button>
      </nav>

      <AnimatePresence>
        {showAddModal && <AddActivityModal onClose={() => setShowAddModal(false)} />}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  )
}
