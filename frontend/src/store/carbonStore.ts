import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 碳排放活动类型
export type ActivityCategory = 'transport' | 'food' | 'energy' | 'shopping' | 'other'

// 活动记录
export interface CarbonActivity {
  id: string
  category: ActivityCategory
  name: string
  carbonKg: number // 碳排放量（kg CO2）
  timestamp: number
  isReduction: boolean // 是否为减碳行为
}

// 碳排放因子（kg CO2）
export const carbonFactors = {
  // 交通
  car_km: 0.21,           // 私家车每公里
  bus_km: 0.089,          // 公交每公里
  subway_km: 0.035,       // 地铁每公里
  bike_km: 0,             // 自行车
  walk_km: 0,             // 步行
  plane_km: 0.255,        // 飞机每公里
  train_km: 0.041,        // 高铁每公里

  // 饮食
  beef_meal: 6.61,        // 牛肉餐
  pork_meal: 1.72,        // 猪肉餐
  chicken_meal: 0.98,     // 鸡肉餐
  vegetarian_meal: 0.39,  // 素食餐

  // 能源
  electricity_kwh: 0.785, // 电力每度
  natural_gas_m3: 2.09,   // 天然气每立方米

  // 购物
  clothes_item: 10,       // 一件新衣服
  electronics: 50,        // 电子产品
  plastic_bag: 0.01,      // 塑料袋
}

// 活动预设
export const activityPresets: Record<ActivityCategory, Array<{
  name: string
  factor: keyof typeof carbonFactors
  unit: string
  icon: string
  isReduction?: boolean
}>> = {
  transport: [
    { name: '开车', factor: 'car_km', unit: '公里', icon: '🚗' },
    { name: '公交', factor: 'bus_km', unit: '公里', icon: '🚌', isReduction: true },
    { name: '地铁', factor: 'subway_km', unit: '公里', icon: '🚇', isReduction: true },
    { name: '骑车', factor: 'bike_km', unit: '公里', icon: '🚲', isReduction: true },
    { name: '步行', factor: 'walk_km', unit: '公里', icon: '🚶', isReduction: true },
    { name: '飞机', factor: 'plane_km', unit: '公里', icon: '✈️' },
    { name: '高铁', factor: 'train_km', unit: '公里', icon: '🚄', isReduction: true },
  ],
  food: [
    { name: '牛肉餐', factor: 'beef_meal', unit: '餐', icon: '🥩' },
    { name: '猪肉餐', factor: 'pork_meal', unit: '餐', icon: '🍖' },
    { name: '鸡肉餐', factor: 'chicken_meal', unit: '餐', icon: '🍗' },
    { name: '素食餐', factor: 'vegetarian_meal', unit: '餐', icon: '🥗', isReduction: true },
  ],
  energy: [
    { name: '用电', factor: 'electricity_kwh', unit: '度', icon: '⚡' },
    { name: '天然气', factor: 'natural_gas_m3', unit: '立方米', icon: '🔥' },
  ],
  shopping: [
    { name: '新衣服', factor: 'clothes_item', unit: '件', icon: '👕' },
    { name: '电子产品', factor: 'electronics', unit: '件', icon: '📱' },
    { name: '塑料袋', factor: 'plastic_bag', unit: '个', icon: '🛍️' },
  ],
  other: [],
}

// 类别中文名
export const categoryNames: Record<ActivityCategory, string> = {
  transport: '交通出行',
  food: '饮食',
  energy: '能源',
  shopping: '购物',
  other: '其他',
}

// 类别颜色
export const categoryColors: Record<ActivityCategory, string> = {
  transport: '#0EA5E9',
  food: '#F59E0B',
  energy: '#EF4444',
  shopping: '#8B5CF6',
  other: '#64748B',
}

interface CarbonState {
  activities: CarbonActivity[]
  dailyGoal: number // 每日碳排放目标（kg）
  qiwenApiKey: string

  addActivity: (activity: Omit<CarbonActivity, 'id' | 'timestamp'>) => void
  removeActivity: (id: string) => void
  clearActivities: () => void

  setDailyGoal: (goal: number) => void
  setQiwenApiKey: (key: string) => void

  // 计算属性
  getTodayCarbon: () => number
  getTodayReduction: () => number
  getWeekCarbon: () => number
  getCategoryStats: () => Record<ActivityCategory, number>
}

export const useCarbonStore = create<CarbonState>()(
  persist(
    (set, get) => ({
      activities: [],
      dailyGoal: 8, // 默认每日目标8kg CO2
      qiwenApiKey: '',

      addActivity: (activity) => set((state) => ({
        activities: [
          {
            ...activity,
            id: Date.now().toString(),
            timestamp: Date.now(),
          },
          ...state.activities,
        ]
      })),

      removeActivity: (id) => set((state) => ({
        activities: state.activities.filter(a => a.id !== id)
      })),

      clearActivities: () => set({ activities: [] }),

      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      setQiwenApiKey: (key) => set({ qiwenApiKey: key }),

      getTodayCarbon: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStart = today.getTime()

        return get().activities
          .filter(a => a.timestamp >= todayStart && !a.isReduction)
          .reduce((sum, a) => sum + a.carbonKg, 0)
      },

      getTodayReduction: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStart = today.getTime()

        return get().activities
          .filter(a => a.timestamp >= todayStart && a.isReduction)
          .reduce((sum, a) => sum + a.carbonKg, 0)
      },

      getWeekCarbon: () => {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

        return get().activities
          .filter(a => a.timestamp >= weekAgo && !a.isReduction)
          .reduce((sum, a) => sum + a.carbonKg, 0)
      },

      getCategoryStats: () => {
        const stats: Record<ActivityCategory, number> = {
          transport: 0,
          food: 0,
          energy: 0,
          shopping: 0,
          other: 0,
        }

        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

        get().activities
          .filter(a => a.timestamp >= weekAgo && !a.isReduction)
          .forEach(a => {
            stats[a.category] += a.carbonKg
          })

        return stats
      },
    }),
    {
      name: 'carbon-trace-storage',
    }
  )
)
