class CreateTools < ActiveRecord::Migration[8.1]
  def change
    create_table :tools do |t|
      t.string :name, null: false
      t.string :category
      t.string :brand
      t.string :model
      t.integer :quantity, null: false, default: 1
      t.string :location

      t.timestamps
    end
  end
end
