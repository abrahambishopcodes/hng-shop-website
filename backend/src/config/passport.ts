import passport from 'passport';
import { Strategy as GoogleStrategy, type Profile } from 'passport-google-oauth20';
import { env } from './environment.js';
import { prisma } from '../lib/db.js';

export interface AuthenticatedGoogleUser {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isNew: boolean;
}

const callbackURL = env.googleRedirectUri || `http://localhost:${env.port}/auth/google/callback`;

passport.use(new GoogleStrategy(
  {
    clientID: env.googleClientId!,
    clientSecret: env.googleClientSecret!,
    callbackURL,
  },
  async (_accessToken, _refreshToken, profile: Profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const googleProfile = profile._json as { email_verified?: boolean; verified_email?: boolean } | undefined;
      const emailIsVerified = googleProfile?.email_verified ?? googleProfile?.verified_email;

      if (!profile.id || !email || emailIsVerified === false) {
        return done(null, false);
      }

      const existingUser = await prisma.user.findUnique({
        where: { googleId: profile.id },
        select: { googleId: true },
      });

      const user = await prisma.user.upsert({
        where: { googleId: profile.id },
        create: {
          googleId: profile.id,
          email,
          fullName: profile.displayName || email,
          avatarUrl: profile.photos?.[0]?.value || null,
        },
        update: {
          email,
          fullName: profile.displayName || email,
          avatarUrl: profile.photos?.[0]?.value || null,
          lastSignInAt: new Date(),
        },
      });

      return done(null, { ...user, isNew: !existingUser } satisfies AuthenticatedGoogleUser);
    } catch (error) {
      return done(error as Error);
    }
  },
));

export { passport };
