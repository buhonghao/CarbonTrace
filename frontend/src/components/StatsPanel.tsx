import { motion } from 'framer-motion'
import { useCarbonStore, categoryNames, categoryColors, ActivityCategory } from '../store/carbonStore'

export default function StatsPanel() {
  const { getWeekCarbon, getCategoryStats, activities } = useCarbonStore()

  const weekCarbon = getWeekCarbon()
  const categoryStats = getCategoryStats()
  const totalCategory = Object.values(categoryStats).reduce((a, b) => a + b, 0)

  // 计算减碳量
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weekReduction = activities
    .filter(a => a.timestamp >= weekAgo && a.isReduction)
    .reduce((sum, a) => sum + a.carbonKg, 0)

  // 等效数据
  const treesEquiv = (weekCarbon / 21 * 52).toFixed(1) // 年均需要的树
  const carKmEquiv = (weekCarbon / 0.21).toFixed(0) // 等效开车公里数

  return (
    <div className="space-y-6">
      {/* 周统计卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6"
      >
        <h2 className="text-lg font-bold text-carbon-dark mb-4">本周碳排放</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card">
            <p className="text-sm text-carbon-muted">总排放</p>
            <p className="text-3xl font-bold text-carbon-dark">{weekCarbon.toFixed(1)}</p>
            <p className="text-xs text-carbon-muted">kg CO₂</p>
          </div>

          <div className="stat-card">
            <p className="text-sm text-carbon-muted">已减碳</p>
            <p className="text-3xl font-bold text-carbon-leaf">{weekReduction.toFixed(1)}</p>
            <p className="text-xs text-carbon-muted">kg CO₂</p>
          </div>
        </div>

        {/* 等效数据 */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-carbon-leaf/10 flex items-center justify-center tree-icon">
              <span className="text-xl">🌳</span>
            </div>
            <div>
              <p className="text-lg font-bold text-carbon-dark">{treesEquiv}</p>
              <p className="text-xs text-carbon-muted">棵树/年抵消</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-carbon-sky/10 flex items-center justify-center">
              <span className="text-xl">🚗</span>
            </div>
            <div>
              <p className="text-lg font-bold text-carbon-dark">{carKmEquiv}</p>
              <p className="text-xs text-carbon-muted">km开车等效</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 分类占比 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6"
      >
        <h2 className="text-lg font-bold text-carbon-dark mb-4">排放来源</h2>

        {totalCategory === 0 ? (
          <p className="text-center text-carbon-muted py-8">暂无数据</p>
        ) : (
          <div className="space-y-4">
            {(Object.entries(categoryStats) as [ActivityCategory, number][])
              .filter(([, value]) => value > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, value], index) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryColors[cat] }}
                      />
                      <span className="text-sm text-carbon-dark">{categoryNames[cat]}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-carbon-dark">
                        {value.toFixed(1)} kg
                      </span>
                      <span className="text-xs text-carbon-muted ml-2">
                        {((value / totalCategory) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      style={{ backgroundColor: categoryColors[cat] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / totalCategory) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>

      {/* 减碳建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-leaf text-white rounded-3xl p-6"
      >
        <h2 className="text-lg font-bold mb-3">减碳小贴士</h2>
        <ul className="space-y-2 text-sm text-white/90">
          <li className="flex items-start gap-2">
            <span>🚲</span>
            <span>短途出行选择步行或骑车，每公里可减少0.21kg碳排放</span>
          </li>
          <li className="flex items-start gap-2">
            <span>🥗</span>
            <span>多吃蔬菜少吃牛肉，一顿素食比牛肉餐减少6kg碳排放</span>
          </li>
          <li className="flex items-start gap-2">
            <span>💡</span>
            <span>随手关灯，每节约1度电就减少0.78kg碳排放</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}
