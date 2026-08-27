class SendEmailJob < ApplicationJob
  def perform(user_id, template)
    user = FakeUserRepository.new.find(user_id)
    Rails.logger.info("Sending #{template} email to #{user[:email]}...")
    sleep 2 # Simulate network delay
    Rails.logger.info("Email sent to #{user[:email]}")
  end
end
