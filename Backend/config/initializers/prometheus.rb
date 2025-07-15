# require 'prometheus/client'
# require 'prometheus_exporter/middleware'

# prometheus = Prometheus::Client.registry

# Contador de requisições HTTP
# HTTP_REQUESTS_TOTAL = prometheus.counter(
#   :http_requests_total,
#   docstring: 'Contador de requisições HTTP por método e status',
#   labels: [:app_name, :path]
# )

# Medidor de latência
# HTTP_DURATION_SECONDS = prometheus.histogram(
#   :http_duration_seconds,
#   docstring: 'Histograma de latência de requisições HTTP',
#   buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10]
# )

# Medição do tempo de consultas SQL
# DB_QUERY_DURATION_SECONDS = prometheus.histogram(
#   :db_query_duration_seconds,
#   docstring: 'Tempo de execução das consultas SQL no banco de dados',
#   buckets: [0.1, 0.5, 1, 2, 5, 10]
# )

# Registra tempo de queries no ActiveRecord
# ActiveSupport::Notifications.subscribe('sql.active_record') do |_, start, finish, _, payload|
#   duration = finish - start
#   DB_QUERY_DURATION_SECONDS.observe(duration)
# end

# Adiciona o middleware do Prometheus Exporter
# Rails.application.config.middleware.use PrometheusExporter::Middleware
