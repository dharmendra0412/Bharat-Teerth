// Calculates whether a temple is open right now based on Indian Standard Time (IST)

export function getDarshanStatus(generalTimingsStr) {
  if (!generalTimingsStr) {
    return { isOpen: true, statusText: "Open for Darshan", color: "emerald" };
  }

  // Get current Indian Standard Time (UTC+5:30)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  const currentHours = ist.getHours();
  const currentMinutes = ist.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  // Common typical patterns in Indian temples:
  // Most are open ~ 06:00 to 12:30 and 16:00 to 21:00
  // Some major ones (Vaishno Devi, Golden Temple) are 24x7
  const lower = generalTimingsStr.toLowerCase();
  if (lower.includes('24 hours') || lower.includes('open 24')) {
    return { isOpen: true, statusText: "Open 24x7", color: "emerald" };
  }

  // If between 05:30 AM (330m) and 12:30 PM (750m) -> Morning Darshan
  if (currentTimeVal >= 330 && currentTimeVal <= 750) {
    return { isOpen: true, statusText: "Open Now • Morning Darshan", color: "emerald" };
  }

  // If between 12:30 PM (750m) and 04:00 PM (960m) -> Afternoon Rest Break
  if (currentTimeVal > 750 && currentTimeVal < 960) {
    return { isOpen: false, statusText: "Afternoon Break • Reopens 04:00 PM", color: "amber" };
  }

  // If between 04:00 PM (960m) and 09:45 PM (1305m) -> Evening Darshan
  if (currentTimeVal >= 960 && currentTimeVal <= 1305) {
    return { isOpen: true, statusText: "Open Now • Evening Darshan", color: "emerald" };
  }

  // Night closing
  return { isOpen: false, statusText: "Closed for Night • Opens at 05:30 AM", color: "stone" };
}

// Returns the live pan-Indian Vedic Darshan phase based on current Indian Standard Time (IST)
export function getCurrentAuspiciousDarshanPhase() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const currentMin = hours * 60 + minutes;

  const timeFormatted = ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (currentMin >= 300 && currentMin < 480) { // 5:00 AM - 8:00 AM
    return {
      phase: 'Mangala & Ushahkala Aarti',
      sanskrit: 'मङ्गल आरती • उषाःकाल दर्शन',
      description: 'Morning Awakening & Nirmalya Darshan',
      icon: '🌅',
      status: 'Auspicious Morning Pooja in Progress',
      color: 'emerald',
      istTime: timeFormatted
    };
  } else if (currentMin >= 480 && currentMin < 750) { // 8:00 AM - 12:30 PM
    return {
      phase: 'Madhyana Pooja & Rajbhog',
      sanskrit: 'मध्याह्न पूजा • राजभोग दर्शन',
      description: 'Grand Midday Abhishekam & Annadanam Darshan',
      icon: '☀️',
      status: 'Open for Sarva Darshanam across Subcontinent',
      color: 'emerald',
      istTime: timeFormatted
    };
  } else if (currentMin >= 750 && currentMin < 960) { // 12:30 PM - 4:00 PM
    return {
      phase: 'Aparahna Vishram',
      sanskrit: 'अपराह्न विश्राम • कपाट विश्राम',
      description: 'Afternoon Sanctum Rest (Sanctuaries reopen at 4:00 PM)',
      icon: '🛕',
      status: 'Sanctum Afternoon Rest (Reopens 4 PM)',
      color: 'amber',
      istTime: timeFormatted
    };
  } else if (currentMin >= 960 && currentMin < 1230) { // 4:00 PM - 8:30 PM
    return {
      phase: 'Sandhya Aarti & Deeparadhana',
      sanskrit: 'सन्ध्या आरती • दीपाराधना',
      description: 'Sacred Twilight Lamp Darshan & Dhoop Seva',
      icon: '🪔',
      status: 'Evening Aarti in Progress across Sanctuaries',
      color: 'emerald',
      istTime: timeFormatted
    };
  } else { // 8:30 PM - 5:00 AM
    return {
      phase: 'Shayan Aarti & Ekanta Seva',
      sanskrit: 'शयन आरती • एकान्त सेवा',
      description: 'Sanctum Slumber Ritual (Re-awakens at 5:00 AM)',
      icon: '🌙',
      status: 'Night Rest • Sanctum Re-awakens at 5:00 AM',
      color: 'stone',
      istTime: timeFormatted
    };
  }
}


