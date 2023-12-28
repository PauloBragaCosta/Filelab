import type { NextAuthOptions } from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from 'next-auth'



export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "your-cool-Username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "your-awesome-password"
                }
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
    ],


    pages: {
        signIn: '/signin',
        
    }
    // //     signOut: '/auth/signout',
    // //     error: '/auth/error', // Error code passed in query string as ?error=
    // //     verifyRequest: '/auth/verify-request', // (used for check email message)
    // //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
}





export default NextAuth(authOptions);