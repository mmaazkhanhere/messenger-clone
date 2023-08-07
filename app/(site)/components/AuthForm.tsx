"use client"

import Button from '@/app/components/Button'
import Input from '@/app/components/inputs/Input'
import React, { useState, useCallback } from 'react'
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'

type Props = {}

const AuthForm = (props: Props) => {

    type Variant = 'LOGIN' | 'REIGSTER'; //two type of user state (sort of)

    const [variant, setVariant] = useState<Variant>("LOGIN"); //default state would be login (or maybe by default user is required to sign in)
    const [isLoading, setIsLoading] = useState<boolean>(false); //when the form is submitted, isLoading will be true

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant("REIGSTER")
        } else {
            setVariant("LOGIN")
        }
    }, [variant])

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({ /*Default possible values in the form */
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true); //when form is submitted, the loading state is turned to true

        if (variant === 'REIGSTER') {
            //Axios regiser
        }
        if (variant === 'LOGIN') {
            //NextAuth Sign in
        }
    }

    const socialAction = (action: string) => { //function for signing in using google, facebook etc
        setIsLoading(true);
        //NextAuth Social sign in
    }

    return (
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                <form className='space-y-6'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {
                        variant === "REIGSTER" && (
                            <Input
                                id='name'
                                label='Name'
                                type='text'
                                register={register}
                                errors={errors}
                            />
                        )
                    }
                    <Input
                        id='email'
                        label='Email Address'
                        type='email'
                        register={register}
                        errors={errors}
                    />
                    <Input
                        id='password'
                        label='Password'
                        type='password'
                        register={register}
                        errors={errors}
                    />
                    <div>
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type='submit'
                        >
                            {
                                variant === 'LOGIN' ? 'Sign In' : "Register"
                            }
                        </Button>
                    </div>
                </form>
                <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center
                        '>
                            <div className='w-full border-t border-gray-300'
                            />
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='bg-white px-2 text-gray-500'>
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className='mt-6 flex gap-2'>
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>
                </div>
                <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
                    <div>
                        {
                            variant === 'LOGIN' ? 'New to Messenger?' : 'Already have account?'
                        }
                    </div>
                    <div
                        onClick={toggleVariant}
                        className='underline cursor-pointer'
                    >
                        {
                            variant === 'LOGIN' ? 'Create an account' : 'Login'
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm