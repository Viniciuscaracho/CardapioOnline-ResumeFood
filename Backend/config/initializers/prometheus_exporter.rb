# Prometheus Exporter monitoramento desabilitado temporariamente para rodar migrations e seeds
# require 'prometheus_exporter/server'
# require 'prometheus_exporter/middleware'
# require 'prometheus_exporter/instrumentation'
#
# PrometheusExporter::Server::WebServer.new(
#   port: 9394,
#   bind: '0.0.0.0'
# )
#
# Rails.application.middleware.unshift PrometheusExporter::Middleware
# PrometheusExporter::Instrumentation::Process.start(type: 'master')