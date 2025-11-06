import { FC } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const FilterPanel: FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <aside className={`fixed inset-0 z-40 overflow-y-auto bg-white transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <header className="flex items-center justify-between border-b p-5">
        <h2 className="text-xl font-bold">Filters</h2>
        <button title="button" type="button" onClick={onClose} className="text-blue-600">
          <X size={28} />
        </button>
      </header>

      <div className="space-y-6 p-5">
        {/* Example groups – expand as needed */}
        <div>
          <h3 className="mb-3 font-bold">Status</h3>
          {['Sent', 'Preparing', 'Delivered', 'Waiting for Payment'].map((s) => (
            <label key={s} className="mb-2 flex cursor-pointer items-center rounded-lg bg-gray-50 p-3">
              <input type="checkbox" className="mr-3 h-5 w-5" defaultChecked />
              <span>{s}</span>
            </label>
          ))}
        </div>
        {/* … more groups … */}
      </div>

      <footer className="grid grid-cols-2 gap-3 border-t p-5">
        <button title="button" type="button" className="rounded-xl bg-gray-100 py-3 font-bold">
          Clear All
        </button>
        <button title="button" type="button" className="rounded-xl bg-blue-600 py-3 font-bold text-white">
          Apply Filters
        </button>
      </footer>
    </aside>
  );
};
