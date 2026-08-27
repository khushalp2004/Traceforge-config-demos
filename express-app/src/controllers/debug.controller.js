// Synchronous error: Simulates a normal thrown error or syntax error in sync code
export const syncCrash = (req, res) => {
  throw new Error('Manual sync crash');
};

// Async error: Simulates a rejected promise or throw inside an async function
// Note: In Express 5, async errors are automatically caught and passed to the next() middleware.
export const asyncCrash = async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 100)); // simulate async work
  throw new Error('Manual async crash');
};

// Undefined property access: A very common real-world error
export const undefinedProperty = (req, res) => {
  const obj = undefined;
  // This will throw "Cannot read properties of undefined"
  const value = obj.someProperty; 
  res.json({ value });
};

// JSON Parse error: Simulates trying to parse malformed JSON
export const jsonError = (req, res) => {
  const badJson = "{ malformed: 'json' }";
  JSON.parse(badJson); // Throws SyntaxError
  res.json({ success: true });
};

// Timeout: Simulates a request that hangs and never completes
export const timeoutError = (req, res) => {
  // We do not send a response here, causing the client request to hang
  console.log('Timeout request received, intentionally not responding...');
};

// Arbitrary Status Code: Useful for testing client-side error handling or interceptors
export const returnStatus = (req, res) => {
  const code = parseInt(req.params.code, 10);
  if (isNaN(code) || code < 100 || code > 599) {
    return res.status(400).json({ success: false, message: 'Invalid status code' });
  }
  res.status(code).json({
    success: code < 400,
    message: `Returned status ${code}`
  });
};
