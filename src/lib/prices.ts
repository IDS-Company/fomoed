import { PRIVATE_STRIPE_PRICES } from '$env/static/private';

const prices = PRIVATE_STRIPE_PRICES.split(',').map((p) => p.trim());

export default prices;
