require 'rails_helper'

RSpec.describe 'Authentication', type: :request do
  before { FakeDatabase.instance.reset! }

  describe 'POST /register' do
    it 'creates a new user and returns a token' do
      post '/register', params: { name: 'Alice', email: 'alice@test.com', password: 'password' }
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['success']).to be true
      expect(json['token']).to be_present
    end
  end

  describe 'POST /login' do
    before do
      FakeUserRepository.new.create(name: 'Bob', email: 'bob@test.com', password: 'password')
    end

    it 'logs in and returns a token' do
      post '/login', params: { email: 'bob@test.com', password: 'password' }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['token']).to be_present
    end
  end

  describe 'GET /profile' do
    let(:user) { FakeUserRepository.new.create(name: 'Charlie', email: 'charlie@test.com', password: 'password') }
    let(:token) { JwtService.encode(user_id: user[:id]) }

    it 'returns the user profile with a valid token' do
      get '/profile', headers: { 'Authorization' => "Bearer #{token}" }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['user']['name']).to eq('Charlie')
    end

    it 'returns unauthorized without a token' do
      get '/profile'
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
