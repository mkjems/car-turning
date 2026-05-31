export default [
	{
		ignores: ['dist/**', 'build/**', 'node_modules/**']
	},
	{
		files: ['src/**/*.js'],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: 'module',
			globals: {
				document: 'readonly',
				window: 'readonly',
				console: 'readonly'
			}
		},
		rules: {
			'no-use-before-define': ['warn', { functions: false }],
			'no-console': 'warn'
		}
	}
];
