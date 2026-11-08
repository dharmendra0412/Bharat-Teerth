import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { PilgrimageProvider } from './context/PilgrimageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import TempleDetailPage from './pages/TempleDetailPage';
import CircuitsPage from './pages/CircuitsPage';
import PlannerPage from './pages/PlannerPage';
import GuidelinesPage from './pages/GuidelinesPage';
import AdminPage from './pages/AdminPage';
import InteractiveMap from './components/InteractiveMap';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTempleId, setSelectedTempleId] = useState(null);

  // Core Data
  const [temples, setTemples] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Global Filter State passed from Home to Explore
  const [filterState, setFilterState] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterTheme, setFilterTheme] = useState('');
  const [filterDeity, setFilterDeity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const [templeRes, circuitRes, metaRes, statsRes] = await Promise.all([
        api.getTemples(),
        api.getCircuits(),
        api.getRegionsMetadata(),
        api.getStats()
      ]);

      if (templeRes.success) setTemples(templeRes.data);
      if (circuitRes.success) setCircuits(circuitRes.data);
      if (metaRes.success) setMetadata(metaRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Error loading initial portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Real session & engagement telemetry tracking directly in MongoDB Atlas
    let sessionId = sessionStorage.getItem('bt_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('bt_session_id', sessionId);
    }

    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    const startTime = Date.now();
    const sendPing = () => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      api.sendTelemetryPing({
        sessionId,
        deviceType,
        durationSeconds,
        page: window.location.pathname || '/'
      });
    };

    sendPing();
    const interval = setInterval(sendPing, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectTemple = (templeId) => {
    setSelectedTempleId(templeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDirectory = () => {
    setSelectedTempleId(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedTempleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <PilgrimageProvider>
        <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#1E201E]">
          
          {/* Navigation Bar */}
          <Navbar 
            activeTab={selectedTempleId ? 'explore' : activeTab} 
            setActiveTab={handleTabChange} 
            onSelectTemple={handleSelectTemple}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {selectedTempleId ? (
              <TempleDetailPage
                templeId={selectedTempleId}
                onBack={handleBackToDirectory}
                onSelectTemple={handleSelectTemple}
              />
            ) : (
              <>
                {activeTab === 'home' && (
                  <HomePage
                    temples={temples}
                    metadata={metadata}
                    circuits={circuits}
                    stats={stats}
                    onSelectTemple={handleSelectTemple}
                    setActiveTab={handleTabChange}
                    setFilterState={setFilterState}
                    setFilterRegion={setFilterRegion}
                    setFilterTheme={setFilterTheme}
                    setFilterDeity={setFilterDeity}
                    setSearchQuery={setSearchQuery}
                  />
                )}

                {activeTab === 'explore' && (
                  <ExplorePage
                    temples={temples}
                    metadata={metadata}
                    circuits={circuits}
                    onSelectTemple={handleSelectTemple}
                    filterState={filterState}
                    setFilterState={setFilterState}
                    filterRegion={filterRegion}
                    setFilterRegion={setFilterRegion}
                    filterTheme={filterTheme}
                    setFilterTheme={setFilterTheme}
                    filterDeity={filterDeity}
                    setFilterDeity={setFilterDeity}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                )}

                {activeTab === 'circuits' && (
                  <CircuitsPage
                    circuits={circuits}
                    temples={temples}
                    onSelectTemple={handleSelectTemple}
                  />
                )}

                {activeTab === 'map' && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                    <div>
                      <h1 className="font-serif font-black text-3xl sm:text-4xl text-vedic-maroon tracking-tight">
                        Interactive India Temple Heritage Map
                      </h1>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1">
                        Explore exact geospatial coordinates of temples across the subcontinent with direct Google Maps route calculation.
                      </p>
                    </div>

                    <InteractiveMap
                      temples={temples}
                      onSelectTemple={handleSelectTemple}
                    />
                  </div>
                )}

                {activeTab === 'guidelines' && (
                  <GuidelinesPage />
                )}

                {activeTab === 'planner' && (
                  <PlannerPage
                    onSelectTemple={handleSelectTemple}
                    setActiveTab={handleTabChange}
                  />
                )}

                {activeTab === 'admin' && (
                  <AdminPage
                    onSelectTemple={handleSelectTemple}
                    refreshAllTemples={loadData}
                  />
                )}
              </>
            )}
          </main>

          {/* Cultural Footer */}
          <Footer setActiveTab={handleTabChange} />

        </div>
      </PilgrimageProvider>
    </AuthProvider>
  </LanguageProvider>
);
}

