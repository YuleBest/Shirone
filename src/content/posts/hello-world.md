---
title: Hello World
published: 2026-08-28
description: 你的第一篇文章 —— 换成你自己的内容即可。
tags: [Hello, Blog]
category: Notes
draft: false
---

# Hello World

欢迎使用 **Shirone** —— 一个基于 Material 3 Expressive 的博客主题。
这是一篇示例文章，你可以把它替换成自己的第一篇博客。

## 开始写作

文章放在 `src/content/posts/` 目录下，使用 Markdown 或 MDX 编写。
frontmatter 里的 `title` 与 `published` 是必填项，其余字段按需填写：

- `tags`: 标签列表，用于分类索引
- `category`: 文章分类
- `description`: 文章摘要（列表页与分享卡片使用）
- `draft`: `true` 时本地可见、生产构建不发布

## 常用写法

**列表**：

- 第一条
- 第二条
- 第三条

**引用**：

> 写作是思考的外化。

**代码块**：

```ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

## 下一步

- 在 `src/config/` 里修改站点名称、个人资料与导航。
- 删除本文，写下属于你的第一篇文章。
- 完成后运行 `pnpm dev` 在浏览器里预览。
