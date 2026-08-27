class GenerateReportJob < ApplicationJob
  def perform(report_type)
    Rails.logger.info("Generating #{report_type} report...")
    sleep 5 # Simulate heavy computation
    
    if rand < 0.2
      # Simulate a 20% chance of random failure
      raise "Random failure occurred during report generation"
    end
    
    Rails.logger.info("Successfully generated #{report_type} report.")
  end
end
