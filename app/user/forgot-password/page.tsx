"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { ModeToggle } from "@/components/atoms/mode-toggle";
import FormProvider, { RHFTextField } from "@/components/rhf";
import { Button } from "@/components/ui/button";

const defaultValues = {
  email: "",
};

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

function ForgotPasswordPage() {
  const router = useRouter();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    console.log("data", data);
    if (data.email) {
      router.push("/user/reset-password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-slate-200 to-gray-100 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f] px-4 text-foreground relative">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden bg-white/30 dark:bg-black/30 backdrop-blur-md border border-border transition-all">
        {/* ---------------- Left Branding ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1a1a1a] to-black text-white items-center justify-center p-10"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-lg text-gray-300 max-w-sm mx-auto">
              We’ll send you a reset link via email.
            </p>
          </div>
        </motion.div>

        {/* ---------------- Right Form ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-extrabold text-center mb-1">
            Reset Your Password
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter your email and we’ll send you instructions to reset it.
          </p>

          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <RHFTextField
                name="email"
                type="email"
                placeholder="Email Address"
                className="rounded-md h-[45px]"
              />

              <Button
                type="submit"
                className=" w-full h-[45px] bg-[#0f172b] dark:bg-white  dark:text-black text-white cursor-pointer hover:dark:bg-white hover:bg-[#0f172b] transition-colors duration-200"
              >
                {methods.formState.isSubmitting
                  ? "Sending Reset Link..."
                  : "Send Reset Link"}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Remember your password?{" "}
                <Link
                  href="/user/signIn"
                  className="text-[#0f172b] dark:text-white hover:underline font-medium"
                >
                  Go back to login
                </Link>
              </p>
            </div>
          </FormProvider>

          <p className="mt-10 text-xs text-muted-foreground text-center">
            By continuing, you agree to our{" "}
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
export default ForgotPasswordPage;
