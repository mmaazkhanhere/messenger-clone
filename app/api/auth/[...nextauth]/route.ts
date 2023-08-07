// Import required libraries and modules
import brcypt from "bcrypt"; // Import the 'bcrypt' library for password hashing
import NextAuth, { AuthOptions } from 'next-auth'; // Import 'NextAuth' and 'AuthOptions' from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"; // Import the 'CredentialsProvider' from 'next-auth/providers'
import GithubProvider from 'next-auth/providers/github'; // Import the 'GithubProvider' from 'next-auth/providers'
import GoogleProvider from 'next-auth/providers/google'; // Import the 'GoogleProvider' from 'next-auth/providers'
import { PrismaAdapter } from '@next-auth/prisma-adapter'; // Import 'PrismaAdapter' from '@next-auth/prisma-adapter'
import prisma from "../../../libs/prismadb"; // Import the Prisma instance from a file

// Configure authentication options for NextAuth
export const authOptions: AuthOptions = {
    // Use Prisma as the data adapter for NextAuth
    adapter: PrismaAdapter(prisma),
    providers: [
        // Configure GitHub authentication provider
        GithubProvider({
            clientId: process.env.GITHUB_ID as string, // Get GitHub client ID from environment variables
            clientSecret: process.env.GITHUB_SECRET as string, // Get GitHub client secret from environment variables
        }),
        // Configure Google authentication provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string, // Get Google client ID from environment variables
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string // Get Google client secret from environment variables
        }),
        // Configure custom credentials-based authentication provider
        CredentialsProvider({
            name: 'credentials', // Set the name for this authentication method
            credentials: {
                // Define the expected credentials (email and password)
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            // Define the authorization logic for credentials-based authentication
            async authorize(credentials) {
                if (!credentials?.email || credentials?.password) {
                    throw new Error("Invalid Credentials"); // Throw an error if credentials are missing
                }

                // Retrieve user data from the Prisma database based on email
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                // Check if the user exists and has a hashed password
                if (!user || !user?.hashedPassword) {
                    throw new Error("Invalid Credentials"); // Throw an error if user is not found or doesn't have a password
                }

                // Compare the provided password with the hashed password stored in the database
                const isCorrectPassword = await brcypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid Credentials"); // Throw an error if the password is incorrect
                }

                return user; // Return the authenticated user's data
            }
        })
    ],

    // Enable debugging in development mode
    debug: process.env.NODE_ENV === 'development',
    // Set session strategy to use JSON Web Tokens (JWT)
    session: {
        strategy: 'jwt'
    },
    // Set the secret key for signing JWT tokens
    secret: process.env.NEXTAUTH_SECRET
};

// Create the NextAuth authentication handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
