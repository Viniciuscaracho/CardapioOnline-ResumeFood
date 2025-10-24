# Configuração do Sidekiq
require 'sidekiq'

# Configuração do Redis
Sidekiq.configure_server do |config|
  config.redis = {
    url: ENV['REDIS_URL'] || 'redis://localhost:6379/0',
    namespace: 'cheiro_verde'
  }
  
  # Configurar filas com prioridades
  config.queues = %w[critical orders emails notifications analytics low_priority]
  
  # Configurar retry
  config.retry_jobs = true
  config.max_retries = 5
  
  # Configurar middleware
  config.server_middleware do |chain|
    chain.add Sidekiq::Middleware::Server::RetryJobs
    chain.add Sidekiq::Middleware::Server::Logging
  end
end

Sidekiq.configure_client do |config|
  config.redis = {
    url: ENV['REDIS_URL'] || 'redis://localhost:6379/0',
    namespace: 'cheiro_verde'
  }
end

# Configurar middleware global
Sidekiq.configure_server do |config|
  config.server_middleware do |chain|
    chain.add Sidekiq::Middleware::Server::RetryJobs
    chain.add Sidekiq::Middleware::Server::Logging
  end
end

# Configurar middleware do cliente
Sidekiq.configure_client do |config|
  config.client_middleware do |chain|
    chain.add Sidekiq::Middleware::Client::UniqueJobs
  end
end
