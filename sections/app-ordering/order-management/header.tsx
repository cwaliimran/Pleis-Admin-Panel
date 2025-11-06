import { FC } from 'react';
import { Search, Filter, Edit3 } from 'lucide-react';
import { ToggleSwitch } from './toggle-switch';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  orderingEnabled: boolean;
  onOrderingChange: (v: boolean) => void;
  onFilter: () => void;
  onMenu: () => void;
}

export const Header: FC<Props> = ({ search, onSearch, orderingEnabled, onOrderingChange, onFilter, onMenu }) => {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="flex items-center justify-between p-5">
        <h1 className="text-2xl font-bold md:text-3xl">Orders</h1>
        <div className="flex items-center gap-3">
          <button onClick={onFilter} className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold md:text-base">
            <Filter size={18} />
            Filter
          </button>
          <button onClick={onMenu} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:text-base">
            <Edit3 size={18} />
            Menu
          </button>
        </div>
      </div>

      <div className="px-5 pb-3">
        <ToggleSwitch label="In-App Ordering" checked={orderingEnabled} onChange={onOrderingChange} />
      </div>

      <div className="px-5 pb-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name, table, email..."
            className="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-12 outline-none focus:border-blue-600"
          />
        </div>
      </div>
    </header>
  );
};
