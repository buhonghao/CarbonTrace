# CarbonTrace 碳足迹计算器

> 个人碳足迹追踪与减碳助手，记录日常活动碳排放，助力低碳生活

![CarbonTrace](https://img.shields.io/badge/CarbonTrace-碳足迹-22C55E?style=for-the-badge)
![ESA Powered](https://img.shields.io/badge/ESA-Edge%20Powered-0EA5E9?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-支持离线-F59E0B?style=for-the-badge)

## 本项目由[阿里云ESA](https://www.aliyun.com/product/esa)提供加速、计算和保护
![阿里云ESA](https://img.alicdn.com/imgextra/i3/O1CN01H1UU3i1Cti9lYtFrs_!!6000000000139-2-tps-7534-844.png)

## 项目简介

CarbonTrace 是一款个人碳足迹计算与追踪工具。通过记录日常出行、饮食、用电等活动，自动计算碳排放量，帮助用户了解自己的环境影响，并提供个性化的减碳建议。

### 核心功能

- **快捷记录** - 一键记录常见碳排放活动
- **实时计算** - 基于科学碳排放因子即时计算
- **可视化统计** - 仪表盘展示今日/本周碳排放
- **分类分析** - 交通/饮食/能源/购物四大类占比
- **减碳提示** - AI智能减碳建议
- **等效换算** - 显示需要多少棵树抵消排放
- **目标设定** - 设定每日碳排放目标

### 碳排放因子

数据来源：IPCC、中国碳排放数据库

| 分类 | 活动 | 排放因子 |
|------|------|----------|
| 交通 | 私家车 | 0.21 kg/km |
| 交通 | 公交车 | 0.089 kg/km |
| 交通 | 地铁 | 0.035 kg/km |
| 交通 | 飞机 | 0.255 kg/km |
| 饮食 | 牛肉餐 | 6.61 kg/餐 |
| 饮食 | 素食餐 | 0.39 kg/餐 |
| 能源 | 用电 | 0.785 kg/kWh |
| 能源 | 天然气 | 2.09 kg/m³ |

## 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS（环保绿色调）
- Framer Motion（流畅动画）
- Zustand（状态管理 + 本地持久化）
- PWA（渐进式Web应用）

### 后端
- ESA Edge Functions（边缘函数）
- Edge Cache API（边缘缓存）
- 通义千问 API（可选，AI减碳建议）

## How We Use Edge

### 1. 碳排放因子边缘缓存

```typescript
// 碳排放因子数据在边缘节点缓存
const cache = caches.default
const cacheKey = new Request('https://cache/carbon-factors')

let cached = await cache.match(cacheKey)
if (cached) {
  return new Response(cached.body, {
    headers: { 'X-Cache': 'HIT' }
  })
}

// 缓存1小时，确保快速查询
const response = new Response(JSON.stringify(carbonFactors), {
  headers: { 'Cache-Control': 'max-age=3600' }
})
await cache.put(cacheKey, response.clone())
```

### 2. 边缘实时计算

```typescript
// 碳排放计算在边缘节点完成
if (url.pathname === '/api/calculate') {
  const { category, type, amount } = await request.json()
  const factor = carbonFactors[category][type]
  const carbonKg = factor.factor * amount

  return new Response(JSON.stringify({ carbonKg }))
}
```

### 3. AI减碳建议边缘生成

```typescript
// 边缘函数调用AI生成个性化建议
async function getAIAdvice(apiKey, weekCarbon, topCategory) {
  const response = await fetch('https://dashscope.aliyuncs.com/...', {
    body: JSON.stringify({
      messages: [{
        content: `我本周碳排放${weekCarbon}kg，主要来自${topCategory}`
      }]
    })
  })
  return response
}
```

### 4. 边缘优势

- 碳排放因子数据边缘缓存，毫秒级查询
- 计算逻辑边缘执行，低延迟响应
- 用户数据本地存储，保护隐私
- PWA支持离线记录

## 项目结构

```
30_CarbonTrace_碳足迹计算器/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx          # 顶部导航
│   │   │   ├── CarbonGauge.tsx     # 碳排放仪表盘
│   │   │   ├── QuickActions.tsx    # 快捷记录按钮
│   │   │   ├── ActivityList.tsx    # 活动记录列表
│   │   │   ├── AddActivityModal.tsx # 添加活动弹窗
│   │   │   ├── StatsPanel.tsx      # 统计面板
│   │   │   └── SettingsModal.tsx   # 设置弹窗
│   │   ├── store/
│   │   │   └── carbonStore.ts      # Zustand状态管理
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   │   └── manifest.json           # PWA配置
│   └── package.json
├── functions/
│   └── api/
│       └── carbon.ts               # 碳计算边缘函数
├── esa.jsonc
└── README.md
```

## 本地开发

```bash
# 安装依赖
cd frontend
npm install

# 启动开发服务器
npm run dev
```

## 部署

```bash
# 构建前端
cd frontend
npm run build

# 通过ESA控制台部署
# 1. 创建Pages函数
# 2. 关联GitHub仓库
# 3. 配置构建命令: npm run build
# 4. 配置静态资源目录: frontend/dist
```

## 使用说明

1. **快捷记录** - 点击常用活动按钮快速记录
2. **详细记录** - 点击"+"按钮选择分类和数量
3. **查看统计** - 切换到"统计"页面查看周报表
4. **设置目标** - 在设置中配置每日碳排放目标
5. **获取建议** - 配置API Key后可获取AI减碳建议

### 配置API Key（可选）

1. 点击底部"设置"图标
2. 输入通义千问API Key
3. 保存后即可使用AI智能建议功能

## 设计特点

- **环保绿色调** - 传递低碳理念
- **圆环仪表盘** - 直观显示今日排放
- **分类颜色区分** - 交通蓝、饮食黄、能源红、购物紫
- **等效换算** - 树木、汽车里程等直观对比
- **PWA支持** - 可安装到手机，离线使用

## 截图

（部署后添加实际截图）

## License

MIT
