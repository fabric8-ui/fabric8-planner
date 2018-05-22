# First off, let's fetch in the executables installed with npm
PATH  := node_modules/.bin:$(PATH)

build: processjs processcss processhtml processfiles

watch: watchjs watchcss watchhtml watchfiles

clean: cleancache cleandist cleanimages cleanmodules cleantemp

test: testunit

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
		mkdir -p $$htmldest; \
		cp $$htmlfile $$htmldest; \
	done

watchhtml:
	@chokidar --verbose 'src/**/*.html' -c 'make processhtml'

processfiles:
	# Copying LICENSE README.adoc & package.json over to dist/
	mkdir -p dist
	@cp LICENSE README.adoc package.json dist/

watchfiles:
	@chokidar --verbose 'LICENSE' 'README.adoc' 'package.json' -c 'make processfiles'

cleancache: ; @npm cache clean

cleandist: ; @rm -rf dist

cleanimages:
	@sudo docker stop $$(sudo docker ps -aq --filter "name=fabric8-planner")
	@sudo docker rm $$(sudo docker ps -aq --filter "name=fabric8-planner")
	@sudo docker rmi $$(sudo docker images -aq --filter "reference=fabric8-planner-*")

cleanmodules: ; @rm -rf node_modules

cleantemp: ; @rm -rf tmp coverage typings .sass-cache

testunit: ; @./node_modules/karma/bin/karma start
