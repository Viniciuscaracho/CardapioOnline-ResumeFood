# frozen_string_literal: true

class MetricsController < ApplicationController
  def index
    # Retorna as métricas em formato de texto (prometheus-formatted)
    render plain: Prometheus::Client.registry.metrics.map(&:to_s).join("\n")
  end
end
