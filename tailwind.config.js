module.exports = {
	purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				'gray-150': '#F6F8FB',
				'gray-process': '#F2F2F2',
				'gray-input': '#F6F8FB',
				'gray-input-border': '#E0E0E0',
				'gray-250': '#FAFAFB',
				'gray-550': '#4F4F4F',
				'blue-550': '#2F80ED',
				'blue-120': '#97BEF4',
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
