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

