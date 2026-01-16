import { motion } from 'framer-motion'

interface Props {
  value: number
  max: number
}

export default function CarbonGauge({ value, max }: Props) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 80 // r = 80
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // 根据百分比确定颜色
  const getColor = () => {
    if (percentage < 50) return '#22C55E' // 绿色
    if (percentage < 80) return '#F59E0B' // 黄色
    return '#EF4444' // 红色
  }

  // 等效树木数量（一棵树每年吸收约21kg CO2）
  const treesNeeded = (value / 21 * 365).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm mb-6"
    >
      <div className="flex items-center justify-between">
        {/* 仪表盘 */}
        <div className="relative carbon-gauge">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {/* 背景圆环 */}
            <circle
              cx="100"
              cy="100"
              r="80"
              className="carbon-gauge-ring"
              transform="rotate(-90 100 100)"
            />
            {/* 进度圆环 */}
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              className="carbon-gauge-progress"
              stroke={getColor()}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              transform="rotate(-90 100 100)"
            />
          </svg>

          {/* 中心数值 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              key={value}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-carbon-dark"
            >
              {value.toFixed(1)}
            </motion.p>
            <p className="text-sm text-carbon-muted">kg CO₂</p>
          </div>
        </div>

        {/* 右侧信息 */}
        <div className="flex-1 ml-4 space-y-3">
          <div>
            <p className="text-sm text-carbon-muted">今日目标</p>
            <p className="text-2xl font-bold text-carbon-dark">{max} kg</p>
          </div>

          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              style={{ backgroundColor: getColor() }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <p className="text-xs text-carbon-muted">
            {percentage < 100
              ? `还剩 ${(max - value).toFixed(1)} kg 配额`
              : '已超出今日目标！'}
          </p>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-carbon-muted">
              需要 <span className="text-carbon-leaf font-bold">{treesNeeded}</span> 棵树抵消全年排放
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
