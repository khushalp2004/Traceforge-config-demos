Rails.application.routes.draw do
  post '/login', to: 'auth#login'
  post '/register', to: 'auth#register'
  get '/profile', to: 'auth#profile'

  resources :users
  resources :posts

  namespace :errors do
    get :no_method
    get :name_error
    get :json
    get :file
    get :cache
    get :auth
    get :timeout
    get :validation
    get :internal
  end

  namespace :performance do
    get :cpu
    get :memory
    get :n_plus_one
    get :large_response
    get :slow_query
  end

  get 'dashboard' => 'dashboard#index'
  get 'crash' => 'dashboard#crash'
end
