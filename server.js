import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { initializeDatabase, saveGoogleUser } from './db.js';
import { sendWelcomeEmail } from './email.js';

const required = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'SESSION_SECRET',
  'SUPABASE_DATABASE_CONNECTION_STRING',
  'BREVO_API_KEY',
  'EMAIL_FROM',
  'EMAIL_FROM_NAME'
];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const port = Number(process.env.PORT || 3000);
const redirectUri = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${port}/auth/google/callback`;
const isProduction = process.env.NODE_ENV === 'production';
const oauthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
});
const app = express();
const states = new Map();
const root = path.dirname(fileURLToPath(import.meta.url));

app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(express.static(root, { index: 'index.html' }));

function setSession(res, user) {
  const payload = Buffer.from(JSON.stringify({ user, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString('base64url');
  const signature = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url');
  res.cookie('morrow_session', `${payload}.${signature}`, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/'
  });
}

function readSession(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return session.exp > Date.now() ? session.user : null;
  } catch {
    return null;
  }
}

app.get('/auth/google', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  states.set(state, Date.now() + 10 * 60 * 1000);
  const url = oauthClient.generateAuthUrl({
    access_type: 'online',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account'
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const expiresAt = states.get(state);
  states.delete(state);
  if (error) return res.redirect('/?auth=cancelled');
  if (!code || !expiresAt || expiresAt < Date.now()) return res.redirect('/?auth=failed');

  try {
    const { tokens } = await oauthClient.getToken(code);
    const ticket = await oauthClient.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email_verified) throw new Error('Google did not return a verified email address.');
    const user = await saveGoogleUser(profile);
    setSession(res, { id: user.google_id, name: user.full_name, email: user.email, picture: user.avatar_url });
    if (user.isNew) {
      sendWelcomeEmail({ email: user.email, name: user.full_name })
        .catch((error) => console.error('Welcome email failed:', error.message));
    }
    res.redirect('/?auth=success');
  } catch (error) {
    console.error('Google OAuth callback failed:', error.message);
    res.redirect('/?auth=failed');
  }
});

app.get('/api/me', (req, res) => {
  const user = readSession(req.cookies.morrow_session);
  res.json({ user });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('morrow_session', { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/' });
  res.status(204).end();
});

await initializeDatabase();
app.listen(port, () => console.log(`Morrow Goods is running at http://localhost:${port}`));
