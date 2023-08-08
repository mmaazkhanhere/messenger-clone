/*this code imports the Prisma client instance and a session retrieval function, defines an 
asynchronous function to fetch the current user based on their session email, and handles
potential errors to avoid breaking the application. The function returns the retrieved user 
or null if no user is found or an error occurs. */

import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

// Define an asynchronous function named getCurrentUser
const getCurrentUser = async () => {
    try {
        // Call the getSession function to retrieve the user session
        const session = await getSession();

        // Check if a user session exists and if the user has an email
        if (!session?.user?.email) {
            return null; // Return null if there is no user session or email
        }

        // Use the Prisma client to find a unique user based on their email
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string, // Cast the email to a string
            },
        });

        // Check if a user was found based on the email
        if (!currentUser) {
            return null; // Return null if no user was found
        }

        // Return the retrieved currentUser object
        return currentUser;

    } catch (error: any) {
        return null; // Handle errors by returning null to prevent application breakage
    }
};

// Export the getCurrentUser function as the default export of the module
export default getCurrentUser;
