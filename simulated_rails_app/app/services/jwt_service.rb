module JwtService
  # Normally you'd use Rails.application.secret_key_base
  SECRET_KEY = 'super_secret_fake_key'.freeze

  class << self
    def encode(payload, exp = 24.hours.from_now)
      payload[:exp] = exp.to_i
      JWT.encode(payload, SECRET_KEY)
    end

    def decode(token)
      decoded = JWT.decode(token, SECRET_KEY)[0]
      HashWithIndifferentAccess.new(decoded)
    rescue JWT::ExpiredSignature
      raise FakeDatabase::RecordInvalid, 'Token has expired'
    rescue JWT::DecodeError
      raise FakeDatabase::RecordInvalid, 'Invalid token'
    end
  end
end
