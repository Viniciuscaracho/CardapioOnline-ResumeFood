module Api
  class QueueController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_admin!
    
    # Estatísticas das filas
    def stats
      stats = QueueManager.queue_stats
      
      # Adicionar estatísticas gerais
      general_stats = {
        total_jobs: Sidekiq::Stats.new.total_processed,
        failed_jobs: Sidekiq::Stats.new.failed,
        retry_jobs: Sidekiq::RetrySet.new.size,
        dead_jobs: Sidekiq::DeadSet.new.size,
        scheduled_jobs: Sidekiq::ScheduledSet.new.size
      }
      
      render json: {
        queues: stats,
        general: general_stats,
        timestamp: Time.current.iso8601
      }
    end
    
    # Detalhes de uma fila específica
    def queue_details
      queue_name = params[:queue_name]
      queue = Sidekiq::Queue.new(queue_name)
      
      jobs = queue.map do |job|
        {
          jid: job.jid,
          class: job.klass,
          args: job.args,
          created_at: job.created_at,
          enqueued_at: job.enqueued_at
        }
      end
      
      render json: {
        queue_name: queue_name,
        size: queue.size,
        latency: queue.latency,
        jobs: jobs
      }
    end
    
    # Limpar uma fila
    def clear_queue
      queue_name = params[:queue_name]
      QueueManager.clear_queue(queue_name)
      
      render json: { 
        message: "Queue #{queue_name} cleared successfully",
        timestamp: Time.current.iso8601
      }
    end
    
    # Pausar uma fila
    def pause_queue
      queue_name = params[:queue_name]
      QueueManager.pause_queue(queue_name)
      
      render json: { 
        message: "Queue #{queue_name} paused successfully",
        timestamp: Time.current.iso8601
      }
    end
    
    # Retomar uma fila
    def resume_queue
      queue_name = params[:queue_name]
      QueueManager.resume_queue(queue_name)
      
      render json: { 
        message: "Queue #{queue_name} resumed successfully",
        timestamp: Time.current.iso8601
      }
    end
    
    # Retry jobs falhados
    def retry_failed
      queue_name = params[:queue_name]
      QueueManager.retry_failed_jobs(queue_name)
      
      render json: { 
        message: "Failed jobs retried for queue #{queue_name}",
        timestamp: Time.current.iso8601
      }
    end
    
    # Agendar job
    def schedule_job
      worker_class = params[:worker_class]
      args = params[:args] || []
      options = params[:options] || {}
      
      # Validar worker class
      unless valid_worker_class?(worker_class)
        return render json: { error: 'Invalid worker class' }, status: :bad_request
      end
      
      # Enfileirar job
      worker_class.constantize.perform_async(*args)
      
      render json: { 
        message: "Job scheduled successfully",
        worker_class: worker_class,
        args: args,
        timestamp: Time.current.iso8601
      }
    end
    
    # Jobs falhados
    def failed_jobs
      failed_set = Sidekiq::RetrySet.new
      
      jobs = failed_set.map do |job|
        {
          jid: job.jid,
          class: job.klass,
          args: job.args,
          error_message: job.error_message,
          failed_at: job.failed_at,
          retry_count: job.retry_count
        }
      end
      
      render json: {
        failed_jobs: jobs,
        total: failed_set.size
      }
    end
    
    # Jobs agendados
    def scheduled_jobs
      scheduled_set = Sidekiq::ScheduledSet.new
      
      jobs = scheduled_set.map do |job|
        {
          jid: job.jid,
          class: job.klass,
          args: job.args,
          scheduled_at: job.at
        }
      end
      
      render json: {
        scheduled_jobs: jobs,
        total: scheduled_set.size
      }
    end
    
    private
    
    def ensure_admin!
      unless current_user&.admin?
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    end
    
    def valid_worker_class?(worker_class)
      %w[
        OrderProcessingWorker
        EmailWorker
        NotificationWorker
        AnalyticsBatchWorker
        KinesisAnalyticsWorker
      ].include?(worker_class)
    end
  end
end
