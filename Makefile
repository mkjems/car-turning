JS_FILES = $(shell find . -name "*.js")

js:
	./node_modules/.bin/webpack --watch

lint:
	./node_modules/.bin/eslint src/game.js -c .eslintrc.json  --print-config