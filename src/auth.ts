import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    role?: string;
    [key: string]: any;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      [key: string]: any;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      [key: string]: any;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${process.env.NEST_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) return null;
        const data = await res.json();

        // Return all user data from server
        return {
          id: data.user.id,
          email: data.user.email,
          ...data.user, // Spread all user data from server
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, profile, user }) {
      console.log("SignIn callback:", { account: account?.provider, profile: profile?.email, user: user?.email });

      // For OAuth providers, fetch user data from server
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const requestBody = {
            email: profile?.email,
            name: profile?.name || profile?.login,
            image: user?.image || profile?.picture || profile?.avatar_url,
          };

          console.log("Sending OAuth user data:", requestBody);

          // Check if user exists in our system or create/update
          const res = await fetch(`${process.env.NEST_API_URL}/auth/oauth-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error("OAuth user creation failed:", errorText);
            return false;
          }

          const userData = await res.json();
          console.log("OAuth user created/updated:", userData);

          // Store user data for JWT callback
          user.id = userData.id;
          user.role = userData.role;
          Object.assign(user, userData);
        } catch (error) {
          console.error("OAuth signin error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account, user, trigger, session }) {
      // If new sign in (credentials or OAuth)
      if (account && user) {
        token.user = {
          id: user.id as string,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          ...user,
        };
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          ...session,
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          name: token.user.name,
          email: token.user.email || session.user.email || "",
          image: token.user.image,
          role: token.user.role,
          ...Object.fromEntries(
            Object.entries(token.user).filter(([key]) =>
              !['id', 'name', 'email', 'image', 'role'].includes(key)
            )
          ),
        };
      }
      return session;
    },
  },
});
