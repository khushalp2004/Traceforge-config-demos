class PostsController < ApplicationController
  before_action :set_post, only: [:update, :destroy]

  def index
    posts = FakePostRepository.new.paginate(page: params[:page], per_page: params[:per_page])
    render json: { success: true, posts: posts }
  end

  def create
    post = FakePostRepository.new.create(post_params.merge(user_id: current_user[:id]))
    render json: { success: true, post: post }, status: :created
  end

  def update
    updated_post = FakePostRepository.new.update(@post[:id], post_params)
    render json: { success: true, post: updated_post }
  end

  def destroy
    FakePostRepository.new.destroy(@post[:id])
    render json: { success: true, message: 'Post deleted' }
  end

  private

  def set_post
    @post = FakePostRepository.new.find(params[:id])
    raise FakeDatabase::RecordInvalid, 'Unauthorized' unless @post[:user_id] == current_user[:id]
  end

  def post_params
    params.permit(:title, :body)
  end
end
