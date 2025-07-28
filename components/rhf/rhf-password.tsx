"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

interface RHFPasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const RHFPasswordField: FC<RHFPasswordFieldProps> = ({
  name,
  label,
  showPassword,
  onTogglePassword,
  ...props
}) => {
  const { control, watch } = useFormContext();
  const password = watch(name);

  const strength = getPasswordStrength(password || "");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-6">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                {...props}
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute top-2 right-2 text-muted-foreground"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </FormControl>
          <div className="">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((index) => {
                let barColor = "bg-gray-200"; // default (empty)

                if (password) {
                  if (strength.level > index) {
                    if (strength.level >= 4)
                      barColor = "bg-green-500"; // strong
                    else if (strength.level >= 3)
                      barColor = "bg-green-400"; // medium
                    else barColor = "bg-green-400"; // weak
                  }
                }

                return (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded transition-all duration-300 ${barColor}`}
                  />
                );
              })}
            </div>
            <p className="text-[13px] text-gray-200  mt-2">
              Use 8 or more characters with a mix of letters, numbers & symbols.
            </p>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFPasswordField;

export function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-green-400", level: 1 };
  if (score === 3 || score === 4)
    return { label: "Medium", color: "bg-green-400", level: 2 };
  return { label: "Strong", color: "bg-green-400", level: 3 };
}
