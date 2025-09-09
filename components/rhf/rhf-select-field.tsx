'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

interface Option {
  label: string;
  value: string;
}

interface RHFSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Make onChange optional
}

const RHFSelectField: FC<RHFSelectFieldProps> = ({
  name,
  label,
  placeholder = 'Select option',
  options,
  className = '',
  disabled = false,
  onChange, // Add onChange to destructured props
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={(val) => {
              // Only update if valid
              if (options.some((o) => o.value === val)) {
                field.onChange(val);
                // Call the optional onChange if provided
                if (onChange) {
                  // Create a synthetic event object to match the expected type
                  const syntheticEvent = {
                    target: { value: val },
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(syntheticEvent);
                }
              }
            }}
            value={field.value || ''}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={`w-full ${className}`}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="dark:bg-secondary">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Hidden input to support RHF blur + validation */}
          <input
            type="hidden"
            onBlur={field.onBlur}
            value={field.value || ''}
            name={field.name}
            ref={field.ref}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFSelectField;

// 'use client';

// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// import { FC } from 'react';
// import { useFormContext } from 'react-hook-form';

// interface Option {
//   label: string;
//   value: string;
// }

// interface RHFSelectFieldProps {
//   name: string;
//   label?: string;
//   placeholder?: string;
//   options: Option[];
//   className?: string;
//   disabled?: boolean;
// }

// const RHFSelectField: FC<RHFSelectFieldProps> = ({
//   name,
//   label,
//   placeholder = 'Select option',
//   options,
//   className = '',
//   disabled = false,
// }) => {
//   const { control } = useFormContext();

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           {label && <FormLabel>{label}</FormLabel>}
//           <Select
//             onValueChange={(val) => {
//               // Only update if valid
//               if (options.some((o) => o.value === val)) {
//                 field.onChange(val);
//               }
//             }}
//             value={field.value || ''}
//             disabled={disabled}
//           >
//             <FormControl>
//               <SelectTrigger className={`w-full ${className}`}>
//                 <SelectValue placeholder={placeholder} />
//               </SelectTrigger>
//             </FormControl>
//             <SelectContent className="dark:bg-secondary">
//               {options.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Hidden input to support RHF blur + validation */}
//           <input
//             type="hidden"
//             onBlur={field.onBlur}
//             value={field.value || ''}
//             name={field.name}
//             ref={field.ref}
//           />

//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

// export default RHFSelectField;
