# Seed para Pizzaria - Pizzas, Bordas e Bebidas
# Executar com: rails runner db/seeds_pizzaria.rb

puts "🍕 Criando seed para pizzaria..."

# Limpar dados existentes
OrderItem.destroy_all
Order.destroy_all
Product.destroy_all

# Criar usuário administrador
admin_user = User.find_or_create_by(email: 'admin@cheiroverde.com') do |user|
  user.password = 'admin123'
  user.password_confirmation = 'admin123'
  user.admin = true
end

puts "✅ Usuário administrador criado: #{admin_user.email}"

# ===== PIZZAS =====
puts "\n🍕 Criando pizzas..."

pizzas = [
  # Pizzas Clássicas
  {
    name: 'Pizza Margherita',
    description: 'Molho de tomate, muçarela fresca, manjericão e azeite de oliva',
    price: 45.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Calabresa',
    description: 'Linguiça calabresa, cebola, muçarela e molho de tomate',
    price: 48.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Quatro Queijos',
    description: 'Muçarela, parmesão, provolone e gorgonzola',
    price: 52.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Portuguesa',
    description: 'Presunto, ovos, cebola, azeitonas, muçarela e molho de tomate',
    price: 50.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Frango com Catupiry',
    description: 'Frango desfiado, catupiry, milho, muçarela e molho de tomate',
    price: 54.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Bacon',
    description: 'Bacon crocante, muçarela, molho de tomate e orégano',
    price: 56.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Pepperoni',
    description: 'Pepperoni, muçarela, molho de tomate e orégano',
    price: 58.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Alho e Óleo',
    description: 'Alho tostado, óleo de oliva, muçarela e molho de tomate',
    price: 46.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Milho',
    description: 'Milho, muçarela, molho de tomate e orégano',
    price: 44.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Atum',
    description: 'Atum, cebola, muçarela e molho de tomate',
    price: 52.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Palmito',
    description: 'Palmito, muçarela, molho de tomate e orégano',
    price: 50.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Escarola',
    description: 'Escarola refogada, muçarela, molho de tomate e orégano',
    price: 48.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Broccoli',
    description: 'Broccoli, muçarela, molho de tomate e orégano',
    price: 46.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Rúcula',
    description: 'Rúcula fresca, muçarela, tomate seco e molho de tomate',
    price: 54.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Camarão',
    description: 'Camarão, muçarela, molho de tomate e orégano',
    price: 68.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Strogonoff',
    description: 'Strogonoff de frango, muçarela, batata palha e molho de tomate',
    price: 56.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Carne Seca',
    description: 'Carne seca desfiada, muçarela, molho de tomate e orégano',
    price: 62.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Costela',
    description: 'Costela desfiada, muçarela, molho de tomate e orégano',
    price: 58.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Calabresa e Frango',
    description: 'Calabresa e frango desfiado, muçarela, molho de tomate e orégano',
    price: 56.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Margherita e Calabresa',
    description: 'Margherita e calabresa, muçarela, molho de tomate e orégano',
    price: 54.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Quatro Queijos e Bacon',
    description: 'Quatro queijos e bacon, molho de tomate e orégano',
    price: 62.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Portuguesa e Frango',
    description: 'Portuguesa e frango desfiado, muçarela, molho de tomate e orégano',
    price: 58.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Pepperoni e Calabresa',
    description: 'Pepperoni e calabresa, muçarela, molho de tomate e orégano',
    price: 60.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Bacon e Frango',
    description: 'Bacon e frango desfiado, muçarela, molho de tomate e orégano',
    price: 58.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Atum e Cebola',
    description: 'Atum e cebola, muçarela, molho de tomate e orégano',
    price: 56.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Palmito e Milho',
    description: 'Palmito e milho, muçarela, molho de tomate e orégano',
    price: 52.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Escarola e Bacon',
    description: 'Escarola refogada e bacon, muçarela, molho de tomate e orégano',
    price: 56.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Broccoli e Frango',
    description: 'Broccoli e frango desfiado, muçarela, molho de tomate e orégano',
    price: 54.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Rúcula e Tomate Seco',
    description: 'Rúcula fresca e tomate seco, muçarela, molho de tomate e orégano',
    price: 58.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Camarão e Catupiry',
    description: 'Camarão e catupiry, muçarela, molho de tomate e orégano',
    price: 72.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Strogonoff e Bacon',
    description: 'Strogonoff de frango e bacon, muçarela, batata palha e molho de tomate',
    price: 64.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Carne Seca e Catupiry',
    description: 'Carne seca desfiada e catupiry, muçarela, molho de tomate e orégano',
    price: 68.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Costela e Cebola',
    description: 'Costela desfiada e cebola, muçarela, molho de tomate e orégano',
    price: 62.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Margherita, Calabresa e Frango',
    description: 'Margherita, calabresa e frango desfiado, muçarela, molho de tomate e orégano',
    price: 66.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Quatro Queijos, Bacon e Pepperoni',
    description: 'Quatro queijos, bacon e pepperoni, molho de tomate e orégano',
    price: 70.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Portuguesa, Frango e Catupiry',
    description: 'Portuguesa, frango desfiado e catupiry, muçarela, molho de tomate e orégano',
    price: 68.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Pepperoni, Calabresa e Bacon',
    description: 'Pepperoni, calabresa e bacon, muçarela, molho de tomate e orégano',
    price: 72.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Pizza Atum, Cebola e Palmito',
    description: 'Atum, cebola e palmito, muçarela, molho de tomate e orégano',
    price: 66.00,
    category: 'pizza',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  }
]

# Criar pizzas
pizzas.each do |pizza_data|
  product = Product.create!(
    name: pizza_data[:name],
    description: pizza_data[:description],
    price: pizza_data[:price],
    category: pizza_data[:category],
    available: pizza_data[:available],
    image_url: pizza_data[:image_url]
  )
  puts "✅ Pizza criada: #{product.name} - R$ #{product.price}"
end

puts "\n🍕 #{pizzas.length} pizzas criadas com sucesso!"

# ===== BORDAS =====
puts "\n🥖 Criando bordas..."

bordas = [
  {
    name: 'Borda Recheada Catupiry',
    description: 'Borda recheada com catupiry cremoso',
    price: 8.00,
    category: 'borda',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  },
  {
    name: 'Borda Recheada Cheddar',
    description: 'Borda recheada com queijo cheddar',
    price: 8.00,
    category: 'borda',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    name: 'Borda Recheada Calabresa',
    description: 'Borda recheada com calabresa',
    price: 10.00,
    category: 'borda',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
  },
  {
    name: 'Borda Recheada Bacon',
    description: 'Borda recheada com bacon',
    price: 12.00,
    category: 'borda',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
  },
  {
    name: 'Borda Recheada Frango',
    description: 'Borda recheada com frango desfiado',
    price: 10.00,
    category: 'borda',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
  },
  {
    name: 'Borda Recheada Quatro Queijos',
    description: 'Borda recheada com quatro queijos',
    price: 12.00,
    category: 'borda',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  }
]

# Criar bordas
bordas.each do |borda_data|
  product = Product.create!(
    name: borda_data[:name],
    description: borda_data[:description],
    price: borda_data[:price],
    category: borda_data[:category],
    available: borda_data[:available],
    image_url: borda_data[:image_url]
  )
  puts "✅ Borda criada: #{product.name} - R$ #{product.price}"
end

puts "\n🥖 #{bordas.length} bordas criadas com sucesso!"

# ===== BEBIDAS =====
puts "\n🥤 Criando bebidas..."

bebidas = [
  {
    name: 'Coca-Cola 350ml',
    description: 'Refrigerante Coca-Cola 350ml',
    price: 6.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Coca-Cola 600ml',
    description: 'Refrigerante Coca-Cola 600ml',
    price: 8.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Coca-Cola 1L',
    description: 'Refrigerante Coca-Cola 1L',
    price: 10.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pepsi 350ml',
    description: 'Refrigerante Pepsi 350ml',
    price: 5.50,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Pepsi 600ml',
    description: 'Refrigerante Pepsi 600ml',
    price: 7.50,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Fanta Laranja 350ml',
    description: 'Refrigerante Fanta Laranja 350ml',
    price: 5.50,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Fanta Uva 350ml',
    description: 'Refrigerante Fanta Uva 350ml',
    price: 5.50,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Sprite 350ml',
    description: 'Refrigerante Sprite 350ml',
    price: 5.50,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Guaraná Antarctica 350ml',
    description: 'Refrigerante Guaraná Antarctica 350ml',
    price: 5.50,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Guaraná Antarctica 600ml',
    description: 'Refrigerante Guaraná Antarctica 600ml',
    price: 7.50,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Suco Natural Laranja 300ml',
    description: 'Suco natural de laranja 300ml',
    price: 8.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'
  },
  {
    name: 'Suco Natural Limão 300ml',
    description: 'Suco natural de limão 300ml',
    price: 7.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'
  },
  {
    name: 'Suco Natural Maracujá 300ml',
    description: 'Suco natural de maracujá 300ml',
    price: 9.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop'
  },
  {
    name: 'Água com Gás 500ml',
    description: 'Água com gás 500ml',
    price: 4.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
  },
  {
    name: 'Água sem Gás 500ml',
    description: 'Água sem gás 500ml',
    price: 3.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
  },
  {
    name: 'Heineken 350ml',
    description: 'Cerveja Heineken 350ml',
    price: 8.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Brahma 350ml',
    description: 'Cerveja Brahma 350ml',
    price: 6.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Skol 350ml',
    description: 'Cerveja Skol 350ml',
    price: 6.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  },
  {
    name: 'Corona 350ml',
    description: 'Cerveja Corona 350ml',
    price: 10.00,
    category: 'bebidas',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop'
  }
]

# Criar bebidas
bebidas.each do |bebida_data|
  product = Product.create!(
    name: bebida_data[:name],
    description: bebida_data[:description],
    price: bebida_data[:price],
    category: bebida_data[:category],
    available: bebida_data[:available],
    image_url: bebida_data[:image_url]
  )
  puts "✅ Bebida criada: #{product.name} - R$ #{product.price}"
end

puts "\n🥤 #{bebidas.length} bebidas criadas com sucesso!"

# ===== RESUMO FINAL =====
puts "\n🎉 Seed da pizzaria concluído!"
puts "📊 Resumo:"
puts "   - #{Product.where(category: 'pizza').count} pizzas criadas"
puts "   - #{Product.where(category: 'borda').count} bordas criadas"
puts "   - #{Product.where(category: 'bebidas').count} bebidas criadas"
puts "   - #{Product.count} produtos no total"
puts "\n🔑 Credenciais do Admin:"
puts "   Email: admin@cheiroverde.com"
puts "   Senha: admin123"
puts "\n🍕 Para executar: rails runner db/seeds_pizzaria.rb" 