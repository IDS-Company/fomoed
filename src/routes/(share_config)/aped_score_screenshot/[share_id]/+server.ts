import chromium from '@sparticuz/chromium';
import { error } from '@sveltejs/kit';
import puppeteer from 'puppeteer-core';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	chromium.setGraphicsMode = false;
	chromium.setHeadlessMode = true;

	const browser = await puppeteer.launch({
		args: [
			'--disable-features=site-per-process',
			'--disable-dev-shm-usage',
			'--disable-gpu',
			'--disable-dev-shm-usage',
			'--disable-setuid-sandbox',
			'--no-first-run',
			'--no-sandbox',
			'--no-zygote',
			'--deterministic-fetch',
			'--disable-features=IsolateOrigins',
			'--disable-site-isolation-trials'
		],
		defaultViewport: { height: 630, width: 1200 },
		executablePath: url.origin.includes('localhost')
			? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
			: await chromium.executablePath(),
		headless: chromium.headless
	});

	const [browser_page] = await browser.pages();
	await browser_page.goto(
		`${url.origin.endsWith('/') ? url.origin : `${url.origin}/`}aped_score_screenshot${url.search}`
	);
	await browser_page.waitForNetworkIdle();
	const buffer = await browser_page.screenshot();

	await browser.close();

	return new Response(buffer);
}
