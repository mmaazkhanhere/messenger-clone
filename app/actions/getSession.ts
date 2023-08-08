/*this code imports the getServerSession function from the next-auth library, as well as the authOptions 
object from a specified path. It defines an asynchronous function named getSession that uses getServerSession 
to retrieve the user session stored on the server based on the provided authOptions. The function returns 
the retrieved session. This setup is likely used to retrieve user session information for authentication purposes. */

import { getServerSession } from 'next-auth';
import { authOptions } from "../api/auth/[...nextauth]/route";

// Define an asynchronous function named `getSession`
export default async function getSession() {
    // Call the `getServerSession` function with the provided `authOptions`
    // to retrieve the user session stored on the server
    return await getServerSession(authOptions);
}
