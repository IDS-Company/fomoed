import { writable } from 'svelte/store';

export const auth_user = writable<(IUser & { subscriptions: ISubscription[] }) | null>(null);
export const auth_email = writable<string | null>(null);
