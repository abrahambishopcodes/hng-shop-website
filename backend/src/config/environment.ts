import 'dotenv/config';

const requiredVariables = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'SESSION_SECRET', 'SUPABASE_DATABASE_CONNECTION_STRING', 'BREVO_API_KEY', 'EMAIL_FROM', 'EMAIL_FROM_NAME'] as const;
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
}

export const env = {
  port: Number(process.env.PORT || 3001),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
  sessionSecret: process.env.SESSION_SECRET,
  supabaseConnectionString: process.env.SUPABASE_DATABASE_CONNECTION_STRING,
  supabasePassword: process.env.SUPABASE_DATABASE_PASSWORD || '',
  brevoApiKey: process.env.BREVO_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  emailFromName: process.env.EMAIL_FROM_NAME,
  isProduction: process.env.NODE_ENV === 'production',
} as const;
