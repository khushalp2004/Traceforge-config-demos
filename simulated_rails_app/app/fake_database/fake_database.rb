class FakeDatabase
  include Singleton

  attr_reader :users, :posts, :comments

  def initialize
    @users = []
    @posts = []
    @comments = []
    @mutex = Mutex.new
    @sequences = Hash.new(0)
  end

  def transaction(&block)
    @mutex.synchronize(&block)
  end

  def reset!
    @mutex.synchronize do
      @users.clear
      @posts.clear
      @comments.clear
      @sequences.clear
    end
  end

  def next_id(table)
    @mutex.synchronize do
      @sequences[table] += 1
      @sequences[table]
    end
  end
end

class FakeDatabase::RecordNotFound < StandardError; end
class FakeDatabase::RecordInvalid < StandardError; end
