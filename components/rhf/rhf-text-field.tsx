import { FC } from "react"
import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { cn } from "@/lib/utils"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  type?: string
  rows?: number,
  multiline?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}

const RHFTextField: FC<Props> = ({ name, label, type = "text", showPassword, multiline, rows, ...props }) => {

  const { control } = useFormContext();
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type
  const onTogglePassword = props.onTogglePassword;

  return (
    <FormField
      control={control}
      name={name}

      render={({ field, fieldState: { error } }) => {
        return <FormItem className="">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              {multiline ? (
                <Textarea
                  {...field}
                  rows={rows}
                  className={cn(props.className
                  )}
                  {...(props as any)}
                />
              ) : (
                <Input
                  type={inputType}
                  className={props.className}
                  {...field}
                  {...props}
                />
              )}

              {isPassword && onTogglePassword && (
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-2 top-2 text-muted-foreground cursor-pointer"
                >
                  {!showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      }}
    />
  )
}

export default RHFTextField
