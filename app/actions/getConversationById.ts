/*this code provides a utility function to fetch a conversation and its associated users 
from a database using Prisma ORM. It ensures that the user is authenticated before attempting 
to retrieve the conversation and gracefully handles errors that might occur during the process. */

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";


const getConversationById = async (
    conversationId: string
) => {
    //recieves a conversation id as a aparameter
    try {

        const currentUser = await getCurrentUser(); //retrieves the current user information

        if (!currentUser?.email) { //if the current user is null (doesnt exist, meaning that user is not authenticated), null is return 
            return null;
        }

        const conversation = await prisma.conversation.findUnique({
            /*If user is authenticated, the function proceeds to retrieve conversation with specificed conversation id
            using prisma findUnique method */
            where: { //specifying that id field matches with conversation id
                id: conversationId
            },
            include: {
                /*specifies which related records should be included in the query result. The below code indicates that
                query aslo fetches information about the users who are part of that conversation*/
                users: true
            }
        });

        return conversation; //return the retrieved conversation object which include information about conversation and associated users

    } catch (error) {
        return null;
    }
}

export default getConversationById;
