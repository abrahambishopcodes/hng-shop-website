import passport from 'passport';
import { Strategy as GoogleStrategy, type Profile } from 'passport-google-oauth20';
import { SocialProvider } from '../generated/prisma/client.js';
import { env } from './environment.js';
import { prisma } from '../lib/db.js';

export interface AuthenticatedGoogleUser {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isNew: boolean;
}

const callbackURL =
  env.googleRedirectUri || `http://localhost:${env.port}/api/v1/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId!,
      clientSecret: env.googleClientSecret!,
      callbackURL,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value.toLowerCase();
        const googleProfile = profile._json as
          { email_verified?: boolean; verified_email?: boolean } | undefined;
        const emailIsVerified = googleProfile?.email_verified ?? googleProfile?.verified_email;

        if (!profile.id || !email || emailIsVerified === false) {
          return done(null, false);
        }

        const authenticatedUser = await prisma.$transaction(async (transaction) => {
          const connectedSocial = await transaction.connectedSocial.findUnique({
            where: {
              providerId_providerName: {
                providerId: profile.id,
                providerName: SocialProvider.Google,
              },
            },
            include: { user: true },
          });

          if (connectedSocial) {
            // An identity is permanently bound to its user's email. A changed provider
            // email must be resolved by account support rather than silently linked.
            if (
              !connectedSocial.user.isActive ||
              connectedSocial.user.email.toLowerCase() !== email
            ) {
              return null;
            }

            return { ...connectedSocial.user, isNew: false };
          }

          const existingUser = await transaction.user.findUnique({ where: { email } });
          if (existingUser && !existingUser.isActive) {
            return null;
          }

          const user =
            existingUser ??
            (await transaction.user.create({
              data: {
                email,
                fullName: profile.displayName || email,
                avatarUrl: profile.photos?.[0]?.value || null,
              },
            }));

          await transaction.connectedSocial.create({
            data: {
              providerId: profile.id,
              providerName: SocialProvider.Google,
              userId: user.id,
            },
          });

          return { ...user, isNew: !existingUser };
        });

        return done(null, authenticatedUser ?? false);
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

export { passport };
