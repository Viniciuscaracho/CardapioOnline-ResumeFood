class AddIndexesForPerformance < ActiveRecord::Migration[7.1]
  def change
    # Índices para Orders
    add_index :orders, :created_at, order: { created_at: :desc } unless index_exists?(:orders, :created_at)
    add_index :orders, :status unless index_exists?(:orders, :status)
    add_index :orders, :customer_phone unless index_exists?(:orders, :customer_phone)
    add_index :orders, :customer_email unless index_exists?(:orders, :customer_email)
    add_index :orders, [:status, :created_at], order: { created_at: :desc } unless index_exists?(:orders, [:status, :created_at])
    
    # Índices para OrderItems
    add_index :order_items, :order_id unless index_exists?(:order_items, :order_id)
    add_index :order_items, :product_id unless index_exists?(:order_items, :product_id)
    add_index :order_items, [:order_id, :product_id] unless index_exists?(:order_items, [:order_id, :product_id])
    
    # Índices para Products
    add_index :products, :name unless index_exists?(:products, :name)
    add_index :products, :category unless index_exists?(:products, :category)
    if column_exists?(:products, :active)
      add_index :products, [:category, :active] unless index_exists?(:products, [:category, :active])
    end
    
    # Índices para Users (se existir)
    if table_exists?(:users)
      add_index :users, :email unless index_exists?(:users, :email)
      add_index :users, :username if column_exists?(:users, :username) && !index_exists?(:users, :username)
    end
  end
end
