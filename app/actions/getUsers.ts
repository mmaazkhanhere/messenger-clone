/* this code provides a utility function to fetch a list of users from a database using Prisma ORM */

import prisma from "@/app/libs/prismadb"
import getSession from "./getSession"

const getUsers = async () => {
    const session = await getSession();
    //retrieves the current isers session information using the getSession function

    if (!session?.user?.email) {
        /*If the session object doesnt have a valid user (user is not authenticated), function returns null
        indicating no users present */
        return [];
    }

    try {
        const users = await prisma.user.findMany({
            /*retrieves users from database and order in descending order and the query is filtered such that
            current user is not include*/
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                //include all other users except the current user
                NOT: {
                    email: session.user.email
                }
            }
        });

        return users; //The function returns an array of user objects, each containing information about the user.

    } catch (error) {
        return []
    }
}

export default getUsers;