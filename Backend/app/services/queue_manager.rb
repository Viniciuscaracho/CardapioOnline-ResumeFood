class QueueManager
  # Filas organizadas por prioridade
  QUEUES = {
    critical: {
      priority: 1,
      description: 'Jobs críticos que precisam ser processados imediatamente',
      workers: 3,
      timeout: 30
    },
    orders: {
      priority: 2,
      description: 'Processamento de pedidos',
      workers: 2,
      timeout: 60
    },
    emails: {
      priority: 3,
      description: 'Envio de emails',
      workers: 2,
      timeout: 30
    },
    notifications: {
      priority: 4,
      description: 'Notificações push e SMS',
      workers: 2,
      timeout: 30
    },
    analytics: {
      priority: 5,
      description: 'Processamento de analytics',
      workers: 1,
      timeout: 120
    },
    low_priority: {
      priority: 6,
      description: 'Jobs de baixa prioridade',
      workers: 1,
      timeout: 300
    }
  }.freeze
  
  def self.enqueue_job(worker_class, args, options = {})
    queue = options[:queue] || determine_queue(worker_class)
    priority = options[:priority] || QUEUES[queue.to_sym][:priority]
    
    # Configurar opções do job
    job_options = {
      queue: queue,
      retry: options[:retry] || 3,
      backtrace: options[:backtrace] || true
    }
    
    # Adicionar delay se especificado
    if options[:delay]
      job_options[:at] = Time.current + options[:delay]
    end
    
    # Enfileirar job
    worker_class.set(job_options).perform_async(*args)
    
    Rails.logger.info "📋 Job enqueued: #{worker_class} on queue: #{queue}"
  end
  
  def self.determine_queue(worker_class)
    case worker_class.to_s
    when 'OrderProcessingWorker'
      :orders
    when 'EmailWorker'
      :emails
    when 'NotificationWorker'
      :notifications
    when 'AnalyticsBatchWorker', 'KinesisAnalyticsWorker'
      :analytics
    else
      :low_priority
    end
  end
  
  def self.queue_stats
    stats = {}
    
    QUEUES.each do |queue_name, config|
      queue = Sidekiq::Queue.new(queue_name)
      
      stats[queue_name] = {
        size: queue.size,
        latency: queue.latency,
        workers: config[:workers],
        description: config[:description]
      }
    end
    
    stats
  end
  
  def self.clear_queue(queue_name)
    queue = Sidekiq::Queue.new(queue_name)
    queue.clear
    
    Rails.logger.info "🧹 Cleared queue: #{queue_name}"
  end
  
  def self.pause_queue(queue_name)
    # Pausar fila (implementação específica do Sidekiq Pro)
    Rails.logger.info "⏸️ Paused queue: #{queue_name}"
  end
  
  def self.resume_queue(queue_name)
    # Retomar fila (implementação específica do Sidekiq Pro)
    Rails.logger.info "▶️ Resumed queue: #{queue_name}"
  end
  
  def self.retry_failed_jobs(queue_name = nil)
    if queue_name
      queue = Sidekiq::Queue.new(queue_name)
      queue.retry_all
    else
      Sidekiq::RetrySet.new.retry_all
    end
    
    Rails.logger.info "🔄 Retrying failed jobs for queue: #{queue_name || 'all'}"
  end
  
  def self.schedule_analytics_batch
    # Agendar processamento em lote de analytics
    AnalyticsBatchWorker.perform_in(5.minutes)
    
    Rails.logger.info "📊 Scheduled analytics batch processing"
  end
  
  def self.schedule_email_campaign(campaign_id, delay = 0)
    # Agendar campanha de email
    EmailWorker.perform_in(delay, 'marketing', 'campaign', { campaign_id: campaign_id })
    
    Rails.logger.info "📧 Scheduled email campaign: #{campaign_id}"
  end
  
  def self.schedule_order_reminder(order_id, delay = 30.minutes)
    # Agendar lembrete de pedido
    OrderProcessingWorker.perform_in(delay, order_id)
    
    Rails.logger.info "⏰ Scheduled order reminder: #{order_id}"
  end
end
