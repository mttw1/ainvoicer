import { LineItem } from "./types";

export function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

export function toMoney(n: number) {
	if (!Number.isFinite(n)) return "0.00";
	return n.toFixed(2);
}

export function calcSubtotal(items: LineItem[]) {
	return items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
}