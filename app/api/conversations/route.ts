import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(
    request: Request,
) {
    try {
        const currentUser = await getCurrentUser();//get the current user
        const body = await request.json(); //extract information from the request body
        const {
            userId,
            isGroup,
            members,
            name
        } = body;

        if (!currentUser?.id || !currentUser?.email) {
            /*If the current user object doesnt have id or email (meaning user is unauthorised, give the follwwing response) */
            return new NextResponse('Unauthorized', { status: 400 });
        }

        if (isGroup && (!members || members.length < 2 || !name)) {
            /*If the conversation is a group conversation, it validates that members are provided and 
            group members should be more than 2 else it will return 400 error */
            return new NextResponse('Invalid data', { status: 400 });
        }

        if (isGroup) {
            /*If the conversation is of group, it creates new group conversation using prisma .create method */
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        //connects each memeber including the current user to the new group conversation
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include: {
                    users: true,
                }
            });

            // after creating the conversation, it sends a real-time update to each user using Pusher
            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, 'conversation:new', newConversation);
                }
            });

            return NextResponse.json(newConversation); //It returns a JSON response with the details of the newly created conversation.
        }

        const existingConversations = await prisma.conversation.findMany({

            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        });

        const singleConversation = existingConversations[0];
        /*If the conversation is one-on-one conversation, it checks if a conversation already exists */

        if (singleConversation) {
            //If a conversation exists, it returns a JSON response with the existing conversation details.
            return NextResponse.json(singleConversation);
        }

        const newConversation = await prisma.conversation.create({
            //If no conversation exists, it creates a new one-on-one conversation between the current user and the specified user.
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        });

        /*it sends a real-time update to each user using Pusher and returns a JSON response with the details 
        of the newly created conversation.*/

        newConversation.users.map((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:new', newConversation);
            }
        });

        return NextResponse.json(newConversation);

    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}