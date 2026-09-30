import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin({ onBackToWebsite, onLoginSuccess }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Back to website button */}
      <button
        onClick={onBackToWebsite}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#163624] hover:text-[#C69A52] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#E5DFD7] shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Yashwant Farm</span>
      </button>

      {/* Main Split Login Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden card-shadow border border-[#E5DFD7] grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Visual Column */}
        <div className="md:col-span-5 relative hidden md:block">
          <img
            src="/images/farmhouse-exterior-2.jpg"
            alt="Yashwant Farmhouse Nandwal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102419]/95 via-[#163624]/80 to-[#163624]/60 mix-blend-multiply" />
          
          <div className="absolute inset-0 p-8 flex flex-col justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[#C69A52] font-serif font-bold text-lg border border-white/20">
                Y
              </div>
              <span className="font-serif text-lg font-bold tracking-wider">
                Yashwant Farm
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C69A52] block mb-1">
                Authorized Personnel Only
              </span>
              <h2 className="font-serif text-2xl font-bold mb-2">
                Farmhouse Management System
              </h2>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                Directly manage live calendar availability, seasonal pricing, gallery photos, and guest enquiries.
              </p>
            </div>

            <div className="text-[11px] text-white/50 pt-4 border-t border-white/15">
              📍 Nandwal, Kolhapur • Secure JWT Authentication
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#E7EFEA] text-[#163624] flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#1F4A32]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#C69A52] block mb-1">
              Management Portal
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#163624]">
              Admin Sign In
            </h1>
            <p className="text-xs sm:text-sm text-[#6B726D] mt-1">
              Please enter your authorized manager credentials to continue.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D433A] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#796E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yashwantfarm.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624] text-sm text-[#222B24] bg-[#FAF8F5]/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D433A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#796E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#E5DFD7] focus:outline-none focus:ring-2 focus:ring-[#163624] text-sm text-[#222B24] bg-[#FAF8F5]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#163624] hover:bg-[#102419] text-white font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow hover:shadow-md disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-[#C69A52]" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>

          </form>

          {/* Seed info notice for development */}
          <div className="mt-8 pt-6 border-t border-[#F3EFE9] text-center">
            <p className="text-[11px] text-[#796E64]">
              Default Admin: <code className="bg-[#E7EFEA] px-1.5 py-0.5 rounded text-[#163624] font-semibold">admin@yashwantfarm.com</code>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
