---
title: VuePress Theme Hope 使用自定义的本地字体
published: 2025-11-21
description: 自定义 VuePress Theme Hope 字体，包括设置本地字体文件和声明字体
tags: [Vue, VuePress, vuepress-theme-hope, 个性化]
category: 笔记
draft: false
---

最近用 VuePress 的 Hope 主题时想更换一下字体，但[官方文档](https://theme-hope.vuejs.press/zh/guide/customize/font.html)只介绍如何使用字体库里的字体[^1]，所以自己折腾了下，搞定了本地字体的使用，分享出来供大家参考。

<!-- more -->

设置完成后，你可以看到类似本站的字体显示效果。

::: center

![移动端显示效果|0x200](https://image.yule.ink/blog/移动端显示效果) ![PC端显示效果|0x200](https://image.yule.ink/blog/PC端显示效果.png)

:::

## 准备

首先需要在 `/src/.vuepress/public/assets/` 下新建一个目录 `fonts/`，用于储存字体文件，可以额外加字体类型目录，比如 `woff2/` `ttf/`（当然这看你自己的喜好，不加也行），然后把你所需的字体文件放在里面，例如：

![文件路径截图](https://image.yule.ink/blog/20251120143358699.png)

## 声明字体

修改 `/src/.vuepress/styles/index.scss`，在开头新增代码：

```scss
$pf-fonts: (
  400: "PingFangSC-Regular",
  500: "PingFangSC-Medium",
  600: "PingFangSC-Semibold",
  // 添加你需要的所有字重和字体名称
);

@each $weight, $file in $pf-fonts {
  @font-face {
    font-family: "PingFang SC";
    src: url("/assets/fonts/woff2/#{$file}.woff2") format("woff2"); // 替换成你实际的文件类型，比如 .ttf 是 truetype
    font-weight: $weight;
    font-display: swap; // 这个是字体显示策略，你可以上网查找相关信息
  }
}
```

这是 SCSS 的一个循环，用于声明所有字体文件。

## 设置字体

修改 `/src/.vuepress/styles/palette.scss`，把 `$vp-font` 和 `$vp-font-heading` 这两个变量的值设置为你声明的字体族名称，这里是 `"PingFang SC"`，注意开头和结束都要加单引号 [^1]。

```scss
$vp-font: '"PingFang SC", "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
$vp-font-heading: '"PingFang SC", "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
// $vp-font-mono 是等宽字体，这里没有设置，你可以根据需要自己设置
```

然后你就可以看见字体应用的效果了，移动端也会生效。

[^1]: [VuePress Theme Hope 官方文档](https://theme-hope.vuejs.press/zh/guide/customize/font.html)
