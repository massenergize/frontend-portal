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
	python deployment/prepare_to_deploy.py prod 0 1
	npm run build  && aws2 s3 sync build/ s3://community.massenergize.org
.PHONY: deploy-prod

deploy-canary:
	python deployment/prepare_to_deploy.py canary 0 1
	npm run build  && aws2 s3 sync build/ s3://community-canary.massenergize.org
.PHONY: deploy-canary

deploy-dev:
	python deployment/prepare_to_deploy.py dev 0 1
	npm run build  && aws2 s3 sync build/ s3://community-dev.massenergize.org
.PHONY: deploy-dev

run-dev:
	python deployment/prepare_to_deploy.py dev  $(local)
	npm start
.PHONY: run-dev

dev-local:
	python deployment/prepare_to_deploy.py dev  1
	npm start
.PHONY: dev-local

dev-prod:
	python deployment/prepare_to_deploy.py prod 1
	npm start
.PHONY: dev-prod

run-prod:
	python deployment/prepare_to_deploy.py prod $(local)
	npm start
.PHONY: run-prod

run-canary:
	python deployment/prepare_to_deploy.py canary $(local)
	npm start
.PHONY: run-canary

run-local:
	python deployment/prepare_to_deploy.py dev 1
	npm start
.PHONY: run-prod
