class A; def initialize(app); @app=app; end; def call(env); puts "A in"; begin; @app.call(env); rescue => e; puts "A caught"; raise; end; puts "A out"; end; end
class B; def initialize(app); @app=app; end; def call(env); puts "B in"; begin; @app.call(env); rescue => e; puts "B caught"; raise; end; puts "B out"; end; end
class C; def call(env); puts "C raise"; raise "Error"; end; end
require 'rack'
app = Rack::Builder.new do
  use A
  use B
  run C.new
end
begin; app.call({}); rescue; end
