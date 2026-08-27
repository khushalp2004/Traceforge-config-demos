module RequestLogging
  def self.new(app)
    ->(env) do
      start_time = Time.now
      Rails.logger.info("Started #{env['REQUEST_METHOD']} #{env['PATH_INFO']} for #{env['REMOTE_ADDR']} at #{start_time}")
      
      status, headers, response = app.call(env)
      
      end_time = Time.now
      Rails.logger.info("Completed #{status} in #{((end_time - start_time) * 1000).round(2)}ms")
      
      [status, headers, response]
    end
  end
end
