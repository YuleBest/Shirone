---
title: 在 VuePress 的 Markdown 文档里使用 Vue 语法
published: 2025-11-21
description: 介绍如何在 VuePress 的文档里使用 Vue 语法
tags: [Vue, VuePress, Markdown]
category: 笔记
draft: false
---

<script setup>
import VueDemo from "@VueDemo";
import { ref } from "vue";
const demoNumber = ref(0);

const randomNumber = () => {
  demoNumber.value = Math.random();
}
</script>

VuePress 是一个基于 Vue 的静态网站生成器，它的页面主要是用 Markdown 编写的。在 VuePress 中，Markdown 最终转换为 Vue 组件，因此在文档中使用 Vue 语法是非常方便的。（VuePress 中的文档，我们下面简称为文档）

在文档中使用 Vue 有两种方式，分别是使用 Vue 模板语法和使用 Vue 组件，下面将分别介绍。

<!-- more -->

::: tip
下面的内容默认你已掌握 Vue 基本语法和 [Markdown 基本语法](/front-end/markdown/)
:::

---

## 使用 Vue 模板语法

你可以直接在 Markdown 中使用 Vue 模板语法，比如：

```md
一加一等于 {{ 1 + 1 }}
```

将渲染为：
一加一等于 {{ 1 + 1 }}

再比如：

```md
<span v-for="i in 10"> {{ i }} </span>
```

将渲染为：
<span v-for="i in 10"> {{ i }} </span>

使用此方式，你不能使用 `<style scoped>` 和 `<script setup>` ，因为这些标签被用于页面本身的逻辑和样式定义。

---

## 使用 Vue 组件

由于 Markdown 文件会被转换为 Vue 单文件组件并缓存到缓存目录，所以相对路径导入在 Markdown 文件中是无效的，必须使用别名 [^1]。

`@source` 是 VuePress 提供的一个别名，指向项目的源目录（`src/` 或 `docs/`）。

### 局部导入

::: tip
局部导入的组件仅在当前文档中可以用，在其他文档需要重新导入
:::

你可以直接在 Markdown 中导入你的 Vue 组件，例如：

```md 3-5
<MyComponent />

<script setup>
import MyComponent from "@source/.vuepress/MyComponent.vue";
</script>
```

你也可以在项目配置文件 `.vuepress/config.ts` 或 `.vuepress/config.js` 中使用 `alias` 给组件设置别名。

假设你的组件是 `.vuepress/components/MyComponent.vue`，那么：

```ts 2,4,7-9
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  alias: {
    "@MyComponent": path.resolve(__dirname, "components/MyComponent.vue"),
  },
});
```

然后你就可以使用 `@MyComponent` 代替 `@source/.vuepress/MyComponent.vue` 来导入 `<MyComponent />` 了。

::: details 示例

- `.vuepress/components/VueDemo.vue`

```vue
<template>
  <div class="demo">
    <span>当前值：{{ count }}</span>
    <button @click="count++">+1</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const count = ref(0);
</script>

<style scoped>
button {
  margin: 10px;
}
</style>
```

- `.vuepress/config.ts`

```ts
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";
import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  // ...

  alias: {
    "@VueDemo": path.resolve(__dirname, "components/VueDemo.vue"),
  },

  theme,
  // ...
});
```

- `vue.md`

```md
<VueDemo />

<script>
import VueDemo from "@VueDemo";
</script>
```

效果如下：

<VueDemo />
:::

---

### 全局注册

你需要新建 `.vuepress/client.ts`（或 `client.js`），然后编写：

```ts
import { defineClientConfig } from "@vuepress/client";

import MyButton from "./components/MyButton.vue"; // 在这导入组件

export default defineClientConfig({
  enhance({ app }) {
    app.component("MyButton", MyButton); // 全局注册
  },
});
```

然后你就可以在任意文档里使用 `<MyButton />` 语法来使用你的组件。

::: details 示例

- `.vuepress/components/VueDemo2.vue`

```vue
<template>
  <div class="demo-box">
    <p>当前计数：{{ count }}</p>
    <button @click="increment">加一</button>
    <p>计数状态：{{ status }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const count = ref(0);

function increment() {
  count.value += 1;
}

const status = computed(() => {
  return count.value % 2 === 0 ? "偶数" : "奇数";
});
</script>

<style scoped>
.demo-box {
  border: 1px solid #ccc;
  padding: 16px;
  width: 240px;
  border-radius: 8px;
}
button {
  margin-top: 8px;
}
</style>
```

- `.vuepress/client.ts`

```ts
import { defineClientConfig } from "vuepress/client";

import VueDemo2 from "./components/VueDemo2.vue"; // 在这导入组件

export default defineClientConfig({
  enhance({ app }) {
    app.component("VueDemo2", VueDemo2); // 全局注册
  },
});
```

- `vue.md`

```md
<VueDemo2 />
```

效果如下：

<VueDemo2 />

:::

::: details 了解 `client.ts`

`client.ts` 是 VuePress 提供的一个客户端配置文件，你可以在其中注册全局组件、指令、插件等，等价于 Vue 项目的 `main.ts`。

常见的用途有：

| 目的                     | 示例代码                                                |
| :----------------------- | :------------------------------------------------------ |
| 全局注册组件             | `app.component('MyButton', MyButton)`                   |
| 注册全局指令             | `app.directive('focus', { mounted: el => el.focus() })` |
| 路由守卫                 | `router.beforeEach(to => { ... })`                      |
| 挂载额外 Vue 插件        | `app.use(SomePlugin)`                                   |
| 插入自定义 CSS           | `import './custom.css'`                                 |
| 挂载到挂载点之后做副作用 | `onMounted(() => { ... })`                              |

:::

[^1]: [theme-hope.vuejs.press](https://theme-hope.vuejs.press/zh/guide/component/sfc.html#导入文件)
