/* this script provides functionality to mark messages as "seen" in a conversation, 
updates the database accordingly, and triggers real-time updates using Pushe */

import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from '@/app/libs/pusher'
import prisma from "@/app/libs/prismadb";

interface IParams {
    conversationId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser(); //get the current user 
        const {
            conversationId
        } = params; //get the conversation id from the params


        if (!currentUser?.id || !currentUser?.email) {
            //if the current user doesnt have id or emai (is unauthenticated), return 401 error
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Find existing conversation
        const conversation = await prisma.conversation.findUnique({
            /*The function retrieves exisitng conversation with specified conversation id */
            where: {
                id: conversationId,
            },
            include: {
                //includes the related messaages and their seen status and user information in the query result
                messages: {
                    include: {
                        seen: true
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            //if no exisiting conversations is found, 400 bad request response send
            return new NextResponse('Invalid ID', { status: 400 });
        }

        // Find last message that needs to be seen
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        // Update seen of last message
        const updatedMessage = await prisma.message.update({
            /*Updates the seen status of last message by connecting the users id to the seen field */
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        /*triggers a real-time update using Pusher to notify other users in the conversation 
        that a message's seen status has been updated.*/

        await pusherServer.trigger(currentUser.email, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        });

        // If user has already seen the message, no need to go further
        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        /*If the message has not been seen by the current user before, it triggers another real-time 
        update using Pusher to notify other users that the message has been seen. */

        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

        return new NextResponse('Success');

    } catch (error) {
        console.log(error, 'ERROR_MESSAGES_SEEN')
        return new NextResponse('Error', { status: 500 });
    }
}