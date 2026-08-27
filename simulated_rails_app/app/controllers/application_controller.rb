class ApplicationController < ActionController::API
  before_action :authenticate_request

  # rescue_from StandardError, with: :handle_internal_error
  rescue_from FakeDatabase::RecordNotFound, with: :handle_not_found
  rescue_from FakeDatabase::RecordInvalid, with: :handle_unauthorized
  rescue_from ActionController::ParameterMissing, with: :handle_bad_request

  attr_reader :current_user

  private

  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    raise FakeDatabase::RecordInvalid, 'Missing token' unless token

    decoded = JwtService.decode(token)
    @current_user = FakeUserRepository.new.find(decoded[:user_id])
  end

  def handle_unauthorized(e)
    render json: { success: false, message: e.message, errorCode: 'UNAUTHORIZED' }, status: :unauthorized
  end

  def handle_not_found(e)
    render json: { success: false, message: e.message, errorCode: 'NOT_FOUND' }, status: :not_found
  end

  def handle_bad_request(e)
    render json: { success: false, message: e.message, errorCode: 'BAD_REQUEST' }, status: :bad_request
  end

  def handle_internal_error(e)
    Rails.logger.error(e.message)
    Rails.logger.error(e.backtrace.join("\n"))
    render json: { success: false, message: 'Internal Server Error', errorCode: 'INTERNAL_ERROR' }, status: :internal_server_error
  end
end
