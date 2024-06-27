/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: '#0d0d0d',
				platform_red: '#f02834',
				platform_orange: '#f07d29',
				platform_light_green: '#99cb81',
				platform_green: '#34b348'
			}
		}
	},
	plugins: []
};
