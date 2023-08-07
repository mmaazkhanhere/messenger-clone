"use client"

import Button from '@/app/components/Button'
import Input from '@/app/components/inputs/Input'
import React, { useState, useCallback } from 'react'
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"

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
                        <Button />
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AuthForm