import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
    conversationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params; //gets the conversation id from the params of the function
        const currentUser = await getCurrentUser(); //gets the current user

        if (!currentUser?.id) { //if not current user, returns a json response of null;
            return NextResponse.json(null);
        }

        const existingConversation = await prisma.conversation.findUnique({
            /*Gets the existing conversation retrieving the conversation whose id is same of the required
            conversation */
            where: {
                id: conversationId
            },
            include: {
                //also includes user information associated with the conversation
                users: true
            }
        });

        if (!existingConversation) {
            //if existing conversation doesnt exist, 400 error is returned in response
            return new NextResponse('Invalid ID', { status: 400 });
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            /*If the conversation is found and is associated with the current user, it deletes the conversation based on
            conversation id and the user id */
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                },
            },
        });

        existingConversation.users.forEach((user) => {
            //It sends a real-time update to each user (using Pusher) to inform them of the removed conversation.
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
            }
        });

        return NextResponse.json(deletedConversation);
        //The function returns a JSON response with the details of the deleted conversation.

    } catch (error) {
        return NextResponse.json(null);
    }
}