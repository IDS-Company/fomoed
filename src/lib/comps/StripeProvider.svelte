<script lang="ts">
	import { PUBLIC_STRIPE_PUBLIC_KEY } from '$env/static/public';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { onMount, setContext } from 'svelte';

	let stripe: Stripe | null;

	setContext('stripe', {
		getStripe: () => stripe
	});

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_PUBLIC_KEY);
	});
</script>

{#if stripe}
	<slot />
{/if}
