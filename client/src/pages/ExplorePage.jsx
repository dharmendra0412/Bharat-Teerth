import React, { useState, useMemo, useEffect } from 'react';
import TempleCard from '../components/TempleCard';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Compass, 
  MapPin, 
  Sparkles, 
  LayoutGrid, 
  List, 
  Navigation, 
  Clock, 
  X, 
  ArrowRight 
} from 'lucide-react';
import { getDarshanStatus } from '../utils/timings';
import { useLanguage } from '../context/LanguageContext';

const REGIONS_TABS = [
  { id: '', label: 'All India' },
  { id: 'North', label: 'North India' },
  { id: 'South', label: 'South India' },
  { id: 'East', label: 'East India' },
  { id: 'West', label: 'West India' },
  { id: 'Central', label: 'Central India' },
  { id: 'North East', label: 'North East' }
];

export default function ExplorePage({ 
  temples = [], 
  metadata = {}, 
  circuits = [], 
  onSelectTemple,
  filterState = '',
  setFilterState,
  filterRegion = '',
  setFilterRegion,
  filterTheme = '',
  setFilterTheme,
  filterDeity = '',
  setFilterDeity,
  searchQuery = '',
  setSearchQuery
}) {
  const { t, language } = useLanguage();
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const [selectedRegion, setSelectedRegion] = useState(filterRegion || '');
  const [selectedState, setSelectedState] = useState(filterState || '');
  const [selectedDeity, setSelectedDeity] = useState(filterDeity || '');
  const [selectedArchitecture, setSelectedArchitecture] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(filterTheme || '');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [visibleCount, setVisibleCount] = useState(36);

  // Sync external filters from props & reset pagination on filter change
  useEffect(() => {
    setVisibleCount(36);
  }, [localSearch, selectedRegion, selectedState, selectedDeity, selectedArchitecture, selectedCircuit, selectedTheme, verifiedOnly, sortBy]);

  // Sync external filters from props
  useEffect(() => {
    if (filterState) setSelectedState(filterState);
    if (filterRegion) setSelectedRegion(filterRegion);
    if (filterTheme) setSelectedTheme(filterTheme);
    if (filterDeity) setSelectedDeity(filterDeity);
    if (searchQuery) setLocalSearch(searchQuery);
  }, [filterState, filterRegion, filterTheme, filterDeity, searchQuery]);

  // Filtered and sorted temples
  const filteredTemples = useMemo(() => {
    let result = [...temples];

    if (localSearch.trim()) {
      const q = localSearch.toLowerCase().trim();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        (t.localName && t.localName.toLowerCase().includes(q)) ||
        t.location.state.toLowerCase().includes(q) ||
        t.location.city.toLowerCase().includes(q) ||
        t.deity.primary.toLowerCase().includes(q) ||
        (t.history?.architecturalStyle && t.history.architecturalStyle.toLowerCase().includes(q))
      );
    }

    if (selectedRegion) {
      result = result.filter(t => t.location?.region?.toLowerCase() === selectedRegion.toLowerCase());
    }

    if (selectedState) {
      result = result.filter(t => t.location.state === selectedState);
    }

    if (selectedDeity) {
      result = result.filter(t => t.deity.primary.toLowerCase().includes(selectedDeity.toLowerCase()));
    }

    if (selectedArchitecture) {
      result = result.filter(t => 
        t.history?.architecturalStyle && 
        t.history.architecturalStyle.toLowerCase().includes(selectedArchitecture.toLowerCase())
      );
    }

    if (selectedCircuit) {
      result = result.filter(t => t.circuits && t.circuits.includes(selectedCircuit));
    }

    if (selectedTheme) {
      const th = selectedTheme.toLowerCase();
      result = result.filter(t =>
        (t.themes && t.themes.some(item => item.toLowerCase().includes(th))) ||
        (t.circuits && t.circuits.some(c => c.toLowerCase().includes(th)))
      );
    }

    if (verifiedOnly) {
      result = result.filter(t => t.verificationStatus === 'verified');
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'state') {
      result.sort((a, b) => a.location.state.localeCompare(b.location.state));
    }

    return result;
  }, [
    temples, 
    localSearch, 
    selectedRegion, 
    selectedState, 
    selectedDeity, 
    selectedArchitecture, 
    selectedCircuit, 
    selectedTheme, 
    verifiedOnly, 
    sortBy
  ]);

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedRegion('');
    setSelectedState('');
    setSelectedDeity('');
    setSelectedArchitecture('');
    setSelectedCircuit('');
    setSelectedTheme('');
    setVerifiedOnly(false);
    setSortBy('name');
    if (setSearchQuery) setSearchQuery('');
    if (setFilterState) setFilterState('');
    if (setFilterRegion) setFilterRegion('');
    if (setFilterTheme) setFilterTheme('');
    if (setFilterDeity) setFilterDeity('');
  };

  const statesList = metadata.states || [...new Set(temples.map(t => t.location?.state).filter(Boolean))].sort();
  const deitiesList = (metadata.deities && metadata.deities.length > 0) 
    ? metadata.deities 
    : [...new Set(temples.map(t => t.deity?.primary?.split('(')[0]?.trim()).filter(Boolean))].sort();
  const architectureList = ['Dravidian', 'Nagara', 'Kalinga', 'Maru-Gurjara', 'Chera', 'Sikh', 'Hemadpanthi', 'Nilachal'];
  const themesList = [
    'UNESCO World Heritage', 
    '12 Jyotirlinga', 
    'Char Dham', 
    'Shakti Peetha', 
    'Pancha Bhoota', 
    'Colossal Statue', 
    'Ancient Heritage'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-vedic-saffronDark uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-vedic-saffron" />
            <span>Incredible India Temple Directory</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-vedic-maroon tracking-tight">
            Explore Sacred Temples of Bharat
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Complete nationwide catalog across {statesList.length || 35} states & UTs with authentic darshan schedules, sthala purana, and logistics.
          </p>
        </div>

        {/* View Mode Toggle: Grid vs List */}
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl self-start md:self-end">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              viewMode === 'grid' 
                ? 'bg-white text-vedic-maroon shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Grid View with Visual Photography"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              viewMode === 'list' 
                ? 'bg-white text-vedic-maroon shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Compact List View for Fast Skimming"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Region Selector Ribbon (Incredible India Style) */}
      <div className="bg-stone-50 p-1.5 rounded-2xl border border-stone-200/80 overflow-x-auto flex space-x-1 scrollbar-none">
        {REGIONS_TABS.map(tab => {
          const isSelected = selectedRegion === tab.id;
          const count = tab.id 
            ? temples.filter(t => t.location?.region === tab.id).length 
            : temples.length;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-vedic-maroon text-white shadow-sm'
                  : 'text-stone-600 hover:text-vedic-maroon hover:bg-stone-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        
        {/* Row 1: Search & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder', 'Search temple name, town, presiding deity, or architecture...')}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-vedic-saffron focus:bg-white"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center space-x-2">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-vedic-saffron"
            >
              <option value="name">Temple Name (A - Z)</option>
              <option value="state">State (Geographic)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Faceted Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
          
          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron"
            >
              <option value="">All States ({statesList.length})</option>
              {statesList.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Deity Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Presiding Deity</label>
            <select
              value={selectedDeity}
              onChange={(e) => setSelectedDeity(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron"
            >
              <option value="">All Deities ({deitiesList.length})</option>
              {deitiesList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Architecture Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Architecture Style</label>
            <select
              value={selectedArchitecture}
              onChange={(e) => setSelectedArchitecture(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron"
            >
              <option value="">All Styles</option>
              {architectureList.map(a => (
                <option key={a} value={a}>{a} Style</option>
              ))}
            </select>
          </div>

          {/* Theme Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Spiritual Theme</label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron"
            >
              <option value="">All Themes</option>
              {themesList.map(th => (
                <option key={th} value={th}>{th}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Row 3: Active Status & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-vedic-saffron focus:ring-vedic-saffron"
              />
              <span className="text-stone-700 font-medium">Show ASI / Devasthanam Verified Only</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-semibold text-stone-700">
              Showing <span className="text-vedic-maroon font-bold text-sm">{filteredTemples.length}</span> of {temples.length} temples
            </span>
            {(localSearch || selectedRegion || selectedState || selectedDeity || selectedArchitecture || selectedCircuit || selectedTheme || verifiedOnly) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-1 text-stone-500 hover:text-red-700 transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Temples Render: Grid View or Compact List View */}
      {filteredTemples.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemples.slice(0, visibleCount).map(temple => (
                <TempleCard
                  key={temple.id}
                  temple={temple}
                  onSelectTemple={onSelectTemple}
                />
              ))}
            </div>
          ) : (
            /* Compact User-Friendly List View */
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm divide-y divide-stone-100">
              {filteredTemples.slice(0, visibleCount).map(temple => {
                const status = getDarshanStatus(temple.darshanTimings?.generalTimings);
                const coords = temple.location?.coordinates;
                const mapsUrl = coords 
                  ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.name)}`;

                return (
                  <div
                    key={temple.id}
                    onClick={() => onSelectTemple(temple.id)}
                    className="p-4 sm:p-5 hover:bg-amber-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={temple.imageUrl}
                        alt={temple.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/temples/somnath-jyotirlinga.jpg';
                        }}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {temple.location.region || 'India'}
                          </span>
                          <span className="text-[10px] text-stone-400">•</span>
                          <span className="text-xs text-stone-500 font-medium">
                            {temple.location.city}, {temple.location.state}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-vedic-maroon transition-colors">
                          {temple.name}
                        </h3>

                        <div className="text-xs text-stone-600 flex items-center space-x-2">
                          <span className="font-medium">Deity: {temple.deity?.primary?.split('(')[0] || 'Sanctum Deity'}</span>
                          <span>•</span>
                          <span className="text-stone-500">{temple.history?.architecturalStyle}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-[11px] pt-1">
                          <span className={`inline-flex items-center space-x-1 font-semibold ${
                            status.color === 'emerald' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status.color === 'emerald' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                            }`} />
                            <span>{status.statusText}</span>
                          </span>
                          <span className="text-stone-300">|</span>
                          <span className="text-stone-500">{temple.darshanTimings?.generalTimings}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center space-x-1"
                      >
                        <Navigation className="w-3.5 h-3.5 text-vedic-saffron" />
                        <span>Directions</span>
                      </a>

                      <span className="text-xs font-semibold text-vedic-saffronDark flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button for Large Repositories */}
          {filteredTemples.length > visibleCount && (
            <div className="text-center pt-8 pb-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 36)}
                className="px-8 py-3.5 bg-vedic-maroon hover:bg-vedic-maroonDark text-white font-semibold rounded-2xl shadow-md transition-all text-sm inline-flex items-center space-x-2"
              >
                <span>Load More Temples</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  Showing {visibleCount} of {filteredTemples.length}
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8 space-y-4">
          <div className="text-4xl">🛕</div>
          <h3 className="font-serif font-bold text-xl text-stone-800">
            No Temples Found Matching Criteria
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            We couldn't find any temple matching your selected filters. Try resetting the filters or modifying your search terms.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-vedic-saffron text-white rounded-xl text-xs font-semibold hover:bg-vedic-saffronDark transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}
