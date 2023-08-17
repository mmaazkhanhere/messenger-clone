import prisma from "@/app/libs/prismadb"
import getCurrentUser from "./getCurrentUser"

const getConversations = async () => {

    const currentUser = await getCurrentUser(); //gets the current user

    if (!currentUser?.id) { //if the current user doesnt exist, it returns no conversation
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            /*The function proceeds to retrieve conversations from the databse using findMany method. */
            orderBy: {
                //conversations are ordered by last message in descending order meaning the latest message is shown first
                lastMessageAt: 'desc'
            },
            where: {
                /*conversations are filtered based on the userIs array containing the current user's id*/
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,//users associated with query result should also be included
                messages: { //includes information about each message within each conversation
                    include: { //also include the sender and seen information
                        sender: true, //message sender
                        seen: true //is message seen
                    }
                }
            }
        });

        return conversations; /*The function returns the list of conversations retrieved from the database along with
        the details about the associated users and messages */

    } catch (error) {
        return [];
    }
}

export default getConversations