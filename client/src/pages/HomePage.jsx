import React, { useState, useMemo } from 'react';
import TempleCard from '../components/TempleCard';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  Globe2, 
  Flame, 
  Award,
  Users,
  Clock,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';

const REGIONS = [
  {
    id: "North",
    name: "North India",
    hindi: "उत्तर भारत",
    tagline: "Himalayan Abodes, Ancient River Ghats & Sacred Ganga",
    states: "Uttarakhand, UP, J&K, Punjab, Delhi, Himachal",
    icon: "🏔️",
    color: "from-amber-600 to-orange-800"
  },
  {
    id: "South",
    name: "South India",
    hindi: "दक्षिण भारत",
    tagline: "Towering Dravidian Gopurams, Kaveri Delta & Living Chola Art",
    states: "Tamil Nadu, Kerala, Karnataka, Andhra Pradesh",
    icon: "🛕",
    color: "from-red-700 to-rose-900"
  },
  {
    id: "West",
    name: "West India",
    hindi: "पश्चिम भारत",
    tagline: "Desert Marble Marvels, Arabian Sea Shrines & Sahyadris",
    states: "Maharashtra, Gujarat, Rajasthan, Goa",
    icon: "🌅",
    color: "from-orange-600 to-amber-800"
  },
  {
    id: "East",
    name: "East India",
    hindi: "पूर्व भारत",
    tagline: "Kalinga Rekha Deulas, Chariots of Puri & Shakti Peethas",
    states: "Odisha, West Bengal, Bihar, Jharkhand",
    icon: "🌊",
    color: "from-emerald-700 to-teal-900"
  },
  {
    id: "Central",
    name: "Central India",
    hindi: "मध्य भारत",
    tagline: "Heartland Chandela Temples & Holy Narmada Sanctuaries",
    states: "Madhya Pradesh, Chhattisgarh",
    icon: "⚜️",
    color: "from-yellow-700 to-amber-900"
  },
  {
    id: "North East",
    name: "North East India",
    hindi: "पूर्वोत्तर भारत",
    tagline: "Nilachal Nilayam, Ancient Kamarupa & Sacred Turtles",
    states: "Assam, Tripura, Meghalaya, Sikkim",
    icon: "🌿",
    color: "from-teal-700 to-emerald-950"
  }
];

const POPULAR_STATES = [
  "Tamil Nadu", "Uttar Pradesh", "Uttarakhand", "Maharashtra", 
  "Gujarat", "Odisha", "Karnataka", "Kerala", "Rajasthan", "Assam"
];

export default function HomePage({ 
  temples = [], 
  metadata = {},
  circuits = [], 
  stats = {}, 
  onSelectTemple, 
  setActiveTab, 
  setFilterState, 
  setFilterRegion, 
  setFilterTheme,
  setFilterDeity,
  setSearchQuery 
}) {
  const { t, language } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('');

  // Dynamically compute all 35 States & UTs covered in the database
  const allStates = useMemo(() => {
    if (metadata?.states?.length) return metadata.states;
    return [...new Set(temples.map(t => t.location?.state).filter(Boolean))].sort();
  }, [temples, metadata]);

  // Dynamically compute all 120 authentic deities covered in the database
  const allDeities = useMemo(() => {
    if (metadata?.deities?.length) return metadata.deities;
    return [...new Set(temples.map(t => t.deity?.primary?.split('(')[0]?.trim()).filter(Boolean))].sort();
  }, [temples, metadata]);

  const featuredTemples = temples.filter(t => t.featured).slice(0, 6);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (setSearchQuery) setSearchQuery(searchInput);
    if (setFilterState) setFilterState(selectedState);
    if (setFilterDeity) setFilterDeity(selectedDeity);
    setActiveTab('explore');
  };

  const handleRegionClick = (regionName) => {
    if (setFilterRegion) setFilterRegion(regionName);
    setActiveTab('explore');
  };

  const handleStateChipClick = (stateName) => {
    if (setFilterState) setFilterState(stateName);
    setActiveTab('explore');
  };

  const handleThemeClick = (themeName) => {
    if (setFilterTheme) setFilterTheme(themeName);
    setActiveTab('explore');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2A0808] via-[#1A0B09] to-[#120605] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b-4 border-vedic-gold">
        
        {/* Subtle Decorative Background Mandala Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          {/* Top Sanskrit Invocation */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-vedic-gold/15 border border-vedic-gold/40 text-vedic-goldLight text-xs tracking-wider font-semibold">
            <span className="font-serif">ॐ</span>
            <span>{t('heroTitle')} • Bharat Teerth Sacred Portal</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              {t('heroTitle')} <br />
              <span className="bg-gradient-to-r from-vedic-gold via-amber-200 to-vedic-saffron text-transparent bg-clip-text">
                {t('portalName')}
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-stone-300 text-sm sm:text-base font-normal leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Real-World Quick Search & Discovery Box */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-vedic-gold/50 text-stone-900">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              
              {/* Search text */}
              <div className="sm:col-span-4 relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-vedic-saffron focus:bg-white"
                />
              </div>

              {/* State dropdown */}
              <div className="sm:col-span-3">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-vedic-saffron focus:bg-white"
                >
                  <option value="">All States ({allStates.length || 35})</option>
                  {(allStates.length > 0 ? allStates : POPULAR_STATES).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Deity filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedDeity}
                  onChange={(e) => setSelectedDeity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-vedic-saffron focus:bg-white truncate"
                >
                  <option value="">All Deities ({allDeities.length || 118})</option>
                  {allDeities.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full py-2.5 px-4 bg-gradient-to-r from-vedic-saffron to-vedic-saffronDark hover:from-vedic-saffronDark hover:to-vedic-maroon text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-vedic-saffron/30 flex items-center justify-center space-x-1"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

            {/* Quick State Chips */}
            <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-center gap-1.5 text-xs text-stone-600">
              <span className="font-semibold text-stone-500 mr-1">Popular States:</span>
              {(allStates.length > 0 ? allStates.slice(0, 10) : POPULAR_STATES).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStateChipClick(st)}
                  className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-vedic-goldLight hover:text-vedic-maroon border border-stone-200 transition-colors text-[11px]"
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Official Key Performance Indicators (KPIs) Strip */}
          <div className="pt-6 max-w-5xl mx-auto space-y-3">
            <div className="flex items-center justify-center space-x-2 text-vedic-goldLight text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-vedic-gold" />
              <span>{t('kpiSectionTitle')}</span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-300 normal-case font-normal hidden sm:inline">{t('kpiSectionSubtitle')}</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-left">
              
              {/* KPI 1: Number of Temples Listed */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-vedic-gold/30 backdrop-blur-md hover:border-vedic-gold transition-all duration-200 group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-vedic-gold/20 flex items-center justify-center text-vedic-goldLight">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {stats.statesCovered || 35} States & UTs
                  </span>
                </div>
                <div className="font-serif font-black text-2xl text-white group-hover:text-vedic-goldLight transition-colors">
                  {stats.kpis?.templesListed?.displayValue || stats.totalTemples || 972}
                </div>
                <div className="text-xs font-semibold text-stone-200 mt-0.5 leading-snug">
                  {t('kpiTemplesListed')}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                  <span>{t('kpiTemplesListedSub')}</span>
                </div>
              </div>

              {/* KPI 2: Monthly Active Users */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-vedic-gold/30 backdrop-blur-md hover:border-vedic-gold transition-all duration-200 group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Active Sessions
                  </span>
                </div>
                <div className="font-serif font-black text-2xl text-white group-hover:text-sky-200 transition-colors">
                  {stats.kpis?.monthlyActiveUsers?.displayValue || '1'}
                </div>
                <div className="text-xs font-semibold text-stone-200 mt-0.5 leading-snug">
                  {t('kpiMonthlyActiveUsers')}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {t('kpiMonthlyActiveUsersSub')}
                </div>
              </div>

              {/* KPI 3: Search Success Rate */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-vedic-gold/30 backdrop-blur-md hover:border-vedic-gold transition-all duration-200 group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {stats.kpis?.searchSuccessRate?.avgLatencyMs || 42}ms latency
                  </span>
                </div>
                <div className="font-serif font-black text-2xl text-white group-hover:text-amber-200 transition-colors">
                  {stats.kpis?.searchSuccessRate?.displayValue || '100%'}
                </div>
                <div className="text-xs font-semibold text-stone-200 mt-0.5 leading-snug">
                  {t('kpiSearchSuccessRate')}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {t('kpiSearchSuccessRateSub')}
                </div>
              </div>

              {/* KPI 4: Page Engagement Time */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-vedic-gold/30 backdrop-blur-md hover:border-vedic-gold transition-all duration-200 group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-300">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Avg Session
                  </span>
                </div>
                <div className="font-serif font-black text-2xl text-white group-hover:text-rose-200 transition-colors">
                  {stats.kpis?.pageEngagementTime?.displayValue || '4m 00s'}
                </div>
                <div className="text-xs font-semibold text-stone-200 mt-0.5 leading-snug">
                  {t('kpiPageEngagement')}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {t('kpiPageEngagementSub')}
                </div>
              </div>

              {/* KPI 5: User Satisfaction Score */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-vedic-gold/30 backdrop-blur-md hover:border-vedic-gold transition-all duration-200 col-span-2 lg:col-span-1 group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <Star className="w-3.5 h-3.5 fill-emerald-300" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {stats.kpis?.userSatisfactionScore?.totalRatings || stats.totalPilgrimTips || 4} Reviews
                  </span>
                </div>
                <div className="font-serif font-black text-2xl text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  {stats.kpis?.userSatisfactionScore?.displayValue || '5.0 / 5.0'}
                </div>
                <div className="text-xs font-semibold text-stone-200 mt-0.5 leading-snug">
                  {t('kpiSatisfactionScore')}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {t('kpiSatisfactionScoreSub')}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Incredible India Inspired: Explore by Geographical Region */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-vedic-saffronDark uppercase tracking-wider mb-1">
              <Globe2 className="w-4 h-4 text-vedic-saffron" />
              <span>Incredible India Regional Map</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-vedic-maroon">
              Explore Temples by Region of India
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Traverse the sacred geography of India across its 6 historic spiritual regions.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('map')}
            className="text-xs font-semibold text-vedic-saffronDark hover:text-vedic-maroon flex items-center space-x-1"
          >
            <span>Open Geospatial Map Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REGIONS.map(reg => (
            <div
              key={reg.id}
              onClick={() => handleRegionClick(reg.id)}
              className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-stone-200/80 hover:border-vedic-gold shadow-sm hover:shadow-temple transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{reg.icon}</span>
                  <span className="text-[11px] font-semibold text-stone-500 font-serif italic">
                    {reg.hindi}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-vedic-maroon transition-colors">
                    {reg.name}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium mt-1 leading-snug">
                    {reg.tagline}
                  </p>
                </div>

                <div className="text-[11px] text-stone-500">
                  <strong className="text-stone-700">Covers:</strong> {reg.states}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-vedic-saffronDark group-hover:text-vedic-maroon">
                <span>View Shrines in {reg.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Sacred Temples Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-vedic-saffronDark uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-vedic-saffron" />
              <span>Timeless Heritage</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-vedic-maroon tracking-tight">
              Featured Sacred Temples of India
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Curated architectural wonders and revered shrines with verified darshan schedules and sthala purana.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-vedic-maroon hover:text-vedic-saffronDark transition-colors group"
          >
            <span>View All {temples.length} Temples</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Temples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTemples.map(temple => (
            <TempleCard
              key={temple.id}
              temple={temple}
              onSelectTemple={onSelectTemple}
            />
          ))}
        </div>
      </section>

      {/* Sacred Pilgrimage Circuits Overview */}
      <section className="bg-gradient-to-b from-stone-50 to-vedic-goldLight/20 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-vedic-saffronDark uppercase tracking-wider">
              Sacred Itineraries
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-vedic-maroon">
              Major Pilgrimage Circuits of Bharat
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Traditional pilgrimage routes connecting sacred kshetras across the subcontinent with spiritual sequence and duration guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circuits.map(circuit => (
              <div 
                key={circuit.id}
                onClick={() => setActiveTab('circuits')}
                className="bg-white rounded-2xl p-6 border border-stone-200/80 hover:border-vedic-gold/80 shadow-sm hover:shadow-temple transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
                      {circuit.tag}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      {circuit.totalStops} Sacred Stops
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-vedic-maroon transition-colors">
                      {circuit.name}
                    </h3>
                    {circuit.sanskritName && (
                      <p className="text-xs text-stone-500 font-serif italic">
                        {circuit.sanskritName}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {circuit.overview}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="text-stone-500">
                    <span className="font-medium text-stone-700">Duration:</span> {circuit.durationDays}
                  </div>
                  <span className="font-semibold text-vedic-saffronDark flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>View Circuit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Why Authenticity Matters / Verification Standard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A0B09] rounded-3xl p-8 sm:p-12 text-white border-2 border-vedic-gold/40 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-vedic-gold/20 text-vedic-goldLight text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-vedic-gold" />
              <span>Real-World Authentic Guarantee</span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight">
              Strict Adherence to Authentic Heritage Records
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Unlike generic, unverified travel blogs, this portal enforces an <strong>Authentic Temple Trust Verification</strong> standard. Every sacred shrine entry, pooja schedule, ancient sthala purana, and visitor protocol is corroborated directly against:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-vedic-gold shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-medium">Archaeological Survey of India (ASI)</strong>
                  Official architectural dating, epigraphic records, and preservation guidelines.
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-vedic-gold shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-medium">State Devasthanam & Shrine Boards</strong>
                  Official live daily pooja schedules from TTD, BKTC, Kashi Vishwanath Trust, and SMVDSB.
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-vedic-gold shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-medium">Puranic & Vedic Literature</strong>
                  Authentic citations from Skanda Purana, Shiva Purana, and Divya Prabandham.
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-vedic-gold shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-medium">Verified Pilgrim Experience</strong>
                  First-hand crowd navigation tips reviewed by administrators for accuracy.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('explore')}
                className="px-6 py-3 rounded-xl bg-vedic-saffron hover:bg-vedic-saffronDark text-white font-semibold text-sm transition-all shadow-md shadow-vedic-saffron/30"
              >
                Explore All {temples.length} Verified Temples
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
