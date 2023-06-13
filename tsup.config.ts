import { defineConfig } from 'tsup-preset-solid';

export default defineConfig(
	{
		entry: 'src/index.ts',
		devEntry: false,
	},
	{
		dropConsole: true,
		writePackageJson: true,
		esbuildOptions(options) {
			options.minify = true;
		},
		cjs: true,
	}
);
