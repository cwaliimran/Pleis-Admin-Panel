import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  label?: string;
  className?: string;
}

function formatIBAN(raw: string): string {
  // Strip spaces, force uppercase, keep only alphanumeric
  const clean = raw.replace(/\s/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  //IBAN groups: 4 · 4 · 4 · 4 · 4 · 1  (total 21 chars without spaces)
  const parts = [
    clean.slice(0, 4),
    clean.slice(4, 8),
    clean.slice(8, 12),
    clean.slice(12, 16),
    clean.slice(16, 20),
    clean.slice(20, 21),
  ];
  return parts.filter(Boolean).join(' ');
}

const RHFIBANField: FC<Props> = ({ name, label, className }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder="HRkk bbbb bbbb cccc cccc c"
              className={`h-[40px] font-mono tracking-widest ${className ?? ''}`}
              maxLength={26} // 21 chars + 5 spaces
              onChange={(e) => {
                field.onChange(formatIBAN(e.target.value));
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFIBANField;
