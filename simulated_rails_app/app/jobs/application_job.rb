class ApplicationJob
  class << self
    def perform_async(*args)
      Thread.new do
        Rails.logger.info("Enqueued #{self.name} with args: #{args.inspect}")
        begin
          new.perform(*args)
          Rails.logger.info("Successfully executed #{self.name}")
        rescue StandardError => e
          Rails.logger.error("Failed to execute #{self.name}: #{e.message}")
        end
      end
    end
  end
end
