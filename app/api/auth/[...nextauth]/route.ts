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
      // credentials type explicitly allows for undefined, so we type it
      async authorize(credentials) {
        // Defensive: ensure we never return id as undefined
        const username = credentials?.username ?? "";
        const password = credentials?.password ?? "";
        if (!username || !password) return null;

        const res = await fetch("http://127.0.0.1:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username,
            password
          })
        });

        if (!res.ok) return null;
        const data = await res.json();

        // If login is valid, return a user object with required string properties
        if (data.access_token) {
          return {
            id: username,           // id MUST be a string
            name: username,         // name MUST be a string
            email: username,        // email MUST be a string
            accessToken: data.access_token as string // mark as string for type
          } as any; // Type assertion to avoid TypeScript adapter/NextAuth type confusion
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
      // Only set accessToken if user is defined
      if (user && "accessToken" in user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose accessToken on client session
      (session as any).accessToken = token.accessToken;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
