import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';

import { signOut } from "next-auth/react";
import useConversation from './useConversation';

const useRoutes = () => {
    // Get the current pathname from the URL using the `usePathname` hook.
    const pathname = usePathname();

    // Get conversation-related information using the `useConversation` custom hook.
    const { conversationId } = useConversation();

    // Define an array of route objects using `useMemo`.
    const routes = useMemo(() => [
        {
            label: 'Chat',
            href: '/conversations',
            icon: HiChat,
            // Determine if this route is active based on the current pathname or conversation.
            active: pathname === '/conversations' || !!conversationId
        },
        {
            label: 'Users',
            href: '/users',
            icon: HiUsers,
            // Determine if this route is active based on the current pathname.
            active: pathname === '/users'
        },
        {
            label: 'Logout',
            href: '#',
            // Attach a sign-out function to the onClick event.
            onClick: () => signOut(),
            icon: HiArrowLeftOnRectangle
        }
    ], [pathname, conversationId]);

    // Return the array of route objects.
    return routes;
}

// Export the custom hook for use in other components.
export default useRoutes;
