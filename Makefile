# First off, let's fetch in the executables installed with npm
PATH  := node_modules/.bin:$(PATH)

.PHONY: build

.PHONY: watch

build: processjs processcss processhtml processfiles

watch: watchjs watchcss watchhtml watchfiles

processjs:
	# Compiling TypeScript to JavaScript...
	# (according to the configs set in default tsconfig.json)
	@tsc

	# This hack is required to make the templates/styles consumable with require()
	@for jsfile in `find dist/app -name '*.js'`; do \
		sed -i -r -e "s/templateUrl:\s+('.+')/template: require(\1)/g" $$jsfile; \
		sed -i -r -e "s/styleUrls:\s+\[('.+')\]/styles: \[require(\1).toString()\]/g" $$jsfile; \
	done

watchjs:
	@chokidar --verbose 'src/**/*.ts' -c 'make processjs'

processcss:
	# Compiling LESS to CSS
	# @TODO: lesshint report & failOnError
	@for lessfile in `find src -name '*.less'`; do \
		csspath="$${lessfile/src/dist}"; \
		cssfile="$${csspath/\.less/\.css}"; \
		lessc --source-map --autoprefix="last 2 versions" $$lessfile $$cssfile; \
	done

watchcss:
	@chokidar --verbose 'src/**/*.less' -c 'make processcss'

processhtml:
	# Copying HTML over to respective paths in dist directory
	@for htmlfile in `find src -name '*.html'`; do \
		htmlname=$$(basename $$htmlfile); \
		htmlpath="$${htmlfile/src/dist}"; \
		htmldest="$${htmlpath/$$htmlname/}"; \
		cp $$htmlfile $$htmldest; \
	done

watchhtml:
	@chokidar --verbose 'src/**/*.html' -c 'make processhtml'

processfiles:
	# Copying LICENSE README.adoc & package.json over to dist/
	@cp LICENSE README.adoc package.json dist/

watchfiles:
	@chokidar --verbose 'LICENSE' 'README.adoc' 'package.json' -c 'make processfiles'
