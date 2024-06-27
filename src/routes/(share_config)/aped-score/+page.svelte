<script>
	import { MetaTags } from 'svelte-meta-tags';
	import { page } from '$app/stores';

	const random_id = Math.random().toString().replace('.', '').slice(0, 6);
</script>

<MetaTags
	title="Fomoed Score"
	description="Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is
crypto. Have complete access to your favorite Altcoins and get precise data-based market
sentiment analysis"
	openGraph={{
		title: `Fomoed Score ${$page.url.searchParams.get('score') ? $page.url.searchParams.get('score') : ''}`,
		url: $page.url.origin,
		images: [
			{
				url:
					`${$page.url.origin.endsWith('/') ? $page.url.origin : `${$page.url.origin}/`}aped_score_screenshot/${random_id}?score=${$page.url.searchParams.get('score')}` ||
					'',
				width: 1200,
				height: 630,
				alt: `Fomoed Score ${$page.url.searchParams.get('score') ? $page.url.searchParams.get('score') : ''}`
			}
		],
		siteName: 'Fomoed',
		description:
			'Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is crypto. Have complete access to your favorite Altcoins and get precise data-based market sentiment analysis'
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: `Fomoed Score ${$page.url.searchParams.get('score') ? $page.url.searchParams.get('score') : ''}`,
		description:
			'Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is crypto. Have complete access to your favorite Altcoins and get precise data-based market sentiment analysis',
		image:
			`${$page.url.origin.endsWith('/') ? $page.url.origin : `${$page.url.origin}/`}aped_score_screenshot/${random_id}?score=${$page.url.searchParams.get('score')}` ||
			'',
		imageAlt: `Fomoed Score ${$page.url.searchParams.get('score') ? $page.url.searchParams.get('score') : ''}`
	}}
/>

<main>
	<h1>Fomoed</h1>
	<p>
		Aped Score {$page.url.searchParams.get('score')
			? `: ${$page.url.searchParams.get('score')}`
			: ''}
	</p>
</main>
