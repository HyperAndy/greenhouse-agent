# Greenhouse Agent Demo

这个目录保存项目中已经实现的管理后台和大屏展示前端，已改造成纯前端演示版。

## 内容

- `admin/`：管理后台演示版，保留原有页面、布局、路由和 Element Plus 组件。
- `dashboard/`：大屏展示演示版，保留原有大屏布局和 ECharts 组件。

## 演示特性

- 不依赖 NestJS 后端、FastAPI、PostgreSQL、Redis 或 EMQX。
- API 请求层已替换为本地 mock 数据。
- 管理后台登录页已预填演示账号：`13800138000 / admin123`。
- 所有数据仅用于演示，刷新页面后回到初始状态。

## 本地运行

```bash
cd demo/admin
npm install
npm run dev
```

```bash
cd demo/dashboard
npm install
npm run dev
```

## Vercel 部署

建议创建两个 Vercel 项目：

| 项目 | Root Directory | Build Command | Output Directory |
| --- | --- | --- | --- |
| 管理后台 | `demo/admin` | `npm run build` | `dist` |
| 大屏展示 | `demo/dashboard` | `npm run build` | `dist` |
