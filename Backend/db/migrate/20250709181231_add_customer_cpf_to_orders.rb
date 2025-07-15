class AddCustomerCpfToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :customer_cpf, :string
  end
end
