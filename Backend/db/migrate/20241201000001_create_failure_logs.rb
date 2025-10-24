class CreateFailureLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :failure_logs do |t|
      t.string :service, null: false
      t.text :message_body, null: false
      t.text :error_message, null: false
      t.integer :order_id
      t.string :action
      t.datetime :occurred_at, null: false
      t.string :status, default: 'pending'
      t.text :recovery_attempts
      t.datetime :resolved_at
      t.text :resolution_notes

      t.timestamps
    end

    add_index :failure_logs, :service
    add_index :failure_logs, :order_id
    add_index :failure_logs, :status
    add_index :failure_logs, :occurred_at
  end
end
