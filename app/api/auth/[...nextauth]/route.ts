import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },  // NextAuth sends 'username'
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Type guard to avoid TypeScript error
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        // Call FastAPI backend
        const res = await fetch("http://127.0.0.1:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: credentials.username, // Not email!
            password: credentials.password
          })
        });
        if (!res.ok) return null;
        const data = await res.json();
        // If login is valid, return a user object
        if (data.access_token) {
          return {
            id: credentials.username,
            name: credentials.username,
            email: credentials.username,
            accessToken: data.access_token
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.accessToken = user.accessToken;
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
