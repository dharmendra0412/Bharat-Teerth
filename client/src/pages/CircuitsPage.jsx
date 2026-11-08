import React, { useState } from 'react';
import { usePilgrimage } from '../context/PilgrimageContext';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Compass, 
  ArrowRight, 
  Bookmark, 
  CheckCircle, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

export default function CircuitsPage({ circuits = [], temples = [], onSelectTemple }) {
  const [selectedCircuitId, setSelectedCircuitId] = useState(circuits[0]?.id || '12-jyotirlinga');
  const { addToPlan } = usePilgrimage();

  const selectedCircuit = circuits.find(c => c.id === selectedCircuitId) || circuits[0];
  const templesInCircuit = temples.filter(t => t.circuits && t.circuits.includes(selectedCircuit?.id));

  const handleAddAllToPlan = () => {
    let addedCount = 0;
    templesInCircuit.forEach(temple => {
      const added = addToPlan(temple);
      if (added) addedCount++;
    });
    alert(`Added ${addedCount} temples from ${selectedCircuit?.name} to your Yatra Planner!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-vedic-saffronDark uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4 text-vedic-saffron" />
          <span>Traditional Yatra Circuits</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-vedic-maroon tracking-tight">
          Sacred Pilgrimage Circuits of Bharat
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          Ancient pilgrimage routes connecting sacred kshetras across the subcontinent with spiritual sequence, recommended seasons, and duration guidelines.
        </p>
      </div>

      {/* Main Grid: Sidebar of circuits + Circuit Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Circuit Selector Tabs */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            Select Sacred Pilgrimage Circuit
          </h3>

          <div className="space-y-2">
            {circuits.map(circuit => {
              const isSelected = circuit.id === selectedCircuit?.id;
              return (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedCircuitId(circuit.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-vedic-maroon text-white border-vedic-maroon shadow-md'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-vedic-gold/60 hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isSelected ? 'text-vedic-goldLight' : 'text-vedic-saffron'
                    }`}>
                      {circuit.tag}
                    </span>
                    <h4 className="font-serif font-bold text-sm sm:text-base leading-snug">
                      {circuit.name}
                    </h4>
                    <p className={`text-xs ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {circuit.totalStops} Sacred Stops • {circuit.durationDays}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 shrink-0 ${isSelected ? 'text-vedic-gold' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Circuit Deep Dive */}
        {selectedCircuit && (
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
            
            {/* Top Circuit Header */}
            <div className="space-y-3 border-b border-stone-200 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
                  {selectedCircuit.tag}
                </span>

                <button
                  onClick={handleAddAllToPlan}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-vedic-saffron hover:bg-vedic-saffronDark text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Add Entire Circuit to My Yatra ({templesInCircuit.length} Temples)</span>
                </button>
              </div>

              <div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-vedic-maroon">
                  {selectedCircuit.name}
                </h2>
                {selectedCircuit.sanskritName && (
                  <p className="font-serif italic text-sm text-stone-500 mt-0.5">
                    {selectedCircuit.sanskritName}
                  </p>
                )}
              </div>

              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                {selectedCircuit.overview}
              </p>
            </div>

            {/* Circuit Key Fast Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-500 block font-medium">Recommended Duration</span>
                <span className="font-semibold text-stone-900 text-sm">{selectedCircuit.durationDays}</span>
              </div>
              <div>
                <span className="text-stone-500 block font-medium">Best Pilgrimage Season</span>
                <span className="font-semibold text-stone-900 text-sm">{selectedCircuit.bestSeason}</span>
              </div>
              <div>
                <span className="text-stone-500 block font-medium">Presiding Deity Focus</span>
                <span className="font-semibold text-stone-900 text-sm">{selectedCircuit.deity}</span>
              </div>
            </div>

            {/* Sequence of Stops / Sacred Itinerary Progression */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Traditional Sequence & Sacred Stops
              </h3>

              <div className="space-y-3">
                {selectedCircuit.keyStops && selectedCircuit.keyStops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs hover:bg-amber-100/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-vedic-saffron text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {stop.order || idx + 1}
                      </span>
                      <div>
                        <span className="font-serif font-bold text-stone-900 text-sm block">
                          {stop.name}
                        </span>
                        <span className="text-stone-500">
                          {stop.city ? `${stop.city}, ` : ''}{stop.state} {stop.direction ? `• ${stop.direction} Cardinal Dham` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${stop.coordinates.lat},${stop.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 hover:text-vedic-maroon"
                      >
                        Map ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Temples with Full Profiles in this Circuit */}
            {templesInCircuit.length > 0 && (
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Featured Temples with Verified Details in this Circuit
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {templesInCircuit.map(t => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTemple(t.id)}
                      className="flex space-x-3 p-3 rounded-2xl border border-stone-200 hover:border-vedic-gold bg-stone-50 hover:bg-white shadow-sm transition-all cursor-pointer group items-center"
                    >
                      <img
                        src={t.imageUrl}
                        alt={t.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-xs text-stone-900 group-hover:text-vedic-maroon truncate">
                          {t.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 truncate">{t.location.city}, {t.location.state}</div>
                        <span className="text-[10px] text-vedic-saffronDark font-semibold flex items-center space-x-1 mt-0.5">
                          <span>View Sthala Purana</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

