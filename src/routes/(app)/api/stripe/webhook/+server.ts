import { error, json, type RequestEvent } from '@sveltejs/kit';
import stripe from '../stripe';
import { Stripe } from 'stripe';
import { PRIVATE_STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import prices from '$lib/prices';
import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}

async function update_user_subscription(
	user_id: string,
	subscription_id: string,
	subscription_start: Date,
	subscription_end: Date,
	price_id: string,
	supabase: SupabaseClient,
	is_trialing: boolean,
	cancel_at: number | null,
	tries = 0
) {
	console.log({
		user_id,
		subscription_id,
		subscription_start,
		subscription_end,
		price_id,
		tries
	});
	// Find the user id
	const {
		data: subscriptions,
		error: find_subscription_error
	}: PostgrestSingleResponse<ISubscription[]> = await supabase
		.from('subscriptions')
		.select()
		.eq('user_id', user_id);

	const { data: users, error: find_user_error }: PostgrestSingleResponse<IUser[]> = await supabase
		.from('users')
		.select()
		.eq('user_id', user_id);

	if (find_subscription_error || find_user_error || !users?.[0]) {
		console.error(
			'⚠️ Subscription Was not Found. Subscription not Updated: ',
			find_subscription_error,
			' User Error: ',
			find_user_error
		);
		return;
	}

	// Determine if they have the subscription already
	const found_sub = subscriptions.find((sub) => sub.subscription_id === subscription_id);
	let update_error;

	if (!found_sub) {
		// If the subscription is not present, add it with the new timelines

		// Allow a user only one active subscription, so delete the rest
		// Should also filter for the product in my opinion as opposed to the price I think ?
		await supabase
			.from('subscriptions')
			.delete()
			.in(
				'user_id',
				subscriptions.filter((sub) => sub.price_id === price_id).map((sub) => sub.user_id)
			);

		// Add the sub
		const { error } = await supabase.from('subscriptions').insert([
			{
				end_timestamp: subscription_end.toISOString().toLocaleString(),
				start_timestamp: subscription_start.toISOString().toLocaleString(),
				subscription_id: subscription_id,
				price_id: price_id,
				user_id: user_id
			}
		]);

		update_error = error;
	} else {
		// If they have the subscription, update it to the new timelines
		// Modify the sub
		const { error } = await supabase
			.from('subscriptions')
			.update({
				end_timestamp: subscription_end.toISOString().toLocaleString(),
				start_timestamp: subscription_start.toISOString().toLocaleString(),
				subscription_id: subscription_id,
				price_id: price_id,
				user_id: user_id,
				has_cancelled: !!cancel_at,
				updated_at: new Date().toISOString().toLocaleString()
			})
			.eq('subscription_id', subscription_id);

		update_error = error;
	}

	if (is_trialing) {
		try {
			await supabase
				.from('users')
				.update({
					has_had_free_trial: true,
					updated_at: new Date().toISOString().toLocaleString()
				})
				.eq('user_id', users[0].user_id);
		} catch (error) {
			console.error('Failed to Update User to Has Used Free Trial: ', error);
		}
	}

	if (update_error) {
		// If there is an error related to the update, we need to check if the user data already has the subscription, we try again maybe?
		tries += 1;

		if (tries < 3) {
			return update_user_subscription(
				user_id,
				subscription_id,
				subscription_start,
				subscription_end,
				price_id,
				supabase,
				is_trialing,
				cancel_at,
				tries
			);
		} else {
			console.error('⚠️ Maximum Tries reached: ', {
				user_id,
				subscription_id,
				subscription_start,
				subscription_end,
				price_id,
				is_trialing,
				cancel_at,
				tries
			});
			return;
		}
	}

	// Delete old subscriptions ? - This is a maybe
}

async function handle_subscription(
	invoice: Stripe.Invoice | string | null,
	sub_id: string,
	price_id: string,
	metadata: any,
	current_period_start: number,
	current_period_end: number,
	subscription_status:
		| 'active'
		| 'incomplete'
		| 'canceled'
		| 'incomplete_expired'
		| 'past_due'
		| 'paused'
		| 'trialing'
		| 'unpaid',
	subscription: Stripe.Subscription,
	supabase: SupabaseClient
) {
	if (prices.some((id: string) => id === price_id)) {
		if (invoice) {
			if (typeof invoice === 'string') {
				// Fetch the invoice
				invoice = await stripe.invoices.retrieve(invoice);
			}

			if (!invoice) {
				// We must have an invoice associated with the subscription ?
				return;
			}

			if (
				metadata['user_id'] &&
				invoice.status === 'paid' &&
				Date.now() / 1000 < current_period_end
			) {
				// Update the subscription to the start and end times
				// Maybe delete the sub here ?
				update_user_subscription(
					metadata['user_id'],
					sub_id,
					new Date(current_period_start * 1000),
					new Date(current_period_end * 1000),
					price_id,
					supabase,
					subscription.status === 'trialing',
					subscription.cancel_at
				);
			}
		}
	}
}

async function handle_invoice(invoice: Stripe.Invoice | string, supabase: SupabaseClient) {
	if (typeof invoice === 'string') {
		invoice = await stripe.invoices.retrieve(invoice);
		console.log('parsed invoice from a string');
	}

	if (!invoice) {
		console.log('Not invoice');
		return;
	}

	if (invoice.status !== 'paid') {
		console.log('Invoice is not paid');
		return;
	}

	if (invoice.amount_remaining !== 0) {
		console.log('Invoice has remaining amount');
		return;
	}

	// Handle the paid invoice status
	if (typeof invoice.subscription === 'string') {
		// Find the subscription
		invoice.subscription = await stripe.subscriptions.retrieve(invoice.subscription);
		console.log('invoice converted from a string');
	}

	if (!invoice.subscription) {
		console.log('No subscription found');
		return;
	}

	handle_subscription(
		invoice,
		invoice.subscription.id,
		invoice.subscription.items.data[0].price.id,
		invoice.subscription.metadata,
		invoice.subscription.current_period_start,
		invoice.subscription.current_period_end,
		invoice.subscription.status,
		invoice.subscription,
		supabase
	);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { supabase } }: RequestEvent) {
	const _rawBody = await request.arrayBuffer();
	const payload = toBuffer(_rawBody);

	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		throw error(400, 'Invalid request');
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(payload, signature, PRIVATE_STRIPE_WEBHOOK_SECRET);
	} catch (err: any) {
		// warn when signature is invalid
		console.warn('⚠️  Webhook signature verification failed.', err.message);

		// return, because signature is invalid
		throw error(400, 'Invalid request');
	}

	// * See => https://docs.stripe.com/billing/subscriptions/overview#:~:text=The%20subscription%20remains%20in%20status,and%20the%20invoice%20becomes%20void%20.
	switch (event.type) {
		case 'customer.subscription.created':
			// Subscription was created
			// Note: status will be `incomplete`
			handle_subscription(
				event.data.object.latest_invoice,
				event.data.object.id,
				event.data.object.items.data[0].price.id,
				event.data.object.metadata,
				event.data.object.current_period_start,
				event.data.object.current_period_end,
				event.data.object.status,
				event.data.object,
				supabase
			);
			break;
		case 'customer.subscription.updated':
			// Subscription has been changed
			// Get the price id
			handle_subscription(
				event.data.object.latest_invoice,
				event.data.object.id,
				event.data.object.items.data[0].price.id,
				event.data.object.metadata,
				event.data.object.current_period_start,
				event.data.object.current_period_end,
				event.data.object.status,
				event.data.object,
				supabase
			);
			break;
		case 'customer.subscription.deleted':
			handle_subscription(
				event.data.object.latest_invoice,
				event.data.object.id,
				event.data.object.items.data[0].price.id,
				event.data.object.metadata,
				event.data.object.current_period_start,
				event.data.object.current_period_end,
				event.data.object.status,
				event.data.object,
				supabase
			);
			break;
		case 'invoice.paid':
			console.log('Handling Paid Invoice');
			handle_invoice(event.data.object.id, supabase);
			break;
		default:
			// Unexpected event type
			break;
	}

	return json({
		message: 'Success'
	});
}
