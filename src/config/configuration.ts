import { Config } from 'src/common/util/types/base.type'

export default (): Config => ({
  server: {
    host: process.env.SERVER_HOST,
    port: parseInt(process.env.PORT, 10) || 8080,
  },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    url: process.env.DATABASE_URL,
  },
  otp: {
    length: parseInt(process.env.OTP_LENGTH, 10) || 6,
    expirationMinute: parseInt(process.env.OTP_EXPIRATION_MINUTE, 10) || 6,
  },
  jwt: {
    secret: process.env.JWT_SECRETE,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
    redirectUrl: process.env.GOOGLE_REDIRECT_URL,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    smsSender: process.env.TWILIO_SMS_SENDER,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    sender: process.env.EMAIL_SENDER,
    senderPassword: process.env.EMAIL_SENDER_PASSWORD,
  },
  superAdmin: {
    firstName: process.env.SUPER_ADMIN_FIRST_NAME,
    lastName: process.env.SUPER_ADMIN_LAST_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
  chapa: {
    secretKey: process.env.CHAPA_SECRET_KEY || '', // Added Chapa secret key
    baseUrl: process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1', // Default base URL for Chapa API
    initializePath:
      process.env.CHAPA_INITIALIZE_PATH || '/transaction/initialize', // Default initialize path
    verifyPath: process.env.CHAPA_VERIFY_PATH || '/transaction/verify/', // Default verify path
  },
})
