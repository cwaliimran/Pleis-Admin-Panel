// 'use client';

// import Link from 'next/link';
// import { useForm } from 'react-hook-form';
// import * as Yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Button } from '@/components/ui/button';
// import { useBoolean } from '@/hooks/useBoolean';
// import FormProvider, { RHFTextField, RHFCheckbox, RHFPasswordField } from '@/components/rhf';

// const defaultValues = {
//     firstName: "",
//     lastName: "",
//     organization: "",
//     phone: "",
//     email: "",
//     password: "",
//     acceptTerms: false,
// }

// const Page = () => {

//     const open = useBoolean();

//     const schema = Yup.object().shape({
//         firstName: Yup.string().required("First Name is required"),
//         lastName: Yup.string().required("Last Name is Required"),
//         organization: Yup.string().required("Organization"),
//         phone: Yup.string().required("Phone is requird "),
//         email: Yup.string().email('Invalid email').required('Email is required'),
//         password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//         acceptTerms: Yup.boolean().oneOf([true], ''),
//     });

//     const methods = useForm({
//         defaultValues,
//         resolver: yupResolver(schema),
//     });
//     const onSubmit = (data: any) => {
//         console.log(data);
//     }
//     return (
//         <div className=''>
//             <div className="w-full h-screen grid grid-cols-12 items-center 
//              bg-[url('/images/bg10.jpeg')] dark:bg-[url('/images/bg10-dark.jpeg')] bg-cover bg-no-repeat bg-center">
//                 <div className='md:col-span-8 col-span-12  items-center justify-center flex flex-col '>
//                     {/* <img
//                         className="block dark:hidden mx-auto w-[60%] md:w-[60%] max-w-xs mb-10 lg:mb-20"
//                         src="/images/l-standard.png"
//                         alt="Light Logo"
//                     />

//                     <img
//                         className="hidden dark:block mx-auto w-[60%] md:w-[60%] max-w-xs mb-10 lg:mb-20"
//                         src="/images/l-reversed.png"
//                         alt="Dark Logo"
//                     /> */}
//                     <h1 className='md:text-7xl text-5xl font-bold'>PLEIS</h1>
//                 </div>
//                 <div className='
//                 md:col-span-4 col-span-12 items-center justify-center flex flex-col dark:shadow-none shadow-2xl dark:bg-[#1e1e2d] md:m-5 m-2 rounded-[5px] md:min-h-[90vh] min-h-[70vh] '>
//                     <h1 className='font-bold text-3xl  mb-10 md:mt-0 mt-5 '>
//                         sign Up
//                     </h1>
//                     <div className='md:w-[70%]  w-full md:p-0 p-5'>
//                         <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
//                             <RHFTextField
//                                 name="firstName"
//                                 placeholder="First Name *"
//                                 className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.firstName ? 'border border-red-500' : ''} `}
//                             />
//                             <RHFTextField
//                                 name="lastName"
//                                 placeholder="Last Name *"
//                                 className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.firstName ? 'border border-red-500' : ''} `}

//                             />
//                             <RHFTextField
//                                 name="organization"
//                                 placeholder="Add Organization *"
//                                 className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.organization ? 'border border-red-500' : ''} `}

//                             />
//                             <RHFTextField
//                                 name="phone"
//                                 placeholder="Phone *"
//                                 className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.phone ? 'border border-red-500' : ''} `}


//                             />
//                             <RHFTextField
//                                 name="email"
//                                 type="email"
//                                 placeholder="Email *"
//                                 className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.email ? 'border border-red-500' : ''} `}
//                             />

//                             <RHFPasswordField
//                                 name="password"
//                                 placeholder="Password *"
//                                 className={`mb-4 py-5 px-4 rounded !bg-transparent ${methods.formState.errors.password ? 'border border-red-500' : ''} `}
//                                 showPassword={open.value}
//                                 onTogglePassword={() => open.onToggle()}
//                             />
//                             <div className='flex'>
//                                 <div className='flex flex-col'>
//                                     <RHFCheckbox
//                                         name="acceptTerms"
//                                         label="I Accept the"
//                                     />
//                                 </div>
//                                 <Link className='ml-1 text-blue-400 font-medium' href={'/term-and-service'}>Terms</Link>
//                             </div>
//                             <Button
//                                 type="submit"
//                                 className="w-full bg-blue-400 text-white py-5 px-4 rounded hover:bg-blue-900 transition-colors cursor-pointer"
//                             >
//                                 Sign In
//                             </Button>

//                         </FormProvider>
//                         <div className='text-center text-gray-400 mt-10'>
//                             <p className='text-sm'>Already have an Account? <Link href="/user/signIn" className='text-blue-500 hover:underline'>Sign In</Link></p>
//                         </div>
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
import FormProvider from '@/components/rhf/form-provider';
import RHFTextField from '@/components/rhf/rhf-text-field';
import { useBoolean } from '@/hooks/useBoolean';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ModeToggle } from '@/components/atoms/mode-toggle';

const defaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export default function SignUpPage() {
  const router = useRouter();
  const open = useBoolean();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    // Replace with actual API call
    router.push('/super-admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 dark:bg-background px-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-lg shadow-lg border bg-white dark:bg-neutral-900 transition-colors duration-300">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join PLEIS and start managing with ease.</CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <RHFTextField name="name" placeholder="Full Name" />
              <RHFTextField name="email" type="email" placeholder="Email Address" />
              <RHFTextField
                name="password"
                type="password"
                placeholder="Password"
                showPassword={open.value}
                onTogglePassword={() => open.onToggle()}
              />
              <RHFTextField
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                showPassword={open.value}
                onTogglePassword={() => open.onToggle()}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={methods.formState.isSubmitting}
              >
                {methods.formState.isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-2">
                Already have an account?{' '}
                <Link href="/user/signIn" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
