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

- 页面：`/` 展示聚合的新闻，支持按来源筛选、关键词搜索、时间筛选（24h/3天/7天/30天/自定义日期范围）。
- API：`/api/news` 返回每日缓存后的新闻数据（若当天未抓取则会自动抓取并写入 `data/articles.json`）。
- API：`/api/refresh` 触发立即抓取并刷新缓存，便于配合系统计划任务每日执行。
- 缓存文件：`data/articles.json`

## 定时抓取（每日）

项目内置文件缓存与刷新接口，推荐使用系统级计划任务（如 Linux 的 crontab）每天调用一次刷新接口：

```bash
# 例：每天凌晨 3 点刷新缓存（请将域名/端口替换为你的部署地址）
0 3 * * * curl -X POST https://你的域名或IP/api/refresh >/dev/null 2>&1
```

本地开发也可以直接访问 http://localhost:3000/api/refresh 进行手动刷新。

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
