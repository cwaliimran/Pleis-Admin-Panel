'use client';

import { Clock, Edit2, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { TimeSlot, TimeSlotsProps } from './types';

const TimeSlots: React.FC<TimeSlotsProps> = ({ slots, selectedTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4 dark:bg-[#1E1E1E]">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">{selectedTime}</span>
        </div>
        <div className="flex gap-2">
          <button
            title="Edit Reservation"
            type="button"
            className={`cursor-pointer text-black transition-transform duration-300 dark:text-black ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
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
        {slots.map((slot: TimeSlot) => (
          <div
            key={slot.id}
            className="dark:bg-secondary rounded-lg border bg-white p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{slot.name}</h4>
                  <p className="text-sm">Max {slot.maxGuests} guests</p>
                </div>
              </div>
              <button
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label={`Edit ${slot.name}`}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {slot.available}
                  </div>
                  <div className="text-xs">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {slot.booked}
                  </div>
                  <div className="text-xs">Booked</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  €{slot.price}
                </div>
                <div className="text-xs">
                  {slot.booked > 0 ? 'Fixed' : 'Prepay'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;
