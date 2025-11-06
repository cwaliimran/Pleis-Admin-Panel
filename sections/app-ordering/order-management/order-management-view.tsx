import React from 'react';

const OrderManagementView = () => {
  return <div>OrderManagementView</div>;
};

export default OrderManagementView;

// 'use client';

// import { useCallback, useState } from 'react';
// import { FilterPanel } from './filter-panel';
// import { Header } from './header';
// import { mockOrders } from './mockOrders';
// import { Modal } from './Modal';
// import { OrderCard } from './order-card';
// import { Tabs } from './tabs';
// import { useOrders } from './useOrders';

// export const OrderManagement = () => {
//   const { activeTab, setActiveTab, search, setSearch, isOrderingEnabled, setIsOrderingEnabled, orders, expandedId, toggleExpand } = useOrders();

//   const [filterOpen, setFilterOpen] = useState(false);
//   const [modal, setModal] = useState<{
//     open: boolean;
//     title: string;
//     body: string;
//     onConfirm: () => void;
//     confirmClass?: string;
//   }>({ open: false, title: '', body: '', onConfirm: () => {} });

//   const showModal = useCallback((title: string, body: string, onConfirm: () => void, confirmClass?: string) => {
//     setModal({ open: true, title, body, onConfirm, confirmClass });
//   }, []);

//   const handleToggleOrdering = (newState: boolean) => {
//     // const action = newState ? 'open' : 'close';

//     showModal(
//       `${newState ? 'Open' : 'Close'} In-App Ordering?`,
//       newState
//         ? 'Customers will be able to place new orders through the app.'
//         : 'Customers will not be able to place new orders. Existing orders will not be affected.',
//       () => setIsOrderingEnabled(newState),
//       newState ? 'bg-green-600' : 'bg-red-600'
//     );
//   };

//   const counts = {
//     active: mockOrders.active.length,
//     preorders: mockOrders.preorders.length,
//     past: mockOrders.past.length,
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <Header
//         search={search}
//         onSearch={setSearch}
//         orderingEnabled={isOrderingEnabled}
//         onOrderingChange={handleToggleOrdering}
//         onFilter={() => setFilterOpen(true)}
//         onMenu={() => alert('Menu editor (real app would navigate)')}
//       />

//       {/* Tabs */}
//       <Tabs active={activeTab} onChange={setActiveTab} counts={counts} />

//       {/* Orders Grid */}
//       <main className="mx-auto max-w-7xl p-5">
//         <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//           {orders.map((o: any) => (
//             <OrderCard
//               key={o.id}
//               order={o}
//               expanded={expandedId === o.id}
//               onToggle={() => toggleExpand(o.id)}
//               onAccept={() =>
//                 showModal(
//                   'Accept Order?',
//                   `Accept order from ${o.customerName} and start preparing?`,
//                   () => alert(`Accepted ${o.customerName}`),
//                   'bg-blue-600'
//                 )
//               }
//               onDelivered={() =>
//                 showModal(
//                   'Mark as Delivered?',
//                   `Confirm delivery to ${o.customerName} at ${o.deliveryLabel}?`,
//                   () => alert(`Delivered ${o.customerName}`),
//                   'bg-green-600'
//                 )
//               }
//               onPaid={() =>
//                 showModal('Confirm Payment?', `Mark order from ${o.customerName} as paid?`, () => alert(`Paid ${o.customerName}`), 'bg-green-600')
//               }
//               onCancel={() =>
//                 showModal(
//                   'Cancel Order?',
//                   `Are you sure you want to cancel the order from ${o.customerName}?`,
//                   () => alert(`Canceled ${o.customerName}`),
//                   'bg-red-600'
//                 )
//               }
//             />
//           ))}
//         </div>

//         {orders.length === 0 && (
//           <div className="py-16 text-center">
//             <p className="mb-4 text-6xl opacity-20">No orders</p>
//             <p className="text-xl font-bold text-gray-800">No orders found</p>
//             <p className="text-gray-600">Try adjusting filters or search.</p>
//           </div>
//         )}
//       </main>

//       {/* Modals & Panels */}
//       <Modal
//         open={modal.open}
//         title={modal.title}
//         onClose={() => setModal((s) => ({ ...s, open: false }))}
//         onConfirm={() => {
//           modal.onConfirm();
//           setModal((s) => ({ ...s, open: false }));
//         }}
//         confirmLabel="Confirm"
//         confirmClass={modal.confirmClass}
//       >
//         {modal.body}
//       </Modal>

//       <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />
//     </div>
//   );
// };
