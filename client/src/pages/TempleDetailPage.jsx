import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePilgrimage } from '../context/PilgrimageContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  BookOpen, 
  Plane, 
  Train, 
  Bus, 
  Home, 
  Utensils, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Share2, 
  Printer, 
  ArrowLeft, 
  PhoneCall, 
  Globe, 
  MessageSquare, 
  Star,
  Check 
} from 'lucide-react';

export default function TempleDetailPage({ templeId, onBack, onSelectTemple }) {
  const [temple, setTemple] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // New Review Form State
  const [authorName, setAuthorName] = useState('');
  const [authorCity, setAuthorCity] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const { isPlanned, addToPlan, removeFromPlan } = usePilgrimage();
  const { t, language } = useLanguage();

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      try {
        const res = await api.getTempleById(templeId);
        if (res.success) {
          setTemple(res.data);
          setNearby(res.nearby || []);
          setReviews(res.verifiedTips || []);
        }
      } catch (err) {
        console.error('Error loading temple details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [templeId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewContent.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.submitTip({
        templeId,
        author: authorName,
        location: authorCity || 'India',
        content: reviewContent,
        rating: reviewRating
      });
      if (res.success) {
        setReviews(prev => [res.data, ...prev]);
        setReviewSuccessMsg('Your practical pilgrim advice has been recorded and published!');
        setAuthorName('');
        setAuthorCity('');
        setReviewContent('');
        setTimeout(() => setReviewSuccessMsg(''), 5000);
      }
    } catch (err) {
      alert('Error submitting tip: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: temple?.name,
          text: `Explore authentic history, darshan timings, and guidelines for ${temple?.name} on Bharat Teerth.`,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      } catch (err) {
        // fallback
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${temple?.name}* (${temple?.location?.city}, ${temple?.location?.state})\nExplore authentic history, daily pooja schedule, darshan timings, and guidelines on Bharat Teerth:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl animate-bounce">🛕</div>
        <p className="text-sm font-serif font-bold text-vedic-maroon">
          Accessing verified temple records from national heritage repository...
        </p>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-stone-600">Temple record could not be loaded.</p>
        <button onClick={onBack} className="px-4 py-2 bg-vedic-saffron text-white rounded-xl text-xs font-semibold">
          Return to Temple Directory
        </button>
      </div>
    );
  }

  const planned = isPlanned(temple.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-vedic-maroon transition-colors bg-white px-3 py-2 rounded-xl border border-stone-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToTemples')}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleShare}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all shadow-sm ${
              copiedLink
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
            }`}
            title="Share temple or copy link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? t('linkCopied') : t('share')}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-medium transition-all shadow-sm"
            title="Share on WhatsApp"
          >
            <span className="text-sm">💬</span>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printGuidelines')}</span>
          </button>

          <button
            onClick={() => planned ? removeFromPlan(temple.id) : addToPlan(temple)}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              planned
                ? 'bg-vedic-saffron text-white shadow-vedic-saffron/30'
                : 'bg-vedic-maroon text-white hover:bg-vedic-maroonDark'
            }`}
          >
            {planned ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{planned ? t('savedInYatra') : t('addToYatra')}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-stone-900 text-white min-h-[380px] flex flex-col justify-end p-6 sm:p-10 border-2 border-vedic-gold/40">
        
        {/* Background Image */}
        <img
          src={temple.imageUrl}
          alt={temple.name}
          className="absolute inset-0 w-full h-full object-cover opacity-45"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/temples/somnath-jyotirlinga.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Content over image */}
        <div className="relative z-10 space-y-4 max-w-4xl">
          
          <div className="flex flex-wrap items-center gap-2">
            {temple.verificationStatus === 'verified' && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-vedic-maroon/90 text-vedic-goldLight text-xs font-semibold border border-vedic-gold/40 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-vedic-gold" />
                <span>{temple.verifiedBy || 'ASI & Devasthanam Verified'}</span>
              </span>
            )}

            {temple.history?.architecturalStyle && (
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                {temple.history.architecturalStyle}
              </span>
            )}
          </div>

          <div>
            {temple.localName && (
              <p className="font-serif italic text-base sm:text-lg text-vedic-goldLight mb-1">
                {temple.localName}
              </p>
            )}
            <h1 className="font-serif font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {temple.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-200 pt-1">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-vedic-gold" />
              <span>{temple.location.address || `${temple.location.city}, ${temple.location.state}`}</span>
            </span>

            <span>•</span>

            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-vedic-gold" />
              <span><strong>Presiding:</strong> {temple.deity.primary}</span>
            </span>
          </div>

        </div>

      </div>

      {/* Fast Facts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-xs">
        <div>
          <span className="text-stone-400 block font-medium">State / Region</span>
          <span className="font-semibold text-stone-900 text-sm">{temple.location.state}</span>
        </div>
        <div>
          <span className="text-stone-400 block font-medium">Consecration Era</span>
          <span className="font-semibold text-stone-900 text-sm">{temple.history?.consecrationEra || 'Ancient Period'}</span>
        </div>
        <div>
          <span className="text-stone-400 block font-medium">Ruling Patron Dynasty</span>
          <span className="font-semibold text-stone-900 text-sm">{temple.history?.dynasty || 'Various Historic Dynasties'}</span>
        </div>
        <div>
          <span className="text-stone-400 block font-medium">General Darshan Hours</span>
          <span className="font-semibold text-vedic-saffronDark text-sm">{temple.darshanTimings?.generalTimings || '06:00 AM - 09:00 PM'}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-stone-200 flex space-x-2 sm:space-x-8 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: t('tabOverview'), icon: BookOpen },
          { id: 'darshan', label: t('tabTimings'), icon: Clock },
          { id: 'festivals', label: t('festivalsCalendar', 'Festivals Calendar'), icon: Calendar },
          { id: 'guidelines', label: t('tabGuidelines'), icon: ShieldCheck },
          { id: 'facilities', label: t('tabFacilities'), icon: Home },
          { id: 'reviews', label: `${t('tabTips')} (${reviews.length})`, icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-vedic-saffron text-vedic-maroon bg-vedic-saffronLight/20 rounded-t-lg'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-vedic-saffron' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Sthala Purana & History */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-vedic-maroon mb-2 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-vedic-saffron" />
                <span>Spiritual Significance & Sthala Purana</span>
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                {temple.deity.significance}
              </p>
            </div>

            {temple.deity.secondaryDeities && temple.deity.secondaryDeities.length > 0 && (
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Subsidiary Deities & Parivara Devatas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {temple.deity.secondaryDeities.map((sec, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200/60">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100">
              <h3 className="font-serif font-bold text-xl text-vedic-maroon mb-2 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-vedic-saffron" />
                <span>Historical Background & Archaeological Records</span>
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                {temple.history?.historicalBackground}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Darshan Timings & Daily Poojas */}
      {activeTab === 'darshan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            {/* General Timings Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Daily General Public Darshan Hours</span>
                <span className="font-serif font-bold text-lg text-vedic-maroon">
                  {temple.darshanTimings?.generalTimings}
                </span>
              </div>
              <div className="text-xs text-stone-600 max-w-sm">
                <strong>Peak Rush Note:</strong> {temple.darshanTimings?.peakRushHours || 'Mondays, weekends, and major festival days.'}
              </div>
            </div>

            {/* Daily Pooja Schedule Table */}
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
                Sacred Daily Kainkaryams & Pooja Timetable
              </h3>
              
              {temple.darshanTimings?.dailyPoojaSchedule && temple.darshanTimings.dailyPoojaSchedule.length > 0 ? (
                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Ritual / Pooja Name</th>
                        <th className="py-3 px-4">Timing</th>
                        <th className="py-3 px-4">Significance & Sacred Procedure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {temple.darshanTimings.dailyPoojaSchedule.map((p, i) => (
                        <tr key={i} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-vedic-maroon whitespace-nowrap">
                            {p.name}
                          </td>
                          <td className="py-3 px-4 font-mono text-stone-700 whitespace-nowrap">
                            {p.time}
                          </td>
                          <td className="py-3 px-4 text-stone-600">
                            {p.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-stone-500">Pooja schedule subject to daily temple trust announcements.</p>
              )}
            </div>

            {/* Special Darshan & Priority Queues */}
            {temple.darshanTimings?.specialDarshan && (
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Special Entry, VIP & Divyangjan Amenities
                </h4>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  {temple.darshanTimings.specialDarshan}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Tab 3: Auspicious Festivals */}
      {activeTab === 'festivals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-vedic-maroon mb-2 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-vedic-saffron" />
                <span>Annual Utsavams & Sacred Festival Calendar</span>
              </h3>
              <p className="text-stone-600 text-xs">
                Authentic celebration schedule based on traditional Hindu Panchanga and lunar calendar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {temple.festivals && temple.festivals.map((fest, idx) => {
                const isObj = typeof fest === 'object' && fest !== null;
                const festName = isObj ? fest.name : fest;
                const festMonth = isObj ? fest.month : null;
                const festDuration = isObj ? fest.duration : null;
                const festSignificance = isObj ? fest.significance : null;

                return (
                  <div key={idx} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-vedic-maroon">
                        {festName}
                      </span>
                      {festDuration && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-vedic-saffron text-white">
                          {festDuration}
                        </span>
                      )}
                    </div>
                    {festMonth && (
                      <div className="text-xs font-medium text-amber-900">
                        <strong>Panchanga Month:</strong> {festMonth}
                      </div>
                    )}
                    {festSignificance && (
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {festSignificance}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Dress Code & Rules */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            {/* Mandatory Dress Code Alert */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-200 space-y-2">
              <div className="flex items-center space-x-2 text-red-900 font-serif font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>Strictly Enforced Temple Dress Code</span>
              </div>
              <p className="text-stone-800 text-xs sm:text-sm font-medium leading-relaxed">
                {temple.visitorGuidelines?.dressCode}
              </p>
            </div>

            {/* Do's and Don'ts */}
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-3">
                Pilgrim Code of Conduct & Sanctity Guidelines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {temple.visitorGuidelines?.dosAndDonts && temple.visitorGuidelines.dosAndDonts.map((rule, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Entry Fee & Accessibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Entry Fee & Tickets</span>
                <p className="text-xs font-semibold text-stone-800">{temple.visitorGuidelines?.entryFee || 'Free Sarva Darshan'}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Accessibility & Senior Citizens</span>
                <p className="text-xs text-stone-700">{temple.visitorGuidelines?.accessibility || 'Wheelchair assistance available upon request.'}</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 5: Logistics & Nearby Facilities */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            <h3 className="font-serif font-bold text-xl text-vedic-maroon mb-2 flex items-center space-x-2">
              <Home className="w-5 h-5 text-vedic-saffron" />
              <span>Connectivity, Accommodation & Pilgrim Facilities</span>
            </h3>

            {/* Transit Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center space-x-2 text-vedic-saffron font-bold text-xs uppercase tracking-wider">
                  <Plane className="w-4 h-4" />
                  <span>Nearest Airport</span>
                </div>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {temple.nearbyFacilities?.nearestAirport || 'Consult State Tourism'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center space-x-2 text-vedic-saffron font-bold text-xs uppercase tracking-wider">
                  <Train className="w-4 h-4" />
                  <span>Nearest Railway Station</span>
                </div>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {temple.nearbyFacilities?.nearestRailwayStation || 'Consult Indian Railways'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center space-x-2 text-vedic-saffron font-bold text-xs uppercase tracking-wider">
                  <Bus className="w-4 h-4" />
                  <span>Road Connectivity</span>
                </div>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {temple.nearbyFacilities?.roadConnectivity || 'State Transport Corporation buses available.'}
                </p>
              </div>
            </div>

            {/* Accommodation & Prasad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Home className="w-4 h-4 text-vedic-saffron" />
                  <span>Devasthanam Choultries & Stay</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {temple.nearbyFacilities?.accommodation}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Utensils className="w-4 h-4 text-vedic-saffron" />
                  <span>Annadanam & Sacred Prasad</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {temple.nearbyFacilities?.prasadAndDining}
                </p>
              </div>
            </div>

            {/* Official Contact Info */}
            {temple.contactInfo && (
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-stone-900 text-stone-300 text-xs">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-vedic-gold" />
                  <span>Official Helpline: <strong className="text-white font-mono">{temple.contactInfo.helpline}</strong></span>
                </div>
                {temple.contactInfo.website && (
                  <a
                    href={temple.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-vedic-gold hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Temple Trust Portal ↗</span>
                  </a>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Tab 6: Verified Pilgrim Tips & Community Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
            
            <div>
              <h3 className="font-serif font-bold text-xl text-vedic-maroon mb-1 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-vedic-saffron" />
                <span>Verified Pilgrim Advice & Practical Experiences</span>
              </h3>
              <p className="text-xs text-stone-600">
                Real, unembellished tips from pilgrims who visited this shrine, helping you navigate queues, lockers, and darshan with ease.
              </p>
            </div>

            {/* Tips List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(tip => (
                  <div key={tip.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-stone-900">{tip.author}</span>
                        <span className="text-[11px] text-stone-500">({tip.location})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(tip.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      "{tip.content}"
                    </p>
                    <div className="text-[10px] text-stone-400">
                      Shared on {tip.date} • Verified Pilgrim
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300 text-xs text-stone-500">
                Be the first verified pilgrim to share practical advice for this shrine.
              </div>
            )}

            {/* Submit Tip Form */}
            <div className="pt-6 border-t border-stone-200 space-y-4">
              <h4 className="font-serif font-bold text-base text-stone-900">
                Contribute Practical Advice for Fellow Pilgrims
              </h4>

              {reviewSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
                  {reviewSuccessMsg}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Krishnan"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-vedic-saffron focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your City / State</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru, Karnataka"
                      value={authorCity}
                      onChange={(e) => setAuthorCity(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-vedic-saffron focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Practical Darshan Advice (footwear counters, best timing, dress code tips, etc.)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share specific, authentic advice to help fellow pilgrims plan better..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-vedic-saffron focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 bg-vedic-saffron hover:bg-vedic-saffronDark text-white rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Pilgrim Experience'}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Nearby Sacred Temples */}
      {nearby.length > 0 && (
        <div className="pt-6 border-t border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-vedic-maroon flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-vedic-saffron" />
              <span>Nearby Sacred Kshetras</span>
            </h3>
            <span className="text-xs text-stone-500">Calculated by geospatial proximity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nearby.map(nb => (
              <div
                key={nb.id}
                onClick={() => onSelectTemple(nb.id)}
                className="bg-white rounded-xl p-3 border border-stone-200 hover:border-vedic-gold shadow-sm hover:shadow-md transition-all cursor-pointer group flex space-x-3 items-center"
              >
                <img
                  src={nb.imageUrl}
                  alt={nb.name}
                  className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-xs text-stone-900 group-hover:text-vedic-maroon truncate">
                    {nb.name}
                  </h4>
                  <div className="text-[11px] text-stone-500 truncate">{nb.city}, {nb.state}</div>
                  <div className="text-[10px] font-semibold text-vedic-saffron mt-0.5">
                    ~{nb.distanceKm} km away
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

