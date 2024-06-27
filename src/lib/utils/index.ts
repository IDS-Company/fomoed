import { toast } from '@zerodevx/svelte-toast';

export function get_data_color(data: number) {
	return data <= 25 ? '#f02834' : data <= 50 ? '#f07d29' : data <= 75 ? '#99cb81' : '#34b348';
}

export function get_data_label(data: number) {
	return data <= 25
		? CFGIEnum.E_FEAR
		: data <= 50
			? CFGIEnum.FEAR
			: data <= 75
				? CFGIEnum.GREED
				: CFGIEnum.E_GREED;
}

export enum CFGIEnum {
	E_FEAR = 'Extreme Fear',
	FEAR = 'Fear',
	GREED = 'Greed',
	E_GREED = 'Extreme Greed'
}

const toast_handler = (msg: string | any, opts?: any | undefined) => {
	const id = toast.push(msg, opts);

	setTimeout(() => {
		toast.pop(id);
	}, 3000);

	return id;
};

export const success = (m: string) =>
	toast_handler(m, {
		theme: {
			'--toastBackground': 'green',
			'--toastColor': 'white',
			'--toastBarBackground': 'olive'
		}
	});

export const warning = (m: string) =>
	toast_handler(m, {
		theme: {
			'--toastBackground': 'orange',
			'--toastColor': 'white',
			'--toastBarBackground': '#ff9900'
		}
	});

export const failure = (m: string) =>
	toast_handler(m, {
		theme: {
			'--toastBackground': '#cc0033',
			'--toastColor': 'white',
			'--toastBarBackground': '#ff3300'
		}
	});

export type SocialSites = 'facebook' | 'twitter' | 'copy';

export function copy_social_link(platform: SocialSites, link: string) {
	let social_link = link;

	switch (platform) {
		case 'facebook':
			social_link = `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: link }).toString().trim()}`;
			break;
		case 'twitter':
			social_link = `https://twitter.com/intent/tweet?${new URLSearchParams({ text: link }).toString().trim()}`;
			break;
		default:
			social_link = link;
			break;
	}

	return social_link.trim();
}
