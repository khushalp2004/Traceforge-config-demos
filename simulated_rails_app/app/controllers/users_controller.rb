class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]

  def index
    users = FakeUserRepository.new.paginate(page: params[:page], per_page: params[:per_page])
    render json: { success: true, users: users }
  end

  def show
    render json: { success: true, user: @user }
  end

  def create
    user = FakeUserRepository.new.create(user_params)
    render json: { success: true, user: user }, status: :created
  end

  def update
    updated_user = FakeUserRepository.new.update(@user[:id], user_params)
    render json: { success: true, user: updated_user }
  end

  def destroy
    FakeUserRepository.new.destroy(@user[:id])
    render json: { success: true, message: 'User deleted' }
  end

  private

  def set_user
    @user = FakeUserRepository.new.find(params[:id])
  end

  def user_params
    params.permit(:name, :email, :password)
  end
end
