import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${SERVER_URL}/auth/validate-credentials`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
              provider: user.provider || 'credentials',
            };
          }

          return null;
        } catch (error) {
          console.error("Credentials validation error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      // Handle OAuth providers (Google, GitHub)
      if (account?.provider && account.provider !== 'credentials') {
        try {
          // Check if user exists by provider
          const existingUserResponse = await fetch(
            `${SERVER_URL}/auth/user/provider/${account.provider}/${account.providerAccountId}`
          );

          if (existingUserResponse.ok) {
            // User exists, get their data
            const existingUser = await existingUserResponse.json();

            // Update user info in case it changed
            await fetch(`${SERVER_URL}/auth/create-user`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
                provider: account.provider,
                providerId: account.providerAccountId,
                role: existingUser.role,
              }),
            });

            // Set user data for session
            user.role = existingUser.role;
            user.provider = existingUser.provider;
            user.needsRoleSelection = false;

            return true;
          } else {
            // New OAuth user - needs role selection
            user.needsRoleSelection = true;
            user.provider = account.provider;
            user.providerId = account.providerAccountId;

            return true;
          }
        } catch (error) {
          console.error("Error handling OAuth sign in:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.provider = user.provider;
        token.needsRoleSelection = user.needsRoleSelection;
        token.providerId = user.providerId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
        session.user.needsRoleSelection = token.needsRoleSelection as boolean;
        session.user.providerId = token.providerId as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
