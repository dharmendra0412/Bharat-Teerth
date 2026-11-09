import React, { useState, useRef, useEffect } from 'react';
import { usePilgrimage } from '../context/PilgrimageContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { playTempleBell } from '../utils/audio';
import { 
  Compass, 
  MapPin, 
  Map as MapIcon, 
  Bookmark, 
  ShieldCheck, 
  BookOpen, 
  Menu, 
  X, 
  User, 
  LogIn, 
  Bell, 
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onSelectTemple }) {
  const { plannedTemples } = usePilgrimage();
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t, currentLangInfo, allLanguages } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bellRinging, setBellRinging] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleRingBell = () => {
    setBellRinging(true);
    playTempleBell();
    setTimeout(() => setBellRinging(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBF8F3]/95 backdrop-blur-md border-b border-[#E8DFC8] shadow-sm transition-all">
      
      {/* 1. Top Auspicious Cultural Ribbon */}
      <div className="bg-[#6B121C] text-[#F9E8B2] text-xs py-1.5 px-4 sm:px-6 lg:px-8 font-medium tracking-wide border-b border-[#520B13]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Sanskrit Invocation & Subtitle */}
          <div className="flex items-center space-x-2 truncate">
            <span className="text-amber-300 font-serif text-sm">ॐ</span>
            <span className="truncate font-serif italic text-amber-100/90 text-[11px] sm:text-xs">
              {t('portalSubtitle')}
            </span>
          </div>

          {/* Right Cultural Actions & Telemetry */}
          <div className="flex items-center space-x-3 text-[11px] text-amber-200 shrink-0">
            
            {/* Sacred Bell Ring Action */}
            <button
              onClick={handleRingBell}
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full transition-all border ${
                bellRinging 
                  ? 'bg-amber-400 text-[#6B121C] border-white scale-105 shadow font-bold' 
                  : 'bg-white/10 hover:bg-white/20 text-amber-100 border-amber-300/30'
              }`}
              title="Ring the sacred temple bell"
            >
              <Bell className={`w-3 h-3 text-amber-300 ${bellRinging ? 'animate-bounce text-[#6B121C]' : ''}`} />
              <span className="hidden sm:inline font-sans text-[11px]">{t('ringBell')}</span>
            </button>

            <span className="hidden md:inline text-amber-400/50">•</span>

            <span className="hidden md:flex items-center space-x-1 text-amber-100/90">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('verifiedBadge')}</span>
            </span>

            <span className="hidden md:inline text-amber-400/50">•</span>

            <span className="text-amber-100 font-mono text-[11px]">
              IST {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

        </div>
      </div>

      {/* 2. Main Professional Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity Lockup */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            {/* Custom Architectural Vector Temple Crest */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#781822] via-[#8C1D2B] to-[#D35400] p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#520B13] rounded-[10px] flex items-center justify-center text-amber-200">
                <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v3M9 5h6M12 5l-5 6h10l-5-6zM6 11l-2 5h16l-2-5M4 16v6h16v-6M9 22v-4a3 3 0 0 1 6 0v4" />
                </svg>
              </div>
            </div>

            {/* Typography Lockup */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-lg tracking-wider text-[#781822] leading-none">
                  BHARAT TEERTH
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-100/90 text-[#781822] border border-amber-300/80">
                  Incredible India
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium tracking-wide mt-0.5 whitespace-nowrap">
                India Temple Heritage & Pilgrimage Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Single-Line, Non-wrapping) */}
          <nav className="hidden xl:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'home'
                  ? 'bg-[#781822] text-[#F9E8B2] shadow-sm'
                  : 'text-stone-700 hover:text-[#781822] hover:bg-[#F2EADB]'
              }`}
            >
              {t('navHome')}
            </button>

            <button
              onClick={() => handleNavClick('explore')}
              className={`whitespace-nowrap flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'explore'
                  ? 'bg-[#781822] text-[#F9E8B2] shadow-sm'
                  : 'text-stone-700 hover:text-[#781822] hover:bg-[#F2EADB]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('navExplore')}</span>
            </button>

            <button
              onClick={() => handleNavClick('circuits')}
              className={`whitespace-nowrap flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'circuits'
                  ? 'bg-[#781822] text-[#F9E8B2] shadow-sm'
                  : 'text-stone-700 hover:text-[#781822] hover:bg-[#F2EADB]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('navCircuits')}</span>
            </button>

            <button
              onClick={() => handleNavClick('map')}
              className={`whitespace-nowrap flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'map'
                  ? 'bg-[#781822] text-[#F9E8B2] shadow-sm'
                  : 'text-stone-700 hover:text-[#781822] hover:bg-[#F2EADB]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{t('navMap')}</span>
            </button>

            <button
              onClick={() => handleNavClick('guidelines')}
              className={`whitespace-nowrap flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'guidelines'
                  ? 'bg-[#781822] text-[#F9E8B2] shadow-sm'
                  : 'text-stone-700 hover:text-[#781822] hover:bg-[#F2EADB]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('navGuidelines')}</span>
            </button>
          </nav>

          {/* Action Cluster (Language + My Yatra + Admin) */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0">
            
            {/* Multilingual Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="whitespace-nowrap flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#D5C6A9] bg-white hover:bg-[#FAF6EC] text-xs font-bold text-stone-800 shadow-sm transition-all"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#D35400]" />
                <span>{currentLangInfo.flag} {currentLangInfo.native}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-white border border-[#E8DFC8] rounded-xl shadow-2xl py-2 z-50 animate-fadeIn scrollbar-thin">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 flex items-center justify-between">
                    <span>22 Official Languages + English</span>
                    <span className="text-[#D35400] font-mono">23</span>
                  </div>
                  <div className="py-1">
                    {allLanguages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                          language === l.code ? 'font-bold text-[#781822] bg-amber-100/50' : 'text-stone-700'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-sm">{l.flag}</span>
                          <span className="font-medium">{l.native}</span>
                          <span className="text-[10px] text-stone-400">({l.name})</span>
                        </span>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-[#781822]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* My Yatra Planner Button */}
            <button
              onClick={() => handleNavClick('planner')}
              className={`whitespace-nowrap relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'planner'
                  ? 'bg-[#781822] text-[#F9E8B2] border-[#781822] shadow'
                  : 'bg-white text-[#781822] border-[#D5C6A9] hover:bg-[#FAF6EC]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>{t('navYatra')}</span>
              {plannedTemples.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D35400] text-white text-[10px] flex items-center justify-center font-bold">
                  {plannedTemples.length}
                </span>
              )}
            </button>

            {/* Admin CMS Access */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'admin'
                      ? 'bg-[#781822] text-white shadow'
                      : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg text-xs"
                  title="Logout"
                >
                  <LogIn className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="whitespace-nowrap flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-[#781822] border border-[#D5C6A9] rounded-lg hover:border-[#781822] bg-white transition-all shadow-sm"
              >
                <LogIn className="w-3 h-3 text-[#D35400]" />
                <span>{t('navAdmin')}</span>
              </button>
            )}
          </div>

          {/* Mobile & Tablet Hamburger Toggle */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('planner')}
              className="relative p-2 text-[#781822]"
            >
              <Bookmark className="w-5 h-5 text-[#D35400]" />
              {plannedTemples.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#781822] text-white text-[10px] flex items-center justify-center font-bold">
                  {plannedTemples.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-[#F2EADB]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FBF8F3] border-b border-[#E8DFC8] px-4 pt-2 pb-6 space-y-2 shadow-lg">
          
          {/* Mobile Language Switcher */}
          <div className="pb-3 border-b border-[#E8DFC8]">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-[#D35400]" />
                <span>Languages of India ({allLanguages.length}):</span>
              </span>
              <span className="text-[#781822] font-semibold">{currentLangInfo.native}</span>
            </div>
            <div className="max-h-44 overflow-y-auto grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-[#DECFA9] scrollbar-thin">
              {allLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all truncate flex items-center justify-center space-x-1 ${
                    language === l.code 
                      ? 'bg-[#781822] text-[#F9E8B2] border-[#781822] font-bold shadow-sm' 
                      : 'bg-[#FAF6EC] text-stone-700 border-[#E8DFC8] hover:bg-[#F2EADB]'
                  }`}
                  title={`${l.native} (${l.name})`}
                >
                  <span className="text-xs">{l.flag}</span>
                  <span className="truncate">{l.native}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
              activeTab === 'home' ? 'bg-[#781822] text-[#F9E8B2]' : 'hover:bg-[#F2EADB]'
            }`}
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => handleNavClick('explore')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
              activeTab === 'explore' ? 'bg-[#781822] text-[#F9E8B2]' : 'hover:bg-[#F2EADB]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t('navExplore')}</span>
          </button>
          <button
            onClick={() => handleNavClick('circuits')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
              activeTab === 'circuits' ? 'bg-[#781822] text-[#F9E8B2]' : 'hover:bg-[#F2EADB]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t('navCircuits')}</span>
          </button>
          <button
            onClick={() => handleNavClick('map')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
              activeTab === 'map' ? 'bg-[#781822] text-[#F9E8B2]' : 'hover:bg-[#F2EADB]'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>{t('navMap')}</span>
          </button>
          <button
            onClick={() => handleNavClick('guidelines')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
              activeTab === 'guidelines' ? 'bg-[#781822] text-[#F9E8B2]' : 'hover:bg-[#F2EADB]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('navGuidelines')}</span>
          </button>
          <button
            onClick={() => handleNavClick('planner')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-100 text-[#781822]"
          >
            <span className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4" />
              <span>{t('navYatra')}</span>
            </span>
            <span className="px-2 py-0.5 text-xs bg-[#781822] text-white rounded-full">
              {plannedTemples.length}
            </span>
          </button>
          <div className="pt-2 border-t border-[#E8DFC8]">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-200/60 text-[#781822]"
            >
              <User className="w-4 h-4" />
              <span>{t('navAdmin')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
