# AI 新闻聚合站点 (Next.js)

仅聚合 AIBase 的每日 AI 新闻，基于其开放接口实时获取数据：
- 接口：https://mcpapi.aibase.cn/api/aiInfo/dailyNews?t=<时间戳>&langType=zh_cn&pageNo=1

本项目移除了“机器之心”“量子位（QbitAI）”的抓取逻辑与本地 JSON 缓存，页面改为使用 Tab 展示（当前仅 AIBase，未来可扩展）。

## 开发

```bash
pnpm i # 或 npm i / yarn
pnpm dev
```

开发服务器启动后，访问 http://localhost:3000 即可。

- 页面：`/` 展示 AIBase 的新闻，并支持关键词搜索与时间筛选（24h/3天/7天/30天/自定义日期范围）。
- API：`/api/news` 服务端实时调用 AIBase 接口并返回处理后的数据（不落地、不使用本地缓存）。

## 技术栈
- Next.js 14（App Router）
- React 18
- TypeScript

## 注意
- 本项目仅用于学习交流，所有内容版权归原站点所有。
- 生产使用建议添加请求重试与日志监控。
