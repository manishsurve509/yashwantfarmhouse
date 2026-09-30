import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  IndianRupee,
  Image as ImageIcon,
  Settings,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteData } from '../context/SiteContext';

export default function AdminLayout({ activeTab, setActiveTab, onNavigateWebsite, children }) {
  const { admin, logout } = useAuth();
  const { settings } = useSiteData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'availability', label: 'Availability', icon: Calendar },
    { id: 'prices', label: 'Prices & Rates', icon: IndianRupee },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'enquiries', label: 'Enquiries', icon: Mail },
  ];

  const handleMenuClick = (id) => {
    setActiveTab(id);
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigateWebsite();
  };

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#222B24] flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-[#132E20] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1F4A32] text-[#C69A52] flex items-center justify-center font-serif font-bold text-base border border-[#C69A52]/30">
            Y
          </div>
          <div>
            <span className="font-serif text-base font-bold uppercase tracking-wider block">
              Yashwant Farm
            </span>
            <span className="text-[10px] text-[#C69A52] tracking-widest block uppercase -mt-0.5">
              Admin Portal
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-white hover:bg-white/10"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Dark Green Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#132E20] text-white flex flex-col justify-between z-50 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shadow-2xl md:shadow-none border-r border-[#1B402C]`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-[#1E4331]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#1B402C] text-[#C69A52] flex items-center justify-center font-serif font-bold text-xl border border-[#C69A52]/40 shadow-inner">
                Y
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold uppercase tracking-wider text-white">
                  Yashwant Farm
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-[#C69A52] font-semibold">
                  Admin Management
                </p>
              </div>
            </div>

            {/* Current Manager Tag */}
            <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#183927] border border-[#235038] flex items-center justify-between text-xs text-white/80">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span className="truncate">{admin?.email || 'admin@yashwantfarm.com'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1F4A32] text-[#FAF8F5] shadow-sm font-semibold border-l-4 border-[#C69A52]'
                      : 'text-white/75 hover:bg-[#1B402C] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C69A52]' : 'text-white/60'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-[#1E4331] space-y-2">
          
          <button
            onClick={onNavigateWebsite}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-[#1B402C] transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#C69A52]" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>

        </div>
      </aside>

      {/* Main Content Area with Cream Background */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-7xl">
        {children}
      </main>

    </div>
  );
}
