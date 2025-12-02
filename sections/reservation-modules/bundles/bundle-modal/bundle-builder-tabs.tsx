import { Calendar, Package, Ticket } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfessionalDropdown } from './custom-dropdown';
import BundleItemsList from './bundle-item-list';
import { TicketData, ReservationData, MenuItemData } from './bundle-modal.types';

type BundleBuilderTabsProps = {
  activeTab: 'tickets' | 'reservations' | 'preorders';
  setActiveTab: (tab: 'tickets' | 'reservations' | 'preorders') => void;
  totalItems: number;
  tickets: any[];
  reservations: any[];
  preorders: any[];
  event: string;
  ticketOptions: any[];
  reservationOptions: any[];
  menuItemOptions: any[];
  ticketsData: TicketData[];
  reservationsData: ReservationData[];
  menuItemsData: MenuItemData[];
  isTicketsLoading: boolean;
  isReservationsLoading: boolean;
  isMenuItemsLoading: boolean;
  addTicket: (ticketId: string) => void;
  removeTicket: (index: number) => void;
  updateTicketQuantity: (index: number, quantity: number) => void;
  addReservation: (reservationId: string) => void;
  removeReservation: (index: number) => void;
  updateReservationQuantity: (index: number, quantity: number) => void;
  addPreorder: (menuItemId: string) => void;
  removePreorder: (index: number) => void;
  updatePreorderQuantity: (index: number, quantity: number) => void;
};

const BundleBuilderTabs = ({
  activeTab,
  setActiveTab,
  totalItems,
  tickets,
  reservations,
  preorders,
  event,
  ticketOptions,
  reservationOptions,
  menuItemOptions,
  ticketsData,
  reservationsData,
  menuItemsData,
  isTicketsLoading,
  isReservationsLoading,
  isMenuItemsLoading,
  addTicket,
  removeTicket,
  updateTicketQuantity,
  addReservation,
  removeReservation,
  updateReservationQuantity,
  addPreorder,
  removePreorder,
  updatePreorderQuantity,
}: BundleBuilderTabsProps) => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-gray-200 dark:text-black">
            2
          </div>
          <span className="dark:text-gray-100">Build Your Bundle</span>
        </h3>
        {totalItems > 0 && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {totalItems} items added
          </span>
        )}
      </div>

      <div className="dark:bg-secondary mb-6 flex gap-2 rounded-lg bg-white p-1">
        <button
          type="button"
          onClick={() => event && setActiveTab('tickets')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition ${
            activeTab === 'tickets'
              ? 'bg-[#272727] text-gray-100 shadow dark:bg-[#272727] dark:text-white'
              : 'cursor-pointer text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          } ${!event ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          aria-label="Tickets tab"
          disabled={!event}
        >
          <Ticket size={18} />
          Tickets
          {tickets?.length > 0 && (
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'tickets' ? 'bg-opacity-20 bg-white text-black' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {tickets?.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition ${
            activeTab === 'reservations'
              ? 'bg-[#272727] text-gray-100 shadow dark:bg-[#272727] dark:text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
          aria-label="Reservations tab"
        >
          <Calendar size={18} />
          Reservations
          {reservations.length > 0 && (
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'reservations' ? 'bg-opacity-20 bg-white text-black' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {reservations.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preorders')}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition ${
            activeTab === 'preorders'
              ? 'bg-[#272727] text-gray-100 shadow dark:bg-[#272727] dark:text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
          aria-label="Pre-orders tab"
        >
          <Package size={18} />
          Pre-orders
          {preorders.length > 0 && (
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'preorders' ? 'bg-opacity-20 bg-white text-black' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {preorders.length}
            </span>
          )}
        </button>
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'tickets' && (
          <div>
            {isTicketsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                {event && <ProfessionalDropdown options={ticketOptions} onSelect={addTicket} placeholder="+ Select a ticket to add" icon={Ticket} />}

                {!event ? (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <Ticket size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Please select an event before choosing a ticket.</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <Ticket size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No tickets added yet. Select from the dropdown above.</p>
                  </div>
                ) : (
                  <BundleItemsList items={tickets} type="ticket" data={ticketsData} onRemove={removeTicket} onUpdateQuantity={updateTicketQuantity} />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div>
            {isReservationsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                <ProfessionalDropdown
                  options={reservationOptions}
                  onSelect={addReservation}
                  placeholder="+ Select a reservation to add"
                  icon={Calendar}
                />

                {reservations.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No reservations added yet. Select from the dropdown above.</p>
                  </div>
                ) : (
                  <BundleItemsList
                    items={reservations}
                    type="reservation"
                    data={reservationsData}
                    onRemove={removeReservation}
                    onUpdateQuantity={updateReservationQuantity}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'preorders' && (
          <div>
            {isMenuItemsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                <ProfessionalDropdown
                  options={menuItemOptions}
                  onSelect={addPreorder}
                  placeholder="+ Select a pre-order item to add"
                  icon={Package}
                />

                {preorders.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <Package size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No pre-order items added yet. Select from the dropdown above.</p>
                  </div>
                ) : (
                  <BundleItemsList
                    items={preorders}
                    type="preorder"
                    data={menuItemsData}
                    onRemove={removePreorder}
                    onUpdateQuantity={updatePreorderQuantity}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleBuilderTabs;
