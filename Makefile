.PHONY: help watch dist test test-watch

WEBPACK_CMD = node_modules/.bin/webpack
WEBPACK_ARGS = --config webpack.config.js --progress --colors --display-error-details
WEBPACK_ARGS_DIST = --config webpack.config.prod.js --progress --colors --display-error-details
WEBPACK_DEV_SERVER = node_modules/webpack-dev-server/bin/webpack-dev-server.js --content-base src/ --progress --colors
KARMA_CMD = NODE_ENV=test node_modules/.bin/karma
KARMA_ARGS =  start karma.config.js
LINT_CMD = node_modules/eslint/bin/eslint.js
LINT_ARGS = ./src/ --ext .jsx,.js

NO_COLOR=\033[0m
CYAN=\033[36;1m
GREEN=\033[32;1m
CLOUD="☁"
ARROW="➜"

help:
	@echo "${CYAN}${CLOUD}${NO_COLOR} ${GREEN}Hey! here's some cool commands for you to start${NO_COLOR} ${CYAN}${ARROW}${NO_COLOR}"
	@IFS=$$'\n' ; \
  help_lines=(`fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//'`); \
  for help_line in $${help_lines[@]}; do \
      IFS=$$'#' ; \
      help_split=($$help_line) ; \
      help_command=`echo $${help_split[0]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
      help_info=`echo $${help_split[2]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
      printf "%-30s %s\n" $$help_command $$help_info ; \
  done

watch: ## Starts Webpack Watch
	@echo "${CYAN}${CLOUD}${NO_COLOR} ${GREEN}Running Webpack Watch${NO_COLOR} ${CYAN}${ARROW}${NO_COLOR}"
	$(WEBPACK_DEV_SERVER)

dist: ## Build for Production
	@echo "${CYAN}${CLOUD}${NO_COLOR} ${GREEN}Webpack Building${NO_COLOR} ${CYAN}${ARROW}${NO_COLOR}"
	$(WEBPACK_CMD) $(WEBPACK_ARGS_DIST)
	@echo "${CYAN}${CLOUD}${NO_COLOR} ${GREEN}DONE!${NO_COLOR} ${CYAN}${ARROW}${NO_COLOR}"

test: ## Singlerun tests
	@echo "${CYAN}${CLOUD}${NO_COLOR} ${GREEN}Singlerun Tests${NO_COLOR} ${CYAN}${ARROW}${NO_COLOR}"
	$(KARMA_CMD) $(KARMA_ARGS) --single-run

test-watch: ## Starts Test Watch
	@echo "${CYAN}${CLOUD}${NO_COLOR} ${GREEN}Running Test Watch${NO_COLOR} ${CYAN}${ARROW}${NO_COLOR}"
	$(KARMA_CMD) $(KARMA_ARGS) --watch

lint: ## Singlerun eslint
	@echo "${CYAN}${CLOUD}${NO_COLOR} ${GREEN}Singlerun ESlint${NO_COLOR} ${CYAN}${ARROW}${NO_COLOR}"
	${LINT_CMD} ${LINT_ARGS}
	@echo "${CYAN}${CLOUD}${NO_COLOR} ${GREEN}DONE!${NO_COLOR} ${CYAN}${ARROW}${NO_COLOR}"
