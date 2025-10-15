'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import QueryDialog from '@/components/comfirm-dialog/query-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useState } from 'react';

const ReservationBody = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteModal = useBoolean();
  const confirmModal = useBoolean();

  const pendingRequests = [
    {
      id: 1,
      name: 'John Smith',
      memberType: 'Gold Member',
      memberColor: 'bg-amber-50 text-amber-700 border border-amber-200',
      date: '2025-10-15',
      time: '20:00 - 23:00',
      reservationType: 'VIP Table',
      numberOfPeople: '6 guests',
      linkedTicket: 'VIP Event Pass',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      memberType: 'Silver Member',
      memberColor: 'bg-slate-50 text-slate-700 border border-slate-200',
      date: '2025-10-15',
      time: '21:00 - 00:00',
      reservationType: 'Lounge',
      numberOfPeople: '4 guests',
      linkedTicket: 'General Admission',
    },
    {
      id: 3,
      name: 'Mike Davis',
      memberType: 'Platinum Member',
      memberColor: 'bg-purple-50 text-purple-700 border border-purple-200',
      date: '2025-10-16',
      time: '22:00 - 01:00',
      reservationType: 'VIP Table',
      numberOfPeople: '8 guests',
      linkedTicket: 'VIP Event Pass',
    },
  ];

  return (
    <>
      <div className="dark:bg-secondary mt-5 flex flex-col rounded-xl border bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold">Lounge</h2>
            <div className="flex gap-12">
              <div>
                <div className="text-gray-500">Available</div>
                <div className="text-lg font-semibold">3 tables</div>
              </div>
              <div>
                <div className="text-gray-500">Max Capacity</div>
                <div className="text-lg font-semibold">6 people</div>
              </div>
              <div>
                <div className="text-gray-500">Condition</div>
                <div className="text-lg font-semibold">Prepay: €80</div>
              </div>
              <div>
                <div className="text-gray-500">Tax</div>
                <div className="text-lg font-semibold">13%</div>
              </div>
              <div>
                <div className="text-gray-500">Total Price</div>
                <div className="text-lg font-semibold text-green-600">
                  €90.40
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              title="Edit Reservation"
              type="button"
              className={`cursor-pointer text-black transition-transform duration-300 dark:text-white ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: isExpanded ? '2000px' : '0',
            opacity: isExpanded ? '1' : '0',
          }}
        >
          <div className="mt-6 border-t pt-6">
            <h3 className="mb-4 text-2xl font-bold">
              Pending Confirmation Requests
            </h3>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {pendingRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-sm dark:border-[#3c3a3aae] dark:bg-[#222121]"
                  style={{
                    animation: isExpanded
                      ? `slideIn 0.4s ease-out ${index * 0.1}s backwards`
                      : 'none',
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    {/* User details */}
                    <div className="flex items-center justify-start gap-2">
                      <h4 className="text-xl font-bold">{request.name}</h4>
                      <p
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${request.memberColor}`}
                      >
                        {request.memberType}
                      </p>
                    </div>

                    {/* Date and Time */}
                    <div className="text-right">
                      <div className="text-gray-600">{request.date}</div>
                      <div className="text-lg font-semibold">
                        {request.time}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-3">
                    <div>
                      <div className="mb-1 text-sm text-gray-500">
                        Reservation Type
                      </div>
                      <div className="text-md font-bold">
                        {request.reservationType}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-gray-500">
                        Number of People
                      </div>
                      <div className="text-md font-bold">
                        {request.numberOfPeople}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-gray-500">
                        Linked Ticket
                      </div>
                      <div className="text-md font-bold">
                        {request.linkedTicket}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={confirmModal.onTrue}
                      className={[
                        'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium',
                        'bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:ring-offset-2',
                        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
                      ].join(' ')}
                    >
                      <span aria-hidden="true">✔</span>
                      <span>Accept</span>
                    </button>

                    <button
                      type="button"
                      // onClick={confirmModal.onTrue}
                      className={[
                        'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium',
                        'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-offset-2',
                        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
                      ].join(' ')}
                    >
                      <span aria-hidden="true">⇪</span>
                      <span>Offer Upgrade</span>
                    </button>

                    <button
                      type="button"
                      onClick={deleteModal.onTrue}
                      className={[
                        'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium',
                        'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-red-600/50 focus-visible:ring-offset-2',
                        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
                      ].join(' ')}
                    >
                      <span aria-hidden="true">✕</span>
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <QueryDialog
        open={confirmModal.value}
        title="Accept Reservation"
        content="Are you sure you want to accept this reservation?"
        onClose={confirmModal.onFalse}
        onConfirm={confirmModal.onTrue}
        isLoading={false}
        btnClassName="bg-green-700 text-white"
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Reservation"
        content="Are you sure you want to delete this reservation?"
        onClose={() => {
          deleteModal.onFalse();
        }}
        onConfirm={() => {
          deleteModal.onFalse();
        }}
        isLoading={false}
      />

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ReservationBody;
