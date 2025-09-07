module.exports = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/erp',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // OAuth Configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || ''
  },

  // Payment Configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ''
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    mode: process.env.PAYPAL_MODE || 'sandbox'
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },

  // WebSocket Configuration
  wsUrl: process.env.WS_URL || 'ws://localhost:3001',

  // File Upload Configuration
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || 5242880, // 5MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }
}

