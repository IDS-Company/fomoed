import { derived, writable } from 'svelte/store';

export const mobileMenuOpen = writable(false);
export const displayLogoutPopup = writable(false);
export const innerWidth = writable(0);
export const isDesktop = derived(innerWidth, ($innerWidth) => $innerWidth >= 980);
