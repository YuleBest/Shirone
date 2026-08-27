/**
 * 特色页面数据解析与合并工具。
 * 遵循「配置管行为，数据管内容」原则：
 * 将 src/config/*Config.ts 的控制行为（disabledKeys、order 等）
 * 应用于 src/data/*.ts 的内容数据集合。
 */
import { devicesData } from "../data/devices.ts";
import type { DeviceItem, DevicesConfig } from "../types/devicesConfig.ts";

/**
 * 依据禁用列表过滤条目（纯函数）。
 */
export function filterByDisabledKeys<T>(
	items: readonly T[],
	disabledKeys?: readonly string[],
	getKey: (item: T) => string = (item) =>
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).key ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).id ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).name ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).title ??
		"",
): T[] {
	if (!disabledKeys || disabledKeys.length === 0) {
		return [...items];
	}
	const disabledSet = new Set(disabledKeys);
	return items.filter((item) => !disabledSet.has(getKey(item)));
}

/**
 * 解析设备页展示数据。
 */
export function resolveDevicesData(
	config: DevicesConfig,
	customItems?: readonly DeviceItem[],
): DeviceItem[] {
	const source = customItems ?? config.items ?? devicesData;
	const enabledItems = source.filter((item) => item.enable !== false);
	return filterByDisabledKeys(
		enabledItems,
		config.disabledIds ?? config.disabledKeys,
		(item) => item.id,
	);
}
