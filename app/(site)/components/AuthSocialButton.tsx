// Import the 'IconType' type from the 'react-icons' library
import { IconType } from 'react-icons'

// Define the properties that the 'AuthSocialButton' component accepts
interface AuthSocialButtonProps {
    icon: IconType; // The icon to display on the button (imported from 'react-icons')
    onClick: () => void; // Function to be executed when the button is clicked
}

// Define the 'AuthSocialButton' component
const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({ icon: Icon, onClick }) => {
    return (
        // Button element with specified properties and styles
        <button
            type='button' // Set the button type as 'button'
            onClick={onClick} // Attach the provided click event handler
            className='inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm
            ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
        >
            <Icon /> {/* Display the specified icon component */}
        </button>
    );
}

// Export the 'AuthSocialButton' component as the default export
export default AuthSocialButton;
