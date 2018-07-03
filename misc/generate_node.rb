#!/usr/bin/env ruby

require 'yaml'

BASE_CLASS = 'BaseNode'
def generate_class(class_name, fields)
  puts <<~JS
class #{class_name}Node {
  constructor(#{fields.join(', ')}) {
#{fields.map { |field| "    this.#{field} = #{field};" }.join("\n")}
  }

  accept(visitor) {
    visitor.visit#{class_name}(this);
  }
}
JS
end

def generate_export(class_name)
  puts "exports.#{class_name}Node = #{class_name}Node"
end

class_names = {}
class_mapping = YAML.load(STDIN.read)
class_mapping.each do |key, value|
  class_name = key.gsub(/^([a-z])/) { $1.upcase }
                  .gsub(/_([a-z])/) { $1.upcase }
                  .chomp
  class_names[class_name] = value
end

class_names.each do |class_name, fields|
  generate_class(class_name, fields)
  puts
end

puts

class_names.each do |class_name, _|
  generate_export(class_name)
end
