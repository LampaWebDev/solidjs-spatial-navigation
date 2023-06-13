import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(() => {
	return {
		plugins: [
			solidPlugin({
				hot: false,
				solid: { generate: 'dom' },
			}),
		],
		resolve: {
			conditions: ['browser', 'development'],
		},
	};
});
