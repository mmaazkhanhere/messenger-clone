/*this code provides a utility function to fetch a list of messages along with associated sender 
information and "seen" status from a database using Prisma ORM. It retrieves messages for a specific 
conversation ID */

import prisma from '@/app/libs/prismadb'

const getMessages = async (conversationId: string) => {
    //recieved id of the conversation to retrieve as an input parameter
    try {
        const messages = await prisma.message.findMany({
            //get those conversation whose id matches the id required to retrieve
            where: {
                conversationId: conversationId
            },
            include: {
                //also include the information of sender and if message is seen
                sender: true,
                seen: true
            },
            orderBy: {
                //oreder the conversation in ascending order.
                createdAt: 'asc'
            }
        });

        return messages; /*returns an array of message objects each containing information about the message, 
        its associated sender and seen status*/

    } catch (error) {
        return []
    }
}

export default getMessages