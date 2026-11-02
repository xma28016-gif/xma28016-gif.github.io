# 马骁的个人主页 · MX OS

产品研究、交互原型、Web 实践和文章归档。使用原生 HTML、CSS、JavaScript，无需构建。

- 网站：https://xma28016-gif.github.io/
- 源码：https://github.com/xma28016-gif/xma28016-gif.github.io

## 内容与功能

- 展示全部公开项目，支持分类、关键词搜索、详情和原始作品访问。
- 个人技能按产品研究、交互体验、技术工具分组；点击标签可筛选对应项目。
- 文章支持主题搜索和分类，保留公众号原文与完整研究报告的链接。
- 独立的终端欢迎页，点击按钮或按回车进入主页。
- 浅色桌面窗口、个人原照和侧栏分区；支持手机布局、键盘操作及浏览器前进后退。
- 联系页采用淡蓝玻璃卡片，卡通形象支持点击或键盘打招呼，显示 3 秒的 hi 气泡，并遵循减少动态效果偏好。

当前项目资料来自公开仓库及其报告。技能描述对应具体项目实践，不使用熟练度分数。私有仓库未收录。

公众号为「代码不再冷冰冰」。已收录站点主人提供的文章入口；没有取得的历史文章不编造标题、日期或摘要。

## 本地预览

```sh
python3 -m http.server 5173
```

打开 http://localhost:5173/。

## 维护内容

所有内容集中在 `content.js`：

- `works`：项目标题、分类、状态、简介、标签、详细说明、在线地址与源码仓库。
- `skills`：技能分组与项目 ID 的对应关系。
- `notes`：文章标题、分类、日期、摘要、标签、原文链接和来源。日期不确定时保留空字符串。
- `publication`：公众号名称、说明和已确认的文章入口。
- `profileTags`、`greeting`、`bio`：个人标签与介绍。

新增公开项目时，同时维护相关技能中的项目 ID。新增公众号文章时，将标题与原文链接加入 `notes`，可同时补充已确认的日期和摘要。

欢迎页在 `index.html`，主页结构在 `home.html`，样式在 `styles.css`，目录筛选与弹窗在 `app.js`，分区路由在 `workspace.js`，欢迎页键盘入口在 `welcome.js`，联系页卡通互动在 `contact-mascot.js`。个人照片为 `assets/maxiao-portrait.jpg`，来源于站点主人提供的原照。卡通形象为 `assets/maxiao-mascot.png`，由内置图像生成工具参考原照生成；提示词保存在 `assets/maxiao-mascot.prompt.txt`。`particles.js` 保留早期 Canvas 实验，当前页面不加载。Inter 字体本地托管，许可文件在 `assets/fonts/LICENSE.txt`。

## 发布更新

GitHub Pages 使用 `main` 分支的根目录，推送后自动部署：

```sh
git add index.html home.html styles.css app.js content.js welcome.js workspace.js contact-mascot.js assets README.md
git commit -m "Update portfolio content"
git push origin main
```

根目录的 `.nojekyll` 保留静态资源发布方式。
