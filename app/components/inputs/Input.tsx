"use client"

import clsx from 'clsx'; // Importing a utility library for managing CSS classes
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'; // Importing components and types from 'react-hook-form' library

// Define the properties that the 'Input' component accepts
interface InputProps {
    label: string; // Text for the input label
    id: string; // Unique identifier for the input element
    type?: string; // Optional: specifies the input type (e.g., 'text', 'number')
    required?: boolean; // Optional: indicates if the input is required
    register: UseFormRegister<FieldValues>; // Function from 'react-hook-form' to register the input
    errors: FieldErrors; // Object containing validation errors
    disabled?: boolean; // Optional: disables the input
}

// Define the 'Input' component
const Input: React.FC<InputProps> = ({ label, id, type, required, register, errors, disabled }) => {
    return (
        <div>
            {/* Label for the input */}
            <label htmlFor={id} className='block text-sm font-medium leading-6 text-gray-900'>
                {label}
            </label>
            <div className='mt-2'>
                {/* Input element */}
                <input
                    id={id} // Unique identifier for the input element
                    type={type} // Input type (if specified)
                    disabled={disabled} // Indicates if the input is disabled
                    {...register(id, { required })} // Register the input with 'react-hook-form', specify if required
                    className={clsx(
                        // Apply multiple CSS classes conditionally
                        `form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                        ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600
                        sm:text-sm sm:leading-6`, // Base styles for the input
                        errors[id] && `focus:ring-rose-500`, // Apply red ring if there's an error for this input
                        disabled && `opacity-50 cursor-default` // Adjust styles if input is disabled
                    )}
                />
            </div>
        </div>
    );
}

// Export the 'Input' component as the default export
export default Input;
