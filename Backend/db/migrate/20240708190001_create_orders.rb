class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.string :customer_name, null: false
      t.string :customer_phone, null: false
      t.string :customer_email, null: false
      t.string :address
      t.text :notes
      t.string :status, default: 'pending'
      t.decimal :total_amount, precision: 10, scale: 2
      t.timestamps
    end
  end
end 