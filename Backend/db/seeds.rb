# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Criar usuário administrador
admin_user = User.find_or_create_by(email: 'admin@cheiroverde.com') do |user|
  user.password = 'admin123'
  user.password_confirmation = 'admin123'
  user.admin = true
end

puts "Usuário administrador criado: #{admin_user.email} (senha: admin123)"

# Limpar dados existentes (ordem correta para evitar violação de chave estrangeira)
OrderItem.destroy_all
Order.destroy_all
Product.destroy_all

# Criar produtos com imagens
products = [
  {
    name: 'X-Burger Clássico',
    description: 'Hambúrguer artesanal 180g com queijo cheddar, alface, tomate, cebola caramelizada e molho especial da casa',
    price: 28.90,
    category: 'Hambúrgueres',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58e2?w=400&h=300&fit=crop'
  },
  {
    name: 'X-Bacon Premium',
    description: 'Hambúrguer com bacon crocante, queijo gouda, alface, tomate e molho barbecue',
    price: 32.90,
    category: 'Hambúrgueres',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop'
  },
  {
    name: 'X-Frango Grelhado',
    description: 'Filé de frango grelhado com queijo, alface, tomate e molho de ervas',
    price: 26.90,
    category: 'Hambúrgueres',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop'
  },
  {
    name: 'X-Vegano',
    description: 'Hambúrguer de grão-de-bico com queijo vegano, alface, tomate e molho de tahine',
    price: 24.90,
    category: 'Hambúrgueres',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
  },
  {
    name: 'Batata Frita Crocante',
    description: 'Porção de batatas fritas crocantes com sal e ervas finas',
    price: 15.90,
    category: 'Acompanhamentos',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop'
  },
  {
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados e fritos, servidos com molho ranch',
    price: 18.90,
    category: 'Acompanhamentos',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=300&fit=crop'
  },
  {
    name: 'Nuggets de Frango',
    description: '6 unidades de nuggets de frango empanados, servidos com molho de mel e mostarda',
    price: 16.90,
    category: 'Acompanhamentos',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1567620832904-9fe252f7d8c0?w=400&h=300&fit=crop'
  },
  {
    name: 'Coca-Cola',
    description: 'Refrigerante Coca-Cola 350ml',
    price: 7.90,
    category: 'Bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Suco Natural Laranja',
    description: 'Suco natural de laranja 300ml',
    price: 8.90,
    category: 'Bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'
  },
  {
    name: 'Água com Gás',
    description: 'Água com gás 500ml',
    price: 5.90,
    category: 'Bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
  },
  {
    name: 'Milk Shake Chocolate',
    description: 'Milk shake de chocolate com chantilly e granulado',
    price: 12.90,
    category: 'Sobremesas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop'
  },
  {
    name: 'Milk Shake Morango',
    description: 'Milk shake de morango com chantilly e morangos frescos',
    price: 12.90,
    category: 'Sobremesas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    name: 'Brownie',
    description: 'Brownie caseiro com chocolate meio amargo e nozes',
    price: 9.90,
    category: 'Sobremesas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1606313564200-be415a5601c5?w=400&h=300&fit=crop'
  }
]

puts "Criando produtos..."

products.each do |product_data|
  product = Product.create!(
    name: product_data[:name],
    description: product_data[:description],
    price: product_data[:price],
    category: product_data[:category],
    available: product_data[:available],
    image_url: product_data[:image_url]
  )
  puts "✅ Produto criado: #{product.name} - R$ #{product.price}"
end

# Criar pedidos com itens
puts "\nCriando pedidos..."

orders_data = [
  {
    customer_name: 'João Silva',
    customer_phone: '(11) 99999-9999',
    customer_email: 'joao.silva@email.com',
    address: 'Rua das Flores, 123 - Vila Madalena, São Paulo, SP',
    notes: 'Sem cebola, por favor. Entregar no portão.',
    status: 'completed',
    total_amount: 89.70,
    created_at: 2.days.ago,
    items: [
      { product_name: 'X-Burger Clássico', quantity: 2 },
      { product_name: 'Batata Frita Crocante', quantity: 1 },
      { product_name: 'Coca-Cola', quantity: 2 }
    ]
  },
  {
    customer_name: 'Maria Santos',
    customer_phone: '(11) 88888-8888',
    customer_email: 'maria.santos@email.com',
    address: 'Av. Paulista, 456 - Bela Vista, São Paulo, SP',
    notes: 'Pedido para viagem. Adicionar mais molho.',
    status: 'ready',
    total_amount: 156.70,
    created_at: 1.day.ago,
    items: [
      { product_name: 'X-Bacon Premium', quantity: 3 },
      { product_name: 'Onion Rings', quantity: 2 },
      { product_name: 'Milk Shake Chocolate', quantity: 1 }
    ]
  },
  {
    customer_name: 'Pedro Costa',
    customer_phone: '(11) 77777-7777',
    customer_email: 'pedro.costa@email.com',
    address: 'Rua Augusta, 789 - Consolação, São Paulo, SP',
    notes: 'Entregar no condomínio, apto 45.',
    status: 'pending',
    total_amount: 234.50,
    created_at: 3.hours.ago,
    items: [
      { product_name: 'X-Frango Grelhado', quantity: 2 },
      { product_name: 'X-Vegano', quantity: 1 },
      { product_name: 'Nuggets de Frango', quantity: 2 },
      { product_name: 'Suco Natural Laranja', quantity: 3 },
      { product_name: 'Brownie', quantity: 2 }
    ]
  },
  {
    customer_name: 'Ana Oliveira',
    customer_phone: '(11) 66666-6666',
    customer_email: 'ana.oliveira@email.com',
    address: 'Rua Oscar Freire, 321 - Jardins, São Paulo, SP',
    notes: 'Pedido para viagem. Sem sal no hambúrguer.',
    status: 'confirmed',
    total_amount: 67.80,
    created_at: 5.hours.ago,
    items: [
      { product_name: 'X-Burger Clássico', quantity: 1 },
      { product_name: 'Batata Frita Crocante', quantity: 1 },
      { product_name: 'Água com Gás', quantity: 1 },
      { product_name: 'Milk Shake Morango', quantity: 1 }
    ]
  },
  {
    customer_name: 'Carlos Ferreira',
    customer_phone: '(11) 55555-5555',
    customer_email: 'carlos.ferreira@email.com',
    address: 'Rua Haddock Lobo, 654 - Cerqueira César, São Paulo, SP',
    notes: 'Adicionar mais bacon. Entregar no portão principal.',
    status: 'ready',
    total_amount: 123.40,
    created_at: 1.hour.ago,
    items: [
      { product_name: 'X-Bacon Premium', quantity: 2 },
      { product_name: 'Onion Rings', quantity: 1 },
      { product_name: 'Coca-Cola', quantity: 2 },
      { product_name: 'Brownie', quantity: 1 }
    ]
  },
  {
    customer_name: 'Fernanda Lima',
    customer_phone: '(11) 44444-4444',
    customer_email: 'fernanda.lima@email.com',
    address: 'Rua Teodoro Sampaio, 987 - Pinheiros, São Paulo, SP',
    notes: 'Pedido vegetariano. Sem queijo no hambúrguer.',
    status: 'out_for_delivery',
    total_amount: 98.60,
    created_at: 30.minutes.ago,
    items: [
      { product_name: 'X-Vegano', quantity: 2 },
      { product_name: 'Batata Frita Crocante', quantity: 1 },
      { product_name: 'Suco Natural Laranja', quantity: 2 },
      { product_name: 'Milk Shake Chocolate', quantity: 1 }
    ]
  },
  {
    customer_name: 'Roberto Almeida',
    customer_phone: '(11) 33333-3333',
    customer_email: 'roberto.almeida@email.com',
    address: 'Rua Cardeal Arcoverde, 456 - Pinheiros, São Paulo, SP',
    notes: 'Entregar no condomínio, bloco B, apto 12.',
    status: 'pending',
    total_amount: 145.30,
    created_at: 15.minutes.ago,
    items: [
      { product_name: 'X-Frango Grelhado', quantity: 1 },
      { product_name: 'X-Burger Clássico', quantity: 1 },
      { product_name: 'Nuggets de Frango', quantity: 1 },
      { product_name: 'Coca-Cola', quantity: 2 },
      { product_name: 'Milk Shake Morango', quantity: 1 }
    ]
  }
]

orders_data.each do |order_data|
  order = Order.create!(
    customer_name: order_data[:customer_name],
    customer_phone: order_data[:customer_phone],
    customer_email: order_data[:customer_email],
    address: order_data[:address],
    notes: order_data[:notes],
    status: order_data[:status],
    total_amount: order_data[:total_amount],
    created_at: order_data[:created_at]
  )

  # Adicionar timestamps baseados no status
  case order.status
  when 'confirmed'
    order.update!(confirmed_at: order.created_at + 5.minutes)
  when 'preparing'
    order.update!(confirmed_at: order.created_at + 5.minutes, ready_at: order.created_at + 15.minutes)
  when 'ready'
    order.update!(confirmed_at: order.created_at + 5.minutes, ready_at: order.created_at + 20.minutes)
  when 'out_for_delivery'
    order.update!(confirmed_at: order.created_at + 5.minutes, ready_at: order.created_at + 20.minutes, out_for_delivery_at: order.created_at + 25.minutes)
  when 'delivered'
    order.update!(confirmed_at: order.created_at + 5.minutes, ready_at: order.created_at + 20.minutes, out_for_delivery_at: order.created_at + 25.minutes, completed_at: order.created_at + 35.minutes)
  end

  # Criar itens do pedido
  order_data[:items].each do |item_data|
    product = Product.find_by(name: item_data[:product_name])
    if product
      OrderItem.create!(
        order: order,
        product: product,
        quantity: item_data[:quantity],
        unit_price: product.price
      )
    end
  end

  puts "✅ Pedido criado: #{order.customer_name} - R$ #{order.total_amount} (#{order.status})"
end

puts "\n🎉 Seed concluído! Sistema populado com sucesso."
puts "📊 Resumo:"
puts "   - #{Product.count} produtos criados"
puts "   - #{Order.count} pedidos criados"
puts "   - #{OrderItem.count} itens de pedido criados"
puts "\n🔑 Credenciais do Admin:"
puts "   Email: admin@cheiroverde.com"
puts "   Senha: admin123"
