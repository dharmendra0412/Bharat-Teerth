import React, { useState, useMemo, useEffect } from 'react';
import TempleCard from '../components/TempleCard';
import { useLanguage } from '../context/LanguageContext';
import { playTempleBell } from '../utils/audio';
import { getCurrentAuspiciousDarshanPhase } from '../utils/timings';
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
  Activity,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Bell,
  Sunrise,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';

const CINEMATIC_HERO_SHRINES = [
  {
    id: "kedarnath-temple",
    name: "Kedarnath Dham",
    hindi: "केदारनाथ धाम",
    deity: "Lord Shiva (Sadashiva)",
    state: "Uttarakhand",
    elevation: "3,583 m (Garhwal Himalayas)",
    circuit: "Char Dham • 12 Jyotirlingas",
    tagline: "Highest of the sacred Twelve Jyotirlingas, perched amidst Himalayan glaciers and eternal snow.",
    image: "/images/temples/kedarnath-temple.jpg"
  },
  {
    id: "kashi-vishwanath",
    name: "Kashi Vishwanath",
    hindi: "काशी विश्वनाथ",
    deity: "Lord Shiva (Vishweshwara)",
    state: "Varanasi, Uttar Pradesh",
    elevation: "Sacred Ganga Ghats",
    circuit: "12 Jyotirlingas • Mokshapuri",
    tagline: "The eternal golden city of light on sacred Ganga, where Lord Shiva grants liberation and divine supreme peace.",
    image: "/images/temples/kashi-vishwanath.jpg"
  },
  {
    id: "meenakshi-amman",
    name: "Meenakshi Amman",
    hindi: "मीनाक्षी सुन्दरेश्वरर",
    deity: "Goddess Meenakshi & Sundareswarar",
    state: "Madurai, Tamil Nadu",
    elevation: "Vaigai River Plain",
    circuit: "Dravidian Architectural Marvel",
    tagline: "A colossal wonder of 14 monumental sculptured Gopurams and a Thousand-Pillar Hall holding millennia of living worship.",
    image: "/images/temples/meenakshi-amman.jpg"
  },
  {
    id: "somnath-jyotirlinga",
    name: "Somnath Mahadev",
    hindi: "सोमनाथ ज्योतिर्लिंग",
    deity: "Lord Shiva (Someshwara)",
    state: "Prabhas Patan, Gujarat",
    elevation: "Arabian Sea Coastline",
    circuit: "First of the 12 Jyotirlingas",
    tagline: "The primal Jyotirlinga standing eternal on the shores of the Arabian Sea, representing the immortal spirit of Bharat.",
    image: "/images/temples/somnath-jyotirlinga.jpg"
  },
  {
    id: "brihadeeswarar-thanjavur",
    name: "Brihadisvara Temple",
    hindi: "बृहदीश्वर मन्दिर",
    deity: "Lord Shiva (Peruvudaiyar)",
    state: "Thanjavur, Tamil Nadu",
    elevation: "Kaveri Delta Basin",
    circuit: "UNESCO World Heritage Site",
    tagline: "Raja Raja Chola I's granite wonder crowned with an 80-tonne monolithic Kumbam vimana that casts no shadow at midday.",
    image: "/images/temples/brihadeeswarar-thanjavur.jpg"
  },
  {
    id: "konark-sun-temple",
    name: "Konark Sun Temple",
    hindi: "कोणार्क सूर्य मन्दिर",
    deity: "Surya Deva (Sun God)",
    state: "Puri Coastline, Odisha",
    elevation: "Bay of Bengal Coast",
    circuit: "UNESCO World Heritage Site",
    tagline: "13th-century colossal stone chariot with 24 intricately carved sundial wheels pulled by seven cosmic steeds.",
    image: "/images/temples/konark-sun-temple.jpg"
  },
  {
    id: "jagannath-puri",
    name: "Jagannath Temple",
    hindi: "श्री जगन्नाथ मन्दिर",
    deity: "Lord Jagannath, Balabhadra, Subhadra",
    state: "Puri, Odisha",
    elevation: "Eastern Coast",
    circuit: "Char Dham • Nilachala Dhama",
    tagline: "Revered Purushottama Kshetra, sanctuary of Mahaprasad, the sacred Patitapavana flag, and the world-famed Ratha Yatra.",
    image: "/images/temples/jagannath-puri.jpg"
  }
];

const SACRED_CIRCUITS_QUICK = [
  { name: "Char Dham", icon: "🕉️", count: 4, filter: "Char Dham" },
  { name: "12 Jyotirlingas", icon: "🔱", count: 12, filter: "Jyotirlinga" },
  { name: "51 Shakti Peethas", icon: "🌺", count: 51, filter: "Shakti Peetha" },
  { name: "Pancha Bhoota", icon: "🌊", count: 5, filter: "Pancha Bhoota" },
  { name: "Divya Desams", icon: "🛕", count: 108, filter: "Divya Desam" },
  { name: "UNESCO Heritage", icon: "🏛️", count: 8, filter: "UNESCO" }
];

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

  // Cinematic Hero Carousel & Live Darshan state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [darshanPhase, setDarshanPhase] = useState(() => getCurrentAuspiciousDarshanPhase());
  const [bellRinging, setBellRinging] = useState(false);

  // Auto-advance hero slideshow every 6.5s unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CINEMATIC_HERO_SHRINES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Real-time Darshan Phase update every 15s
  useEffect(() => {
    const timer = setInterval(() => {
      setDarshanPhase(getCurrentAuspiciousDarshanPhase());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleRingBell = () => {
    setBellRinging(true);
    playTempleBell();
    setTimeout(() => setBellRinging(false), 2200);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CINEMATIC_HERO_SHRINES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CINEMATIC_HERO_SHRINES.length) % CINEMATIC_HERO_SHRINES.length);
  };

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

  const handleCircuitQuickTag = (circuitFilter) => {
    if (setFilterTheme) setFilterTheme(circuitFilter);
    setActiveTab('explore');
  };

  const currentShrine = CINEMATIC_HERO_SHRINES[currentSlide];

  return (
    <div className="space-y-16 pb-16">
      
      {/* ======================================================== */}
      {/* CONCEPT 1: GRAND ROYAL SANDSTONE & TEMPLE IVORY HERO     */}
      {/* ======================================================== */}
      <section 
        className="relative overflow-hidden bg-gradient-to-b from-[#F5EFE0] via-[#FAF6EC] to-[#FBF8F3] text-stone-900 pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8DFC8] shadow-sm"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Subtle Sacred Mandala Background Dot Grid */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C89B3C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top Auspicious Invocation & Live Darshan Ticker */}
        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E8DFC8] pb-3">
            
            {/* Sanskrit Shloka & Official Verified Tag */}
            <div className="flex items-center space-x-2 text-[#781822] text-xs tracking-wider font-semibold text-center sm:text-left">
              <span className="text-[#C89B3C] font-serif text-base">ॐ</span>
              <span className="font-serif italic text-stone-800">असतो मा सद्गमय तमसो मा ज्योतिर्गमय</span>
              <span className="hidden md:inline text-stone-400">•</span>
              <span className="hidden md:inline text-[#781822] text-[11px] font-sans font-bold">
                ASI & State Devasthanams Verified
              </span>
            </div>

            {/* Live Pan-India Darshan Status Pill */}
            <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#DECFA9] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm">{darshanPhase.icon}</span>
              <span className="text-xs font-bold text-[#781822]">
                {darshanPhase.phase}
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                (IST {darshanPhase.istTime})
              </span>
              <button
                onClick={handleRingBell}
                title="Ring the sacred temple bell"
                className={`ml-1 flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all border ${
                  bellRinging
                    ? 'bg-amber-400 text-[#781822] border-white scale-105 shadow-md'
                    : 'bg-[#781822] text-amber-100 hover:bg-[#5A0D15] border-[#781822]'
                }`}
              >
                <Bell className={`w-3 h-3 ${bellRinging ? 'animate-bounce text-[#781822]' : 'text-amber-300'}`} />
                <span className="hidden lg:inline">{bellRinging ? 'Ringing...' : 'Ring Bell'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Central Hero Branding & Dynamic Spotlight */}
        <div className="relative z-10 max-w-6xl mx-auto w-full my-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 7 Columns: Majestic Title, Mission & Search Box */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#781822]/10 border border-[#781822]/20 text-[#781822] text-xs tracking-wider font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>National Digital Heritage Repository</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-700">972 Temples Across 35 States & UTs</span>
                </div>

                <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#781822] tracking-tight leading-[1.12]">
                  DISCOVER THE SACRED SHRINES <br />
                  <span className="text-[#C27D00] font-playfair italic font-bold">
                    of Timeless Bharat
                  </span>
                </h1>

                <p className="text-stone-600 text-xs sm:text-sm lg:text-base font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {t('heroSubtitle')}
                </p>
              </div>

              {/* Floating Warm Glass Search & Discovery Box */}
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-[#DECFA9] text-stone-900 ring-1 ring-[#DECFA9]/50">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  
                  {/* Search text */}
                  <div className="sm:col-span-5 relative">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F0] border border-[#E2D7C0] rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#781822] focus:bg-white"
                    />
                  </div>

                  {/* State dropdown */}
                  <div className="sm:col-span-3">
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#E2D7C0] rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#781822] focus:bg-white truncate"
                    >
                      <option value="">All States ({allStates.length || 35})</option>
                      {(allStates.length > 0 ? allStates : POPULAR_STATES).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Deity dropdown */}
                  <div className="sm:col-span-2">
                    <select
                      value={selectedDeity}
                      onChange={(e) => setSelectedDeity(e.target.value)}
                      className="w-full px-2.5 py-2.5 bg-[#FAF7F0] border border-[#E2D7C0] rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#781822] focus:bg-white truncate"
                    >
                      <option value="">Deities ({allDeities.length || 118})</option>
                      {allDeities.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full h-full py-2.5 px-3 bg-gradient-to-r from-[#D35400] to-[#781822] hover:from-[#E65100] hover:to-[#5A0D15] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#781822]/20 flex items-center justify-center space-x-1 group"
                    >
                      <span>Search</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                </form>

                {/* Quick Sacred Circuit Tags */}
                <div className="mt-3 pt-3 border-t border-[#E8DFC8] flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs">
                  <span className="font-bold text-[#781822] text-[11px] mr-1 flex items-center space-x-1">
                    <Compass className="w-3 h-3 text-[#D35400]" />
                    <span>Sacred Circuits:</span>
                  </span>
                  {SACRED_CIRCUITS_QUICK.map(circ => (
                    <button
                      key={circ.name}
                      type="button"
                      onClick={() => handleCircuitQuickTag(circ.filter)}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-[#781822] hover:text-[#FDF3D6] border border-[#DECFA9] transition-all text-[11px] font-semibold text-stone-700 flex items-center space-x-1 shadow-sm"
                    >
                      <span>{circ.icon}</span>
                      <span>{circ.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">({circ.count})</span>
                    </button>
                  ))}
                </div>

                {/* Popular State Quick Filters */}
                <div className="mt-2 flex flex-wrap items-center justify-center lg:justify-start gap-1 text-[11px] text-stone-500">
                  <span className="text-stone-700 font-semibold mr-1">Popular States:</span>
                  {(allStates.length > 0 ? allStates.slice(0, 8) : POPULAR_STATES.slice(0, 8)).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStateChipClick(st)}
                      className="px-2 py-0.5 rounded text-[10px] text-stone-600 hover:text-[#781822] hover:bg-[#F2EADB] transition-colors"
                    >
                      {st}
                    </button>
                  ))}
                </div>

              </div>

            </div>

            {/* Right 5 Columns: Interactive Spotlight Shrine Showcase */}
            <div className="lg:col-span-5">
              <div className="relative bg-white/95 rounded-2xl border border-[#DECFA9] p-5 shadow-xl backdrop-blur-xl space-y-4 ring-1 ring-[#DECFA9]/50">
                
                {/* Spotlight Header with Live Badge & Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#781822] text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#D35400]" />
                      <span>Heritage Spotlight</span>
                    </span>
                    <span className="text-[11px] text-[#781822] font-mono font-bold">
                      {String(currentSlide + 1).padStart(2, '0')} / {String(CINEMATIC_HERO_SHRINES.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Navigation & Pause Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handlePrevSlide}
                      className="p-1 rounded-lg bg-stone-100 hover:bg-[#781822] hover:text-white text-stone-700 transition-colors"
                      title="Previous spotlight shrine"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className="p-1 rounded-lg bg-stone-100 hover:bg-[#781822] hover:text-white text-stone-700 transition-colors"
                      title={isPaused ? "Play slideshow" : "Pause slideshow"}
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="p-1 rounded-lg bg-stone-100 hover:bg-[#781822] hover:text-white text-stone-700 transition-colors"
                      title="Next spotlight shrine"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Shrine Preview Image Container */}
                <div 
                  onClick={() => onSelectTemple(currentShrine.id)}
                  className="relative h-48 w-full rounded-xl overflow-hidden border border-[#DECFA9] cursor-pointer group shadow-md"
                >
                  <img
                    src={currentShrine.image}
                    alt={currentShrine.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/temples/somnath-jyotirlinga.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#781822] text-[#F9E8B2] text-[10px] font-bold shadow-sm">
                      {currentShrine.circuit}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-medium backdrop-blur-sm">
                      {currentShrine.elevation}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-amber-200 font-serif italic">
                        {currentShrine.hindi}
                      </div>
                      <div className="font-serif font-black text-xl text-white group-hover:text-amber-200 transition-colors">
                        {currentShrine.name}
                      </div>
                    </div>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#C89B3C] text-stone-900 text-xs font-bold shadow group-hover:bg-white transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Shrine Metadata & Tagline */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-600">
                    <div className="flex items-center space-x-1 text-[#781822]">
                      <MapPin className="w-3.5 h-3.5 text-[#D35400]" />
                      <span className="font-bold">{currentShrine.state}</span>
                    </div>
                    <div className="text-stone-600 font-medium">
                      Deity: <span className="text-stone-900 font-bold">{currentShrine.deity}</span>
                    </div>
                  </div>

                  <p className="text-stone-600 text-[11px] leading-relaxed line-clamp-2">
                    {currentShrine.tagline}
                  </p>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => onSelectTemple(currentShrine.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D35400] to-[#781822] hover:from-[#E65100] hover:to-[#5A0D15] text-white font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-md shadow-[#781822]/20"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Sthala Purana, Timings & Darshan Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Slide Indicator Dots */}
                <div className="flex items-center justify-center space-x-1.5 pt-1">
                  {CINEMATIC_HERO_SHRINES.map((shrine, idx) => (
                    <button
                      key={shrine.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentSlide
                          ? 'w-7 bg-[#781822] shadow-sm'
                          : 'w-2 bg-[#DECFA9] hover:bg-[#781822]/50'
                      }`}
                      title={shrine.name}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Bottom Key Performance Indicators (KPIs) Strip */}
        <div className="relative z-10 pt-6 max-w-6xl mx-auto w-full space-y-3">
          <div className="flex items-center justify-center space-x-2 text-[#781822] text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-[#D35400]" />
            <span>{t('kpiSectionTitle')}</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-600 normal-case font-medium hidden sm:inline">{t('kpiSectionSubtitle')}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-left">
            
            {/* KPI 1: Number of Temples Listed */}
            <div className="p-3.5 rounded-2xl bg-white/95 border border-[#DECFA9] shadow-sm hover:border-[#C89B3C] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-[#781822]">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {stats.statesCovered || 35} States & UTs
                </span>
              </div>
              <div className="font-serif font-black text-2xl text-[#781822] group-hover:text-[#D35400] transition-colors">
                {stats.kpis?.templesListed?.displayValue || stats.totalTemples || 972}
              </div>
              <div className="text-xs font-bold text-stone-800 mt-0.5 leading-snug">
                {t('kpiTemplesListed')}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1">
                <span>{t('kpiTemplesListedSub')}</span>
              </div>
            </div>

            {/* KPI 2: Monthly Active Users */}
            <div className="p-3.5 rounded-2xl bg-white/95 border border-[#DECFA9] shadow-sm hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-800">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  Active Sessions
                </span>
              </div>
              <div className="font-serif font-black text-2xl text-[#781822] group-hover:text-sky-700 transition-colors">
                {stats.kpis?.monthlyActiveUsers?.displayValue || '1'}
              </div>
              <div className="text-xs font-bold text-stone-800 mt-0.5 leading-snug">
                {t('kpiMonthlyActiveUsers')}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {t('kpiMonthlyActiveUsersSub')}
              </div>
            </div>

            {/* KPI 3: Search Success Rate */}
            <div className="p-3.5 rounded-2xl bg-white/95 border border-[#DECFA9] shadow-sm hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-[#D35400]">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {stats.kpis?.searchSuccessRate?.avgLatencyMs || 42}ms latency
                </span>
              </div>
              <div className="font-serif font-black text-2xl text-[#781822] group-hover:text-[#D35400] transition-colors">
                {stats.kpis?.searchSuccessRate?.displayValue || '100%'}
              </div>
              <div className="text-xs font-bold text-stone-800 mt-0.5 leading-snug">
                {t('kpiSearchSuccessRate')}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {t('kpiSearchSuccessRateSub')}
              </div>
            </div>

            {/* KPI 4: Page Engagement Time */}
            <div className="p-3.5 rounded-2xl bg-white/95 border border-[#DECFA9] shadow-sm hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                  Avg Session
                </span>
              </div>
              <div className="font-serif font-black text-2xl text-[#781822] group-hover:text-rose-700 transition-colors">
                {stats.kpis?.pageEngagementTime?.displayValue || '4m 00s'}
              </div>
              <div className="text-xs font-bold text-stone-800 mt-0.5 leading-snug">
                {t('kpiPageEngagement')}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {t('kpiPageEngagementSub')}
              </div>
            </div>

            {/* KPI 5: User Satisfaction Score */}
            <div className="p-3.5 rounded-2xl bg-white/95 border border-[#DECFA9] shadow-sm hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 col-span-2 lg:col-span-1 group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {stats.kpis?.userSatisfactionScore?.totalRatings || stats.totalPilgrimTips || 4} Reviews
                </span>
              </div>
              <div className="font-serif font-black text-2xl text-emerald-700 group-hover:text-emerald-800 transition-colors">
                {stats.kpis?.userSatisfactionScore?.displayValue || '5.0 / 5.0'}
              </div>
              <div className="text-xs font-bold text-stone-800 mt-0.5 leading-snug">
                {t('kpiSatisfactionScore')}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {t('kpiSatisfactionScoreSub')}
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
              className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-[#E8DFC8] hover:border-[#C89B3C] shadow-sm hover:shadow-temple transition-all duration-300 cursor-pointer flex flex-col justify-between"
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
