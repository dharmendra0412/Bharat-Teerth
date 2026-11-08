import React, { useState } from 'react';
import { usePilgrimage } from '../context/PilgrimageContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Bookmark, 
  MapPin, 
  Clock, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Printer, 
  Calendar, 
  Users, 
  FileText, 
  CheckSquare, 
  ShieldCheck, 
  Share2, 
  Plus 
} from 'lucide-react';

export default function PlannerPage({ onSelectTemple, setActiveTab }) {
  const { t } = useLanguage();
  const { 
    plannedTemples, 
    removeFromPlan, 
    clearPlan, 
    moveOrder, 
    yatraMeta, 
    setYatraMeta 
  } = usePilgrimage();

  const handleMetaChange = (field, val) => {
    setYatraMeta(prev => ({ ...prev, [field]: val }));
  };

  const handlePrint = () => {
    window.print();
  };

  const distinctStates = [...new Set(plannedTemples.map(t => t.location.state))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-vedic-saffronDark uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 text-vedic-saffron" />
            <span>{t('navYatra')}</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-vedic-maroon tracking-tight">
            {t('plannerTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t('plannerSubtitle')}
          </p>
        </div>

        {plannedTemples.length > 0 && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-vedic-maroon hover:bg-vedic-maroonDark text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printItinerary')}</span>
            </button>

            <button
              onClick={clearPlan}
              className="inline-flex items-center space-x-1 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-medium transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {plannedTemples.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-4">
          <div className="text-5xl">🛕</div>
          <h3 className="font-serif font-bold text-xl text-stone-800">
            Your Pilgrimage Plan is Empty
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            You haven't added any sacred shrines to your Yatra yet. Browse temples or explore circuits to curate your sacred journey.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => setActiveTab('explore')}
              className="px-5 py-2.5 bg-vedic-saffron text-white rounded-xl text-xs font-semibold hover:bg-vedic-saffronDark transition-colors shadow-sm"
            >
              Explore Temples Directory
            </button>
            <button
              onClick={() => setActiveTab('circuits')}
              className="px-5 py-2.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              Browse Pilgrimage Circuits
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Itinerary Details & Reorderable List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Yatra Meta Editor */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Pilgrimage Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Yatra Title</label>
                  <input
                    type="text"
                    value={yatraMeta.title}
                    onChange={(e) => handleMetaChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-vedic-saffron focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={yatraMeta.startDate}
                    onChange={(e) => handleMetaChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-vedic-saffron focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Pilgrimage Notes / Sankalpa</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Special abhishekam booked on day 2; ensure early morning start at 04:00 AM..."
                  value={yatraMeta.notes}
                  onChange={(e) => handleMetaChange('notes', e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-vedic-saffron focus:outline-none"
                />
              </div>
            </div>

            {/* Sacred Stops Sequence */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Planned Darshan Sequence ({plannedTemples.length} Sacred Shrines)
                </h3>
                <span className="text-[11px] text-stone-500">Use arrows to adjust order</span>
              </div>

              {plannedTemples.map((temple, index) => (
                <div
                  key={temple.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <span className="w-8 h-8 rounded-full bg-vedic-saffron text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <img
                      src={temple.imageUrl}
                      alt={temple.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => onSelectTemple(temple.id)}
                    />
                    <div>
                      <h4 
                        onClick={() => onSelectTemple(temple.id)}
                        className="font-serif font-bold text-sm sm:text-base text-stone-900 hover:text-vedic-maroon transition-colors cursor-pointer"
                      >
                        {temple.name}
                      </h4>
                      <div className="text-xs text-stone-500 flex items-center space-x-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-vedic-gold" />
                        <span>{temple.location.city}, {temple.location.state}</span>
                      </div>
                      <div className="text-[11px] text-vedic-saffronDark font-medium mt-1">
                        <strong>Hours:</strong> {temple.darshanTimings?.generalTimings}
                      </div>
                    </div>
                  </div>

                  {/* Order adjustment actions */}
                  <div className="flex items-center space-x-1.5 self-end sm:self-center">
                    <button
                      disabled={index === 0}
                      onClick={() => moveOrder(index, index - 1)}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4 text-stone-600" />
                    </button>
                    <button
                      disabled={index === plannedTemples.length - 1}
                      onClick={() => moveOrder(index, index + 1)}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4 text-stone-600" />
                    </button>
                    <button
                      onClick={() => removeFromPlan(temple.id)}
                      className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 ml-2"
                      title="Remove from Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('explore')}
              className="w-full py-3 border border-dashed border-stone-300 rounded-2xl text-xs font-semibold text-stone-600 hover:text-vedic-maroon hover:border-vedic-saffron flex items-center justify-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add More Temples to Itinerary</span>
            </button>

          </div>

          {/* Right Column: Yatra Summary & Checklist */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Summary Card */}
            <div className="bg-stone-900 text-stone-300 p-6 rounded-3xl border-2 border-vedic-gold/40 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-lg text-white border-b border-stone-800 pb-3 flex items-center space-x-2">
                <span className="text-vedic-gold">ॐ</span>
                <span>Yatra Summary</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Shrines:</span>
                  <span className="text-white font-bold">{plannedTemples.length} Temples</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">States Traversed:</span>
                  <span className="text-white font-bold">{distinctStates.length} ({distinctStates.join(', ')})</span>
                </div>
                {yatraMeta.startDate && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Starting Date:</span>
                    <span className="text-white font-bold">{yatraMeta.startDate}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-800">
                <button
                  onClick={handlePrint}
                  className="w-full py-2.5 bg-vedic-saffron hover:bg-vedic-saffronDark text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Generate Printable Itinerary</span>
                </button>
              </div>
            </div>

            {/* Essential Pilgrim Checklist */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-xs">
              <h4 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-vedic-saffron" />
                <span>Pre-Yatra Essential Checklist</span>
              </h4>

              <div className="space-y-2.5 text-stone-700">
                <div className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Dress Code:</strong> Pack traditional Indian attire (Men: Dhoti/Kurta; Women: Saree/Salwar).</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Valid Photo IDs:</strong> Original Aadhaar / Passport for electronic darshan entry verification.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Biometric Passes:</strong> Keep paper printouts of TTD / BKTC / Kashi Vishwanath passes ready.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Electronics Policy:</strong> Prepare to deposit mobile phones and leather belts at temple lockers.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

