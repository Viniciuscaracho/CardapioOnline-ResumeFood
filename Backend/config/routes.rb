# config/routes.rb
Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: 'registrations', sessions: 'sessions' }
  resources :users, only: [:index, :show]
  root 'home#index'
  resources :search
  resources :deputies

  # Rota para métricas
  get 'metrics', to: 'metrics#index'

  # Área administrativa
  namespace :admin do
    get '/', to: 'dashboard#index'
    get '/api_data', to: 'dashboard#api_data'
    resources :products
    resources :orders
  end

  # Rotas da API para produtos e pedidos
  namespace :api do
    get '/dashboard/stats', to: 'dashboard#stats'
    resources :products, only: [:index, :show, :create, :update, :destroy]
    resources :orders, only: [:index, :show, :create, :update, :destroy] do
      collection do
        get :search
      end
    end
    
    # Rotas de autenticação
    post '/auth/admin_login', to: 'auth#admin_login'
    get '/auth/admin_verify', to: 'auth#admin_verify'
  end

  # Action Cable
  mount ActionCable.server => '/cable'
end
