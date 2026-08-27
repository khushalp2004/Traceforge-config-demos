class ErrorsController < ApplicationController
  skip_before_action :authenticate_request, only: [:no_method, :name_error, :json, :file, :cache, :auth, :timeout, :validation, :internal]

  def no_method
    user = nil
    user.name
  end

  def name_error
    puts undefined_variable_current_user
  end

  def json
    JSON.parse("{malformed: true}")
  end

  def file
    File.read("/path/to/missing/file.txt")
  end

  def cache
    raise StandardError, "Redis connection failed (simulated)"
  end

  def auth
    raise FakeDatabase::RecordInvalid, "Invalid or expired token (simulated)"
  end

  def timeout
    sleep 5
    render json: { success: false, message: "Request timeout", errorCode: "TIMEOUT" }, status: :gateway_timeout
  end

  def validation
    render json: { success: false, errors: { email: ["can't be blank", "is invalid"] }, errorCode: "VALIDATION_FAILED" }, status: :unprocessable_entity
  end

  def internal
    raise RuntimeError, "This is a simulated internal server error"
  end
end
