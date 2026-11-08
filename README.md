# YSLRP / 圣罗兰海外介绍站

一个真正可部署到 **Cloudflare Pages Free** 的静态网站。仓库包含纯 HTML、CSS、JavaScript 和本地 WebP 视觉素材，没有服务器端运行时、数据库、账户、论坛、R2、付费 Cloudflare 服务或外部 JS CDN。

## 设计

清晰的中文 FiveM / GTA V RP 介绍、官方品牌、场景选择器、滚动叙事、可切换角色、可切换放大画廊、参与指南。设计注重排版与游戏场景，而不是空洞的装饰效果。

## 部署

Cloudflare Pages Git 集成选择 `AincFh/yslrp-immersive-site`，根目录 `/`，Framework preset `None`，Build command **留空**，输出目录 `/`。通过 Git 自动发布和 PR 预览。全是静态资源，没有构建依赖。请先检查 pages.dev 发布结果，再绑定 yslrp.com。

如果 Cloudflare 控制台的 Pages 项目已经链接该仓库，推送至 main 会自动部署，不要重新创建同名项目。自定义域需要域名已托管于 Cloudflare DNS；在域名 NS 切换前检查旧 DNS 记录、邮件记录及 DNSSEC。

## 兼容性与测试

桌面与移动端均采用语义化 HTML、键盘可操作按钮、减少动画偏好支持及图片加载降级。支持无原生可见滚动条的自然滚动；不禁用键盘和触摸滚动。

所有视觉素材记录见 MEDIA_SOURCES.md。

## 网站边界

只管理 `yslrp.com` 海外介绍站，不修改国内 `yslfivem.com` 站点、业务系统、数据库或ICP备案信息。国内官网仅作为站外链接目的地。 
