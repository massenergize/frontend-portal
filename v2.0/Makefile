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
	python deployment/prepare_to_deploy.py prod-sandbox 0 1
	npm run build  && aws2 s3 sync build/ s3://sandbox.community.massenergize.org
	python deployment/prepare_to_deploy.py prod 0 1
	npm run build  && aws2 s3 sync build/ s3://community.massenergize.org
.PHONY: deploy-prod

deploy-dev:
	python deployment/prepare_to_deploy.py dev-sandbox 0 1
	npm run build  && aws2 s3 sync build/ s3://sandbox.community-dev.massenergize.org
	python deployment/prepare_to_deploy.py dev 0 1
	npm run build  && aws2 s3 sync build/ s3://community-dev.massenergize.org
.PHONY: deploy-dev

run-dev:
	python deployment/prepare_to_deploy.py dev  $(local)
	npm start
.PHONY: run-dev

run-dev-sandbox:
	python deployment/prepare_to_deploy.py dev-sandbox $(local)
	npm start
.PHONY: run-dev-sandbox

run-prod:
	python deployment/prepare_to_deploy.py prod $(local)
	npm start
.PHONY: run-prod

run-local:
	python deployment/prepare_to_deploy.py dev 1
	npm start
.PHONY: run-prod

run-prod-sandbox:
	python deployment/prepare_to_deploy.py prod-sandbox  $(local)
	npm start
.PHONY: run-prod-sandbox
