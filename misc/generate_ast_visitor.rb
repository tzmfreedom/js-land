#!/usr/bin/env ruby

require 'yaml'

class_names = []
class_mapping = YAML.load(STDIN.read)
class_mapping.each do |key, _|
  class_name = key.gsub(/^([a-z])/) { $1.upcase }
                  .gsub(/_([a-z])/) { $1.upcase }
                  .chomp
  class_names << class_name
end

BUILDER_CLASS_NAME = ARGV[0]
puts "class #{BUILDER_CLASS_NAME} {"
class_names.each do |class_name|
  puts <<JS
  visit#{class_name}(node) {
  
  }

JS
end
puts <<~JS
}

exports.#{BUILDER_CLASS_NAME} = #{BUILDER_CLASS_NAME};
JS
