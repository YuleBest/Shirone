import type { FontConfig, ResolvedFontOptions } from "../types/fontConfig.ts";
import { resolveFontOptions as resolve } from "../utils/font-options.ts";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Shirone 全站字体配置指南
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 博客的字体分为 3 种角色（Role）：
 *  1. `body`：西文与默认基础正文字体（英文字母、数字、基础标点）
 *  2. `cjk` ：中日韩字体（汉字、日文平假名/片假名、韩文）
 *  3. `mono`：等宽代码字体（文章代码块、行内代码、终端输出）
 *
 * 当前站点字体通过 `src/styles/font-faces.css` 的 `@font-face` 直接加载本地
 * 可变字体（英文/拉丁 = Google Sans Flex，代码等宽 = Geist Mono，文件在
 * `src/assets/fonts/`），中文走系统字体；本配置保持 `mode: "system"`，
 * 不参与 Astro 字体管线（管线已移除）。
 * 如需启用配置驱动的自托管字体，请：
 *  1. 将 `mode` 改为 `"custom"`，并按下方场景填写 `fontFamilies`；
 *  2. `source: "local"`（字体文件放在 `src/assets/fonts/`）或
 *     `source: "fontsource"`（安装 npm 包后填对应 CSS 路径）。
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 【修改后的验证命令】
 *   在终端依次执行：
 *   1. `npx.cmd astro check`  -> 校验配置与页面语法
 *   2. `pnpm.cmd build`        -> 执行生产构建
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const fontConfig: FontConfig = {
	/**
	 * 构建模式：
	 * - `"custom"`: 启用自定义字体（加载下方 fontFamilies 中配置的字体）
	 * - `"system"`: 纯系统字体模式（不打包任何自定义字体文件，完全依赖访客设备）
	 */
	mode: "system",

	/**
	 * 字体清单列表（仅 `mode: "custom"` 时生效；`"system"` 模式下被忽略）
	 */
	fontFamilies: [],

	/**
	 * 字体打包体积预算限制（仅 `mode: "custom"` 时生效；`"system"` 模式下无字体产物）
	 */
	budget: {
		maxTotalBytes: 6 * 1024 * 1024, // 全站引用自定义字体总大小上限：6MB
		maxFamilyBytes: 4 * 1024 * 1024, // 单个字体族文件大小上限：4MB
	},
};

/** 经过校验与标准化处理后的字体配置对象，由 Astro 模板与 CSS 消费 */
export const resolvedFontOptions: ResolvedFontOptions = resolve(fontConfig);

/** 字体配置解析与校验函数 */
export const resolveFontOptions: (config: FontConfig) => ResolvedFontOptions =
	resolve;
