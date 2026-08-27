# -*- encoding: utf-8 -*-
# stub: traceforge 1.0.7 ruby lib

Gem::Specification.new do |s|
  s.name = "traceforge".freeze
  s.version = "1.0.7".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Khushal Patil".freeze]
  s.date = "1980-01-02"
  s.description = "Zero-touch exception capturing for Ruby on Rails applications.".freeze
  s.email = ["patilkhushal54321@gmail.com".freeze]
  s.homepage = "https://github.com/khushalp2004/TraceForge".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "4.0.16".freeze
  s.summary = "TraceForge SDK for Ruby on Rails.".freeze

  s.installed_by_version = "4.0.16".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<railties>.freeze, [">= 5.0".freeze])
  s.add_runtime_dependency(%q<rack>.freeze, [">= 2.0".freeze])
  s.add_runtime_dependency(%q<dotenv>.freeze, [">= 2.0".freeze])
end
