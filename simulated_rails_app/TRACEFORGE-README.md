# TraceForge SDK for Ruby on Rails

I have automatically configured your `.env` file with your TraceForge API Key!

## Installation

Because we built this as a Zero-Touch SDK using Rails Railties, there is ZERO manual configuration required in your application code! 

1. Install the SDK:
   ```bash
   bundle add traceforge
   # Or manually: gem install traceforge
   ```

2. Start your Rails server!
   ```bash
   rails server
   ```

The TraceForge SDK will automatically discover itself, inject our Rack middleware, and start capturing all unhandled exceptions instantly!

### Testing it out
Throw an exception anywhere in your Rails controllers:
```ruby
def index
  raise "This is a zero-touch Rails exception!"
end
```
Check your TraceForge Dashboard and you will see the exception appear instantly!
