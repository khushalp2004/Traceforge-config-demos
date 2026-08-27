export default () => ({
  port: parseInt(process.env.PORT || '5173', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-default-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '60m',
  }
});
