module CorrelationId
  def self.new(app)
    ->(env) do
      request_id = env['HTTP_X_CORRELATION_ID'] || SecureRandom.uuid
      env['action_dispatch.request_id'] = request_id
      
      status, headers, response = app.call(env)
      
      headers['X-Correlation-ID'] = request_id
      [status, headers, response]
    end
  end
end
