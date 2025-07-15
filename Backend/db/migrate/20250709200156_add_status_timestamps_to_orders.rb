class AddStatusTimestampsToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :confirmed_at, :datetime
    add_column :orders, :ready_at, :datetime
    add_column :orders, :out_for_delivery_at, :datetime
  end
end
