'use client';

import React, { useState } from 'react';
import { CalendarStats, CalendarViewProps } from './types';
import { Check, Clock, Clock4 } from 'lucide-react';

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 9, 1)); // October 2025

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);

    return days;
  };

  const getBookingStats = (day: number): CalendarStats | null => {
    if (day === 15) return { slots: 2, pending: 2, booked: 1 };
    if (day === 20) return { slots: 1, pending: 0, booked: 0 };
    if (day === 10) return { slots: 0, pending: 0, booked: 0 };
    return null;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: number): void => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  const isToday = (day: number): boolean => {
    const today = new Date(2025, 9, 13);
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number | null): boolean => {
    if (!selectedDate || !day) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="cursor-pointer rounded-lg bg-gray-200 p-2 text-gray-900 transition-colors duration-300 hover:bg-gray-300"
            aria-label="Previous month"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="cursor-pointer rounded-lg bg-gray-200 p-2 text-gray-900 transition-colors duration-300 hover:bg-gray-300"
            aria-label="Next month"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const stats = day ? getBookingStats(day) : null;
          const selected = isSelected(day);
          const today = day ? isToday(day) : false;

          return (
            <div
              key={index}
              onClick={() =>
                day &&
                onDateSelect(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  )
                )
              }
              className={`min-h-[80px] cursor-pointer rounded-lg border p-2 transition-all ${
                !day
                  ? 'cursor-default bg-gray-50'
                  : 'hover:border-blue-300 hover:shadow-sm'
              } ${selected ? 'border-2 border-blue-500 bg-blue-50' : 'border-gray-200'} ${
                today ? 'bg-yellow-50' : ''
              } ${stats?.highlighted ? 'bg-yellow-100' : ''}`}
            >
              {day && (
                <div>
                  <div
                    className={`mb-1 text-sm font-medium ${selected ? 'text-blue-600' : 'text-gray-900'}`}
                  >
                    {day}
                  </div>
                  {stats && (
                    <div className="space-y-1">
                      {stats.slots > 0 && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Clock4 className="h-3 w-3" />
                          <span>{stats.slots} slot(s)</span>
                        </div>
                      )}
                      {stats.pending > 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <Clock className="h-3 w-3" />
                          <span>{stats.pending} pending</span>
                        </div>
                      )}
                      {stats.booked > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Check className="h-3 w-3" />
                          <span>{stats.booked} booked</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
