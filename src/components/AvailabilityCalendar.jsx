import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function AvailabilityCalendar({ onSelectDate }) {
  const { availability, settings } = useSiteData();

  // Navigation state for month and year
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate calendar grid for this month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateKey = (d) => {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getDateStatus = (dateKey) => {
    // If backend has a status record for this date, return it
    if (availability && availability[dateKey]) {
      const val = availability[dateKey];
      return typeof val === 'string' ? val : (val.status || 'available');
    }
    // Default to available
    return 'available';
  };

  const isPastDate = (dayNum) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(year, month, dayNum);
    return dateToCheck < today;
  };

  const handleDayClick = (dayNum) => {
    if (isPastDate(dayNum)) return;
    const dateKey = formatDateKey(dayNum);
    const status = getDateStatus(dateKey);
    setSelectedDate({ dateKey, status, dayNum });
    if (onSelectDate) {
      onSelectDate(dateKey, status);
    }
  };

  return (
    <section id="availability" className="py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#E5DFD7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-2">
            Live Calendar
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#163624] mb-4">
            Farmhouse Availability
          </h2>
          <div className="divider-ornament my-4">
            <span className="text-[#C69A52] text-xs">📅</span>
          </div>
          <p className="text-[#6B726D] text-base sm:text-lg font-light leading-relaxed">
            Check real-time farmhouse dates. Click any open date to begin your booking enquiry.
          </p>
        </div>

        {/* Legend Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5DFD7] card-shadow mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#163624]">
            <CalendarIcon className="w-4 h-4 text-[#C69A52]" />
            <span>Date Status Legend:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#16A34A] ring-4 ring-[#16A34A]/20 inline-block"></span>
              <span className="font-medium text-[#163624]">🟢 Available</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#DC2626] ring-4 ring-[#DC2626]/20 inline-block"></span>
              <span className="font-medium text-[#163624]">🔴 Booked</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] ring-4 ring-[#D97706]/20 inline-block"></span>
              <span className="font-medium text-[#163624]">🟡 Unavailable</span>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DFD7] card-shadow">
          
          {/* Calendar Header with Controls */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5DFD7]">
            <button
              onClick={handlePrevMonth}
              className="p-2 sm:p-2.5 rounded-xl border border-[#E5DFD7] hover:bg-[#FAF8F5] text-[#163624] transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#163624]">
              {monthNames[month]} {year}
            </h3>

            <button
              onClick={handleNextMonth}
              className="p-2 sm:p-2.5 rounded-xl border border-[#E5DFD7] hover:bg-[#FAF8F5] text-[#163624] transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-3 text-center">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#796E64] py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            
            {/* Blank leading slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="h-14 sm:h-20 rounded-xl bg-transparent" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNum = index + 1;
              const dateKey = formatDateKey(dayNum);
              const past = isPastDate(dayNum);
              const status = past ? 'past' : getDateStatus(dateKey);
              const isSelected = selectedDate?.dateKey === dateKey;

              let bgClasses = 'bg-[#FAF8F5] border-[#E5DFD7] text-[#163624]';
              let statusLabel = 'Available';
              let dotColor = 'bg-[#16A34A]';

              if (past) {
                bgClasses = 'bg-gray-100/60 border-gray-200 text-gray-400 cursor-not-allowed';
                statusLabel = 'Past';
                dotColor = 'bg-gray-300';
              } else if (status === 'booked') {
                bgClasses = 'bg-red-50/70 border-red-200 text-red-950 cursor-pointer hover:bg-red-100/80';
                statusLabel = 'Booked';
                dotColor = 'bg-[#DC2626]';
              } else if (status === 'unavailable') {
                bgClasses = 'bg-amber-50/70 border-amber-200 text-amber-950 cursor-pointer hover:bg-amber-100/80';
                statusLabel = 'Unavailable';
                dotColor = 'bg-[#D97706]';
              } else {
                bgClasses = 'bg-[#F0F7F2] border-[#86EFAC]/70 text-[#163624] cursor-pointer hover:bg-[#DCFCE7]';
                statusLabel = 'Available';
                dotColor = 'bg-[#16A34A]';
              }

              return (
                <div
                  key={dayNum}
                  onClick={() => handleDayClick(dayNum)}
                  className={`h-16 sm:h-22 p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative group ${bgClasses} ${
                    isSelected ? 'ring-2 ring-[#163624] scale-[1.03] shadow-md z-10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm sm:text-base">
                      {dayNum}
                    </span>
                    {!past && (
                      <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                    )}
                  </div>

                  <span className="text-[10px] sm:text-xs font-medium block truncate capitalize opacity-85">
                    {statusLabel}
                  </span>
                </div>
              );
            })}

          </div>

          {/* Selected Date Callout */}
          {selectedDate && (
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#E7EFEA] border border-[#C69A52]/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#163624] text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#796E64] uppercase tracking-wider">
                    Selected Date
                  </p>
                  <p className="font-serif text-lg font-bold text-[#163624]">
                    {selectedDate.dateKey} — Status:{' '}
                    <span className="capitalize">{selectedDate.status}</span>
                  </p>
                </div>
              </div>

              {selectedDate.status === 'available' ? (
                <a
                  href="#enquiry"
                  className="px-6 py-2.5 rounded-full bg-[#163624] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#102419] transition-all shadow"
                >
                  Enquire for this date
                </a>
              ) : (
                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '918010042002'}?text=Hello%2C%20I%20saw%20that%20date%20${selectedDate.dateKey}%20is%20marked%20${selectedDate.status}.%20Can%20you%20confirm%20or%20suggest%20alternative%20dates?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#25D366] text-white font-semibold text-xs tracking-wider hover:bg-[#20ba5a] transition-all shadow flex items-center gap-1.5"
                >
                  Ask manager on WhatsApp
                </a>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
