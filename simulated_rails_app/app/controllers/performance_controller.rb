class PerformanceController < ApplicationController
  skip_before_action :authenticate_request

  def cpu
    iterations = (params[:iterations] || 10_000_000).to_i
    start_time = Time.now

    result = 0
    iterations.times do |i|
      result += Math.sqrt(i)
    end

    end_time = Time.now
    render json: { success: true, execution_time: "#{((end_time - start_time) * 1000).round(2)}ms", result: result }
  end

  def memory
    # Simulate a memory leak by appending to a global array
    $memory_leak_array ||= []
    100_000.times do |i|
      $memory_leak_array << "This string takes up memory #{i} - #{Time.now.to_f}"
    end

    render json: { success: true, message: "Allocated 100,000 strings", total_leaked_items: $memory_leak_array.size }
  end

  def large_response
    start_time = Time.now
    users = Array.new(100_000) do |i|
      { id: i, name: "User #{i}", email: "user#{i}@example.com" }
    end
    end_time = Time.now

    render json: { success: true, generate_time: "#{((end_time - start_time) * 1000).round(2)}ms", users_count: users.size }
  end

  def slow_query
    start_time = Time.now
    sleep 5 # Simulate slow DB query
    end_time = Time.now

    render json: { success: true, query_duration: "#{((end_time - start_time) * 1000).round(2)}ms" }
  end

  def n_plus_one
    # Setup some fake data
    repo = FakeUserRepository.new
    post_repo = FakePostRepository.new
    
    100.times do |i|
      user = repo.create(name: "User #{i}", email: "nplusone#{i}@example.com")
      3.times do |j|
        post_repo.create(title: "Post #{j}", body: "Body", user_id: user[:id])
      end
    end

    # Bad Implementation (N+1)
    start_bad = Time.now
    users_with_posts_bad = repo.all.map do |user|
      user.merge(posts: post_repo.find_by_user_id(user[:id]))
    end
    end_bad = Time.now

    # Good Implementation (Simulated Eager Loading)
    start_good = Time.now
    all_users = repo.all
    all_posts = post_repo.all
    posts_by_user = all_posts.group_by { |p| p[:user_id] }
    users_with_posts_good = all_users.map do |user|
      user.merge(posts: posts_by_user[user[:id]] || [])
    end
    end_good = Time.now

    render json: {
      success: true,
      n_plus_one_duration: "#{((end_bad - start_bad) * 1000).round(2)}ms",
      optimized_duration: "#{((end_good - start_good) * 1000).round(2)}ms",
      users_count: users_with_posts_good.size
    }
  end
end
