init:
	npm install
.PHONY: init

start:
	npm start
.PHONY: start

build:
	npm run build
.PHONY: build

deploy-prod:
	npm run build  && aws2 s3 sync build/ s3://community.massenergize.org
	npm run build  && aws2 s3 sync build/ s3://sandbox.community.massenergize.org
.PHONY: deploy-prod

deploy-dev:
	npm run build  && aws2 s3 sync build/ s3://community-dev.massenergize.org
	npm run build  && aws2 s3 sync build/ s3://sandbox.community-dev.massenergize.org
.PHONY: deploy-dev



