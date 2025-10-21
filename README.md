# AI 新闻聚合站点 (Next.js)

聚合以下网站的 AI 新闻资讯：
- https://www.aibase.cn/
- https://www.qbitai.com/
- https://www.jiqizhixin.com/

基于 Next.js App Router 构建，优先通过各站的 RSS 获取数据，若 RSS 不可用则回退到简单的页面抓取（cheerio）。

## 开发

```bash
pnpm i # 或 npm i / yarn
pnpm dev
```

开发服务器启动后，访问 http://localhost:3000 即可。

- 页面：`/` 展示聚合的新闻，支持按来源筛选与搜索。
- API：`/api/news` 返回 JSON 结构的聚合新闻数据。

## 技术栈
- Next.js 14（App Router）
- React 18
- TypeScript
- cheerio（HTML 解析）
- rss-parser（RSS 解析）

## 注意
- 本项目仅用于学习交流，所有内容版权归原站点所有。
- 部分站点可能没有 RSS，抓取结构可能随页面变动而需要调整选择器。
- 生产使用建议添加缓存、请求重试与日志监控。
