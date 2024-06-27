import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON } from '$env/static/public';
import type { SetOptional } from 'type-fest';
import type { Session } from '@supabase/supabase-js';
import { goto } from '$app/navigation';

export const load: LayoutLoad = async ({ depends, fetch, data, url }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends('supabase:auth');

	// ! Always created using the ANON key
	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON, {
				global: {
					fetch
				},
				cookies: {
					get(key) {
						const cookie = parse(document.cookie);
						return cookie[key];
					}
				}
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON, {
				global: {
					fetch
				},
				cookies: {
					get() {
						if (data.session) {
							delete data.session.user;
						}

						return JSON.stringify(data.session);
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (!isBrowser()) {
		if (session) {
			delete (session as SetOptional<Session, 'user'>).user;
		}
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user && isBrowser()) {
		const code = url.searchParams.get('code');

		if (code) {
			await supabase.auth.exchangeCodeForSession(code).catch(async (err) => {
				const query = new URLSearchParams(url.search);
				query.delete('code');

				await goto(`${url.protocol}//${url.host}${url.pathname}?${query.toString()}`);
			});
		}
	}

	return { session, supabase, user };
};
