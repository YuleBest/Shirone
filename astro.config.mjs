import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { expressiveCodeConfig } from "./src/config/expressiveCodeConfig.ts";
import { siteConfig } from "./src/config/siteConfig.ts";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { siteMarkdownProcessor } from "./src/utils/markdown-processor.mjs";

const isBuildCommand = process.argv.includes("build");

// https://astro.build/config
export default defineConfig({
	site: siteConfig.site,
	base: siteConfig.base ?? "/",
	trailingSlash: "always",
	integrations: [
		swup({
			theme: false,
			ignore: 'a[href="#"]',
			animationClass: "transition-swup-",
			containers: ["main", "#toc"],
			smoothScrolling: true,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: {
				awaitAssets: false,
				persistTags: "link[rel=stylesheet], style",
			},
			updateBodyClass: false,
			globalInstance: true,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => Boolean(event.state?.url?.includes("#")),
		}),
		icon({
			include: {
				"preprocess: vitePreprocess(),": ["*"],
				"fa6-brands": ["*"],
				"fa6-regular": ["*"],
				"fa6-solid": ["*"],
			},
		}),
		expressiveCode({
			themes: [
				expressiveCodeConfig.lightTheme ?? expressiveCodeConfig.theme,
				expressiveCodeConfig.darkTheme ?? expressiveCodeConfig.theme,
			],
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.75rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily: "var(--m3e-font-mono-family)",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		svelte({
			compilerOptions: {
				// CSS-source hashing keeps SSR and client scope hashes stable after moves.
				cssHash: ({ css, hash }) => `svelte-${hash(css)}`,
				// 过滤良性开发期提示（a11y 已由 Playwright/axe 测试覆盖；未用 CSS 选择器
				// 与 runes 局部引用仅为提醒），避免刷屏；真正的编译错误仍照常报出。
				warningFilter: (warning) => {
					if (warning.code.startsWith("a11y_")) return false;
					if (warning.code === "css_unused_selector") return false;
					if (warning.code === "state_referenced_locally") return false;
					return true;
				},
			},
		}),
		sitemap(),
		mdx({
			syntaxHighlight: false,
			optimize: true,
		}),
	],
	markdown: {
		processor: siteMarkdownProcessor,
	},
	vite: {
		resolve: {
			alias: [
				{
					find: /^@iconify\/svelte$/,
					replacement: fileURLToPath(
						new URL(
							"./src/components/atoms/display/Icon.svelte",
							import.meta.url,
						),
					),
				},
			],
		},
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: ["overlayscrollbars", "@fancyapps/ui"],
			// @iconify/svelte 的 exports 仅暴露 `svelte` 条件，Vite/Rolldown 的依赖
			// 扫描器不应用该条件会误报 "subpath is not defined by exports" 并中断预编译。
			// 关闭自动发现（扫描器不再在冷启动时运行），include 列表仍按需预编译。
			noDiscovery: true,
		},
		build: {
			minify: "esbuild",
			cssCodeSplit: true,
			cssMinify: "esbuild",
			chunkSizeWarningLimit: 1000,
			esbuild: isBuildCommand
				? {
						drop: ["debugger"],
						pure: ["console.log", "console.debug"],
					}
				: undefined,
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
		},
	},
});
