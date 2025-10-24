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
    get '/test', to: 'test#index'
    get '/dashboard/stats', to: 'dashboard#stats'
    resources :products, only: [:index, :show, :create, :update, :destroy]
    resources :orders, only: [:index, :show, :create, :update, :destroy] do
      collection do
        get :search
      end
    end
    
    # Rotas de analytics
    post '/analytics/track', to: 'analytics#track'
    post '/analytics/page_view', to: 'analytics#track_page_view'
    post '/analytics/click', to: 'analytics#track_click'
    post '/analytics/conversion', to: 'analytics#track_conversion'
    get '/analytics/admin_stats', to: 'analytics#admin_stats'
    get '/analytics/session_events', to: 'analytics#session_events'
    get '/analytics/user_events', to: 'analytics#user_events'
    
    # Rotas de filas
    get '/queue/stats', to: 'queue#stats'
    get '/queue/:queue_name', to: 'queue#queue_details'
    delete '/queue/:queue_name/clear', to: 'queue#clear_queue'
    post '/queue/:queue_name/pause', to: 'queue#pause_queue'
    post '/queue/:queue_name/resume', to: 'queue#resume_queue'
    post '/queue/:queue_name/retry', to: 'queue#retry_failed'
    post '/queue/schedule', to: 'queue#schedule_job'
    get '/queue/failed', to: 'queue#failed_jobs'
    get '/queue/scheduled', to: 'queue#scheduled_jobs'
    
    # Rotas SQS
    get '/sqs/queues/stats', to: 'sqs#queue_stats'
    get '/sqs/dlq/stats', to: 'sqs#dlq_stats'
    get '/sqs/failures', to: 'sqs#failure_logs'
    post '/sqs/send', to: 'sqs#send_message'
    post '/sqs/dlq/:queue_name/recover', to: 'sqs#recover_from_dlq'
    post '/sqs/queue/:queue_name/purge', to: 'sqs#purge_queue'
    post '/sqs/queues/create', to: 'sqs#create_queues'
    delete '/sqs/queues/delete', to: 'sqs#delete_queues'
    get '/sqs/failure_stats', to: 'sqs#failure_stats'
    post '/sqs/failures/:failure_id/resolve', to: 'sqs#resolve_failure'
    
    # Rotas de autenticação
    post '/auth/admin_login', to: 'auth#admin_login'
    get '/auth/admin_verify', to: 'auth#admin_verify'
  end

  # Action Cable
  mount ActionCable.server => '/cable'
end
