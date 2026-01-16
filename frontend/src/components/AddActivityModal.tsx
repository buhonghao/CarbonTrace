import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  useCarbonStore,
  ActivityCategory,
  activityPresets,
  categoryNames,
  categoryColors,
  carbonFactors
} from '../store/carbonStore'

interface Props {
  onClose: () => void
}

export default function AddActivityModal({ onClose }: Props) {
  const { addActivity } = useCarbonStore()
  const [category, setCategory] = useState<ActivityCategory>('transport')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [amount, setAmount] = useState('')

  const presets = activityPresets[category]

  const handleSubmit = () => {
    if (!selectedPreset || !amount) return

    const preset = presets.find(p => p.name === selectedPreset)
    if (!preset) return

    const carbonKg = carbonFactors[preset.factor] * parseFloat(amount)

    addActivity({
      category,
      name: `${preset.name} ${amount}${preset.unit}`,
      carbonKg,
      isReduction: preset.isReduction || false,
    })

    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 拖动条 */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 标题 */}
        <div className="px-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-carbon-dark">记录碳排放</h2>
          <p className="text-sm text-carbon-muted">选择活动类型和数量</p>
        </div>

        {/* 分类选择 */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(Object.keys(categoryNames) as ActivityCategory[]).filter(c => c !== 'other').map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setSelectedPreset(null)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'text-white'
                    : 'bg-gray-100 text-carbon-muted'
                }`}
                style={category === cat ? { backgroundColor: categoryColors[cat] } : {}}
              >
                {categoryNames[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* 活动选择 */}
        <div className="px-6 py-4">
          <p className="text-sm text-carbon-muted mb-3">选择活动</p>
          <div className="grid grid-cols-3 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset.name)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPreset === preset.name
                    ? 'border-carbon-leaf bg-carbon-leaf/5'
                    : 'border-gray-200'
                }`}
              >
                <span className="text-2xl block mb-2">{preset.icon}</span>
                <span className="text-sm font-medium text-carbon-dark">{preset.name}</span>
                {preset.isReduction && (
                  <span className="block text-xs text-carbon-leaf mt-1">减碳</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 数量输入 */}
        {selectedPreset && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-4 border-t border-gray-100"
          >
            <p className="text-sm text-carbon-muted mb-3">
              输入数量（{presets.find(p => p.name === selectedPreset)?.unit}）
            </p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="例如：10"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-carbon-leaf focus:outline-none"
            />

            {amount && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-carbon-muted">预计碳排放</span>
                  <span className="text-2xl font-bold" style={{ color: categoryColors[category] }}>
                    {(carbonFactors[presets.find(p => p.name === selectedPreset)!.factor] * parseFloat(amount || '0')).toFixed(2)} kg
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 提交按钮 */}
        <div className="px-6 py-6 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={!selectedPreset || !amount}
            className={`w-full py-4 rounded-xl font-bold text-white transition-colors ${
              selectedPreset && amount
                ? 'bg-gradient-leaf'
                : 'bg-gray-300'
            }`}
          >
            确认记录
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
