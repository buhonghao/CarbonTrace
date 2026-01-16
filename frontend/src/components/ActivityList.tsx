import { motion } from 'framer-motion'
import { useCarbonStore, categoryNames, categoryColors, ActivityCategory } from '../store/carbonStore'

export default function ActivityList() {
  const { activities, removeActivity } = useCarbonStore()

  // 获取今天的活动
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStart = today.getTime()

  const todayActivities = activities.filter(a => a.timestamp >= todayStart)

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (todayActivities.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-carbon-leaf/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-carbon-leaf" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
          </svg>
        </div>
        <p className="text-carbon-muted">今天还没有记录</p>
        <p className="text-sm text-carbon-muted/70 mt-1">点击上方快捷按钮开始记录</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-4">
      <h2 className="text-lg font-bold text-carbon-dark mb-4">今日记录</h2>

      <div className="space-y-3">
        {todayActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
          >
            <div
              className="category-icon"
              style={{ backgroundColor: `${categoryColors[activity.category]}20` }}
            >
              <span className="text-xl">
                {getCategoryIcon(activity.category)}
              </span>
            </div>

            <div className="flex-1">
              <p className="font-medium text-carbon-dark">{activity.name}</p>
              <div className="flex items-center gap-2 text-xs text-carbon-muted">
                <span>{categoryNames[activity.category]}</span>
                <span>·</span>
                <span>{formatTime(activity.timestamp)}</span>
              </div>
            </div>

            <div className="text-right">
              <p
                className="font-bold"
                style={{ color: activity.isReduction ? '#22C55E' : categoryColors[activity.category] }}
              >
                {activity.isReduction ? '-' : '+'}{activity.carbonKg.toFixed(2)} kg
              </p>
              <p className="text-xs text-carbon-muted">CO₂</p>
            </div>

            <button
              onClick={() => removeActivity(activity.id)}
              className="p-2 text-carbon-muted/50 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function getCategoryIcon(category: ActivityCategory): string {
  const icons: Record<ActivityCategory, string> = {
    transport: '🚗',
    food: '🍽️',
    energy: '⚡',
    shopping: '🛒',
    other: '📦',
  }
  return icons[category]
}
