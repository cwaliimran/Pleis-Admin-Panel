import { FC } from 'react';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const ToggleSwitch: FC<Props> = ({ checked, onChange, label }) => {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-100 p-3">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`block h-8 w-12 rounded-full transition ${checked ? 'bg-green-500' : 'bg-gray-300'}`} />
        <div className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-sm transition ${checked ? 'translate-x-4' : ''}`} />
      </div>
    </label>
  );
};
