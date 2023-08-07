'use client'
import clsx from "clsx";

// Define the properties that the 'Button' component accepts
interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | undefined; // Specify the button's type attribute
    fullWidth?: boolean; // Option to make the button take full width
    children?: React.ReactNode; // Content to be placed inside the button
    onClick?: () => void; // Function to be executed when the button is clicked
    secondary?: boolean; // Option to style the button as secondary
    danger?: boolean; // Option to style the button as a danger or warning
    disabled?: boolean; // Option to disable the button
}

// Define the 'Button' component
const Button: React.FC<ButtonProps> = ({ type, fullWidth, children, onClick, secondary, danger, disabled }) => {
    return (
        // Button element with dynamic properties and styles
        <button
            onClick={onClick} // Attach the provided click event handler
            type={type} // Set the button's type (e.g., 'button', 'submit')
            disabled={disabled} // Determine if the button is disabled
            className={clsx(
                // Use 'clsx' to conditionally apply CSS classes
                `flex justify-center rounded-md px-3 py-2 text-sm font-semibold
                focus-visible:outline focus-visible:outline-2 focus-visible::outline-offset-2`, // Base button styles
                disabled && "opacity-50 cursor-default", // Apply styles if the button is disabled reducing its opacity
                fullWidth && "w-full", // Make the button take full width if requested
                secondary ? 'text-gray-900' : 'text-white', // Style for secondary button (gray text if true, white if false)
                danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600', // Style for danger or error button
                !secondary && !danger && "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600" // Default button style
            )}
        >
            {children} {/* Display the content inside the button */}
        </button>
    );
}

// Export the 'Button' component as the default export
export default Button;
