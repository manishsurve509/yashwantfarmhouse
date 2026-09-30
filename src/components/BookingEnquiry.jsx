import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, CheckCircle2, AlertCircle, Phone, Calendar, User, Mail, Users } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function BookingEnquiry({ prefilledDate }) {
  const { settings, submitEnquiry } = useSiteData();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    guests: '5-10 Guests',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (prefilledDate) {
      setFormData((prev) => ({ ...prev, date: prefilledDate }));
    }
  }, [prefilledDate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await submitEnquiry(formData);
      setSuccessMessage('Thank you! Your enquiry has been sent to Yashwant Farm management. We will contact you promptly.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        guests: '5-10 Guests',
        message: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Could not send enquiry. Please try WhatsApp directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const parts = [
      'Hello Yashwant Farm! I would like to enquire about booking the farmhouse.',
      formData.name ? `Name: ${formData.name}` : '',
      formData.phone ? `Phone: ${formData.phone}` : '',
      formData.date ? `Preferred Date: ${formData.date}` : '',
      formData.guests ? `Number of Guests: ${formData.guests}` : '',
      formData.message ? `Notes: ${formData.message}` : ''
    ].filter(Boolean);

    return encodeURIComponent(parts.join('\n'));
  };

  const whatsappLink = `https://wa.me/${settings?.whatsappNumber || '918010042002'}?text=${generateWhatsAppMessage()}`;

  return (
    <section id="enquiry" className="py-20 sm:py-28 bg-[#F3EFE9]/40 border-t border-[#E5DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-2">
            Plan Your Stay
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#163624] mb-4">
            Book / Enquire
          </h2>
          <div className="divider-ornament my-4">
            <span className="text-[#C69A52] text-xs">✉</span>
          </div>
          <p className="text-[#6B726D] text-base sm:text-lg font-light leading-relaxed">
            Send us your preferred dates and group size. We will respond with availability and details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DFD7] card-shadow">
            
            {successMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D433A] mb-1.5">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#796E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624] text-sm text-[#222B24] bg-[#FAF8F5]/50"
                  />
                </div>
              </div>

              {/* Phone Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D433A] mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#796E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624] text-sm text-[#222B24] bg-[#FAF8F5]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D433A] mb-1.5">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#796E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624] text-sm text-[#222B24] bg-[#FAF8F5]/50"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Date & Number of Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D433A] mb-1.5">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#796E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624] text-sm text-[#222B24] bg-[#FAF8F5]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D433A] mb-1.5">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#796E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624] text-sm text-[#222B24] bg-[#FAF8F5]/50"
                    >
                      <option value="1-5 Guests">1 - 5 Guests</option>
                      <option value="5-10 Guests">5 - 10 Guests (Standard)</option>
                      <option value="10-15 Guests">10 - 15 Guests</option>
                      <option value="15-25 Guests">15 - 25 Guests</option>
                      <option value="Day Visit Only">Day Outing / Picnic Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D433A] mb-1.5">
                  Message / Special Requests
                </label>
                <textarea
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your event, family gathering, timing, or questions..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624] text-sm text-[#222B24] bg-[#FAF8F5]/50 resize-none"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#163624] hover:bg-[#102419] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#C69A52]" />
                  <span>{submitting ? 'Sending Enquiry...' : 'Send Enquiry'}</span>
                </button>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm tracking-wider transition-all flex items-center justify-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>

            </form>

          </div>

          {/* Direct Contact & Helpful Tips Sidecard */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#163624] text-white rounded-3xl p-8 card-shadow">
              <span className="text-xs uppercase tracking-widest text-[#C69A52] font-semibold block mb-2">
                Fastest Response
              </span>
              <h3 className="font-serif text-2xl font-bold mb-3">
                Prefer an instant phone or WhatsApp answer?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                You can call the farmhouse owner directly or send a message on WhatsApp for instant confirmation.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${settings?.phonePrimary || '+918010042002'}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#C69A52]" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block">Primary Mobile</span>
                    <span className="font-bold text-sm">{settings?.phonePrimaryDisplay || '80100 42002'}</span>
                  </div>
                </a>

                <a
                  href={`tel:${settings?.phoneSecondary || '+919975919947'}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#C69A52]" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block">Alternative Mobile</span>
                    <span className="font-bold text-sm">{settings?.phoneSecondaryDisplay || '99759 19947'}</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '918010042002'}?text=Hello%20Yashwant%20Farm%2C%20I%20would%20like%20to%20enquire%20about%20availability.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/80 block">Direct WhatsApp</span>
                    <span className="font-bold text-sm">Chat with Manager</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick check-in note */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5DFD7]">
              <h4 className="font-serif text-lg font-bold text-[#163624] mb-2">
                Booking Information
              </h4>
              <ul className="text-xs text-[#6B726D] space-y-2">
                <li>• Farmhouse check-in & check-out timings are flexible upon request.</li>
                <li>• Advance confirmation is recommended for weekends and holiday dates.</li>
                <li>• Kitchen facility available for self-cooking or bringing your own caterer.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
