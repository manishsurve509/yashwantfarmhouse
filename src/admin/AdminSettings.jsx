import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  MessageSquare,
  MapPin,
  Compass,
  User,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteData } from '../context/SiteContext';
import { safeFetch } from '../utils/api';

export default function AdminSettings() {
  const { token } = useAuth();
  const { settings, refreshData } = useSiteData();

  const [form, setForm] = useState({
    farmhouseName: '',
    nameMarathi: '',
    tagline: '',
    owner: '',
    phonePrimary: '',
    phonePrimaryDisplay: '',
    phoneSecondary: '',
    phoneSecondaryDisplay: '',
    whatsappNumber: '',
    locationVillage: '',
    locationCity: '',
    locationState: '',
    locationFull: '',
    mapsUrl: '',
    mapsEmbedUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await safeFetch('/api/settings');
        if (res.ok && res.data?.success && res.data?.settings) {
          const s = res.data.settings;
          setForm({
            farmhouseName: s.farmhouseName || '',
            nameMarathi: s.nameMarathi || '',
            tagline: s.tagline || '',
            owner: s.owner || '',
            phonePrimary: s.phonePrimary || '',
            phonePrimaryDisplay: s.phonePrimaryDisplay || '',
            phoneSecondary: s.phoneSecondary || '',
            phoneSecondaryDisplay: s.phoneSecondaryDisplay || '',
            whatsappNumber: s.whatsappNumber || '',
            locationVillage: s.locationVillage || '',
            locationCity: s.locationCity || '',
            locationState: s.locationState || '',
            locationFull: s.locationFull || '',
            mapsUrl: s.mapsUrl || '',
            mapsEmbedUrl: s.mapsEmbedUrl || ''
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setForm((prev) => ({
        farmhouseName: settings.farmhouseName !== undefined ? settings.farmhouseName : prev.farmhouseName,
        nameMarathi: settings.nameMarathi !== undefined ? settings.nameMarathi : prev.nameMarathi,
        tagline: settings.tagline !== undefined ? settings.tagline : prev.tagline,
        owner: settings.owner !== undefined ? settings.owner : prev.owner,
        phonePrimary: settings.phonePrimary !== undefined ? settings.phonePrimary : prev.phonePrimary,
        phonePrimaryDisplay: settings.phonePrimaryDisplay !== undefined ? settings.phonePrimaryDisplay : prev.phonePrimaryDisplay,
        phoneSecondary: settings.phoneSecondary !== undefined ? settings.phoneSecondary : prev.phoneSecondary,
        phoneSecondaryDisplay: settings.phoneSecondaryDisplay !== undefined ? settings.phoneSecondaryDisplay : prev.phoneSecondaryDisplay,
        whatsappNumber: settings.whatsappNumber !== undefined ? settings.whatsappNumber : prev.whatsappNumber,
        locationVillage: settings.locationVillage !== undefined ? settings.locationVillage : prev.locationVillage,
        locationCity: settings.locationCity !== undefined ? settings.locationCity : prev.locationCity,
        locationState: settings.locationState !== undefined ? settings.locationState : prev.locationState,
        locationFull: settings.locationFull !== undefined ? settings.locationFull : prev.locationFull,
        mapsUrl: settings.mapsUrl !== undefined ? settings.mapsUrl : prev.mapsUrl,
        mapsEmbedUrl: settings.mapsEmbedUrl !== undefined ? settings.mapsEmbedUrl : prev.mapsEmbedUrl
      }));
    }
  }, [settings]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await safeFetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok || !res.data?.success) {
        throw new Error(res.error || res.data?.message || 'Failed to update settings');
      }

      await refreshData();
      showToast('Farmhouse settings updated successfully! Live website refreshed.');
    } catch (err) {
      setErrorMessage(err.message || 'Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#163624]">
          Farmhouse Settings
        </h1>
        <p className="text-sm text-[#6B726D] mt-1">
          Manage business name, contact phones, WhatsApp links, and physical address.
        </p>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand Information Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD7] card-shadow space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F3EFE9]">
            <Building className="w-5 h-5 text-[#1F4A32]" />
            <h2 className="font-serif text-xl font-bold text-[#163624]">
              Brand Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                Farmhouse Name (English)
              </label>
              <input
                type="text"
                name="farmhouseName"
                value={form.farmhouseName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                Farmhouse Name (Marathi)
              </label>
              <input
                type="text"
                name="nameMarathi"
                value={form.nameMarathi}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
              Owner / Primary Host Name
            </label>
            <input
              type="text"
              name="owner"
              value={form.owner}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
            />
          </div>
        </div>

        {/* Contact Numbers Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD7] card-shadow space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F3EFE9]">
            <Phone className="w-5 h-5 text-[#1F4A32]" />
            <h2 className="font-serif text-xl font-bold text-[#163624]">
              Phone Numbers & WhatsApp
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                Primary Phone (System E.164)
              </label>
              <input
                type="text"
                name="phonePrimary"
                value={form.phonePrimary}
                onChange={handleChange}
                placeholder="+918010042002"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                Primary Phone (Display Text)
              </label>
              <input
                type="text"
                name="phonePrimaryDisplay"
                value={form.phonePrimaryDisplay}
                onChange={handleChange}
                placeholder="80100 42002"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                Secondary Phone
              </label>
              <input
                type="text"
                name="phoneSecondary"
                value={form.phoneSecondary}
                onChange={handleChange}
                placeholder="+919975919947"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                Secondary Phone (Display Text)
              </label>
              <input
                type="text"
                name="phoneSecondaryDisplay"
                value={form.phoneSecondaryDisplay}
                onChange={handleChange}
                placeholder="99759 19947"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
              WhatsApp Number (Country code + 10 digits)
            </label>
            <input
              type="text"
              name="whatsappNumber"
              value={form.whatsappNumber}
              onChange={handleChange}
              placeholder="918010042002"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
            />
          </div>
        </div>

        {/* Location & Google Maps Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD7] card-shadow space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F3EFE9]">
            <MapPin className="w-5 h-5 text-[#1F4A32]" />
            <h2 className="font-serif text-xl font-bold text-[#163624]">
              Location & Maps Integration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                Village
              </label>
              <input
                type="text"
                name="locationVillage"
                value={form.locationVillage}
                onChange={handleChange}
                placeholder="Nandwal"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                City / District
              </label>
              <input
                type="text"
                name="locationCity"
                value={form.locationCity}
                onChange={handleChange}
                placeholder="Kolhapur"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
                State
              </label>
              <input
                type="text"
                name="locationState"
                value={form.locationState}
                onChange={handleChange}
                placeholder="Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
              Full Address
            </label>
            <input
              type="text"
              name="locationFull"
              value={form.locationFull}
              onChange={handleChange}
              placeholder="Nandwal, Kolhapur, Maharashtra, India"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
              Google Maps Share Link
            </label>
            <input
              type="text"
              name="mapsUrl"
              value={form.mapsUrl}
              onChange={handleChange}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#796E64] mb-1">
              Google Maps Iframe Embed URL
            </label>
            <input
              type="text"
              name="mapsEmbedUrl"
              value={form.mapsEmbedUrl}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD7] text-sm text-[#222B24]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-full bg-[#163624] hover:bg-[#102419] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow hover:shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#C69A52]" />
            <span>{loading ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
