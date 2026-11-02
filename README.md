# 我的小站

一个包含个人介绍、作品和随笔的中文个人主页，使用原生 HTML、CSS 和 JavaScript，无需安装依赖或构建。

- 网站地址：https://xma28016-gif.github.io/
- 源码仓库：https://github.com/xma28016-gif/xma28016-gif.github.io

## 本地预览

在仓库目录运行：

```sh
python3 -m http.server 5173
```

然后访问 http://localhost:5173/。

## 修改个人内容

编辑 `content.js` 中的站点名称、简介、邮箱、作品和随笔。填写 `email` 后，联系入口就会显示写信按钮。当前作品和随笔均为示例，请替换为自己的内容。

- `index.html`：页面结构
- `styles.css`：配色、排版与手机适配
- `app.js`：作品筛选、详情弹窗与随笔阅读
- `assets/`：插画和图标

## 发布更新

GitHub Pages 使用 `main` 分支的根目录。提交并推送修改后，GitHub 会自动更新网站：

```sh
git add index.html styles.css app.js content.js assets README.md
git commit -m "Update personal website"
git push origin main
```

`.nojekyll` 保证页面按静态文件发布，不经过 Jekyll 处理。
