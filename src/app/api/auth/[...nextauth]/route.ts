import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  debug: true, // فعال کردن دیباگ برای بررسی بهتر
  callbacks: {
    async redirect({ url, baseUrl }) {
      // اگه url با baseUrl شروع می‌شه، همون url رو برگردون
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // استفاده از متغیر محیطی برای ریدایرکت
      return `${process.env.NEXTAUTH_URL}/chat`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };