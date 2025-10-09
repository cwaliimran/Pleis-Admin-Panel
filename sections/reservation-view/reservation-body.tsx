'use client';

import { useState } from 'react';

const ReservationBody = () => {
  const [isExpanded, setIsExpanded] = useState(false);

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
              className={`cursor-pointer text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
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

            <div className="space-y-4">
              {pendingRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="dark:bg-secondary rounded-lg bg-gray-50 px-2 py-4 shadow-sm"
                  style={{
                    animation: isExpanded
                      ? `slideIn 0.4s ease-out ${index * 0.1}s backwards`
                      : 'none',
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    {/* User details */}
                    <div className="flex items-center justify-start gap-2">
                      <h4 className="text-2xl font-bold">{request.name}</h4>
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${request.memberColor}`}
                      >
                        {request.memberType}
                      </span>
                    </div>

                    {/* Date and Time */}
                    <div className="text-right">
                      <div className="text-gray-600">{request.date}</div>
                      <div className="text-lg font-semibold">
                        {request.time}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div>
                      <div className="mb-1 text-sm text-gray-500">
                        Reservation Type
                      </div>
                      <div className="text-lg font-bold">
                        {request.reservationType}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-gray-500">
                        Number of People
                      </div>
                      <div className="text-lg font-bold">
                        {request.numberOfPeople}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-gray-500">
                        Linked Ticket
                      </div>
                      <div className="text-lg font-bold">
                        {request.linkedTicket}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Accept
                    </button>
                    <button className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700">
                      Offer Upgrade
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-red-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
