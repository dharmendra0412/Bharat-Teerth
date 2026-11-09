import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { MapPin, Navigation, ExternalLink, Filter, Layers, Search, Sparkles } from 'lucide-react';

export default function InteractiveMap({ temples = [], onSelectTemple, selectedCircuit = '' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const tileLayersRef = useRef({});

  const [activeFilterDeity, setActiveFilterDeity] = useState('All');
  const [activeFilterState, setActiveFilterState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState('osm'); // 'osm' | 'topo' | 'satellite'

  // Extract authentic distinct deities & states dynamically
  const uniqueStates = useMemo(() => {
    return ['All', ...new Set(temples.map(t => t.location?.state).filter(Boolean))].sort();
  }, [temples]);

  const deitiesList = useMemo(() => {
    return ['All', ...new Set(temples.map(t => t.deity?.primary?.split('(')[0]?.trim()).filter(Boolean))].sort();
  }, [temples]);

  // Filter temples based on user selection & search query
  const filteredTemples = useMemo(() => {
    return temples.filter(t => {
      if (!t.location?.coordinates?.lat || !t.location?.coordinates?.lng) return false;
      if (activeFilterDeity !== 'All' && !t.deity?.primary?.toLowerCase().includes(activeFilterDeity.toLowerCase())) return false;
      if (activeFilterState !== 'All' && t.location.state !== activeFilterState) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.name?.toLowerCase().includes(q);
        const matchesCity = t.location?.city?.toLowerCase().includes(q);
        const matchesDeity = t.deity?.primary?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesDeity) return false;
      }
      return true;
    });
  }, [temples, activeFilterDeity, activeFilterState, searchQuery]);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of India: Lat 21.5, Lng 79.5
      const map = L.map(mapContainerRef.current, {
        center: [22.0, 79.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        scrollWheelZoom: true
      });

      // 100% Free Open-Source Tile Layers (Zero Watermarks, Zero API Keys Required)
      const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });

      const topoLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri, USGS, NOAA',
        maxZoom: 19
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Source: Esri, Maxar, Earthstar Geographics, GIS User Community',
        maxZoom: 19
      });

      // Default to crisp OpenStreetMap
      osmLayer.addTo(map);

      tileLayersRef.current = {
        osm: osmLayer,
        topo: topoLayer,
        satellite: satelliteLayer
      };

      // Create Custom Vedic Styled Marker Cluster Group
      const clusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 45,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: function(cluster) {
          const count = cluster.getChildCount();
          let sizeClass = 'small';
          let dimension = 36;
          if (count > 50) {
            sizeClass = 'large';
            dimension = 46;
          } else if (count > 15) {
            sizeClass = 'medium';
            dimension = 40;
          }

          return L.divIcon({
            html: `
              <div style="
                background: linear-gradient(135deg, #FF6F00, #800020);
                width: ${dimension}px;
                height: ${dimension}px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFFDF9;
                font-family: 'Inter', sans-serif;
                font-weight: 700;
                font-size: ${dimension > 40 ? '13px' : '11px'};
                box-shadow: 0 4px 12px rgba(128, 0, 32, 0.45);
                border: 2px solid #D4AF37;
              ">
                <span>${count}</span>
              </div>
            `,
            className: 'custom-cluster-marker',
            iconSize: L.point(dimension, dimension)
          });
        }
      });

      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map stays persistent
    };
  }, []);

  // Handle Base Tile Layer Switch
  const switchLayer = (type) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.entries(tileLayersRef.current).forEach(([k, layer]) => {
      if (k === type) {
        if (!map.hasLayer(layer)) map.addLayer(layer);
      } else {
        if (map.hasLayer(layer)) map.removeLayer(layer);
      }
    });
    setActiveLayer(type);
  };

  // Update Markers with Clustering when filteredTemples changes
  useEffect(() => {
    if (!mapInstanceRef.current || !clusterGroupRef.current) return;

    const clusterGroup = clusterGroupRef.current;
    clusterGroup.clearLayers();

    const markers = [];

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
          <div style="position: relative; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background-color: #2A0808;">
            <img src="${temple.imageUrl}" alt="${temple.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/images/temples/somnath-jyotirlinga.jpg'" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.85)); padding: 4px 8px; color: #fff; font-size: 10px; font-weight: 600;">
              ${temple.location.city}, ${temple.location.state}
            </div>
          </div>
          <h4 style="font-family: 'Cinzel', serif; font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: #800020; line-height: 1.3;">
            ${temple.name}
          </h4>
          <p style="font-size: 11px; color: #666; margin: 0 0 6px 0;">
            <strong>Deity:</strong> ${temple.deity.primary}
          </p>
          <div style="background: #FDFBF7; border: 1px solid #E8DFD8; border-radius: 6px; padding: 4px 8px; font-size: 10px; margin-bottom: 8px; color: #555;">
            🕒 <strong>Darshan:</strong> ${temple.darshanTimings.generalTimings.substring(0, 36)}...
          </div>
          <div style="display: flex; gap: 6px;">
            <button 
              id="btn-view-${temple.id}"
              style="
                flex: 1;
                background: linear-gradient(135deg, #FF6F00, #800020);
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 6px 8px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
              "
            >
              View Details →
            </button>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                background: #F5EFEB;
                color: #800020;
                border: 1px solid #D4AF37;
                border-radius: 6px;
                padding: 6px 8px;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
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
        if (btn && onSelectTemple) {
          btn.onclick = () => onSelectTemple(temple.id);
        }
      });

      markers.push(marker);
    });

    clusterGroup.addLayers(markers);

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

        {/* Filters & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search temple / town..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron w-36 sm:w-44"
            />
          </div>

          {/* Deity Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-stone-500 font-medium">Deity:</span>
            <select
              value={activeFilterDeity}
              onChange={(e) => setActiveFilterDeity(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron max-w-[130px] truncate"
            >
              <option value="All">All Deities ({deitiesList.length - 1})</option>
              {deitiesList.filter(d => d !== 'All').map(d => (
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
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-vedic-saffron max-w-[130px] truncate"
            >
              <option value="All">All States ({uniqueStates.length - 1})</option>
              {uniqueStates.filter(st => st !== 'All').map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Map Layer Switcher: Street vs Topo vs Satellite */}
          <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5 text-xs">
            <button
              onClick={() => switchLayer('osm')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                activeLayer === 'osm' 
                  ? 'bg-vedic-maroon text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Official OpenStreetMap Standard"
            >
              Street
            </button>
            <button
              onClick={() => switchLayer('topo')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                activeLayer === 'topo' 
                  ? 'bg-vedic-maroon text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Esri Topographic Relief"
            >
              Topo
            </button>
            <button
              onClick={() => switchLayer('satellite')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                activeLayer === 'satellite' 
                  ? 'bg-vedic-maroon text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Satellite Imagery"
            >
              Satellite
            </button>
          </div>

          {/* Plotted Count Badge */}
          <div className="text-xs px-2.5 py-1.5 bg-amber-100 text-amber-900 rounded-lg font-semibold">
            {filteredTemples.length} Plotted
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[620px] z-10"
        style={{ minHeight: '520px' }}
      />
    </div>
  );
}
