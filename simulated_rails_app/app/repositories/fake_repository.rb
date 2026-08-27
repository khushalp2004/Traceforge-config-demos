class FakeRepository
  attr_reader :table_name

  def initialize(table_name)
    @table_name = table_name
  end

  def all
    records.dup
  end

  def find(id)
    record = records.find { |r| r[:id].to_s == id.to_s }
    raise FakeDatabase::RecordNotFound, "Couldn't find #{table_name.to_s.singularize.capitalize} with 'id'=#{id}" unless record
    record.dup
  end

  def find_by(attrs)
    record = records.find do |r|
      attrs.all? { |k, v| r[k] == v }
    end
    record&.dup
  end

  def create(attrs)
    FakeDatabase.instance.transaction do
      id = FakeDatabase.instance.next_id(table_name)
      record = attrs.to_h.merge(id: id, created_at: Time.current, updated_at: Time.current)
      records << record
      record.dup
    end
  end

  def update(id, attrs)
    FakeDatabase.instance.transaction do
      record = records.find { |r| r[:id].to_s == id.to_s }
      raise FakeDatabase::RecordNotFound unless record
      
      record.merge!(attrs.to_h)
      record[:updated_at] = Time.current
      record.dup
    end
  end

  def destroy(id)
    FakeDatabase.instance.transaction do
      record = records.find { |r| r[:id].to_s == id.to_s }
      raise FakeDatabase::RecordNotFound unless record
      
      records.delete(record)
      record.dup
    end
  end

  def paginate(page: 1, per_page: 10)
    page = [page.to_i, 1].max
    per_page = [per_page.to_i, 1].max
    
    start_index = (page - 1) * per_page
    records[start_index, per_page] || []
  end

  private

  def records
    FakeDatabase.instance.public_send(table_name)
  end
end
