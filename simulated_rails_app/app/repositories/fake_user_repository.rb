class FakeUserRepository < FakeRepository
  def initialize
    super(:users)
  end

  def search(query)
    return all if query.blank?
    
    query = query.downcase
    records.select do |user|
      user[:name]&.downcase&.include?(query) || user[:email]&.downcase&.include?(query)
    end
  end
end
