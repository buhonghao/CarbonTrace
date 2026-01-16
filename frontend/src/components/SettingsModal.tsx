import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCarbonStore } from '../store/carbonStore'

interface Props {
  onClose: () => void
}

export default function SettingsModal({ onClose }: Props) {
  const { dailyGoal, setDailyGoal, qiwenApiKey, setQiwenApiKey, clearActivities } = useCarbonStore()
  const [goal, setGoal] = useState(dailyGoal.toString())
  const [apiKey, setApiKey] = useState(qiwenApiKey)

  const handleSave = () => {
    setDailyGoal(parseFloat(goal) || 8)
    setQiwenApiKey(apiKey)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-carbon-dark">设置</h2>
          <button onClick={onClose} className="p-2 text-carbon-muted">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 设置内容 */}
        <div className="p-6 space-y-6">
          {/* 每日目标 */}
          <div>
            <label className="block text-sm font-medium text-carbon-dark mb-2">
              每日碳排放目标 (kg CO₂)
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-carbon-leaf focus:outline-none"
            />
            <p className="text-xs text-carbon-muted mt-2">
              全球人均每日约22kg，低碳生活建议控制在8kg以内
            </p>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-carbon-dark mb-2">
              通义千问 API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-carbon-leaf focus:outline-none"
            />
            <p className="text-xs text-carbon-muted mt-2">
              配置后可使用AI智能减碳建议功能
            </p>
          </div>

          {/* 边缘计算说明 */}
          <div className="p-4 rounded-xl bg-carbon-leaf/5 border border-carbon-leaf/20">
            <h4 className="text-sm font-medium text-carbon-leaf mb-2">边缘计算优势</h4>
            <ul className="text-xs text-carbon-muted space-y-1">
              <li>- 碳排放因子边缘缓存，毫秒级计算</li>
              <li>- 活动数据本地存储，保护隐私</li>
              <li>- 统计报表边缘生成，快速响应</li>
              <li>- PWA支持，离线也能记录</li>
            </ul>
          </div>

          {/* 清空数据 */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                if (confirm('确定要清空所有记录吗？此操作不可恢复。')) {
                  clearActivities()
                }
              }}
              className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors"
            >
              清空所有记录
            </button>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-leaf text-white rounded-xl font-bold"
          >
            保存设置
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
