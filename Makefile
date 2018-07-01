.PHONY: run
run:
	node main.js examples/sample3.cls

.PHONY:debug
debug:
	node inspect main.js examples/sample3.cls

.PHONY: build
build:
	java -jar /usr/local/bin/antlr4 -Dlanguage=JavaScript -visitor apex.g4
