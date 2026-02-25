'use client';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetSuppliersGloabalQuery } from '@/store/Reducer/suppliers';
import { useSignupMutation } from '@/store/Reducer/user';
import { getErrorMessage } from '@/utils/api';
import { getDeviceType } from '@/utils/getDeviceType';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as Yup from 'yup';

// ============================================================
// TYPES
// ============================================================

interface LocationData {
  fullAddress: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
}

interface FormData {
  fname: string;
  lname: string;
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: { code: string; number: string };
  companyName: string;
  oib: string;
  bankAccountNumber: string;
  representativeFullName: string;
  location: LocationData;
  suppliers: string[];
  terms: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

const STEP_1_FIELDS: (keyof FormData)[] = ['fname', 'lname', 'organizationName', 'email', 'password', 'confirmPassword', 'phone'];

const defaultValues: FormData = {
  fname: '',
  lname: '',
  organizationName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: { code: '+92', number: '' },
  companyName: '',
  oib: '',
  bankAccountNumber: '',
  representativeFullName: '',
  location: {
    fullAddress: '',
    country: '',
    city: '',
    state: '',
    postalCode: '',
  },
  suppliers: [],
  terms: false,
};

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const schema = Yup.object().shape({
  // Step 1 — Basic Info
  fname: Yup.string().required('First name is required').trim(),
  lname: Yup.string().required('Last name is required').trim(),
  organizationName: Yup.string().required('Organization name is required').trim(),
  email: Yup.string().required('Email is required').email('Invalid email format'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  phone: Yup.object().shape({
    code: Yup.string().default('+92'),
    number: Yup.string().required('Phone number is required'),
  }),

  // Step 2 — Business Details
  companyName: Yup.string()
    .required('Company name is required')
    .matches(/^[A-Za-z\s&]+$/, 'Company name must only contain letters, spaces, and &')
    .max(100, 'Company name must be at most 100 characters'),
  oib: Yup.string()
    .required('VAT is required')
    .matches(/^\d{1,11}$/, 'VAT must be at most 11 digits')
    .max(11, 'VAT must be at most 11 digits'),
  bankAccountNumber: Yup.string()
    .required('Bank account number is required')
    .trim()
    .min(5, 'Bank account number must be at least 5 characters')
    .max(34, 'Bank account number must be at most 34 characters')
    .matches(/^[A-Za-z0-9\s-]+$/, 'Bank account number can only contain letters, numbers, spaces, and hyphens'),
  representativeFullName: Yup.string()
    .required('Representative full name is required')
    .matches(/^[A-Za-z\s]+$/, 'Representative name must only contain letters and spaces')
    .max(100, 'Representative name must be at most 100 characters'),
  location: Yup.object().shape({
    fullAddress: Yup.string().required('Full address is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal code is required'),
  }),
  suppliers: Yup.array().of(Yup.string()),
  terms: Yup.boolean().oneOf([true], 'You must accept terms and conditions').required(),
});

// ============================================================
// COMPONENT
// ============================================================

function SignUpView() {
  const open = useBoolean();
  const confirmOpen = useBoolean();
  const router = useRouter();
  const modalOpen = useBoolean();

  const [signUp, { isLoading: signUpLoading }] = useSignupMutation();

  const { data: supplierData } = useGetSuppliersGloabalQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const supplierOptions = React.useMemo(
    () =>
      supplierData?.data?.map((sup: any) => ({
        value: sup._id,
        label: sup?.title,
      })) || [],
    [supplierData]
  );

  const [step, setStep] = React.useState<'basicInfo' | 'businessDetails'>('basicInfo');

  const methods = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    trigger,
    control,
    formState: { errors },
  } = methods;

  const parsePhoneNumber = (phoneInput: { code: string; number: string } | string): { code: string; number: string } => {
    if (typeof phoneInput === 'string') {
      if (!phoneInput) return { code: '+92', number: '' };
      const cleaned = phoneInput.replace(/[\s\-\(\)]/g, '');
      if (cleaned.startsWith('+')) {
        const match = cleaned.match(/^\+(\d{1,3})(.+)$/);
        if (match) return { code: `+${match[1]}`, number: match[2] };
      }
      return { code: '+92', number: cleaned };
    }
    return phoneInput;
  };

  const transformToBackendPayload = (data: FormData): any => {
    const deviceType = getDeviceType();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      firstName: data.fname.trim(),
      lastName: data.lname.trim(),
      organizationName: data.organizationName.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: parsePhoneNumber(data.phone),
      password: data.password,
      deviceType,
      userType: 'organizer',
      deviceId: '123',
      timezone,
      companyDetails: {
        name: data.companyName.trim(),
        oib: data.oib.trim(),
        bankAccountNumber: data.bankAccountNumber.trim(),
        representativeName: data.representativeFullName.trim(),
        location: {
          coordinates: [0, 0],
          fullAddress: data.location.fullAddress || '',
          country: data.location.country || '',
          city: data.location.city || '',
          state: data.location.state || '',
          postalCode: data.location.postalCode || '',
        },
        suppliers: data.suppliers,
      },
      termsAccepted: data.terms,
    };
  };

  const handleNextStep = async () => {
    const isValid = await trigger(STEP_1_FIELDS);
    if (isValid) setStep('businessDetails');
  };

  const handleBackStep = () => {
    setStep('basicInfo');
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = transformToBackendPayload(data);
      const response = await signUp(payload);

      if (response.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      if (response?.data?.message) {
        showSuccess(response.data.message || 'Account created successfully');
      }

      modalOpen.onTrue();
      reset();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-gray-100 via-slate-200 to-gray-100 px-4 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f]">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl border bg-white/30 shadow-2xl backdrop-blur-md dark:bg-black/30">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden w-1/2 items-center justify-center bg-linear-to-br from-[#1a1a1a] to-black p-10 text-white md:flex"
        >
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-extrabold">Welcome to PLEIS</h1>
            <p className="mx-auto max-w-sm text-lg text-gray-300">Your journey to productivity and collaboration starts here.</p>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-6 sm:p-8 md:w-1/2 md:p-14"
        >
          <h2 className="mb-1 text-center text-3xl font-extrabold sm:text-3xl">Create Account</h2>
          <p className="text-muted-foreground mb-6 text-center text-sm">Join Pleis and explore the future</p>

          <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
            {/* -------------------------------------------------- */}
            {/* STEP 1 — Basic Info                                  */}
            {/* -------------------------------------------------- */}
            {step === 'basicInfo' && (
              <div className="space-y-4">
                <RHFTextField name="fname" placeholder="First Name" />
                <RHFTextField name="lname" placeholder="Last Name" />
                <RHFTextField name="organizationName" placeholder="Organization Name" />
                <RHFTextField name="email" type="email" placeholder="Email Address" />
                <RHFTextField name="password" type="password" placeholder="Password" showPassword={open.value} onTogglePassword={open.onToggle} />
                <RHFTextField
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  showPassword={confirmOpen.value}
                  onTogglePassword={confirmOpen.onToggle}
                />

                {/* Phone — manual Controller kept as per existing pattern for PhoneInput */}
                <div>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <PhoneInput
                          country="hr"
                          value={field.value ? `${field.value.code}${field.value.number}` : ''}
                          onChange={(value, countryData: any) => {
                            const phoneNumber = value.replace(countryData.dialCode, '');
                            field.onChange({ code: `+${countryData.dialCode}`, number: phoneNumber });
                          }}
                          placeholder="Phone Number"
                          specialLabel=""
                          inputProps={{
                            required: true,
                            'aria-invalid': fieldState.invalid,
                          }}
                          containerClass="w-full"
                          buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                          inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input !border-gray-100 dark:!border-gray-500 !shadow-sm flex !h-[42px] !w-full min-w-0 rounded-lg !bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${fieldState.invalid ? 'border-destructive ring-destructive/40' : ''}`}
                        />
                        {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                      </div>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="h-[45px] w-full cursor-pointer bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white"
                >
                  Next
                </Button>
              </div>
            )}

            {/* -------------------------------------------------- */}
            {/* STEP 2 — Business Details                            */}
            {/* -------------------------------------------------- */}
            {step === 'businessDetails' && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="col-span-2">
                    <RHFTextField name="companyName" placeholder="Company Name" />
                  </div>
                  <div className="col-span-2">
                    <RHFTextField name="oib" placeholder="VAT" />
                  </div>
                  <div className="col-span-2">
                    <RHFTextField name="bankAccountNumber" placeholder="Bank Account Number" />
                  </div>
                  <div className="col-span-2">
                    <RHFTextField name="representativeFullName" placeholder="Representative Full Name" />
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <RHFTextField name="location.fullAddress" placeholder="Full Address" />

                  <div className="grid gap-4 md:grid-cols-2">
                    <RHFTextField name="location.country" placeholder="Country" />
                    <RHFTextField name="location.state" placeholder="State" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <RHFTextField name="location.city" placeholder="City" />
                    <RHFTextField name="location.postalCode" placeholder="Postal Code" />
                  </div>
                </div>

                <div className="mt-3">
                  <RHFCustomCombobox
                    name="suppliers"
                    placeholder="Select suppliers"
                    className="w-full flex-1"
                    multiple={true}
                    allowCustom={false}
                    options={supplierOptions}
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="cursor-pointer border border-gray-800 dark:border-gray-400"
                        />
                        <Label className="cursor-pointer" htmlFor="terms">
                          Accept terms and conditions
                        </Label>
                      </>
                    )}
                  />
                </div>
                {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-[45px] w-full cursor-pointer"
                    onClick={handleBackStep}
                    disabled={signUpLoading}
                  >
                    Back
                  </Button>

                  {signUpLoading ? (
                    <Button
                      type="button"
                      className="h-[45px] w-full cursor-not-allowed bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white"
                    >
                      <ButtonLoading title="Signing Up" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="h-[45px] w-full cursor-pointer bg-[#0f172b] text-white transition-colors duration-200 hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white"
                      disabled={signUpLoading}
                    >
                      Sign Up
                    </Button>
                  )}
                </div>
              </>
            )}
          </FormProvider>

          {/* Social Auth Buttons */}
          <div className="text-muted-foreground mt-8 text-center text-sm">
            Or sign up with
            <div className="mt-2 flex items-center justify-center gap-4">
              <Button variant="outline" className="h-[60px] w-[60px] cursor-pointer rounded-full py-3" type="button">
                <span className="flex h-6 w-6 items-center justify-center">
                  <Image
                    src="/images/appleIcon.png"
                    alt="Apple"
                    className="block h-[25px] w-[25px] object-contain dark:hidden"
                    width={25}
                    height={25}
                  />
                  <Image
                    src="/images/macIconDark.png"
                    alt="Apple"
                    className="hidden h-[25px] w-[25px] object-contain dark:block"
                    width={40}
                    height={40}
                  />
                </span>
              </Button>

              <Button variant="outline" className="h-[60px] w-[60px] cursor-pointer rounded-full" type="button">
                <span className="flex h-6 w-6 items-center justify-center">
                  <Image src="/images/googleIcon.png" alt="Google" className="h-[25px] w-[25px] object-contain" width={40} height={40} />
                </span>
              </Button>

              <Button variant="outline" className="h-[60px] w-[60px] cursor-pointer rounded-full" type="button">
                <span className="flex h-6 w-6 items-center justify-center">
                  <Image src="/images/metaIcon.png" alt="Meta" className="h-[25px] w-[25px] object-contain" width={40} height={40} />
                </span>
              </Button>
            </div>
            <p className="mt-4 text-sm">
              Already have an account?{' '}
              <Link href="/" className="font-medium text-[#0f172b] hover:underline dark:text-white">
                Login
              </Link>
            </p>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-xs">
            By signing up, you agree to our{' '}
            <Link href="/term-and-service" className="hover:text-primary underline transition-colors">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="hover:text-primary underline transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>

      <Dialog open={modalOpen.value} onOpenChange={modalOpen.onToggle}>
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account Created Successfully</DialogTitle>
            <DialogDescription className="mt-2">
              An activation link has been sent to your email. Please check your email (including the spam/junk folder) and click the link to activate
              your account.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              modalOpen.onFalse();
              router.push('/');
              reset();
            }}
            className="mt-2 bg-[#0f172b] text-white hover:bg-[#0f172b] dark:bg-white dark:text-black hover:dark:bg-white"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SignUpView;
