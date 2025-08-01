"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import * as Yup from "yup";

import { ModeToggle } from "@/components/atoms/mode-toggle";
import FormProvider, { RHFSelectField, RHFTextField } from "@/components/rhf";
import { RHFMultiSelect } from "@/components/rhf/rhf-multiselect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useBoolean } from "@/hooks/useBoolean";
import Image from "next/image";

const defaultValues = {
  fname: "",
  lname: "",
  organizationName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  companyName: "",
  oib: "",
  bankAccountNumber: "",
  representativeFullName: "",
  address: "",
  postalCode: "",
  city: "",
  country: "",
  suppliers: [],
  terms: false,
};

// Step 1 validation
const basicInfoSchema = Yup.object().shape({
  fname: Yup.string().required("First name is required"),
  lname: Yup.string().required("Last name is required"),
  organizationName: Yup.string().required("Organization name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phone: Yup.string().required("Phone number is required"),
});

// Step 2 validation
const businessDetailsSchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  oib: Yup.string().required("OIB is required"),
  bankAccountNumber: Yup.string().required("Bank account number is required"),
  postalCode: Yup.string().required("Postal code is required"),
  representativeFullName: Yup.string().required(
    "Representative full name is required"
  ),
  address: Yup.string().required("Address is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  suppliers: Yup.array().min(1, "At least one supplier is required"),
  terms: Yup.bool()
    .oneOf([true], "You must accept terms and conditions")
    .required(),
});

const fullSchema = basicInfoSchema.concat(businessDetailsSchema);

function SignUpPage() {
  const open = useBoolean();
  const confirmOpen = useBoolean();

  const [step, setStep] = React.useState<"basicInfo" | "businessDetails">(
    "basicInfo"
  );

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(fullSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: any) => {
    console.log("Submitted data:", data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-slate-200 to-gray-100 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f] px-4">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden bg-white/30 dark:bg-black/30 backdrop-blur-md border">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1a1a1a] to-black text-white items-center justify-center p-10"
        >
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold">Welcome to PLEIS</h1>
            <p className="text-lg text-gray-300 max-w-sm mx-auto">
              Your journey to productivity and collaboration starts here.
            </p>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-6 sm:p-8 md:p-14"
        >
          <h2 className="text-3xl sm:text-3xl font-extrabold text-center mb-1">
            Create Account
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Join Pleis and explore the future
          </p>

          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {step === "basicInfo" && (
              <div className="space-y-4">
                <RHFTextField name="fname" placeholder="First Name" />
                <RHFTextField name="lname" placeholder="Last Name" />
                <RHFTextField
                  name="organizationName"
                  placeholder="Organization Name"
                />
                <RHFTextField
                  name="email"
                  type="email"
                  placeholder="Email Address"
                />
                <RHFTextField
                  name="password"
                  type="password"
                  placeholder="Password"
                  showPassword={open.value}
                  onTogglePassword={open.onToggle}
                />

                <RHFTextField
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  showPassword={confirmOpen.value}
                  onTogglePassword={confirmOpen.onToggle}
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
              ${
                fieldState.invalid
                  ? "border-destructive ring-destructive/40"
                  : ""
              }
            `}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Button
                  type="button"
                  onClick={async () => {
                    const valid = await basicInfoSchema.isValid(
                      methods.getValues()
                    );
                    if (valid) {
                      setStep("businessDetails");
                    } else {
                      methods.trigger([
                        "fname",
                        "lname",
                        "organizationName",
                        "email",
                        "password",
                        "confirmPassword",
                        "phone",
                      ]);
                    }
                  }}
                  className="w-full h-[45px] bg-[#0f172b] dark:bg-white  dark:text-black text-white cursor-pointer hover:dark:bg-white hover:bg-[#0f172b] transition-colors duration-200"
                  disabled={
                    !methods.watch("fname") ||
                    !methods.watch("lname") ||
                    !methods.watch("organizationName") ||
                    !methods.watch("email") ||
                    !methods.watch("password") ||
                    !methods.watch("confirmPassword") ||
                    !methods.watch("phone") ||
                    Object.keys(methods.formState.errors).some((key) =>
                      [
                        "fname",
                        "lname",
                        "organizationName",
                        "email",
                        "password",
                        "confirmPassword",
                        "phone",
                      ].includes(key)
                    )
                  }
                >
                  Next
                </Button>
              </div>
            )}

            {step === "businessDetails" && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <RHFTextField
                      name="companyName"
                      placeholder="Company Name"
                    />
                  </div>
                  <RHFTextField name="oib" placeholder="OIB" />
                  <RHFTextField name="postalCode" placeholder="Postal Code" />
                  <div className="col-span-2">
                    <RHFTextField
                      name="bankAccountNumber"
                      placeholder="Bank Account Number"
                    />
                  </div>

                  <div className="col-span-2">
                    <RHFTextField
                      name="representativeFullName"
                      placeholder="Representative Full Name"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <RHFTextField name="address" placeholder="Address" />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <RHFSelectField
                    name="country"
                    placeholder="Select Country"
                    className="w-full flex-1"
                    options={[{ label: "Croatia", value: "cr" }]}
                  />

                  <RHFSelectField
                    name="city"
                    placeholder="Select City"
                    className="w-full flex-1"
                    options={[
                      { label: "Zadar", value: "zadar" },
                      { label: "Pula", value: "pula" },
                      { label: "Hvar", value: "hvar" },
                    ]}
                  />
                </div>

                <div className="mt-4">
                  <RHFMultiSelect
                    name="suppliers"
                    placeholder="List of Suppliers"
                    options={[
                      { label: "Clubbing", value: "clubbing" },
                      { label: "Techno", value: "techno" },
                      { label: "House", value: "house" },
                    ]}
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Controller
                    name="terms"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border border-gray-800 dark:border-gray-400 cursor-pointer"
                        />
                        <Label className="cursor-pointer" htmlFor="terms">
                          Accept terms and conditions
                        </Label>
                        {fieldState.error && (
                          <p className="text-xs text-red-500 mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-[45px] cursor-pointer"
                    onClick={() => setStep("basicInfo")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-full h-[45px] bg-[#0f172b] dark:bg-white  dark:text-black text-white cursor-pointer hover:dark:bg-white hover:bg-[#0f172b] transition-colors duration-200"
                    disabled={
                      !methods.watch("companyName") ||
                      !methods.watch("oib") ||
                      !methods.watch("bankAccountNumber") ||
                      !methods.watch("postalCode") ||
                      !methods.watch("representativeFullName") ||
                      !methods.watch("address") ||
                      !methods.watch("country") ||
                      !methods.watch("city") ||
                      !methods.watch("suppliers") ||
                      !methods.watch("terms") ||
                      Object.keys(methods.formState.errors).some((key) =>
                        [
                          "companyName",
                          "oib",
                          "bankAccountNumber",
                          "postalCode",
                          "representativeFullName",
                          "address",
                          "country",
                          "city",
                          "suppliers",
                          "terms",
                        ].includes(key)
                      )
                    }
                  >
                    {methods.formState.isSubmitting
                      ? "Creating Account..."
                      : "Sign Up"}
                  </Button>
                </div>
              </>
            )}
          </FormProvider>

          {/* Social Auth Buttons */}
          <div className="text-center mt-8 text-muted-foreground text-sm">
            Or sign up with
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className="py-3 cursor-pointer h-[60px] w-[60px] rounded-full"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src="/images/appleIcon.png"
                    alt="Apple"
                    className="w-[25px] h-[25px] object-contain dark:hidden block"
                    width={25}
                    height={25}
                  />

                  <Image
                    src="/images/macIconDark.png"
                    alt="Apple"
                    className="w-[25px] h-[25px] object-contain dark:block hidden"
                    width={25}
                    height={25}
                  />
                </span>
              </Button>

              <Button
                variant="outline"
                className=" cursor-pointer h-[60px] w-[60px] rounded-full"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src="/images/googleIcon.png"
                    alt="Google"
                    className="w-[25px] h-[25px] object-contain"
                    width={25}
                    height={25}
                  />
                </span>
              </Button>

              <Button
                variant="outline"
                className=" cursor-pointer h-[60px] w-[60px] rounded-full"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src="/images/metaIcon.png"
                    alt="Meta"
                    className="w-[25px] h-[25px] object-contain"
                    width={25}
                    height={25}
                  />
                </span>
              </Button>
            </div>
            <p className="text-sm mt-4">
              Already have an account?{" "}
              <Link
                href="/user/signIn"
                className="text-[#0f172b] dark:text-white hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            By signing up, you agree to our{" "}
            <Link
              href="/term-and-service"
              className="underline hover:text-primary transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default SignUpPage;
