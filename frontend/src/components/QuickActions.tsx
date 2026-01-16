import { motion } from 'framer-motion'
import { useCarbonStore, carbonFactors } from '../store/carbonStore'

interface Props {
  onAdd: () => void
}

// 快捷操作
const quickActions = [
  { name: '开车10km', carbon: carbonFactors.car_km * 10, icon: '🚗', color: '#0EA5E9' },
  { name: '吃牛肉餐', carbon: carbonFactors.beef_meal, icon: '🥩', color: '#F59E0B' },
  { name: '用电10度', carbon: carbonFactors.electricity_kwh * 10, icon: '⚡', color: '#EF4444' },
  { name: '骑车5km', carbon: 0, icon: '🚲', color: '#22C55E', isReduction: true },
]

export default function QuickActions({ onAdd }: Props) {
  const { addActivity } = useCarbonStore()

  const handleQuickAdd = (action: typeof quickActions[0]) => {
    addActivity({
      category: 'transport', // 简化处理
      name: action.name,
      carbonKg: action.carbon,
      isReduction: action.isReduction || false,
    })
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-carbon-dark">快捷记录</h2>
        <button
          onClick={onAdd}
          className="text-sm text-carbon-leaf font-medium"
        >
          全部活动
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleQuickAdd(action)}
            className="activity-card p-3 flex flex-col items-center gap-2"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${action.color}20` }}
            >
              {action.icon}
            </div>
            <span className="text-xs text-carbon-dark font-medium text-center leading-tight">
              {action.name}
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: action.color }}
            >
              {action.isReduction ? '减碳' : `+${action.carbon.toFixed(1)}kg`}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
