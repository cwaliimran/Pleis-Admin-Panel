'use client';

import { ModeToggle } from '@/components/atoms/mode-toggle';
import ButtonLoading from '@/components/common/button-loading';
import GoogleLocationInput from '@/components/common/location-input';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetSuppliersGloabalQuery } from '@/store/Reducer/suppliers';
import { useSignupMutation } from '@/store/Reducer/user';
import { getErrorMessage } from '@/utils/api';
import { getDeviceType } from '@/utils/getDeviceType';
import { showError, showSuccess } from '@/utils/toast';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// TypeScript interfaces
interface LocationData {
  coordinates: [number, number];
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
  phone: { code: string; number: string }; // Updated type
  companyName: string;
  oib: string;
  bankAccountNumber: string;
  representativeFullName: string;
  location: LocationData | null;
  suppliers: string[];
  terms: boolean;
}

// interface BackendPayload {
//   // profileIcon: string;
//   firstName: string;
//   lastName: string;
//   organizationName: string;
//   email: string;
//   phoneNumber: {
//     code: string;
//     number: string;
//   };
//   password: string;
//   deviceType: string;
//   userType: string;
//   deviceId: string;
//   timezone: string;
//   companyDetails: {
//     name: string;
//     oib: string;
//     bankAccountNumber: string;
//     representativeName: string;
//     location: {
//       coordinates: [number, number];
//       fullAddress: string;
//       country: string;
//       city: string;
//       state: string;
//       postalCode: string;
//     };
//     suppliers: string[];
//   };
// }

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
  location: null,
  suppliers: [],
  terms: false,
};

// Custom validation functions
const validateEmail = (email: string): string | true => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return true;
};

const validatePassword = (password: string): string | true => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return true;
};

const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string | true => {
  if (!confirmPassword) return 'Confirm password is required';
  if (confirmPassword !== password) return 'Passwords must match';
  return true;
};

const validateRequired = (value: any, fieldName: string): string | true => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  if (Array.isArray(value) && value.length === 0) {
    return `${fieldName} is required`;
  }
  return true;
};

function SignUpView() {
  const open = useBoolean();
  const confirmOpen = useBoolean();
  const router = useRouter();
  const modalOpen = useBoolean();

  // const [emailVerificationLink, setEmailVerificationLink] = useState<
  //   string | null
  // >(null);

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

  const [step, setStep] = React.useState<'basicInfo' | 'businessDetails'>(
    'basicInfo'
  );
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});

  const methods = useForm<FormData>({
    defaultValues,
    mode: 'onTouched',
  });

  const { getValues, reset } = methods;

  const parsePhoneNumber = (
    phoneInput: { code: string; number: string } | string
  ): { code: string; number: string } => {
    if (typeof phoneInput === 'string') {
      if (!phoneInput) return { code: '+92', number: '' };

      const cleaned = phoneInput.replace(/[\s\-\(\)]/g, '');
      if (cleaned.startsWith('+')) {
        const match = cleaned.match(/^\+(\d{1,3})(.+)$/);
        if (match) {
          return {
            code: `+${match[1]}`,
            number: match[2],
          };
        }
      }
      return { code: '+92', number: cleaned };
    }
    return phoneInput; // Already in the correct format
  };

  // Transform form data to backend payload
  // const transformToBackendPayload = (data: FormData): BackendPayload => {
  //   const deviceType = getDeviceType();
  //   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  //   return {
  //     // profileIcon: '435dff23-2928-494b-9ed1-aee72d118066.png',
  //     firstName: data.fname.trim(),
  //     lastName: data.lname.trim(),
  //     organizationName: data.organizationName.trim(),
  //     email: data.email.trim().toLowerCase(),
  //     phoneNumber: parsePhoneNumber(data.phone),
  //     password: data.password,
  //     deviceType: deviceType,
  //     userType: 'organizer',
  //     deviceId: '123',
  //     timezone: timezone,
  //     companyDetails: {
  //       name: data.companyName.trim(),
  //       oib: data.oib.trim(),
  //       bankAccountNumber: data.bankAccountNumber.trim(),
  //       representativeName: data.representativeFullName.trim(),
  //       location: data.location || {
  //         coordinates: [0, 0],
  //         fullAddress: '',
  //         country: '',
  //         city: '',
  //         state: '',
  //         postalCode: '',
  //       },
  //       suppliers: data.suppliers,
  //     },
  //   };
  // };

  const transformToBackendPayload = (data: any): any => {
    const deviceType = getDeviceType();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      firstName: data.fname.trim(),
      lastName: data.lname.trim(),
      organizationName: data.organizationName.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: parsePhoneNumber(data.phone),
      password: data.password,
      deviceType: deviceType,
      userType: 'organizer',
      deviceId: '123',
      timezone: timezone,
      companyDetails: {
        name: data.companyName.trim(),
        oib: data.oib.trim(),
        bankAccountNumber: data.bankAccountNumber.trim(),
        representativeName: data.representativeFullName.trim(),
        location: data.location
          ? {
              coordinates: data.location.coordinates,
              fullAddress: data?.location?.address || '', // Map address to fullAddress
              country: data.location.country || '',
              city: data.location.city || '',
              state: data.location.state || '',
              postalCode: data.location.postalCode || '',
            }
          : {
              coordinates: [0, 0],
              fullAddress: '',
              country: '',
              city: '',
              state: '',
              postalCode: '',
            },
        suppliers: data.suppliers,
      },
      termsAccepted: data.terms, // Map terms to termsAccepted
    };
  };

  // Validate step 1 (Basic Info)
  const validateBasicInfo = (): boolean => {
    const data = getValues();
    const errors: Record<string, string> = {};

    const fnameValidation = validateRequired(data.fname, 'First name');
    if (fnameValidation !== true) errors.fname = fnameValidation;

    const lnameValidation = validateRequired(data.lname, 'Last name');
    if (lnameValidation !== true) errors.lname = lnameValidation;

    const orgValidation = validateRequired(
      data.organizationName,
      'Organization name'
    );
    if (orgValidation !== true) errors.organizationName = orgValidation;

    const emailValidation = validateEmail(data.email);
    if (emailValidation !== true) errors.email = emailValidation;

    const passwordValidation = validatePassword(data.password);
    if (passwordValidation !== true) errors.password = passwordValidation;

    const confirmPasswordValidation = validateConfirmPassword(
      data.confirmPassword,
      data.password
    );
    if (confirmPasswordValidation !== true)
      errors.confirmPassword = confirmPasswordValidation;

    const phoneValidation = validateRequired(data.phone.number, 'Phone number');
    if (phoneValidation !== true) errors.phone = phoneValidation;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate step 2 (Business Details)
  const validateBusinessDetails = (): boolean => {
    const data = getValues();
    const errors: Record<string, string> = {};

    const companyValidation = validateRequired(
      data.companyName,
      'Company name'
    );
    if (companyValidation !== true) errors.companyName = companyValidation;

    const oibValidation = validateRequired(data.oib, 'OIB');

    if (oibValidation !== true) {
      errors.oib = oibValidation;
    } else if (data.oib.length > 11) {
      errors.oib = 'VAT cannot exceed 11 characters';
    }

    const bankValidation = validateRequired(
      data.bankAccountNumber,
      'Bank account number'
    );
    if (bankValidation !== true) errors.bankAccountNumber = bankValidation;

    const repValidation = validateRequired(
      data.representativeFullName,
      'Representative full name'
    );
    if (repValidation !== true) errors.representativeFullName = repValidation;

    const locationValidation = validateRequired(data.location, 'Location');
    if (locationValidation !== true) errors.location = locationValidation;

    const suppliersValidation = validateRequired(data.suppliers, 'Suppliers');
    if (suppliersValidation !== true) errors.suppliers = suppliersValidation;

    if (!data.terms) errors.terms = 'You must accept terms and conditions';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateBasicInfo()) {
      setStep('businessDetails');
    }
  };

  const handleBackStep = () => {
    setStep('basicInfo');
    setValidationErrors({});
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (!validateBusinessDetails()) {
        return;
      }
      const payload = transformToBackendPayload(data);
      const response = await signUp(payload);

      // setEmailVerificationLink(response?.data?.data?.emailVerification || null);

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      if (response?.data?.message) {
        showSuccess(response.data.message || 'Account created successfully');
      }

      modalOpen.onTrue();

      reset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to add category:', errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-100 via-slate-200 to-gray-100 px-4 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f]">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl border bg-white/30 shadow-2xl backdrop-blur-md dark:bg-black/30">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black p-10 text-white md:flex"
        >
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-extrabold">Welcome to PLEIS</h1>
            <p className="mx-auto max-w-sm text-lg text-gray-300">
              Your journey to productivity and collaboration starts here.
            </p>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-6 sm:p-8 md:w-1/2 md:p-14"
        >
          <h2 className="mb-1 text-center text-3xl font-extrabold sm:text-3xl">
            Create Account
          </h2>
          <p className="text-muted-foreground mb-6 text-center text-sm">
            Join Pleis and explore the future
          </p>

          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {step === 'basicInfo' && (
              <div className="space-y-4">
                <div>
                  <RHFTextField name="fname" placeholder="First Name" />
                  {validationErrors.fname && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.fname}
                    </p>
                  )}
                </div>

                <div>
                  <RHFTextField name="lname" placeholder="Last Name" />
                  {validationErrors.lname && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.lname}
                    </p>
                  )}
                </div>

                <div>
                  <RHFTextField
                    name="organizationName"
                    placeholder="Organization Name"
                  />
                  {validationErrors.organizationName && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.organizationName}
                    </p>
                  )}
                </div>

                <div>
                  <RHFTextField
                    name="email"
                    type="email"
                    placeholder="Email Address"
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <RHFTextField
                    name="password"
                    type="password"
                    placeholder="Password"
                    showPassword={open.value}
                    onTogglePassword={open.onToggle}
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <RHFTextField
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    showPassword={confirmOpen.value}
                    onTogglePassword={confirmOpen.onToggle}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <div>
                    <Controller
                      name="phone"
                      control={methods.control}
                      render={({ field }) => (
                        <div className="w-full">
                          <PhoneInput
                            country="pk"
                            value={
                              field.value
                                ? `${field.value.code}${field.value.number}`
                                : ''
                            } // Concatenate code and number
                            onChange={(value, countryData: any) => {
                              const phoneNumber = value.replace(
                                countryData.dialCode,
                                ''
                              );
                              field.onChange({
                                code: `+${countryData.dialCode}`,
                                number: phoneNumber,
                              });
                            }}
                            placeholder="Phone Number"
                            specialLabel=""
                            inputProps={{
                              required: true,
                              'aria-invalid': !!validationErrors.phone,
                            }}
                            containerClass="w-full"
                            buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                            inputClass={`
            file:text-foreground placeholder:text-muted-foreground
            selection:bg-primary selection:text-primary-foreground
            dark:bg-input/30 border-input !border-gray-100 dark:!border-gray-500 !shadow-sm
            flex !h-[42px] !w-full min-w-0 rounded-lg
            !bg-transparent px-3 py-1 text-base
            shadow-xs transition-[color,box-shadow]
            outline-none file:inline-flex file:h-7 file:border-0
            file:bg-transparent file:text-sm file:font-medium
            disabled:pointer-events-none disabled:cursor-not-allowed
            disabled:opacity-50 md:text-sm
            focus-visible:ring-ring/50 focus-visible:ring-[3px]
            aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
            aria-invalid:border-destructive
            ${validationErrors.phone ? 'border-destructive ring-destructive/40' : ''}
          `}
                          />
                        </div>
                      )}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.phone}
                    </p>
                  )}
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

            {step === 'businessDetails' && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="col-span-2">
                    <RHFTextField
                      name="companyName"
                      placeholder="Company Name"
                    />
                    {validationErrors.companyName && (
                      <p className="mt-1 text-xs text-red-500">
                        {validationErrors.companyName}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <RHFTextField name="oib" placeholder="VAT" />
                    {validationErrors.oib && (
                      <p className="mt-1 text-xs text-red-500">
                        {validationErrors.oib}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <RHFTextField
                      name="bankAccountNumber"
                      placeholder="Bank Account Number"
                    />
                    {validationErrors.bankAccountNumber && (
                      <p className="mt-1 text-xs text-red-500">
                        {validationErrors.bankAccountNumber}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <RHFTextField
                      name="representativeFullName"
                      placeholder="Representative Full Name"
                    />
                    {validationErrors.representativeFullName && (
                      <p className="mt-1 text-xs text-red-500">
                        {validationErrors.representativeFullName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <GoogleLocationInput
                    name="location"
                    label="Location"
                    showLabel={false}
                  />
                  {validationErrors.location && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.location}
                    </p>
                  )}
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

                  {validationErrors.suppliers && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.suppliers}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Controller
                    name="terms"
                    control={methods.control}
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
                <div>
                  {validationErrors.terms && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.terms}
                    </p>
                  )}
                </div>

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
              <Button
                variant="outline"
                className="h-[60px] w-[60px] cursor-pointer rounded-full py-3"
                type="button"
              >
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

              <Button
                variant="outline"
                className="h-[60px] w-[60px] cursor-pointer rounded-full"
                type="button"
              >
                <span className="flex h-6 w-6 items-center justify-center">
                  <Image
                    src="/images/googleIcon.png"
                    alt="Google"
                    className="h-[25px] w-[25px] object-contain"
                    width={40}
                    height={40}
                  />
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-[60px] w-[60px] cursor-pointer rounded-full"
                type="button"
              >
                <span className="flex h-6 w-6 items-center justify-center">
                  <Image
                    src="/images/metaIcon.png"
                    alt="Meta"
                    className="h-[25px] w-[25px] object-contain"
                    width={40}
                    height={40}
                  />
                </span>
              </Button>
            </div>
            <p className="mt-4 text-sm">
              Already have an account?{' '}
              <Link
                href="/"
                className="font-medium text-[#0f172b] hover:underline dark:text-white"
              >
                Login
              </Link>
            </p>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-xs">
            By signing up, you agree to our{' '}
            <Link
              href="/term-and-service"
              className="hover:text-primary underline transition-colors"
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy-policy"
              className="hover:text-primary underline transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>

      <Dialog open={modalOpen.value} onOpenChange={modalOpen.onToggle}>
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Account Created Successfully</DialogTitle>
            <DialogDescription className="mt-2">
              An activation link has been sent to your email. Please check your
              email (including the spam/junk folder) and click the link to
              activate your account.
              {/* <br />
              <br />
              <span className="text-md mx-auto w-full">
                Click Here To Verify Email <br />
                {emailVerificationLink ? (
                  <a
                    href={emailVerificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Verify Email
                  </a>
                ) : (
                  'Loading...'
                )}
              </span> */}
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
