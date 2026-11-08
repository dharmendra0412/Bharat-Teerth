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
    <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-vedic-gold/20 shadow-sm transition-all">
      {/* Top Auspicious Cultural Ribbon */}
      <div className="bg-gradient-to-r from-vedic-maroon via-vedic-saffron to-vedic-maroon text-white text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-vedic-gold font-serif text-sm">ॐ</span>
            <span className="truncate">{t('portalSubtitle')}</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-vedic-goldLight">
            
            {/* Sacred Bell Ring Action */}
            <button
              onClick={handleRingBell}
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full transition-all border ${
                bellRinging 
                  ? 'bg-vedic-gold text-vedic-maroon border-white scale-105' 
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Ring the sacred temple bell"
            >
              <Bell className={`w-3.5 h-3.5 text-vedic-gold ${bellRinging ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{t('ringBell')}</span>
            </button>

            <span className="hidden md:inline">•</span>

            <span className="hidden md:flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-vedic-gold" />
              <span>{t('verifiedBadge')}</span>
            </span>

            <span className="hidden md:inline">•</span>

            <span className="text-white/80 font-mono">IST {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Portal Identity */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vedic-saffron to-vedic-maroon p-0.5 shadow-md shadow-vedic-saffron/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#1A0B09] rounded-[10px] flex items-center justify-center text-2xl">
                🛕
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-xl text-vedic-maroon tracking-tight">
                  {t('portalName').toUpperCase()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-vedic-saffronLight text-vedic-saffronDark font-semibold uppercase tracking-wider border border-vedic-saffron/30">
                  Incredible India
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium tracking-wide">
                {t('portalSubtitle')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-vedic-saffron/10 text-vedic-saffronDark font-semibold shadow-sm'
                  : 'text-stone-700 hover:text-vedic-saffronDark hover:bg-stone-50'
              }`}
            >
              {t('navHome')}
            </button>

            <button
              onClick={() => handleNavClick('explore')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-vedic-saffron/10 text-vedic-saffronDark font-semibold shadow-sm'
                  : 'text-stone-700 hover:text-vedic-saffronDark hover:bg-stone-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('navExplore')}</span>
            </button>

            <button
              onClick={() => handleNavClick('circuits')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'circuits'
                  ? 'bg-vedic-saffron/10 text-vedic-saffronDark font-semibold shadow-sm'
                  : 'text-stone-700 hover:text-vedic-saffronDark hover:bg-stone-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t('navCircuits')}</span>
            </button>

            <button
              onClick={() => handleNavClick('map')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-vedic-saffron/10 text-vedic-saffronDark font-semibold shadow-sm'
                  : 'text-stone-700 hover:text-vedic-saffronDark hover:bg-stone-50'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{t('navMap')}</span>
            </button>

            <button
              onClick={() => handleNavClick('guidelines')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'guidelines'
                  ? 'bg-vedic-saffron/10 text-vedic-saffronDark font-semibold shadow-sm'
                  : 'text-stone-700 hover:text-vedic-saffronDark hover:bg-stone-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('navGuidelines')}</span>
            </button>
          </nav>

          {/* Action Buttons: Language Selector + My Yatra + Admin Portal */}
          <div className="hidden lg:flex items-center space-x-2.5">
            
            {/* Multilingual Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-vedic-gold/40 bg-white hover:bg-vedic-saffronLight/20 text-xs font-semibold text-stone-700 shadow-sm transition-all"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-vedic-saffron" />
                <span>{currentLangInfo.flag} {currentLangInfo.native}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-white border border-stone-200 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn scrollbar-thin">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 flex items-center justify-between">
                    <span>22 Official Languages + English</span>
                    <span className="text-vedic-saffron">23</span>
                  </div>
                  <div className="py-1">
                    {allLanguages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-vedic-saffronLight/20 transition-colors ${
                          language === l.code ? 'font-bold text-vedic-maroon bg-vedic-saffronLight/30' : 'text-stone-700'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-sm">{l.flag}</span>
                          <span className="font-medium">{l.native}</span>
                          <span className="text-[10px] text-stone-400">({l.name})</span>
                        </span>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-vedic-maroon" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* My Yatra Planner Button */}
            <button
              onClick={() => handleNavClick('planner')}
              className={`relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                activeTab === 'planner'
                  ? 'bg-vedic-maroon text-white border-vedic-maroon shadow-md'
                  : 'bg-white text-vedic-maroon border-vedic-gold/40 hover:bg-vedic-goldLight'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-vedic-gold" />
              <span>{t('navYatra')}</span>
              {plannedTemples.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-vedic-saffron text-white text-[10px] flex items-center justify-center font-bold">
                  {plannedTemples.length}
                </span>
              )}
            </button>

            {/* Admin CMS Access */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === 'admin'
                      ? 'bg-vedic-saffronDark text-white shadow'
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
                className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-stone-500 hover:text-vedic-maroon border border-dashed border-stone-300 rounded-lg hover:border-vedic-saffron transition-all"
              >
                <LogIn className="w-3 h-3" />
                <span>{t('navAdmin')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('planner')}
              className="relative p-2 text-vedic-maroon"
            >
              <Bookmark className="w-5 h-5 text-vedic-saffron" />
              {plannedTemples.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-vedic-maroon text-white text-[10px] flex items-center justify-center font-bold">
                  {plannedTemples.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-vedic-gold/20 px-4 pt-2 pb-6 space-y-2">
          
          {/* Mobile Language Switcher */}
          <div className="pb-3 border-b border-stone-200">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-vedic-saffron" />
                <span>Languages of India ({allLanguages.length}):</span>
              </span>
              <span className="text-vedic-maroon font-semibold">{currentLangInfo.native}</span>
            </div>
            <div className="max-h-44 overflow-y-auto grid grid-cols-3 gap-1.5 p-1 bg-stone-50 rounded-xl border border-stone-200 scrollbar-thin">
              {allLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all truncate flex items-center justify-center space-x-1 ${
                    language === l.code 
                      ? 'bg-vedic-maroon text-white border-vedic-maroon font-bold shadow-sm' 
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
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
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-100"
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => handleNavClick('explore')}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-100"
          >
            <Compass className="w-4 h-4 text-vedic-saffron" />
            <span>{t('navExplore')}</span>
          </button>
          <button
            onClick={() => handleNavClick('circuits')}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-100"
          >
            <MapPin className="w-4 h-4 text-vedic-saffron" />
            <span>{t('navCircuits')}</span>
          </button>
          <button
            onClick={() => handleNavClick('map')}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-100"
          >
            <MapIcon className="w-4 h-4 text-vedic-saffron" />
            <span>{t('navMap')}</span>
          </button>
          <button
            onClick={() => handleNavClick('guidelines')}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-100"
          >
            <BookOpen className="w-4 h-4 text-vedic-saffron" />
            <span>{t('navGuidelines')}</span>
          </button>
          <button
            onClick={() => handleNavClick('planner')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium bg-vedic-saffron/10 text-vedic-saffronDark"
          >
            <span className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4" />
              <span>{t('navYatra')}</span>
            </span>
            <span className="px-2 py-0.5 text-xs bg-vedic-saffron text-white rounded-full">
              {plannedTemples.length}
            </span>
          </button>
          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-amber-100 text-amber-900"
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
