import { defineConfig } from 'vite';

// `npm run build` produces a single self-contained ES module, dist/car-race.js,
// which defines the <car-race> element when imported
export default defineConfig({
	build: {
		lib: {
			entry: 'src/car-race.js',
			formats: ['es'],
			fileName: function() {
				return 'car-race.js';
			}
		},
		copyPublicDir: false
	}
});
