/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				// fhd: "1920px",
				// "2k": "2560px",
				// "4k": "3840px",
				// "-2xl": { max: "1535px" },
				// "-xl": { max: "1279px" },
				// "-lg": { max: "1023px" },
				// "-md": { max: "767px" },
				'-sm': { max: '639px' },
				// "@md": { min: "640px", max: "767px" },
				// "@lg": { min: "768px", max: "1023px" },
				// "@xl": { min: "1024px", max: "1279px" },
				// "@2xl": { min: "1280px", max: "1535px" },
				desktop: { min: '980px' }, // The maximum width that the homepage look good on
				'-desktop': { max: '980px' }, // The maximum width that the homepage look good on
				'-1120': { max: '1120px' }
			},
			colors: {
				background: '#0d0d0d',
				platform_red: '#f02834',
				platform_orange: '#f07d29',
				platform_light_green: '#99cb81',
				platform_green: '#34b348',
				primary: '#FF3B10',
				yellow: '#F3C111'
			},
			fontFamily: {
				satoshi: ['Satoshi-Variable', 'sans-serif'],
				switzer: ['Switzer-Variable', 'sans-serif'],
				paralucent: ['Paralucent', 'sans-serif'],
				'paralucent-demibold': ['ParalucentDemibold', 'sans-serif'],
				'paralucent-heavy': ['ParalucentHeavy', 'sans-serif'],
				sans: ['Manrope', 'sans-serif'],
				manrope: ['Manrope', 'sans-serif']
			},
			boxShadow: {
				'primary-button': '0px 0px 0px 5px #FF3B1033'
			}
		}
	},
	plugins: []
};
