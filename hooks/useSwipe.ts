import * as React from "react";

export function useSwipe(onLeft: () => void, onRight: () => void) {
	const startX = React.useRef<number | null>(null);
	const startY = React.useRef<number | null>(null);

	function onTouchStart(e: React.TouchEvent) {
		const t = e.touches[0];
		startX.current = t.clientX;
		startY.current = t.clientY;
	}

	function onTouchEnd(e: React.TouchEvent) {
		if (startX.current == null || startY.current == null) return;
		const t = e.changedTouches[0];
		const dx = t.clientX - startX.current;
		const dy = t.clientY - startY.current;

		// Avoid interfering with vertical scroll.
		if (Math.abs(dy) > Math.abs(dx)) return;

		const threshold = 60;
		if (dx <= -threshold) onLeft();
		if (dx >= threshold) onRight();

		startX.current = null;
		startY.current = null;
	}

	return { onTouchStart, onTouchEnd };
}