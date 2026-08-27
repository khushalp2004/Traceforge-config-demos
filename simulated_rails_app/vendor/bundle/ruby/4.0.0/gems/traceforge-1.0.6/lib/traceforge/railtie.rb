require 'traceforge/middleware'

module TraceForge
  class Railtie < Rails::Railtie
    initializer "traceforge.configure_rails_initialization" do |app|
      app.middleware.insert_after ActionDispatch::ShowExceptions, TraceForge::Middleware
    end
  end
end
