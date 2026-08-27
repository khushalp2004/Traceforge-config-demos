require 'rails_helper'

RSpec.describe 'Errors Laboratory', type: :request do
  describe 'GET /errors/timeout' do
    it 'returns a timeout response' do
      get '/errors/timeout'
      expect(response).to have_http_status(:gateway_timeout)
    end
  end

  describe 'GET /errors/internal' do
    it 'returns a 500 error gracefully caught by global exception handler' do
      get '/errors/internal'
      expect(response).to have_http_status(:internal_server_error)
      json = JSON.parse(response.body)
      expect(json['success']).to be false
      expect(json['errorCode']).to eq('INTERNAL_ERROR')
    end
  end
end
