class CleanupJob < ApplicationJob
  def perform
    Rails.logger.info("Starting cleanup of old data...")
    sleep 3 # Simulate long running task
    
    repo = FakePostRepository.new
    all = repo.all
    deleted_count = 0
    all.each do |post|
      if post[:title].blank? || post[:title].length < 3
        repo.destroy(post[:id])
        deleted_count += 1
      end
    end
    
    Rails.logger.info("Cleanup complete. Deleted #{deleted_count} posts.")
  end
end
