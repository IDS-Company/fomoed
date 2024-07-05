import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { json, type RequestEvent, error } from '@sveltejs/kit';
import type { CFGIEnum } from '$lib/utils';
import type { ICoinCfgiPriceData, TCoinStatsCoin } from '$lib';
import { CFGI_SUPPORTED_PERIODS_ENUM, cfgi_supported_tokens } from '$lib/utils/cfgi_data';
import { sortBy, uniqBy } from 'lodash-es';
import { PRIVATE_CFGI_KEY } from '$env/static/private';
import { free_tokens } from '$lib/stores';

const endpoint =
	'https://cfgi.io/api/api_request.php?api_key=API_KEY&token=TOKEN&start=START&end=END&period=PERIOD';

async function fetch_cfgi_data(
	token_symbol: string,
	period: CFGI_SUPPORTED_PERIODS_ENUM,
	start: Date,
	end: Date
) {
	let url = endpoint;
	url = url.replace('API_KEY', PRIVATE_CFGI_KEY);
	url = url.replace('TOKEN', token_symbol);
	url = url.replace('START', start.toISOString().toLocaleString());
	url = url.replace('END', end.toISOString().toLocaleString());
	url = url.replace('PERIOD', period.toString());

	console.log(url);

	return fetch(url)
		.then((res) => res.text())
		.then((res) => {
			if (res.toString().length) {
				const data = JSON.parse(res.toString()) as ICoinCfgiPriceData[];
				return data
					.map((d) => ({ ...d, symbol: token_symbol, cfgi: parseInt(d.cfgi.toString()) }))
					.filter((d) => d.cfgi);
			}

			return [];
		})
		.catch((err) => {
			console.error('Our Error: ', err);

			return [];
		});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { supabase, user } }: RequestEvent) {
	const formData = await request.json();
	const token_symbol = formData.token_symbol;
	const period: CFGI_SUPPORTED_PERIODS_ENUM = formData.period || CFGI_SUPPORTED_PERIODS_ENUM.DAY1;
	const token_slug = formData.token_slug;

	if (!token_symbol || !token_slug) {
		return error(400, { message: 'Bad Request' });
	}

	// Check subscription
	if (!free_tokens.includes(token_symbol.toUpperCase())) {
		if (!user) {
			return error(401, { message: 'Unauthorized' });
		}

		const { data: subscriptions, error: sub_error }: PostgrestSingleResponse<ISubscription[]> =
			await supabase.from('subscriptions').select().eq('user_id', user.id);

		if (
			sub_error ||
			(Array.isArray(subscriptions) &&
				!subscriptions.filter((sub) => new Date(sub.end_timestamp).getTime() > Date.now()).length)
		) {
			return error(401, 'Unauthorized');
		}
	}

	if (cfgi_supported_tokens.includes(token_symbol.toUpperCase())) {
		const maxBarsAvailable = 1200;
		let secondsBack = 0;

		// One Day is the Default
		switch (period) {
			case CFGI_SUPPORTED_PERIODS_ENUM.HOUR1:
				const one_hour = 3600 * 1000;
				secondsBack = 1200 * one_hour;
				break;
			case CFGI_SUPPORTED_PERIODS_ENUM.HOUR4:
				const four_hours = 3600 * 1000 * 4;
				secondsBack = 1200 * four_hours;
				break;
			case CFGI_SUPPORTED_PERIODS_ENUM.MIN15:
				const min_15 = 15 * 60 * 1000;
				secondsBack = 1200 * min_15;
				break;
			default:
				const one_day = 24 * 3600 * 1000;
				secondsBack = 1200 * one_day;
				break;
		}

		const cfgi_data = await fetch_cfgi_data(
			token_symbol,
			secondsBack,
			new Date(Date.now() - secondsBack),
			new Date()
		);

		if (cfgi_data.length) {
			return json({
				data: sortBy(
					cfgi_data
						.filter((d) => d?.cfgi)
						.map((d) => ({
							...d,
							cfgi: parseInt(d.cfgi.toString()),
							date: new Date(d.date).getTime()
							// period,
							// symbol: token_symbol
						}))
						.filter((d) => d.date && d.price && d.cfgi && !isNaN(d.cfgi)),
					['date']
				)
			});
		}
	}

	// Fallback
	// Token History
	const token_historical_price = uniqBy(
		await fetch(`https://api.coin-stats.com/v2/coin_chart/${token_slug}?type=all`)
			.then((res) => res.json())
			.then(
				(res) =>
					(res?.data?.map((d: number[]) => {
						return {
							date: new Date(new Date(d[0] * 1000).setHours(0, 0, 0, 0)).getTime(),
							price: d[1]
						};
					}) || []) as { date: number; price: number }[]
			)
			.catch(() => []),
		'date'
	);

	// Summarize history by the day
	const cfgi_data = uniqBy(
		await fetch('https://api.coin-stats.com/v2/fear-greed?type=all')
			.then((res) => res.json())
			.then((res) => {
				const data =
					(res?.data as {
						value: number;
						value_classification: CFGIEnum;
						timestamp: number;
						time_until_update: number;
					}[]) || [];

				return data.map((d) => {
					d.timestamp = new Date(
						new Date(parseInt(d.timestamp.toString()) * 1000).setHours(0, 0, 0, 0)
					).getTime();

					return d;
				});
			})
			.catch(() => []),
		'timestamp'
	);

	// History of Tether isn't accurate

	// Combine the data
	return json({
		data: sortBy(
			cfgi_data
				.map((d) => {
					const h_price = token_historical_price.find((p) => p.date === d.timestamp);

					return {
						cfgi: parseInt(d.value.toString()),
						price: d.timestamp && !isNaN(d.timestamp) ? h_price?.price || null : null,
						date: d.timestamp && !isNaN(d.timestamp) ? new Date(d.timestamp).getTime() : 0,
						symbol: token_symbol,
						period
					};
				})
				.filter((d) => d.price && d.date && d.cfgi && !isNaN(d.cfgi)),
			['date']
		)
	});
}
