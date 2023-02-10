install:
	npm ci

lint:
	npx eslint

serve:
	npx webpack serve

del-build:
	rm -rf dist

build:
	NODE_ENV=production npx webpack