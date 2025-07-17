
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/atoms/mode-toggle';
import { useBoolean } from '@/hooks/useBoolean';
import FormProvider, { RHFTextField } from '@/components/rhf';

const defaultValues = {
  fname: '',
  lname: '',
  email: '',
  password: '',
  phone: '',
};


function SignUpPage() {

  const router = useRouter();
  const open = useBoolean();

  const schema = Yup.object().shape({
    fname: Yup.string()
    // required('Full name is required')
    ,
    lname: Yup.string()
    // .required('Last name is required')
    ,
    email: Yup.string().email('Invalid email')
    // .required('Email is required')
    ,
    password: Yup.string()
    // .min(6, 'Password must be at least 6 characters').required('Password is required')
    ,
    phone: Yup.string()
    // .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    // .required('Phone number is required')
  });

  const [phone, setPhone] = React.useState('');

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
              <RHFTextField name="fname" placeholder="First Name" className="rounded-md h-[40px]" />
              <RHFTextField name="lname" placeholder="Last Name" className="rounded-md h-[40px]" />


              <RHFTextField name="email" type="email" placeholder="Email Address" className="rounded-md h-[40px]" />
              <RHFTextField
                name="password"
                type="password"
                placeholder="Password"
                className="rounded-md h-[40px]"
                showPassword={open.value}
                onTogglePassword={open.onToggle}
              />
              <Controller
                name={"phone"}
                control={methods.control}
                render={({ field, fieldState }) => (
                  <div className="w-full">
                    <PhoneInput
                      {...field}
                      country="pk"
                      onChange={(value) => field.onChange(value)}
                      placeholder={"Phone Number"}
                      specialLabel=""
                      inputProps={{
                        required: true,
                        "aria-invalid": fieldState.invalid,
                      }}
                      containerClass="w-full"
                      buttonClass="!bg-transparent !border-none !shadow-none px-2"
                      inputClass={`
              file:text-foreground placeholder:text-muted-foreground
              selection:bg-primary selection:text-primary-foreground
              dark:bg-input/30 border-input !border-gray-100 !shadow-sm
              flex !h-[40px] !w-full min-w-0 rounded-md
              !bg-transparent px-3 py-1 text-base
              shadow-xs transition-[color,box-shadow]
              outline-none file:inline-flex file:h-7 file:border-0
              file:bg-transparent file:text-sm file:font-medium
              disabled:pointer-events-none disabled:cursor-not-allowed
              disabled:opacity-50 md:text-sm
              focus-visible:ring-ring/50 focus-visible:ring-[3px]
              aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
              aria-invalid:border-destructive
              ${fieldState.invalid ? "border-destructive ring-destructive/40" : ""}
            `}
                    />
                  </div>
                )}
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
    </div >
  );
}


export default SignUpPage;