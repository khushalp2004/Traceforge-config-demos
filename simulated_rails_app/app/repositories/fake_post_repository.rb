class FakePostRepository < FakeRepository
  def initialize
    super(:posts)
  end

  def find_by_user_id(user_id)
    records.select { |post| post[:user_id].to_s == user_id.to_s }
  end
end
