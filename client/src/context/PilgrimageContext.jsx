import React, { createContext, useContext, useState, useEffect } from 'react';

const PilgrimageContext = createContext(null);

export function PilgrimageProvider({ children }) {
  const [plannedTemples, setPlannedTemples] = useState(() => {
    try {
      const saved = localStorage.getItem('bharat_teerth_yatra_plan');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [yatraMeta, setYatraMeta] = useState(() => {
    try {
      const saved = localStorage.getItem('bharat_teerth_yatra_meta');
      return saved ? JSON.parse(saved) : {
        title: 'My Sacred Bharat Pilgrimage',
        startDate: '',
        devoteesCount: 2,
        notes: ''
      };
    } catch (e) {
      return { title: 'My Sacred Bharat Pilgrimage', startDate: '', devoteesCount: 2, notes: '' };
    }
  });

  useEffect(() => {
    localStorage.setItem('bharat_teerth_yatra_plan', JSON.stringify(plannedTemples));
  }, [plannedTemples]);

  useEffect(() => {
    localStorage.setItem('bharat_teerth_yatra_meta', JSON.stringify(yatraMeta));
  }, [yatraMeta]);

  const addToPlan = (temple) => {
    if (!plannedTemples.some(t => t.id === temple.id)) {
      setPlannedTemples(prev => [...prev, temple]);
      return true;
    }
    return false;
  };

  const removeFromPlan = (templeId) => {
    setPlannedTemples(prev => prev.filter(t => t.id !== templeId));
  };

  const isPlanned = (templeId) => {
    return plannedTemples.some(t => t.id === templeId);
  };

  const clearPlan = () => {
    setPlannedTemples([]);
  };

  const moveOrder = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= plannedTemples.length) return;
    const updated = [...plannedTemples];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setPlannedTemples(updated);
  };

  return (
    <PilgrimageContext.Provider
      value={{
        plannedTemples,
        addToPlan,
        removeFromPlan,
        isPlanned,
        clearPlan,
        moveOrder,
        yatraMeta,
        setYatraMeta
      }}
    >
      {children}
    </PilgrimageContext.Provider>
  );
}

export function usePilgrimage() {
  const context = useContext(PilgrimageContext);
  if (!context) {
    throw new Error('usePilgrimage must be used within a PilgrimageProvider');
  }
  return context;
}

