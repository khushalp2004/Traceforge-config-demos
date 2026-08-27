class DashboardController < ApplicationController
  skip_before_action :authenticate_request

  def index
    1 / 0
    # Demonstrate caching
    cached_data = Rails.cache.fetch('dashboard_data', expires_in: 10.seconds) do
      # This block simulates a cache miss and expensive data aggregation
      sleep 1 # simulate DB aggregation delay
      
      {
        users_count: FakeDatabase.instance.users.size,
        posts_count: FakeDatabase.instance.posts.size,
        comments_count: FakeDatabase.instance.comments.size,
        generated_at: Time.current
      }
    end

    render json: {
      success: true,
      stats: cached_data,
      metrics: {
        uptime: "#{((Time.now - Rails.application.config.start_time) / 60).round(2)} minutes",
        ruby_version: RUBY_VERSION,
        rails_version: Rails.version,
        memory_usage_mb: (ObjectSpace.memsize_of_all / 1024.0 / 1024.0).round(2),
        active_threads: Thread.list.select(&:alive?).count
      },
      message: "Data cached for 10 seconds. Reload to see cache hit."
    }
  end
end
