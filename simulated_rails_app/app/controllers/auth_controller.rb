class AuthController < ApplicationController
  skip_before_action :authenticate_request, only: [:login, :register]

  def login
    user = FakeUserRepository.new.find_by(email: params[:email])
    
    if user && params[:password].present? # Simple fake password validation
      token = JwtService.encode(user_id: user[:id])
      render json: { success: true, token: token, user: user }
    else
      render json: { success: false, message: 'Invalid credentials', errorCode: 'UNAUTHORIZED' }, status: :unauthorized
    end
  end

  def register
    user = FakeUserRepository.new.create(
      name: params[:name],
      email: params[:email],
      password: params[:password]
    )
    token = JwtService.encode(user_id: user[:id])
    render json: { success: true, token: token, user: user }, status: :created
  end

  def profile
    render json: { success: true, user: current_user }
  end
end
