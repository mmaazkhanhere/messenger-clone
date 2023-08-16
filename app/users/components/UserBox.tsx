/* the UserBox component represents a UI box displaying user information. When clicked, 
it sends a POST request to create a new conversation and then navigates to the conversation 
page. */


import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

// Define the UserBoxProps interface to specify the props for UserBox component
interface UserBoxProps {
    data: User; // The user data to be displayed in the box
}

// Define the UserBox component using React.FC (functional component) pattern
const UserBox: React.FC<UserBoxProps> = ({ data }) => {
    // Get the router instance using the useRouter hook
    const router = useRouter();
    // State to manage loading state
    const [isLoading, setIsLoading] = useState(false);

    // Define a click event handler for the UserBox
    const handleClick = useCallback(() => {
        setIsLoading(true);

        axios.post('/api/conversations', { userId: data.id })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
            .finally(() => setIsLoading(false));
    }, [data, router]);

    // Return the UI representation of the UserBox
    return (
        <>
            {
                isLoading && (
                    <LoadingModal />
                )
            }

            <div
                onClick={handleClick} // Attach click event handler to the box
                className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg
            transition cursor-pointer"
            >
                <Avatar user={data} /> {/* Render the Avatar component */}
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-900">
                                {data.name} {/* Display the user's name */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default UserBox; // Export the UserBox component as default
