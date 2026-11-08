import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink, Filter, Sparkles } from 'lucide-react';

export default function InteractiveMap({ temples = [], onSelectTemple, selectedCircuit = '' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeFilterDeity, setActiveFilterDeity] = useState('All');
  const [activeFilterState, setActiveFilterState] = useState('All');

  // Filter temples based on user selection
  const filteredTemples = temples.filter(t => {
    if (!t.location?.coordinates?.lat || !t.location?.coordinates?.lng) return false;
    if (activeFilterDeity !== 'All' && !t.deity.primary.toLowerCase().includes(activeFilterDeity.toLowerCase())) return false;
    if (activeFilterState !== 'All' && t.location.state !== activeFilterState) return false;
    return true;
  });

  const uniqueStates = ['All', ...new Set(temples.map(t => t.location?.state).filter(Boolean))].sort();
  const deitiesList = ['All', 'Shiva', 'Vishnu', 'Krishna', 'Rama', 'Devi', 'Ganesha'];

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of India: Lat 21.5, Lng 80.0
      const map = L.map(mapContainerRef.current, {
        center: [21.5, 79.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        scrollWheelZoom: true
      });

      // CartoDB Positron / OSM tiles for clean heritage display
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map persistent while component lives
    };
  }, []);

  // Update Markers when filteredTemples changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredTemples.forEach(temple => {
      const { lat, lng } = temple.location.coordinates;

      // Custom Sacred Temple Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-temple-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #FF6F00, #800020);
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            border: 2px solid #FFFDF9;
          ">
            <span style="transform: rotate(45deg); font-size: 14px;">🛕</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; min-width: 220px; max-width: 260px;">
          <div style="position: relative; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
            <img src="${temple.imageUrl}" alt="${temple.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 4px 8px; color: #fff; font-size: 10px; font-weight: 600;">
              ${temple.location.city}, ${temple.location.state}
            </div>
          </div>
          <h4 style="font-family: 'Cinzel', serif; font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: #800020; line-height: 1.3;">
            ${temple.name}
          </h4>
          <div style="font-size: 11px; color: #555; margin-bottom: 6px;">
            <strong>Deity:</strong> ${temple.deity.primary.split('(')[0]}
          </div>
          <div style="font-size: 10px; color: #777; margin-bottom: 10px;">
            <strong>Hours:</strong> ${temple.darshanTimings?.generalTimings || 'Standard Darshan Hours'}
          </div>
          <div style="display: flex; gap: 6px;">
            <button id="btn-view-${temple.id}" style="
              flex: 1;
              background: #FF6F00;
              color: white;
              border: none;
              padding: 6px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            ">
              View Details
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="
              display: flex;
              align-items: center;
              justify-content: center;
              background: #F4EBE1;
              color: #800020;
              text-decoration: none;
              padding: 6px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
            " title="Directions">
              Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-${temple.id}`);
        if (btn) {
          btn.onclick = () => onSelectTemple(temple.id);
        }
      });

      markersLayerRef.current.addLayer(marker);
    });

  }, [filteredTemples, onSelectTemple]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
      {/* Map Controls Header */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-vedic-maroon flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-vedic-saffron" />
            <span>Interactive Sacred Geography Explorer</span>
          </h3>
          <p className="text-xs text-stone-500">
            Plotting verified coordinates of temples across the Indian subcontinent
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Deity Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-stone-500 font-medium">Deity:</span>
            <select
              value={activeFilterDeity}
              onChange={(e) => setActiveFilterDeity(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron"
            >
              {deitiesList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-stone-500 font-medium">State:</span>
            <select
              value={activeFilterState}
              onChange={(e) => setActiveFilterState(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron"
            >
              {uniqueStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="text-xs px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-semibold">
            {filteredTemples.length} Temples Plotted
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[600px] z-10"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
}

