import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {

    const params = useParams();/*Gets the route parameters from the URL using useParams */

    const conversationId = useMemo(() => { /*using use memo to calculate the conversation id  from the route parameter */
        if (!params?.conversationId) {
            return '';
        }
        return params.conversationId as string //if a conversatoin id exists in the params, it is casted to string and returned
    }, [params?.conversationId]);

    const isOpen = useMemo(() => !!conversationId, [conversationId]); /*isOpen is calculated using useMemo which is
    determined based on presence of conversation id. If conversation id exists, isOpen is true */

    return useMemo(() => ({
        isOpen, conversationId
    }), [isOpen, conversationId]);
    /*The hook returns object containing the status of isOpen and conversation id */
}

export default useConversation