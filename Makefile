.PHONY: run
run:
	@time bin/land -f examples/sample.cls --action "Hoge1#action"

.PHONY:debug
debug:
	node inspect lib/main.js examples/sample3.cls

.PHONY: build
build:
	java -jar /usr/local/bin/antlr4 -Dlanguage=JavaScript -visitor lib/apex.g4

node/ast.js: misc/generate_node.rb misc/node.yml
	misc/generate_node.rb < misc/node.yml > lib/node/ast.js

node/apex_interpreter.js: misc/generate_ast_visitor.rb misc/node.yml
	misc/generate_ast_visitor.rb ApexInterpreter < misc/node.yml > misc/apex_interpreter.js
