import type { ProfileConfig } from "@/types/config";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = {
	avatar:
		"https://q.qlogo.cn/headimg_dl?dst_uin=1011567690&spec=640&img_type=jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Yule",
	bio: "愿望是天天开心",
	links: [
		{
			name: "酷安",
			icon: "arcticons:coolapk", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://twitter.com",
		},
		{
			name: "GitHub",
			icon: "arcticons:github",
			url: "https://github.com/YuleBest",
		},
	],
};
