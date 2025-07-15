# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

# Criar usuário administrador
admin_user = User.find_or_create_by(email: 'admin@cheiroverde.com') do |user|
  user.password = 'admin123'
  user.password_confirmation = 'admin123'
  user.admin = true
end

puts "Usuário administrador criado: #{admin_user.email} (senha: admin123)"

# Criar alguns produtos de exemplo
products = [
  {
    name: 'X-Burger',
    description: 'Hambúrguer artesanal com queijo, alface, tomate e molho especial',
    price: 25.90,
    category: 'Hambúrgueres',
    available: true
  },
  {
    name: 'X-Bacon',
    description: 'Hambúrguer com bacon crocante, queijo, alface e tomate',
    price: 29.90,
    category: 'Hambúrgueres',
    available: true
  },
  {
    name: 'Batata Frita',
    description: 'Porção de batatas fritas crocantes',
    price: 12.90,
    category: 'Acompanhamentos',
    available: true
  },
  {
    name: 'Refrigerante',
    description: 'Refrigerante 350ml (Coca-Cola, Pepsi, Sprite)',
    price: 6.90,
    category: 'Bebidas',
    available: true
  }
]

products.each do |product_data|
  product = Product.find_or_create_by(name: product_data[:name]) do |p|
    p.description = product_data[:description]
    p.price = product_data[:price]
    p.category = product_data[:category]
    p.available = product_data[:available]
  end
  puts "Produto criado: #{product.name}"
end

# Criar alguns pedidos de exemplo
orders = [
  {
    customer_name: 'João Silva',
    customer_phone: '(11) 99999-9999',
    customer_email: 'joao@email.com',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    notes: 'Sem cebola, por favor',
    status: 'delivered',
    total_amount: 89.90,
    created_at: 2.days.ago
  },
  {
    customer_name: 'Maria Santos',
    customer_phone: '(11) 88888-8888',
    customer_email: 'maria@email.com',
    address: 'Av. Paulista, 456 - São Paulo, SP',
    notes: 'Entregar no portão',
    status: 'preparing',
    total_amount: 156.70,
    created_at: 1.day.ago
  },
  {
    customer_name: 'Pedro Costa',
    customer_phone: '(11) 77777-7777',
    customer_email: 'pedro@email.com',
    address: 'Rua Augusta, 789 - São Paulo, SP',
    notes: '',
    status: 'pending',
    total_amount: 234.50,
    created_at: 3.hours.ago
  },
  {
    customer_name: 'Ana Oliveira',
    customer_phone: '(11) 66666-6666',
    customer_email: 'ana@email.com',
    address: 'Rua Oscar Freire, 321 - São Paulo, SP',
    notes: 'Pedido para viagem',
    status: 'confirmed',
    total_amount: 67.80,
    created_at: 5.hours.ago
  },
  {
    customer_name: 'Carlos Ferreira',
    customer_phone: '(11) 55555-5555',
    customer_email: 'carlos@email.com',
    address: 'Rua Haddock Lobo, 654 - São Paulo, SP',
    notes: 'Adicionar mais molho',
    status: 'ready',
    total_amount: 123.40,
    created_at: 1.hour.ago
  }
]

orders.each do |order_data|
  order = Order.find_or_create_by(
    customer_name: order_data[:customer_name],
    customer_email: order_data[:customer_email],
    created_at: order_data[:created_at]
  ) do |o|
    o.customer_phone = order_data[:customer_phone]
    o.address = order_data[:address]
    o.notes = order_data[:notes]
    o.status = order_data[:status]
    o.total_amount = order_data[:total_amount]
  end
  puts "Pedido criado: #{order.customer_name} - R$ #{order.total_amount}"
end

puts "Seed concluído! Dados de exemplo criados com sucesso."
