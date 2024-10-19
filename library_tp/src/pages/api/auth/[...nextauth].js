import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { supabase } from "../../../lib/supabaseClient";

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", credentials.username)
          .single();

        if (error || !data) {
          throw new Error("Invalid credentials");
        }

        if (data.password !== credentials.password) {
          throw new Error("Invalid credentials");
        }

        return { id: data.id, username: data.username, role: data.role };
      },
    }),
  ],
  session: { jwt: true },
  callbacks: {
    async jwt(token, user) {
      if (user) token.id = user.id;
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      return session;
    },
  },
});
