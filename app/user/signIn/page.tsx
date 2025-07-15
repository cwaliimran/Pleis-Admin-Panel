// 'use client';

// import FormProvider from '@/components/rhf/form-provider';
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import * as Yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import RHFTextField from '@/components/rhf/rhf-text-field';
// import { Button } from '@/components/ui/button';
// import { useBoolean } from '@/hooks/useBoolean';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// const defaultValues = {
//     email: "",
//     password: "",
// }

// const Page = () => {


//     const router = useRouter();
//     const open = useBoolean();

//     const schema = Yup.object().shape({
//         email: Yup.string().email('Invalid email').required('Email is required'),
//         password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//     });

//     const methods = useForm({
//         defaultValues,
//         resolver: yupResolver(schema),
//     });
//     const onSubmit = (data: any) => {
//         router.push('/super-admin')
//     }
//     return (
//         <div>
//             <div className="w-full h-screen grid grid-cols-12 items-center 
//              bg-[url('/images/bg10.jpeg')] dark:bg-[url('/images/bg10-dark.jpeg')] bg-cover bg-no-repeat bg-center">
//                 <div className='md:col-span-8 col-span-12  items-center justify-center flex flex-col '>
//                     {/* <img
//                         className="block dark:hidden mx-auto w-[60%] md:w-[100%] max-w-xs "
//                         src="/images/l-standard.png"
//                         alt="Light Logo"
//                     />

//                     <img
//                         className="hidden dark:block mx-auto w-[60%] md:w-[100%] max-w-xs mb-10  "
//                         src="/images/l-reversed.png"
//                         alt="Dark Logo"
//                     /> */}
//                     <h1 className='md:text-7xl text-5xl font-bold'>PLEIS</h1>
//                 </div>
//                 <div className='md:col-span-4 col-span-12 items-center justify-center flex flex-col dark:shadow-none shadow-2xl dark:bg-[#1e1e2d] md:m-5 m-2 rounded-[5px] md:min-h-[90vh] min-h-[60vh] '>
//                     <h1 className='font-bold text-3xl mb-10 md:mt-0'>
//                         sign In
//                     </h1>
//                     <div className='md:w-[70%]  w-full md:p-0 p-5'>
//                         <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
//                             <RHFTextField
//                                 name="email"
//                                 type="email"
//                                 placeholder="Enter your email"
//                                 className={`mb-4 py-5 px-4 rounded !bg-transparent  ${methods.formState.errors.email ? 'border border-red-500' : ''}`}

//                             />
//                             <RHFTextField
//                                 name="password"
//                                 type="password"
//                                 placeholder="Enter your password"
//                                 className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.password ? 'border border-red-500' : ''}`}

//                                 showPassword={open.value}
//                                 onTogglePassword={() => open.onToggle()}
//                             />
//                             <Button
//                                 type="submit"
//                                 className="w-full bg-blue-400 text-white py-5 px-4 rounded hover:bg-blue-900 transition-colors cursor-pointer"
//                             >
//                                 Sign In
//                             </Button>

//                         </FormProvider>
//                         {/* <div className='text-center text-gray-400 mt-10'>
//                             <p className='text-sm'>Don't have an account? <Link href="/user/signUp" className='text-blue-500 hover:underline'>Sign Up</Link></p>
//                         </div> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Page;
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { useBoolean } from '@/hooks/useBoolean';
import { useTheme } from 'next-themes';
import { ModeToggle } from '@/components/atoms/mode-toggle';

const defaultValues = {
    email: '',
    password: '',
};

export default function LoginPage() {
    const router = useRouter();
    const open = useBoolean();
    const { theme, setTheme } = useTheme();

    const schema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        // fake login logic
        router.push('/super-admin');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background transition-colors duration-300 px-4 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <ModeToggle />
            </div>

            <Card className="w-full max-w-md shadow-2xl border border-border bg-white dark:bg-neutral-900 transition-colors duration-300">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-primary">
                        Login to <span className="">PLEIS</span>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <RHFTextField
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className={`py-5 px-4 rounded-md border ${methods.formState.errors.email ? 'border-red-500' : 'border-border'
                                    } bg-transparent`}
                            />

                            <RHFTextField
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className={`py-5 px-4 rounded-md border ${methods.formState.errors.password ? 'border-red-500' : 'border-border'
                                    } bg-transparent`}
                                showPassword={open.value}
                                onTogglePassword={() => open.onToggle()}
                            />

                            {/* Forgot Password */}
                            <div className="text-right text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="text-muted-foreground hover:text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={methods.formState.isSubmitting}
                            >
                                {methods.formState.isSubmitting ? 'Logging in...' : 'Login'}
                            </Button>

                            {/* Sign up */}
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/user/signUp"
                                    className="text-primary font-medium hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </FormProvider>
                </CardContent>

            </Card>
        </div>
    );
}
