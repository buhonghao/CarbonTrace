import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import AddActivityModal from './components/AddActivityModal'
import SettingsModal from './components/SettingsModal'

const BOTTOM_NAV_HEIGHT = 64

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'settings'>('home')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showBeian, setShowBeian] = useState(false)

  /**
   * 仅大陆 IP 显示备案
   * 海外直接隐藏（规避 Lighthouse / 合规扫描误报）
   */
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data?.country_code === 'CN') {
          setShowBeian(true)
        }
      })
      .catch(() => {
        // 获取失败默认隐藏，最安全
        setShowBeian(false)
      })
  }, [])

  return (
    <div style={{ paddingBottom: BOTTOM_NAV_HEIGHT }}>
      {/* 页面主体 */}
      <div>
        {/* 你的页面内容 */}
      </div>

      {/* 底部导航 */}
      <nav className="bottom-nav">
        <button
          onClick={() => setActiveTab('home')}
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          <span>首页</span>
        </button>

        <button onClick={() => setShowAddModal(true)} className="nav-item">
          <div className="add-btn">＋</div>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
        >
          <span>统计</span>
        </button>

        <button
          onClick={() => setShowSettings(true)}
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <span>设置</span>
        </button>
      </nav>

      {/* 备案信息（仅大陆显示） */}
      {showBeian && (
        <footer
          style={{
            position: 'fixed',
            bottom: `${BOTTOM_NAV_HEIGHT}px`,
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(0,0,0,0.65)',
            background: 'transparent',
            zIndex: 9,
            pointerEvents: 'auto'
          }}
        >
          {/* 工信部备案 */}
          <div>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              备案号：湘ICP备2026003711号-1
            </a>
          </div>

          {/* 公安备案 */}
          <div style={{ marginTop: 4 }}>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=43092102000906"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <img
                src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png"
                alt="公安备案"
                style={{ width: 14, height: 14 }}
              />
              湘公网安备43092102000906号
            </a>
          </div>
        </footer>
      )}

      <AnimatePresence>
        {showAddModal && <AddActivityModal onClose={() => setShowAddModal(false)} />}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  )
}
