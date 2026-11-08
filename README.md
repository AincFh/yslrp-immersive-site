# YSLRP · 圣罗兰 RP 海外介绍站

本项目仅服务于 **yslrp.com**，是零后端、零数据库、无注册的纯静态 FiveM / GTA V 角色扮演世界介绍页。

## 已实现
- 中文优先的站点信息架构：简介、城市、角色、故事、视觉画廊、参与指南、常见问题
- 自定义右侧章节指示器与进度条；隐藏系统滚动条外观，但保留原生滚动/触屏/键盘操作
- 交互：城市氛围切换、角色选项卡、剧情选择、画廊弹层、Esc 关闭、移动端菜单
- 降低动画设置、响应式布局、键盘可访问性、避免横向溢出
- HTML/CSS/JS 内嵌在 index.html，不依赖外置 CSS/JS 文件，不需要构建
- 页面中的摄影素材仅为城市气氛示意，非 FiveM 服务器实机截图，详见 MEDIA_SOURCES.md

## Cloudflare Pages Free
选择 GitHub 仓库 `AincFh/yslrp-immersive-site`，框架选 None，生产分支 main；Build command 留空，输出目录为根目录 `/` 或 `.`。绑定域名 `yslrp.com` 前先验证 Cloudflare 分配的 pages.dev 预览链接。无需购买主机、R2、D1、Workers Paid。

本仓库不修改国内 `yslfivem.com`，该域名只是网站上的站外链接。

## 本地预览
直接用浏览器打开 index.html 或在仓库根目录运行 `python -m http.server 8000`。

## 边界
- 不含账户、论坛、后台、数据库或数据存储
- 角色与场景是概念性展示，不代表某部门开放招募或服务器实际实装细节
- 外部 Unsplash 图片可能受网络影响，网站保留纯 CSS 渐变背景降级
