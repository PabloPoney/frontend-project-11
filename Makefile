install:
	npm ci

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

serve:
	npx webpack serve

del-build:
	rm -rf dist

build:
	NODE_ENV=production npx webpack