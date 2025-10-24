class CreateAnalyticsEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :analytics_events do |t|
      t.string :event_type, null: false, index: true
      t.string :event_name, null: false, index: true
      t.integer :user_id, index: true
      t.string :session_id, null: false, index: true
      t.text :properties
      t.string :ip_address
      t.text :user_agent
      t.string :page_url
      t.string :referrer
      t.decimal :latitude, precision: 10, scale: 8
      t.decimal :longitude, precision: 11, scale: 8
      t.string :device_type
      t.string :browser
      t.string :os
      t.string :country
      t.string :city

      t.timestamps
    end

    add_index :analytics_events, [:event_type, :created_at]
    add_index :analytics_events, [:user_id, :created_at]
    add_index :analytics_events, [:session_id, :created_at]
  end
end
