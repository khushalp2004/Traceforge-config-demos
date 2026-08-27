module RequestTiming
  def self.new(app)
    ->(env) do
      start_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)
      status, headers, response = app.call(env)
      end_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)
      
      headers['X-Runtime'] = ((end_time - start_time) * 1000).round(2).to_s
      [status, headers, response]
    end
  end
end
