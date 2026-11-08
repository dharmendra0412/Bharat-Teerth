import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Compass, PhoneCall } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-[#140806] text-stone-300 pt-16 pb-10 border-t-2 border-vedic-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Mandate */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🛕</span>
              <div>
                <span className="font-serif font-black text-xl text-white tracking-wider">
                  BHARAT TEERTH
                </span>
                <p className="text-[11px] text-vedic-gold uppercase tracking-widest font-semibold">
                  National Temple Heritage Portal
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              A centralized digital repository providing authentic, verified, and complete heritage information for temples across India. Created to support pilgrims, cultural researchers, and tourists with authentic, certified shrine records.
            </p>
            <div className="p-3 bg-stone-900/80 rounded-xl border border-vedic-gold/20 flex items-start space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-vedic-gold shrink-0 mt-0.5" />
              <div className="text-[11px] text-stone-300">
                <span className="font-semibold text-white block">Official Verification Benchmark</span>
                Data corroborated against Archaeological Survey of India (ASI) records and State Endowments & Devaswom boards.
              </div>
            </div>
          </div>

          {/* Quick Pilgrimage Navigation */}
          <div>
            <h4 className="text-sm font-serif font-bold text-vedic-gold uppercase tracking-wider mb-4 border-l-2 border-vedic-saffron pl-2.5">
              Pilgrimage Circuits
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setActiveTab('circuits')} className="hover:text-vedic-gold transition-colors flex items-center space-x-1.5">
                  <span>•</span> <span>12 Jyotirlinga Circuit (द्वादश ज्योतिर्लिंग)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('circuits')} className="hover:text-vedic-gold transition-colors flex items-center space-x-1.5">
                  <span>•</span> <span>Maha Char Dham (बद्रीनाथ, जगन्नाथ, रामेश्वरम, द्वारका)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('circuits')} className="hover:text-vedic-gold transition-colors flex items-center space-x-1.5">
                  <span>•</span> <span>Uttarakhand Chota Char Dham</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('circuits')} className="hover:text-vedic-gold transition-colors flex items-center space-x-1.5">
                  <span>•</span> <span>51 Sacred Shakti Peethas</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('circuits')} className="hover:text-vedic-gold transition-colors flex items-center space-x-1.5">
                  <span>•</span> <span>Pancha Bhoota Stalam (TN & AP)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('circuits')} className="hover:text-vedic-gold transition-colors flex items-center space-x-1.5">
                  <span>•</span> <span>Ashtavinayak Yatra (Maharashtra)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional References */}
          <div>
            <h4 className="text-sm font-serif font-bold text-vedic-gold uppercase tracking-wider mb-4 border-l-2 border-vedic-saffron pl-2.5">
              Recognized Authorities
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a 
                  href="https://www.incredibleindia.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white flex items-center justify-between group"
                >
                  <span>Incredible India (Ministry of Tourism)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600 group-hover:text-vedic-gold" />
                </a>
              </li>
              <li>
                <a 
                  href="https://asi.nic.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white flex items-center justify-between group"
                >
                  <span>Archaeological Survey of India (ASI)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600 group-hover:text-vedic-gold" />
                </a>
              </li>
              <li>
                <a 
                  href="https://ttdevasthanams.ap.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white flex items-center justify-between group"
                >
                  <span>Tirumala Tirupati Devasthanams (TTD)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600 group-hover:text-vedic-gold" />
                </a>
              </li>
              <li>
                <a 
                  href="https://shrikashivishwanath.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white flex items-center justify-between group"
                >
                  <span>Shri Kashi Vishwanath Temple Trust</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600 group-hover:text-vedic-gold" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.unifiedmentor.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white flex items-center justify-between group"
                >
                  <span>Unified Mentor Project Initiative</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600 group-hover:text-vedic-gold" />
                </a>
              </li>
            </ul>
          </div>

          {/* Pilgrim Guidelines & Safety */}
          <div>
            <h4 className="text-sm font-serif font-bold text-vedic-gold uppercase tracking-wider mb-4 border-l-2 border-vedic-saffron pl-2.5">
              Pilgrim Safety & Conduct
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <p>
                Strict dress codes apply across Indian temples. Maintain sacred silence and verify biometric passes on official trust portals prior to high-rush yatras.
              </p>
              <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 text-[11px] space-y-1">
                <div className="flex items-center space-x-1.5 text-vedic-saffron">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span className="font-semibold">National Tourism Helpline</span>
                </div>
                <div className="text-stone-300 font-mono">Dial: 1363 / 1800-11-1363 (24x7 Toll-Free)</div>
              </div>
              <button
                onClick={() => setActiveTab('guidelines')}
                className="text-[11px] text-vedic-gold hover:underline flex items-center space-x-1"
              >
                <span>Read Visitor Guidelines & Sacred Etiquette</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} Bharat Teerth Heritage Portal.</span>
            <span>•</span>
            <span>All rights reserved. Dedicated to the preservation of Indian sacred culture.</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-vedic-gold text-[11px]">सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः</span>
            <span className="text-stone-600">|</span>
            <button 
              onClick={() => setActiveTab('admin')} 
              className="text-stone-500 hover:text-stone-300 text-[11px]"
            >
              Admin Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

