
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/atoms/mode-toggle';
import { useBoolean } from '@/hooks/useBoolean';
import FormProvider, { RHFTextField } from '@/components/rhf';

const defaultValues = {
    email: '',
    password: '',
};

const schema = Yup.object().shape({
    email: Yup.string()
    // .email('Invalid email').required('Email is required')
    ,
    password: Yup.string()
    // .min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
    const router = useRouter();
    const open = useBoolean();

    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        // Fake login logic
        router.push('/super-admin'); // or '/super-admin'
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-slate-200 to-gray-100 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f] text-foreground relative px-4">
            <div className="absolute top-4 right-4 z-10">
                <ModeToggle />
            </div>

            <div className="flex w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden bg-white/30 dark:bg-black/30 backdrop-blur-md border border-border transition-all">
                {/* Branding Left Side */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1a1a1a] to-black text-white items-center justify-center p-10 relative"
                >
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-extrabold tracking-tight">Welcome Back</h1>
                        <p className="text-lg text-gray-300 max-w-sm mx-auto">
                            Let’s get you signed in to continue.
                        </p>

                    </div>
                </motion.div>

                {/* Form Right Side */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center"
                >
                    <h2 className="text-3xl font-extrabold text-center mb-1">Login to PLEIS</h2>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                        Enter your credentials to access your account
                    </p>

                    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <RHFTextField name="email" type="email" placeholder="Email Address" className="rounded-md h-[40px]" />
                            <RHFTextField
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="rounded-md h-[40px]"
                                showPassword={open.value}
                                onTogglePassword={open.onToggle}
                            />

                            <Button type="submit" className="w-full h-[45px]">
                                {methods.formState.isSubmitting ? 'Signing In...' : 'Login'}
                            </Button>

                            <div className="text-center text-muted-foreground text-sm">Or sign in with</div>

                            <div className="flex items-center justify-center gap-4">
                                <Button variant="outline" className="py-3 cursor-pointer h-[60px] w-[60px] rounded-full">
                                    <span className="w-6 h-6 flex items-center justify-center">
                                        <img src="/images/appleIcon.png" alt="Apple" className='w-[25px] h-[25px] dark:hidden block' />
                                        <img src="/images/macIconDark.png" alt="Apple" className='w-[25px] h-[25px] dark:block hidden' />
                                    </span>
                                </Button>

                                <Button variant="outline" className=" cursor-pointer h-[60px] w-[60px] rounded-full">
                                    <span className="w-6 h-6 flex items-center justify-center">
                                        <img src="/images/googleIcon.png" alt="Google" className='w-[25px] h-[25px]' />
                                    </span>
                                </Button>

                                <Button variant="outline" className=" cursor-pointer h-[60px] w-[60px] rounded-full">
                                    <span className="w-6 h-6 flex items-center justify-center">
                                        <img src="/images/metaIcon.png" alt="Meta" className='w-[25px] h-[25px]' />
                                    </span>
                                </Button>
                            </div>

                            <p className="text-center text-sm text-muted-foreground mt-4">
                                Don’t have an account?{' '}
                                <Link href="/user/signUp" className="text-primary hover:underline font-medium">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </FormProvider>

                    <p className="mt-10 text-xs text-muted-foreground text-center">
                        By continuing, you agree to our <span className="underline">Terms</span> and{' '}
                        <span className="underline">Privacy Policy</span>.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
