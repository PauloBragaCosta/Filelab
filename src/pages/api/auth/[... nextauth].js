import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  providers: [
    process.env.VERCEL_ENV === "preview"
      ? CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: {
              label: "Username",
              type: "text",
              placeholder: "jsmith",
            },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            // This is where you need to retrieve user data 
            // to verify with credentials
            // Docs: https://next-auth.js.org/configuration/providers/credentials
            const user = { id: "42", email: "Paulo", password: "12345" }

            if (credentials?.username === user.email && credentials?.password === user.password) {
                return user
            } else {
                return null
            }
        },
    })
      : GoogleProvider({
          clientId: process.env.GOOGLE_ID,
          clientSecret: process.env.GOOGLE_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
  ],
})