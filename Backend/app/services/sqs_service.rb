class SqsService
  include Sidekiq::Worker
  
  # Configuração das filas SQS
  QUEUES = {
    orders: {
      name: 'cheiro-verde-orders',
      dlq_name: 'cheiro-verde-orders-dlq',
      visibility_timeout: 300, # 5 minutos
      message_retention_period: 1209600, # 14 dias
      max_receive_count: 3
    },
    emails: {
      name: 'cheiro-verde-emails',
      dlq_name: 'cheiro-verde-emails-dlq',
      visibility_timeout: 60, # 1 minuto
      message_retention_period: 1209600, # 14 dias
      max_receive_count: 5
    },
    notifications: {
      name: 'cheiro-verde-notifications',
      dlq_name: 'cheiro-verde-notifications-dlq',
      visibility_timeout: 60, # 1 minuto
      message_retention_period: 1209600, # 14 dias
      max_receive_count: 5
    },
    analytics: {
      name: 'cheiro-verde-analytics',
      dlq_name: 'cheiro-verde-analytics-dlq',
      visibility_timeout: 300, # 5 minutos
      message_retention_period: 1209600, # 14 dias
      max_receive_count: 3
    }
  }.freeze
  
  def self.send_message(queue_name, message_body, options = {})
    queue_config = QUEUES[queue_name.to_sym]
    raise "Unknown queue: #{queue_name}" unless queue_config
    
    sqs_client = create_sqs_client
    
    begin
      response = sqs_client.send_message(
        queue_url: get_queue_url(queue_name),
        message_body: message_body.to_json,
        message_attributes: build_message_attributes(options),
        delay_seconds: options[:delay_seconds] || 0
      )
      
      Rails.logger.info "📤 Message sent to SQS queue #{queue_name}: #{response.message_id}"
      response
      
    rescue Aws::SQS::Errors::ServiceError => e
      Rails.logger.error "❌ Error sending message to SQS: #{e.message}"
      raise e
    end
  end
  
  def self.receive_messages(queue_name, max_messages = 10)
    sqs_client = create_sqs_client
    
    begin
      response = sqs_client.receive_message(
        queue_url: get_queue_url(queue_name),
        max_number_of_messages: max_messages,
        wait_time_seconds: 20, # Long polling
        message_attribute_names: ['All']
      )
      
      Rails.logger.info "📥 Received #{response.messages.count} messages from #{queue_name}"
      response.messages
      
    rescue Aws::SQS::Errors::ServiceError => e
      Rails.logger.error "❌ Error receiving messages from SQS: #{e.message}"
      raise e
    end
  end
  
  def self.delete_message(queue_name, receipt_handle)
    sqs_client = create_sqs_client
    
    begin
      sqs_client.delete_message(
        queue_url: get_queue_url(queue_name),
        receipt_handle: receipt_handle
      )
      
      Rails.logger.info "🗑️ Message deleted from SQS queue #{queue_name}"
      
    rescue Aws::SQS::Errors::ServiceError => e
      Rails.logger.error "❌ Error deleting message from SQS: #{e.message}"
      raise e
    end
  end
  
  def self.get_queue_attributes(queue_name)
    sqs_client = create_sqs_client
    
    begin
      response = sqs_client.get_queue_attributes(
        queue_url: get_queue_url(queue_name),
        attribute_names: ['All']
      )
      
      response.attributes
      
    rescue Aws::SQS::Errors::ServiceError => e
      Rails.logger.error "❌ Error getting queue attributes: #{e.message}"
      raise e
    end
  end
  
  def self.create_queues
    sqs_client = create_sqs_client
    
    QUEUES.each do |queue_name, config|
      create_queue_with_dlq(sqs_client, queue_name, config)
    end
    
    Rails.logger.info "✅ All SQS queues created successfully"
  end
  
  def self.delete_queues
    sqs_client = create_sqs_client
    
    QUEUES.each do |queue_name, config|
      delete_queue(sqs_client, config[:name])
      delete_queue(sqs_client, config[:dlq_name])
    end
    
    Rails.logger.info "🗑️ All SQS queues deleted successfully"
  end
  
  def self.get_queue_stats(queue_name)
    attributes = get_queue_attributes(queue_name)
    
    {
      name: queue_name,
      approximate_number_of_messages: attributes['ApproximateNumberOfMessages'].to_i,
      approximate_number_of_messages_not_visible: attributes['ApproximateNumberOfMessagesNotVisible'].to_i,
      approximate_number_of_messages_delayed: attributes['ApproximateNumberOfMessagesDelayed'].to_i,
      created_timestamp: Time.at(attributes['CreatedTimestamp'].to_i),
      last_modified_timestamp: Time.at(attributes['LastModifiedTimestamp'].to_i),
      visibility_timeout: attributes['VisibilityTimeoutSeconds'].to_i,
      message_retention_period: attributes['MessageRetentionPeriod'].to_i
    }
  end
  
  private
  
  def self.create_sqs_client
    Aws::SQS::Client.new(
      region: ENV['AWS_REGION'] || 'us-east-1',
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
  end
  
  def self.get_queue_url(queue_name)
    queue_config = QUEUES[queue_name.to_sym]
    raise "Unknown queue: #{queue_name}" unless queue_config
    
    "https://sqs.#{ENV['AWS_REGION'] || 'us-east-1'}.amazonaws.com/#{ENV['AWS_ACCOUNT_ID']}/#{queue_config[:name]}"
  end
  
  def self.build_message_attributes(options)
    attributes = {}
    
    if options[:priority]
      attributes['Priority'] = {
        string_value: options[:priority].to_s,
        data_type: 'String'
      }
    end
    
    if options[:source]
      attributes['Source'] = {
        string_value: options[:source],
        data_type: 'String'
      }
    end
    
    if options[:retry_count]
      attributes['RetryCount'] = {
        string_value: options[:retry_count].to_s,
        data_type: 'Number'
      }
    end
    
    attributes
  end
  
  def self.create_queue_with_dlq(sqs_client, queue_name, config)
    # Criar DLQ primeiro
    dlq_url = create_queue(sqs_client, config[:dlq_name], {
      message_retention_period: config[:message_retention_period]
    })
    
    # Criar fila principal com DLQ
    queue_url = create_queue(sqs_client, config[:name], {
      visibility_timeout: config[:visibility_timeout],
      message_retention_period: config[:message_retention_period],
      redrive_policy: {
        dead_letter_target_arn: dlq_url,
        max_receive_count: config[:max_receive_count]
      }.to_json
    })
    
    Rails.logger.info "✅ Created queue #{queue_name} with DLQ"
    queue_url
  end
  
  def self.create_queue(sqs_client, queue_name, attributes = {})
    begin
      response = sqs_client.create_queue(
        queue_name: queue_name,
        attributes: attributes
      )
      
      Rails.logger.info "✅ Created SQS queue: #{queue_name}"
      response.queue_url
      
    rescue Aws::SQS::Errors::QueueAlreadyExists
      Rails.logger.info "ℹ️ Queue #{queue_name} already exists"
      get_queue_url_by_name(queue_name)
    end
  end
  
  def self.delete_queue(sqs_client, queue_name)
    begin
      queue_url = get_queue_url_by_name(queue_name)
      sqs_client.delete_queue(queue_url: queue_url)
      
      Rails.logger.info "🗑️ Deleted SQS queue: #{queue_name}"
      
    rescue Aws::SQS::Errors::NonExistentQueue
      Rails.logger.info "ℹ️ Queue #{queue_name} does not exist"
    end
  end
  
  def self.get_queue_url_by_name(queue_name)
    sqs_client = create_sqs_client
    
    response = sqs_client.get_queue_url(queue_name: queue_name)
    response.queue_url
  end
end
