'use client';

import FormProvider from '@/components/rhf/form-provider';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFTextField from '@/components/rhf/rhf-text-field';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const defaultValues = {
    email: "",
    password: "",
}

const Page = () => {


    const router = useRouter();
    const open = useBoolean();

    const schema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });
    const onSubmit = (data: any) => {
        router.push('/super-admin')
    }
    return (
        <div>
            <div className="w-full h-screen grid grid-cols-12 items-center 
             bg-[url('/images/bg10.jpeg')] dark:bg-[url('/images/bg10-dark.jpeg')] bg-cover bg-no-repeat bg-center">
                <div className='md:col-span-8 col-span-12  items-center justify-center flex flex-col '>
                    {/* <img
                        className="block dark:hidden mx-auto w-[60%] md:w-[100%] max-w-xs "
                        src="/images/l-standard.png"
                        alt="Light Logo"
                    />

                    <img
                        className="hidden dark:block mx-auto w-[60%] md:w-[100%] max-w-xs mb-10  "
                        src="/images/l-reversed.png"
                        alt="Dark Logo"
                    /> */}
                    <h1 className='md:text-7xl text-5xl font-bold'>PLEIS</h1>
                </div>
                <div className='md:col-span-4 col-span-12 items-center justify-center flex flex-col dark:shadow-none shadow-2xl dark:bg-[#1e1e2d] md:m-5 m-2 rounded-[5px] md:min-h-[90vh] min-h-[60vh] '>
                    <h1 className='font-bold text-3xl mb-10 md:mt-0'>
                        sign In
                    </h1>
                    <div className='md:w-[70%]  w-full md:p-0 p-5'>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <RHFTextField
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className={`mb-4 py-5 px-4 rounded !bg-transparent  ${methods.formState.errors.email ? 'border border-red-500' : ''}`}

                            />
                            <RHFTextField
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.password ? 'border border-red-500' : ''}`}

                                showPassword={open.value}
                                onTogglePassword={() => open.onToggle()}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-blue-400 text-white py-5 px-4 rounded hover:bg-blue-900 transition-colors cursor-pointer"
                            >
                                Sign In
                            </Button>

                        </FormProvider>
                        {/* <div className='text-center text-gray-400 mt-10'>
                            <p className='text-sm'>Don't have an account? <Link href="/user/signUp" className='text-blue-500 hover:underline'>Sign Up</Link></p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
