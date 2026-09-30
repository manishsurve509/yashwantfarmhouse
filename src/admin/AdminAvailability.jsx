import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Plus,
  RefreshCw,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteData } from '../context/SiteContext';
import { safeFetch } from '../utils/api';

export default function AdminAvailability() {
  const { token } = useAuth();
  const { availability, refreshData } = useSiteData();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('available');
  const [notes, setNotes] = useState('');
  const [guestCount, setGuestCount] = useState(0);

  // Batch Range State
  const [batchStart, setBatchStart] = useState('');
  const [batchEnd, setBatchEnd] = useState('');
  const [batchStatus, setBatchStatus] = useState('booked');
  const [batchNotes, setBatchNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDateKey = (d) => {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getDateStatus = (dateKey) => {
    return availability?.[dateKey] || 'available';
  };

  const handleSelectDay = (dayNum) => {
    const dateKey = formatDateKey(dayNum);
    const status = getDateStatus(dateKey);
    setSelectedDate(dateKey);
    setSelectedStatus(status);
    setNotes('');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Save single date status
  const handleSaveSingleDate = async () => {
    if (!selectedDate) return;
    setLoading(true);

    try {
      const res = await safeFetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          status: selectedStatus,
          notes,
          guestCount: Number(guestCount)
        })
      });

      if (!res.ok || !res.data?.success) {
        throw new Error(res.error || res.data?.message || 'Failed to save date status');
      }

      await refreshData();
      showToast(`Date ${selectedDate} set to ${selectedStatus}. Public site updated!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset single date
  const handleResetDate = async (dateKey) => {
    setLoading(true);
    try {
      const res = await safeFetch(`/api/availability/${dateKey}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error(res.error || res.data?.message || 'Failed to reset date');

      await refreshData();
      if (selectedDate === dateKey) {
        setSelectedStatus('available');
      }
      showToast(`Date ${dateKey} reset to available.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save batch date range
  const handleSaveBatch = async (e) => {
    e.preventDefault();
    if (!batchStart || !batchEnd) {
      alert('Please select both start and end dates.');
      return;
    }

    const start = new Date(batchStart);
    const end = new Date(batchEnd);

    if (start > end) {
      alert('Start date must be before or equal to end date.');
      return;
    }

    const datesList = [];
    let cur = new Date(start);
    while (cur <= end) {
      datesList.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }

    setLoading(true);
    try {
      const res = await safeFetch('/api/availability/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dates: datesList,
          status: batchStatus,
          notes: batchNotes
        })
      });

      if (!res.ok || !res.data?.success) throw new Error(res.error || res.data?.message || 'Failed batch update');

      await refreshData();
      showToast(`Updated ${datesList.length} dates to ${batchStatus}!`);
      setBatchStart('');
      setBatchEnd('');
      setBatchNotes('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // List upcoming non-available dates
  const markedDates = Object.entries(availability || {})
    .filter(([_, status]) => status !== 'available')
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#163624]">
            Manage Availability
          </h1>
          <p className="text-sm text-[#6B726D] mt-1">
            Mark dates as Available, Booked, or Unavailable. Changes immediately appear on the public website.
          </p>
        </div>

        <button
          onClick={() => refreshData()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5DFD7] text-xs font-semibold text-[#163624] hover:bg-[#FAF8F5] transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C69A52]" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Calendar & Date Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Calendar Column (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD7] card-shadow">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5DFD7]">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-[#E5DFD7] hover:bg-[#FAF8F5] text-[#163624]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#163624]">
              {monthNames[month]} {year}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-[#E5DFD7] hover:bg-[#FAF8F5] text-[#163624]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[#796E64] uppercase">
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="h-16 rounded-xl bg-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateKey = formatDateKey(dayNum);
              const status = getDateStatus(dateKey);
              const isSelected = selectedDate === dateKey;

              let bgClasses = 'bg-[#F0F7F2] border-[#86EFAC]/70 text-[#163624] hover:bg-[#DCFCE7]';
              let dotColor = 'bg-[#16A34A]';

              if (status === 'booked') {
                bgClasses = 'bg-red-50 border-red-200 text-red-950 hover:bg-red-100';
                dotColor = 'bg-[#DC2626]';
              } else if (status === 'unavailable') {
                bgClasses = 'bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100';
                dotColor = 'bg-[#D97706]';
              }

              return (
                <button
                  key={dayNum}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-16 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${bgClasses} ${
                    isSelected ? 'ring-2 ring-[#163624] scale-105 z-10 shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs sm:text-sm">{dayNum}</span>
                    <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                  </div>
                  <span className="text-[10px] font-medium capitalize truncate block opacity-85">
                    {status}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Info underneath */}
          <div className="mt-6 pt-4 border-t border-[#F3EFE9] flex items-center justify-between text-xs text-[#796E64]">
            <p>Click on any date to change its booking status on the right.</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">🟢 Available</span>
              <span className="flex items-center gap-1">🔴 Booked</span>
              <span className="flex items-center gap-1">🟡 Unavailable</span>
            </div>
          </div>

        </div>

        {/* Action Panel Column (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Selected Date Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DFD7] card-shadow">
            <h3 className="font-serif text-lg font-bold text-[#163624] mb-3">
              {selectedDate ? `Date: ${selectedDate}` : 'Select a Date'}
            </h3>

            {selectedDate ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1.5">
                    Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'available', label: '🟢 Free', bg: 'hover:bg-emerald-50' },
                      { val: 'booked', label: '🔴 Booked', bg: 'hover:bg-red-50' },
                      { val: 'unavailable', label: '🟡 Closed', bg: 'hover:bg-amber-50' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setSelectedStatus(opt.val)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                          selectedStatus === opt.val
                            ? 'bg-[#163624] text-white border-[#163624]'
                            : `bg-white text-[#222B24] border-[#E5DFD7] ${opt.bg}`
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1.5">
                    Admin Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Ramesh Family Booking"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleSaveSingleDate}
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#163624] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#102419] transition-all shadow disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Date'}
                  </button>

                  <button
                    onClick={() => handleResetDate(selectedDate)}
                    disabled={loading}
                    title="Reset to Available"
                    className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#796E64] leading-relaxed">
                Click any day on the calendar to mark it as Booked, Unavailable, or Available.
              </p>
            )}
          </div>

          {/* Batch Date Range Updater */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DFD7] card-shadow">
            <h3 className="font-serif text-lg font-bold text-[#163624] mb-1">
              Batch Date Update
            </h3>
            <p className="text-xs text-[#6B726D] mb-4">
              Update multiple consecutive days at once.
            </p>

            <form onSubmit={handleSaveBatch} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#796E64] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={batchStart}
                  onChange={(e) => setBatchStart(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DFD7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#796E64] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={batchEnd}
                  onChange={(e) => setBatchEnd(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DFD7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#796E64] mb-1">
                  Set Status
                </label>
                <select
                  value={batchStatus}
                  onChange={(e) => setBatchStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DFD7]"
                >
                  <option value="booked">🔴 Booked</option>
                  <option value="available">🟢 Available</option>
                  <option value="unavailable">🟡 Unavailable</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#C69A52] hover:bg-[#b08846] text-black font-semibold text-xs uppercase tracking-wider transition-colors shadow"
              >
                Apply Range Status
              </button>
            </form>
          </div>

          {/* Booked Dates Summary */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DFD7] card-shadow">
            <h3 className="font-serif text-lg font-bold text-[#163624] mb-3">
              Upcoming Booked Dates ({markedDates.length})
            </h3>

            {markedDates.length === 0 ? (
              <p className="text-xs text-[#6B726D]">No dates currently marked booked.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {markedDates.map(([dKey, st]) => (
                  <div
                    key={dKey}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD7] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#163624] block">{dKey}</span>
                      <span className={`text-[10px] capitalize font-medium ${
                        st === 'booked' ? 'text-red-700' : 'text-amber-700'
                      }`}>
                        {st}
                      </span>
                    </div>

                    <button
                      onClick={() => handleResetDate(dKey)}
                      className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Clear reservation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
