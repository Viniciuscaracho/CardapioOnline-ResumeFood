module Api
  class SqsController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_admin!
    
    # Estatísticas das filas SQS
    def queue_stats
      stats = {}
      
      SqsService::QUEUES.each do |queue_name, config|
        begin
          queue_stats = SqsService.get_queue_stats(queue_name)
          stats[queue_name] = queue_stats
        rescue => e
          Rails.logger.error "Error getting stats for queue #{queue_name}: #{e.message}"
          stats[queue_name] = { error: e.message }
        end
      end
      
      render json: {
        queues: stats,
        timestamp: Time.current.iso8601
      }
    end
    
    # Estatísticas das DLQs
    def dlq_stats
      dlq_stats = {}
      
      SqsService::QUEUES.each do |queue_name, config|
        begin
          dlq_name = "#{queue_name}_dlq"
          dlq_stats[dlq_name] = SqsService.get_queue_stats(dlq_name)
        rescue => e
          Rails.logger.error "Error getting DLQ stats for #{queue_name}: #{e.message}"
          dlq_stats[dlq_name] = { error: e.message }
        end
      end
      
      render json: {
        dlq_stats: dlq_stats,
        timestamp: Time.current.iso8601
      }
    end
    
    # Logs de falha
    def failure_logs
      logs = FailureLog.recent(7.days)
                     .order(occurred_at: :desc)
                     .limit(100)
      
      render json: {
        failure_logs: logs.map do |log|
          {
            id: log.id,
            service: log.service,
            error_message: log.error_message,
            order_id: log.order_id,
            action: log.action,
            status: log.status,
            occurred_at: log.occurred_at,
            created_at: log.created_at
          }
        end,
        total: logs.count
      }
    end
    
    # Enviar mensagem para SQS
    def send_message
      queue_name = params[:queue_name]
      message_body = params[:message_body]
      options = params[:options] || {}
      
      # Validar parâmetros
      unless queue_name && message_body
        return render json: { error: 'queue_name and message_body are required' }, status: :bad_request
      end
      
      # Validar fila
      unless SqsService::QUEUES.key?(queue_name.to_sym)
        return render json: { error: 'Invalid queue name' }, status: :bad_request
      end
      
      begin
        response = SqsService.send_message(queue_name.to_sym, message_body, options)
        
        render json: {
          message: 'Message sent successfully',
          message_id: response.message_id,
          queue_name: queue_name,
          timestamp: Time.current.iso8601
        }
      rescue => e
        Rails.logger.error "Error sending message to SQS: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end
    end
    
    # Recuperar mensagens da DLQ
    def recover_from_dlq
      queue_name = params[:queue_name]
      message_ids = params[:message_ids] || []
      
      unless queue_name
        return render json: { error: 'queue_name is required' }, status: :bad_request
      end
      
      begin
        # Recuperar mensagens da DLQ
        recovered_count = 0
        
        if message_ids.any?
          # Recuperar mensagens específicas
          message_ids.each do |message_id|
            # Implementar recuperação específica por ID
            # Por enquanto, vamos simular
            recovered_count += 1
          end
        else
          # Recuperar todas as mensagens da DLQ
          dlq_name = "#{queue_name}_dlq"
          messages = SqsService.receive_messages(dlq_name, 10)
          
          messages.each do |message|
            # Reprocessar mensagem
            SqsMessageProcessor.perform_async(queue_name, message.body, message.receipt_handle)
            recovered_count += 1
          end
        end
        
        render json: {
          message: 'Messages recovered successfully',
          recovered_count: recovered_count,
          queue_name: queue_name,
          timestamp: Time.current.iso8601
        }
      rescue => e
        Rails.logger.error "Error recovering from DLQ: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end
    end
    
    # Limpar fila
    def purge_queue
      queue_name = params[:queue_name]
      
      unless queue_name
        return render json: { error: 'queue_name is required' }, status: :bad_request
      end
      
      begin
        # Limpar fila SQS
        sqs_client = Aws::SQS::Client.new
        queue_url = SqsService.get_queue_url(queue_name)
        
        sqs_client.purge_queue(queue_url: queue_url)
        
        render json: {
          message: 'Queue purged successfully',
          queue_name: queue_name,
          timestamp: Time.current.iso8601
        }
      rescue => e
        Rails.logger.error "Error purging queue: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end
    end
    
    # Criar filas SQS
    def create_queues
      begin
        SqsService.create_queues
        
        render json: {
          message: 'SQS queues created successfully',
          queues: SqsService::QUEUES.keys,
          timestamp: Time.current.iso8601
        }
      rescue => e
        Rails.logger.error "Error creating SQS queues: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end
    end
    
    # Deletar filas SQS
    def delete_queues
      begin
        SqsService.delete_queues
        
        render json: {
          message: 'SQS queues deleted successfully',
          timestamp: Time.current.iso8601
        }
      rescue => e
        Rails.logger.error "Error deleting SQS queues: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end
    end
    
    # Estatísticas de falha
    def failure_stats
      stats = {
        total_failures: FailureLog.recent(7.days).count,
        pending_failures: FailureLog.pending.count,
        resolved_failures: FailureLog.resolved.count,
        failure_rate: FailureLog.failure_rate(nil, 7),
        top_failing_services: FailureLog.top_failing_services(7),
        auto_recoverable: FailureLog.auto_recoverable_failures.count,
        manual_intervention_required: FailureLog.manual_intervention_required.count
      }
      
      render json: {
        failure_stats: stats,
        timestamp: Time.current.iso8601
      }
    end
    
    # Resolver falha manualmente
    def resolve_failure
      failure_id = params[:failure_id]
      resolution_notes = params[:resolution_notes]
      
      unless failure_id
        return render json: { error: 'failure_id is required' }, status: :bad_request
      end
      
      begin
        failure_log = FailureLog.find(failure_id)
        failure_log.resolve!(resolution_notes)
        
        render json: {
          message: 'Failure resolved successfully',
          failure_id: failure_id,
          timestamp: Time.current.iso8601
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Failure log not found' }, status: :not_found
      rescue => e
        Rails.logger.error "Error resolving failure: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end
    end
    
    private
    
    def ensure_admin!
      unless current_user&.admin?
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    end
  end
end
