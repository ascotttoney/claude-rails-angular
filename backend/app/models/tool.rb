class Tool < ApplicationRecord
  CATEGORIES = %w[Hand Power Clamps Measuring Sharpening Safety Fastening Finishing Other].freeze

  validates :name, presence: true
  validates :quantity, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:category, :name) }
end
