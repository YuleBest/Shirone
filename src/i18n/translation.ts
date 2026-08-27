// 站点仅使用中文（zh_CN）单一语言：i18nKey 仍作为文案单一事实来源，
// i18n() 固定返回中文文案，无需按 lang 分发。
import type I18nKey from "./i18nKey";
import { zh_CN } from "./languages/zh_CN";

export type Translation = {
	[K in I18nKey]: string;
};

export function i18n(key: I18nKey): string {
	return zh_CN[key];
}
