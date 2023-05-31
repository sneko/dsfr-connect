define HELP_TEXT

  Makefile commands

	make deps       - Install dependent programs and libraries
	make ...     	  - (see the Makefile)

endef

help:
	$(info $(HELP_TEXT))

build:
	pnpm turbo build

serve:
	pnpm turbo dev

lint:
	pnpm turbo lint

test-unit:
	pnpm turbo test:unit

test-unit-watch:
	pnpm turbo test:unit:watch

clean:
	pnpm turbo clean

deps:
	pnpm install

format:
	pnpm run format

format-check:
	pnpm run format:check
