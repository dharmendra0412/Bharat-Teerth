import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Users, 
  Camera, 
  Footprints, 
  HelpCircle, 
  PhoneCall, 
  HeartHandshake 
} from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-vedic-saffronDark uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-vedic-saffron" />
          <span>Sanctity, Conduct & Etiquette</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-vedic-maroon tracking-tight">
          Visitor Guidelines & Temple Code of Conduct
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          Indian temples are living sacred energy spaces governed by ancient Agama and Vedic traditions. Respecting institutional dress codes, queue discipline, and sacred decorum ensures an auspicious pilgrimage.
        </p>
      </div>

      {/* Dress Code Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg">
            👗
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Mandatory Traditional Dress Codes
            </h2>
            <p className="text-xs text-stone-500">
              Mandated by High Courts and State Endowments Boards across major Indian temples.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Men's Attire */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h3 className="font-serif font-bold text-sm text-vedic-maroon flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Recommended Attire for Men</span>
            </h3>
            <ul className="text-xs text-stone-700 space-y-2 list-disc pl-4">
              <li><strong>South India (Tirupati, Madurai, Rameswaram):</strong> Pure white cotton Dhoti (Veshti) with Angavastram or Kurta-Pyjama.</li>
              <li><strong>Kerala Temples (Padmanabhaswamy, Guruvayur):</strong> Plain white Mundu worn around waist with bare chest; upper body must remain bare during inner sanctum darshan.</li>
              <li><strong>North & Central Jyotirlingas (Kashi, Mahakaleshwar):</strong> Unstitched Dhoti (Sola) required for direct Sparsh Darshan / Bhasma Aarti.</li>
              <li><strong>Golden Temple (Amritsar):</strong> Modest attire covering shoulders and legs; head must remain covered with a scarf or rumal at all times.</li>
            </ul>
          </div>

          {/* Women's Attire */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h3 className="font-serif font-bold text-sm text-vedic-maroon flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Recommended Attire for Women</span>
            </h3>
            <ul className="text-xs text-stone-700 space-y-2 list-disc pl-4">
              <li><strong>Traditional Saree:</strong> Suitable and reverently accepted at every temple across India.</li>
              <li><strong>Salwar Kameez / Churidar:</strong> Permissible when worn with a properly pinned Dupatta. Half-sarees (Pavadai-Davani) are customary in South India.</li>
              <li><strong>Kerala Shrines:</strong> Traditional Kasavu Set-Mundu or Saree preferred.</li>
              <li><strong>Head Covering:</strong> Required in Gurdwaras (Golden Temple) and customary in North Indian shrines during Aarti.</li>
            </ul>
          </div>

        </div>

        {/* Prohibited Clothes */}
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-xs text-red-900">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Strictly Prohibited Attire Across Major Shrines:</strong>
            Shorts, bermudas, lungis, capris, mini-skirts, sleeveless tops, ripped jeans, low-waist trousers, and transparent fabrics are strictly banned at entry security gates.
          </div>
        </div>
      </section>

      {/* Electronics & Footwear Protocols */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mobile & Gadgets */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6 text-vedic-saffron" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Electronics, Cameras & Photography
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            By orders of various High Courts and Temple Administration Trusts, photography inside the sanctum sanctorum (Garbhagriha) is strictly prohibited across India.
          </p>
          <ul className="text-xs text-stone-700 space-y-2 list-disc pl-4">
            <li>Mobile phones, smartwatches, and video cameras must be deposited at automated institutional lockers before queue entry.</li>
            <li>Do not carry leather items (belts, wallets, bags) into sanctum areas.</li>
            <li>Maintain queue silence and avoid loud ringtones or speaker calls on temple grounds.</li>
          </ul>
        </div>

        {/* Footwear & Purification */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <Footprints className="w-6 h-6 text-vedic-saffron" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Footwear & Purificatory Traditions
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Wearing shoes, sandals, or socks is completely forbidden on sacred temple grounds.
          </p>
          <ul className="text-xs text-stone-700 space-y-2 list-disc pl-4">
            <li>Deposit shoes at the free official Joda Ghar / Footwear counters at the gateway.</li>
            <li>Wash feet in the running water channel or sacred footbath before stepping onto marble or granite parikramas.</li>
            <li>If taking a holy dip in temple tanks (Pushkarini / Teertham / Amrit Sarovar), change into dry clothes prior to sanctum entry.</li>
          </ul>
        </div>

      </section>

      {/* Amenities for Seniors & Divyangjan */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-4">
        <div className="flex items-center space-x-3 text-amber-900">
          <Users className="w-6 h-6 text-vedic-saffron" />
          <h3 className="font-serif font-bold text-xl">
            Special Facilities for Senior Citizens & Divyangjan (Disabled Devotees)
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Most major Indian shrines have dedicated concessions to accommodate pilgrims with limited mobility:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-amber-200/60 space-y-1">
            <strong className="text-vedic-maroon block font-serif">Priority Counter Slots</strong>
            <p className="text-stone-600">TTD Tirumala and Kashi Vishwanath operate dedicated daily time slots for senior citizens (65+) and differently-abled devotees with zero wait time.</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200/60 space-y-1">
            <strong className="text-vedic-maroon block font-serif">Free Electric Buggies</strong>
            <p className="text-stone-600">Eco-friendly battery-operated shuttles ply continuously between bus stops, parking areas, and temple gates in Tirumala, Ujjain, and Katra.</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200/60 space-y-1">
            <strong className="text-vedic-maroon block font-serif">Palki, Pony & Helicopter Services</strong>
            <p className="text-stone-600">For high-altitude Himalayan pilgrimages (Kedarnath, Vaishno Devi), fixed government-tariff Dolis, ponies, and helicopter flights are operational.</p>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="p-6 bg-stone-900 text-stone-300 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <PhoneCall className="w-6 h-6 text-vedic-gold shrink-0" />
          <div>
            <span className="font-bold text-white text-sm block">Government of India National Tourist Helpline</span>
            <span>24x7 Multi-lingual Emergency Support for Pilgrims and Tourists</span>
          </div>
        </div>
        <div className="text-vedic-gold font-mono font-bold text-base">
          1363 (Toll Free within India) / +91-11-23365358
        </div>
      </section>

    </div>
  );
}

