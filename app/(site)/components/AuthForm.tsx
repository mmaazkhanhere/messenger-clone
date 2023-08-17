/* this AuthForm component provides a complete UI for user authentication, including form handling, 
social sign-in, and user interface toggling between login and registration modes. */

"use client"

import Button from '@/app/components/Button'; // Import the custom Button component
import Input from '@/app/components/inputs/Input'; // Import the custom Input component
import React, { useState, useCallback, useEffect } from 'react'; // Import React and some hooks
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"; // Import form-related utilities from 'react-hook-form'
import AuthSocialButton from './AuthSocialButton'; // Import the custom AuthSocialButton component
import { BsGithub, BsGoogle } from 'react-icons/bs'; // Import icons from 'react-icons/bs'
import axios from 'axios'
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const AuthForm = () => {

    const session = useSession(); //manages the user's authentication session
    const router = useRouter() //used to handle routing within the application

    // Define the 'Variant' type to represent the user state ('LOGIN' or 'REGISTER')
    type Variant = 'LOGIN' | 'REGISTER';

    // Initialize state variables using the 'useState' hook
    const [variant, setVariant] = useState<Variant>("LOGIN"); // Set default state as 'LOGIN'
    const [isLoading, setIsLoading] = useState<boolean>(false); // Set loading state as 'false'

    // Define a function to toggle between 'LOGIN' and 'REGISTER' states
    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant("REGISTER");
        } else {
            setVariant("LOGIN");
        }
    }, [variant]);

    // Set up form handling using 'react-hook-form' with default values
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/users');
        }
    }, [router, session?.status])

    // Define the form submission handler
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true); // Set loading state to 'true' when form is submitted

        if (variant === 'REGISTER') {
            /*If user is signing up, an HTTP POST request is made using axios to a registration API endpoint. 
            Upon success, the user is signed in using the signIn function from next-auth/react. */
            axios.post('/api/register', data)
                .then(() => signIn('credentials', data))
                .catch(() => toast.error("Something went wrong"))
                .finally(() => setIsLoading(false))
        }
        if (variant === 'LOGIN') {
            /*If the user is loging in the user is signed in using the signIn function. 
            If successful, the user is redirected to the /users page. */
            signIn('credentials', {
                ...data,
                redirect: false
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error("Invalid Credentials")
                    }
                    if (callback?.ok && !callback.error) {
                        toast.success("Logged In");
                        router.push('/users');
                    }
                })
                .finally(() => setIsLoading(false));
        }
    }

    // Define a function to handle social sign-in actions (e.g., Google, GitHub)
    const socialAction = (action: string) => {
        setIsLoading(true);
        signIn(action, { redirect: false }) /* uses the signIn function to initiate the social sign-in process. Upon success, 
        appropriate toasts (notifications) are displayed. */
            .then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid Credentials")
                }
                if (callback?.ok && !callback.error) {
                    toast.success("Logged In")
                }
            })
            .finally(() => setIsLoading(false))
    }

    // Render the UI components
    return (
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                    {/* Render the name input if the variant is 'REGISTER' */}

                    {
                        variant === "REGISTER" && (
                            <Input id='name' label='Name' type='text'
                                register={register} errors={errors}
                                disabled={isLoading}
                            />
                        )
                    }
                    <Input id='email' label='Email Address' type='email'
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <Input id='password' label='Password' type='password'
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <div>
                        {/* Render the submit button */}
                        <Button disabled={isLoading} fullWidth type='submit'>
                            {
                                variant === 'LOGIN' ? 'Sign In' : "Register"
                            }
                        </Button>
                    </div>
                </form>
                <div className='mt-6'>
                    {/* Render social sign-in buttons */}
                    <div className='mt-6 flex gap-2'>
                        <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
                        <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
                    </div>
                </div>
                <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
                    <div>
                        {/* Toggle between 'LOGIN' and 'REGISTER' options */}
                        {
                            variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'
                        }
                    </div>
                    <div onClick={toggleVariant} className='underline cursor-pointer'>
                        {
                            variant === 'LOGIN' ? 'Create an account' : 'Login'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export the 'AuthForm' component as the default export
export default AuthForm;
