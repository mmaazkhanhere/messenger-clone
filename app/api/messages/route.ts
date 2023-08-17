import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
    try {

        const currentUser = await getCurrentUser(); //get the current user
        const body = await request.json(); //extract the body from the request
        const { message, image, conversationId } = body;

        if (!currentUser?.id || !currentUser?.email) {
            //401 error if the user is unauthorised
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const newMessage = await prisma.message.create({
            //It creates a new message using the prisma.message.create method.

            data: {
                body: message,
                image: image,
                conversation: {

                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    //connect the sender field with the current user
                    connect: {
                        id: currentUser.id
                    }
                },
                seen: {
                    //connect the seen field with the current user
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true,
            }
        });

        const updatedConversation = await prisma.conversation.update({
            //updates the conversation associated with the new message
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    //co
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage]
            })
        });

        return NextResponse.json(newMessage);

    } catch (error) {
        console.log(error, "ERROR_MESSAGES");
        return new NextResponse("Internal Error", { status: 500 });
    }
}