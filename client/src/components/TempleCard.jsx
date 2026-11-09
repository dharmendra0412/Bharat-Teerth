import React from 'react';
import { usePilgrimage } from '../context/PilgrimageContext';
import { useLanguage } from '../context/LanguageContext';
import { getDarshanStatus } from '../utils/timings';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ArrowRight, 
  Navigation 
} from 'lucide-react';

export default function TempleCard({ temple, onSelectTemple }) {
  const { isPlanned, addToPlan, removeFromPlan } = usePilgrimage();
  const { t, language } = useLanguage();
  const planned = isPlanned(temple.id);

  const darshanStatus = getDarshanStatus(temple.darshanTimings?.generalTimings);

  const handlePlanToggle = (e) => {
    e.stopPropagation();
    if (planned) {
      removeFromPlan(temple.id);
    } else {
      addToPlan(temple);
    }
  };

  const coords = temple.location?.coordinates;
  const mapsUrl = coords 
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.name + ' ' + temple.location.city)}`;

  return (
    <div 
      onClick={() => onSelectTemple(temple.id)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E8DFC8] hover:border-[#C89B3C] shadow-sm hover:shadow-temple transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Thumbnail & Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <img 
          src={temple.imageUrl} 
          alt={temple.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/temples/somnath-jyotirlinga.jpg';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            {temple.verificationStatus === 'verified' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-vedic-maroon/90 text-vedic-goldLight text-[11px] font-semibold tracking-wide backdrop-blur-sm border border-vedic-gold/40 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-vedic-gold" />
                <span>Verified</span>
              </span>
            )}

            {temple.location?.region && (
              <span className="px-2 py-0.5 rounded-full bg-black/60 text-stone-200 text-[10px] font-medium backdrop-blur-sm border border-white/20">
                {temple.location.region} India
              </span>
            )}
          </div>

          {/* Quick Bookmark Yatra */}
          <button
            onClick={handlePlanToggle}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              planned 
                ? 'bg-vedic-saffron text-white scale-110 shadow-vedic-saffron/40' 
                : 'bg-white/80 hover:bg-white text-stone-700 hover:text-vedic-maroon'
            }`}
            title={planned ? t('savedInYatra') : t('addToYatra')}
          >
            {planned ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom overlay info inside image: Status, Location, and Temple Name in natural vertical flow */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 pt-12 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-transparent flex flex-col justify-end space-y-2 pointer-events-none">
          {/* Live Darshan Status Tag */}
          <div className="flex items-center">
            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md shadow-sm border ${
              darshanStatus.color === 'emerald'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                : darshanStatus.color === 'amber'
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                : 'bg-stone-900/90 text-stone-300 border-stone-600/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                darshanStatus.color === 'emerald' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`} />
              <span className="leading-tight">{darshanStatus.statusText}</span>
            </span>
          </div>

          {/* Location */}
          <div className="text-[11px] text-vedic-goldLight font-medium flex items-center space-x-1.5 leading-none">
            <MapPin className="w-3.5 h-3.5 text-vedic-gold shrink-0" />
            <span className="truncate">{temple.location.city}, {temple.location.state}</span>
          </div>

          {/* Temple Name */}
          <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-vedic-goldLight transition-colors leading-snug line-clamp-1">
            {temple.name}
          </h3>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Devanagari / Local Name & Deity */}
        <div className="space-y-2">
          {temple.localName && (
            <p className="text-xs text-stone-500 font-serif italic line-clamp-1">
              {temple.localName}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/60">
              <Sparkles className="w-3 h-3 mr-1 text-vedic-saffron" />
              {temple.deity.primary.split('(')[0]}
            </span>

            {temple.history?.architecturalStyle && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-stone-700">
                {temple.history.architecturalStyle.split('(')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Timings snippet */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center space-x-1.5 truncate max-w-[190px]" title={temple.darshanTimings?.generalTimings}>
            <Clock className="w-3.5 h-3.5 text-vedic-saffron shrink-0" />
            <span className="truncate">{temple.darshanTimings?.generalTimings || 'Standard Darshan Hours'}</span>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center space-x-1 text-[11px] font-semibold text-vedic-maroon hover:text-vedic-saffronDark bg-stone-100 hover:bg-amber-100 px-2 py-0.5 rounded transition-colors"
            title="Navigate on Google Maps"
          >
            <Navigation className="w-3 h-3 text-vedic-saffron" />
            <span>Map</span>
          </a>
        </div>

        {/* Footer Actions */}
        <div className="pt-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-vedic-saffronDark group-hover:text-vedic-maroon flex items-center space-x-1 transition-colors">
            <span>{t('viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

      </div>
    </div>
  );
}
