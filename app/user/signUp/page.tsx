// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';

// import { Button } from '@/components/ui/button';
// import { ModeToggle } from '@/components/atoms/mode-toggle';
// import { useBoolean } from '@/hooks/useBoolean';
// import FormProvider, { RHFTextField } from '@/components/rhf';

// const defaultValues = {
//   name: '',
//   email: '',
//   password: '',
//   confirmPassword: '',
// };

// const schema = Yup.object().shape({
//   name: Yup.string().required('Full name is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('password')], 'Passwords must match')
//     .required('Confirm your password'),
// });

// export default function SignUpPage() {
//   const router = useRouter();
//   const open = useBoolean();

//   const methods = useForm({
//     defaultValues,
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data: any) => {
//     // Fake register logic
//     router.push('/super-admin');
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative">
//       {/* Mode Toggle */}
//       <div className="absolute top-4 right-4">
//         <ModeToggle />
//       </div>

//       <div className="flex w-full max-w-4xl shadow-xl rounded-xl overflow-hidden">
//         {/* Left: Form Section */}
//         <div className="w-full md:w-1/2 bg-white dark:bg-black p-8 md:p-16 flex flex-col justify-center">
//           <h2 className="text-2xl font-bold mb-1 text-center">Join Us</h2>
//           <p className="text-sm text-muted-foreground text-center mb-6">
//             Create your account with Pleis
//           </p>

//           <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
//             <div className="space-y-4">
//               <RHFTextField name="name" placeholder="Full Name" className="rounded-md" />
//               <RHFTextField name="email" type="email" placeholder="Email Address" className="rounded-md" />
//               <RHFTextField
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 className="rounded-md"
//                 showPassword={open.value}
//                 onTogglePassword={() => open.onToggle()}
//               />
//               <RHFTextField
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="Confirm Password"
//                 className="rounded-md"
//                 showPassword={open.value}
//                 onTogglePassword={() => open.onToggle()}
//               />

//               <Button type="submit" className="w-full">
//                 {methods.formState.isSubmitting ? 'Creating Account...' : 'Sign Up'}
//               </Button>

//               <div className="text-center text-muted-foreground text-sm">Or sign up with</div>

//               <div className="grid grid-cols-3 gap-2">
//                 {/* Apple */}
// <Button variant="outline" className="w-full py-3">
//   <span className="w-6 h-6 flex items-center justify-center">
//     <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 384 512" className="w-6 h-6">
//       <path d="M318.7 268.6c-.3-47.5 38.9-70.2 40.6-71.2-22.1-32.4-56.4-36.8-68.6-37.3-29.2-2.9-56.8 17.1-71.5 17.1-14.6 0-37.3-16.7-61.3-16.2-31.5.5-60.8 18.3-77.1 46.5-32.9 57-8.4 141.2 23.6 187.3 15.7 22.8 34.4 48.3 59 47.4 23.6-.9 32.6-15.2 61-15.2 28.4 0 36.4 15.2 61.3 14.7 25.4-.4 41.5-23.2 57.1-46.1 18.1-26.4 25.5-52 25.8-53.4-.6-.3-49.2-18.9-49.5-74.6zm-59.7-144c13.1-15.8 22-37.7 19.6-59.6-18.9.8-41.7 12.5-55.2 28.2-12.1 13.9-22.8 36.2-20 57.4 21.1 1.6 42.6-10.7 55.6-26z" />
//     </svg>
//   </span>
// </Button>

//                 {/* Google */}
// <Button variant="outline" className="w-full">
//   <span className="w-6 h-6 flex items-center justify-center">
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor" className="w-6 h-6">
//       <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 122.9 24.5 165.3 64.9l-67 64.2C318.5 93.6 285.4 80 248 80c-84.2 0-152.6 69.8-152.6 176S163.8 432 248 432c77.2 0 125.6-44.1 131-106H248v-85.2h240z" />
//     </svg>
//   </span>
// </Button>

//                 {/* Infinity */}
//                 <Button variant="outline" className="w-full">
//                   <span className="w-6 h-6 flex items-center justify-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-6 h-6">
//                       <path d="M472 160c-60.6 0-108.4 34.2-152 96-43.6-61.8-91.4-96-152-96C76.8 160 0 236.2 0 320s76.8 160 168 160c60.6 0 108.4-34.2 152-96 43.6 61.8 91.4 96 152 96 91.2 0 168-76.2 168-160s-76.8-160-168-160zM168 416c-53 0-96-42.1-96-96s43-96 96-96c35.2 0 71.4 24.7 110.7 80-39.3 55.3-75.5 80-110.7 80zm304 0c-35.2 0-71.4-24.7-110.7-80 39.3-55.3 75.5-80 110.7-80 53 0 96 42.1 96 96s-43 96-96 96z" />
//                     </svg>
//                   </span>
//                 </Button>
//               </div>

//               <p className="text-center text-sm text-muted-foreground mt-4">
//                 Already have an account?{' '}
//                 <Link href="/user/signIn" className="text-primary hover:underline">
//                   Login
//                 </Link>
//               </p>
//             </div>
//           </FormProvider>

//           <p className="mt-10 text-xs text-muted-foreground text-center">
//             By signing up, you agree to our <span className="underline">Terms of Service</span> and{' '}
//             <span className="underline">Privacy Policy</span>.
//           </p>
//         </div>

//         {/* Right: Branding */}
//         <div className="hidden md:flex w-1/2 dark:bg-[#171717] bg-[#f5f5f5] items-center justify-center">
//           <h1 className="text-5xl font-extrabold">PLEIS</h1>
//         </div>
//       </div>
//     </div>
//   );
// }

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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const schema = Yup.object().shape({
  name: Yup.string()
  // required('Full name is required')
  ,
  email: Yup.string().email('Invalid email')
  // .required('Email is required')
  ,
  password: Yup.string()
  // .min(6, 'Password must be at least 6 characters').required('Password is required')
  ,
  confirmPassword: Yup.string()
  // .oneOf([Yup.ref('password')], 'Passwords must match')
  // .required('Confirm your password'),
});

function SignUpPage() {
  const router = useRouter();
  const open = useBoolean();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    router.push('/super-admin');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-slate-200 to-gray-100 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f] text-foreground relative px-4">
      {/* Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden bg-white/30 dark:bg-black/30 backdrop-blur-md border border-border transition-all">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1a1a1a] to-black text-white items-center justify-center p-10 relative"
        >
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Welcome to PLEIS</h1>
            <p className="text-lg text-gray-300 max-w-sm mx-auto">
              Your journey to productivity and collaboration starts here.
            </p>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 mx-auto opacity-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path d="M12 4v16m8-8H4" />
            </svg> */}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-extrabold text-center mb-1">Create Account</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Join Pleis and explore the future
          </p>

          <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <RHFTextField name="name" placeholder="Full Name" className="rounded-md h-[40px]" />
              <RHFTextField name="email" type="email" placeholder="Email Address" className="rounded-md h-[40px]" />
              <RHFTextField
                name="password"
                type="password"
                placeholder="Password"
                className="rounded-md h-[40px]"
                showPassword={open.value}
                onTogglePassword={() => open.onToggle()}
              />
              <RHFTextField
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="rounded-md h-[40px]"
                showPassword={open.value}
                onTogglePassword={() => open.onToggle()}
              />

              <Button type="submit" className="w-full h-[45px]">
                {methods.formState.isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <div className="text-center text-muted-foreground text-sm">Or sign up with</div>

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
                Already have an account?{' '}
                <Link href="/user/signIn" className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </FormProvider>

          <p className="mt-10 text-xs text-muted-foreground text-center">
            By signing up, you agree to our <span className="underline">Terms of Service</span> and{' '}
            <span className="underline">Privacy Policy</span>.
          </p>
        </motion.div>

        {/* Right Section: Branding / Illustration */}

      </div>
    </div>
  );
}


export default SignUpPage;