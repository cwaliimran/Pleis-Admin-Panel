'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import FormProvider, { RHFTextField, RHFCheckbox, RHFPasswordField } from '@/components/rhf';

const defaultValues = {
    firstName: "",
    lastName: "",
    organization: "",
    phone: "",
    email: "",
    password: "",
    acceptTerms: false,
}

const Page = () => {

    const open = useBoolean();

    const schema = Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is Required"),
        organization: Yup.string().required("Organization"),
        phone: Yup.string().required("Phone is requird "),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        acceptTerms: Yup.boolean().oneOf([true], ''),
    });

    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });
    const onSubmit = (data: any) => {
        console.log(data);
    }
    return (
        <div className=''>
            <div className="w-full h-screen grid grid-cols-12 items-center 
             bg-[url('/images/bg10.jpeg')] dark:bg-[url('/images/bg10-dark.jpeg')] bg-cover bg-no-repeat bg-center">
                <div className='md:col-span-8 col-span-12  items-center justify-center flex flex-col '>
                    {/* <img
                        className="block dark:hidden mx-auto w-[60%] md:w-[60%] max-w-xs mb-10 lg:mb-20"
                        src="/images/l-standard.png"
                        alt="Light Logo"
                    />

                    <img
                        className="hidden dark:block mx-auto w-[60%] md:w-[60%] max-w-xs mb-10 lg:mb-20"
                        src="/images/l-reversed.png"
                        alt="Dark Logo"
                    /> */}
                    <h1 className='md:text-7xl text-5xl font-bold'>PLEIS</h1>
                </div>
                <div className='
                md:col-span-4 col-span-12 items-center justify-center flex flex-col dark:shadow-none shadow-2xl dark:bg-[#1e1e2d] md:m-5 m-2 rounded-[5px] md:min-h-[90vh] min-h-[70vh] '>
                    <h1 className='font-bold text-3xl  mb-10 md:mt-0 mt-5 '>
                        sign Up
                    </h1>
                    <div className='md:w-[70%]  w-full md:p-0 p-5'>
                        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                            <RHFTextField
                                name="firstName"
                                placeholder="First Name *"
                                className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.firstName ? 'border border-red-500' : ''} `}
                            />
                            <RHFTextField
                                name="lastName"
                                placeholder="Last Name *"
                                className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.firstName ? 'border border-red-500' : ''} `}

                            />
                            <RHFTextField
                                name="organization"
                                placeholder="Add Organization *"
                                className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.organization ? 'border border-red-500' : ''} `}

                            />
                            <RHFTextField
                                name="phone"
                                placeholder="Phone *"
                                className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.phone ? 'border border-red-500' : ''} `}


                            />
                            <RHFTextField
                                name="email"
                                type="email"
                                placeholder="Email *"
                                className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.email ? 'border border-red-500' : ''} `}
                            />

                            <RHFPasswordField
                                name="password"
                                placeholder="Password *"
                                className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.password ? 'border border-red-500' : ''} `}
                                showPassword={open.value}
                                onTogglePassword={() => open.onToggle()}
                            />
                            <div className='flex'>
                                <div className='flex flex-col'>
                                    <RHFCheckbox
                                        name="acceptTerms"
                                        label="I Accept the"
                                    />
                                </div>
                                <Link className='ml-1 text-blue-400 font-medium' href={'/term-and-service'}>Terms</Link>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-400 text-white py-5 px-4 rounded hover:bg-blue-900 transition-colors cursor-pointer"
                            >
                                Sign In
                            </Button>

                        </FormProvider>
                        <div className='text-center text-gray-400 mt-10'>
                            <p className='text-sm'>Already have an Account? <Link href="/user/signIn" className='text-blue-500 hover:underline'>Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
