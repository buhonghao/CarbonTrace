/**
 * CarbonTrace - 碳足迹计算边缘函数
 * 边缘计算优势：
 * 1. 碳排放因子边缘缓存，毫秒级查询
 * 2. 统计数据边缘聚合，快速响应
 * 3. AI减碳建议边缘生成
 */

interface Env {
  QIWEN_API_KEY?: string
}

// 碳排放因子数据库（边缘缓存）
const carbonFactors = {
  // 交通 (kg CO2 per unit)
  transport: {
    car_km: { factor: 0.21, unit: 'km', name: '私家车', description: '汽油车每公里' },
    bus_km: { factor: 0.089, unit: 'km', name: '公交车', description: '公交每公里' },
    subway_km: { factor: 0.035, unit: 'km', name: '地铁', description: '地铁每公里' },
    bike_km: { factor: 0, unit: 'km', name: '自行车', description: '零排放出行' },
    walk_km: { factor: 0, unit: 'km', name: '步行', description: '零排放出行' },
    plane_km: { factor: 0.255, unit: 'km', name: '飞机', description: '航空每公里' },
    train_km: { factor: 0.041, unit: 'km', name: '高铁', description: '高铁每公里' },
    ev_km: { factor: 0.053, unit: 'km', name: '电动车', description: '纯电动车每公里' },
  },
  // 饮食
  food: {
    beef_meal: { factor: 6.61, unit: '餐', name: '牛肉餐', description: '一份牛肉餐' },
    pork_meal: { factor: 1.72, unit: '餐', name: '猪肉餐', description: '一份猪肉餐' },
    chicken_meal: { factor: 0.98, unit: '餐', name: '鸡肉餐', description: '一份鸡肉餐' },
    fish_meal: { factor: 0.84, unit: '餐', name: '鱼肉餐', description: '一份鱼肉餐' },
    vegetarian_meal: { factor: 0.39, unit: '餐', name: '素食餐', description: '一份素食餐' },
    milk_liter: { factor: 1.39, unit: 'L', name: '牛奶', description: '一升牛奶' },
  },
  // 能源
  energy: {
    electricity_kwh: { factor: 0.785, unit: 'kWh', name: '用电', description: '中国电网平均' },
    natural_gas_m3: { factor: 2.09, unit: 'm³', name: '天然气', description: '天然气每立方米' },
    coal_kg: { factor: 2.77, unit: 'kg', name: '煤炭', description: '煤炭每公斤' },
  },
  // 购物
  shopping: {
    clothes_item: { factor: 10, unit: '件', name: '新衣服', description: '一件普通衣物' },
    electronics_small: { factor: 20, unit: '件', name: '小家电', description: '手机、耳机等' },
    electronics_large: { factor: 100, unit: '件', name: '大家电', description: '电视、冰箱等' },
    plastic_bag: { factor: 0.01, unit: '个', name: '塑料袋', description: '一个塑料袋' },
  },
}

// 减碳建议
const reductionTips = [
  { tip: '短途出行选择步行或骑车', savings: '每公里节省0.21kg' },
  { tip: '多吃蔬菜少吃牛肉', savings: '每餐可减少6kg' },
  { tip: '随手关灯节约用电', savings: '每度电节省0.78kg' },
  { tip: '购物时自带环保袋', savings: '每次节省0.01kg' },
  { tip: '选择公共交通出行', savings: '比开车减少60%排放' },
  { tip: '空调温度调高1度', savings: '节省约10%用电' },
  { tip: '购买二手物品', savings: '减少生产环节排放' },
  { tip: '减少外卖包装', savings: '减少一次性用品' },
]

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context
  const url = new URL(request.url)

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const cache = caches.default

    // 获取碳排放因子（边缘缓存1小时）
    if (url.pathname === '/api/factors') {
      const cacheKey = new Request('https://cache/carbon-factors')
      let cached = await cache.match(cacheKey)

      if (cached) {
        return new Response(cached.body, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
        })
      }

      const response = new Response(JSON.stringify(carbonFactors), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=3600' }
      })
      await cache.put(cacheKey, response.clone())

      return new Response(JSON.stringify(carbonFactors), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
      })
    }

    // 计算碳排放
    if (url.pathname === '/api/calculate' && request.method === 'POST') {
      const body = await request.json() as {
        category: string
        type: string
        amount: number
      }

      const categoryData = carbonFactors[body.category as keyof typeof carbonFactors]
      if (!categoryData) {
        return new Response(JSON.stringify({ error: '无效的分类' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const factorData = categoryData[body.type as keyof typeof categoryData]
      if (!factorData) {
        return new Response(JSON.stringify({ error: '无效的活动类型' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const carbonKg = factorData.factor * body.amount

      return new Response(JSON.stringify({
        category: body.category,
        type: body.type,
        amount: body.amount,
        unit: factorData.unit,
        carbonKg,
        description: factorData.description,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 获取减碳建议
    if (url.pathname === '/api/tips') {
      const cacheKey = new Request('https://cache/carbon-tips')
      let cached = await cache.match(cacheKey)

      if (cached) {
        return new Response(cached.body, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
        })
      }

      // 随机返回3条建议
      const shuffled = [...reductionTips].sort(() => Math.random() - 0.5)
      const tips = shuffled.slice(0, 3)

      const response = new Response(JSON.stringify({ tips }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=300' }
      })
      await cache.put(cacheKey, response.clone())

      return new Response(JSON.stringify({ tips }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
      })
    }

    // AI个性化减碳建议
    if (url.pathname === '/api/ai-advice' && request.method === 'POST') {
      const body = await request.json() as {
        weekCarbon: number
        topCategory: string
        apiKey?: string
      }

      const apiKey = body.apiKey || env.QIWEN_API_KEY

      if (!apiKey) {
        // 无API Key时返回通用建议
        return new Response(JSON.stringify({
          advice: `您本周碳排放${body.weekCarbon.toFixed(1)}kg，主要来自${body.topCategory}。建议减少该类活动的碳排放。`,
          source: 'local'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const advice = await getAIAdvice(apiKey, body.weekCarbon, body.topCategory)

      return new Response(JSON.stringify({ advice, source: 'ai' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 健康检查
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'CarbonTrace',
        timestamp: Date.now(),
        edge: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      error: '服务异常',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// 获取AI减碳建议
async function getAIAdvice(apiKey: string, weekCarbon: number, topCategory: string): Promise<string> {
  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的碳减排顾问。请根据用户的碳排放数据，给出简洁实用的减碳建议。建议要具体可行，不超过100字。'
        },
        {
          role: 'user',
          content: `我本周碳排放${weekCarbon.toFixed(1)}kg，主要来自${topCategory}类活动。请给我一些减碳建议。`
        }
      ],
      max_tokens: 200
    })
  })

  const data = await response.json() as {
    choices?: Array<{
      message?: {
        content?: string
      }
    }>
  }

  return data.choices?.[0]?.message?.content || '保持良好的低碳生活习惯，多使用公共交通，减少不必要的消费。'
}

export default { onRequest }
