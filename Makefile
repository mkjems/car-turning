JS_FILES = $(shell find . -name "*.js")

js:
	./node_modules/.bin/webpack

lint:
	./node_modules/.bin/eslint src/game.js -c .eslintrc.json