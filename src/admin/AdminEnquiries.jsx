import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { safeFetch } from '../utils/api';

export default function AdminEnquiries() {
  const { token } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await safeFetch('/api/enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok && res.data?.success && res.data?.enquiries) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await safeFetch(`/api/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok && res.data?.success) {
        fetchEnquiries();
      } else {
        alert(res.error || 'Failed to update status');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer enquiry record?')) return;
    try {
      const res = await safeFetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok && res.data?.success) {
        fetchEnquiries();
      } else {
        alert(res.error || 'Failed to delete enquiry');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredEnquiries = filterStatus === 'all'
    ? enquiries
    : enquiries.filter(e => e.status === filterStatus);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#163624]">
            Customer Booking Enquiries
          </h1>
          <p className="text-sm text-[#6B726D] mt-1">
            Review submissions sent through the website booking form.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5DFD7] text-xs font-semibold text-[#163624] hover:bg-[#FAF8F5] transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C69A52]" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'new', 'contacted', 'confirmed', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              filterStatus === st
                ? 'bg-[#163624] text-white shadow'
                : 'bg-white text-[#796E64] hover:bg-[#FAF8F5] border border-[#E5DFD7]'
            }`}
          >
            {st} ({st === 'all' ? enquiries.length : enquiries.filter(e => e.status === st).length})
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5DFD7] card-shadow">
          <Mail className="w-12 h-12 text-[#C69A52]/60 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-[#163624]">No enquiries found</h3>
          <p className="text-xs text-[#6B726D] mt-1">
            New submissions from the public website enquiry form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl p-6 border border-[#E5DFD7] card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl font-bold text-[#163624]">
                    {item.name}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    item.status === 'new'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : item.status === 'contacted'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : item.status === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B726D]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#C69A52]" />
                    <span className="font-semibold text-[#163624]">{item.phone}</span>
                  </span>

                  {item.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#796E64]" />
                      <span>{item.email}</span>
                    </span>
                  )}

                  {item.preferredDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#163624]" />
                      <span>Date: {item.preferredDate}</span>
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#163624]" />
                    <span>{item.guests || 'Standard group'}</span>
                  </span>
                </div>

                {item.message && (
                  <p className="text-xs text-[#4D433A] bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DFD7]/80">
                    "{item.message}"
                  </p>
                )}

                <span className="text-[10px] text-gray-400 block">
                  Received: {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#F3EFE9]">
                <a
                  href={`tel:${item.phone}`}
                  className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E7EFEA] text-[#163624] border border-[#E5DFD7] text-xs font-semibold flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1F4A32]" />
                  <span>Call</span>
                </a>

                <a
                  href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${item.name}, thank you for enquiring about Yashwant Farmhouse Nandwal. We would love to host you!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <select
                  value={item.status}
                  onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                  className="px-2 py-2 rounded-xl border border-[#E5DFD7] text-xs bg-white text-[#163624]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
