import { derived, writable } from 'svelte/store';

export const mobileMenuOpen = writable(false);
export const displayLogoutPopup = writable(false);
export const innerWidth = writable(null);
export const isDesktop = derived(innerWidth, ($innerWidth) =>
	$innerWidth ? $innerWidth >= 980 : null
);
