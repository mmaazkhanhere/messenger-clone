// Import required libraries and modules
import bcrypt from 'bcrypt'; // Import the 'bcrypt' library for password hashing
import prisma from "@/app/libs/prismadb"; // Import the Prisma instance from a file
import { NextResponse } from 'next/server'; // Import 'NextResponse' from 'next/server'

// Define an asynchronous function for handling POST requests
export async function POST(request: Request) {

    try {
        // Parse the JSON body of the incoming request
        const body = await request.json();
        const { email, name, password } = body;

        // Check if required fields (email, name, password) are present in the request
        if (!email || !name || !password) {
            // Return a response with a 400 status code and an error message
            return new NextResponse('Missing information', { status: 400 });
        }

        // Hash the provided password using bcrypt with a cost factor of 12
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user record in the Prisma database
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        });

        // Return a JSON response with the created user data
        return NextResponse.json(user);
    } catch (error) {
        // Log the error with a specific identifier for debugging
        console.log(error, 'REGISTRATION_ERROR');

        // Return a response with a 500 status code and an error message
        return new NextResponse('Internal Server Error', { status: 500 });
    }

}
