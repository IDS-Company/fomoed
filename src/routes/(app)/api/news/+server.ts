import { json } from '@sveltejs/kit';
import { NewsService } from '$ts/server/services/NewsService.server';

const newsService = new NewsService();

export async function GET() {
	const data = await newsService.getFromCryptoPanic();

	return json({ success: true, data });
}
