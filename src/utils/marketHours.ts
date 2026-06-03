/**
 * Market Hours utility check for Indian Stock Market (NSE/BSE).
 * Standard Indian Market timings are Monday to Friday, 9:15 AM to 3:30 PM IST.
 */

/**
 * Normalizes input or current time to Indian Standard Time (IST - UTC + 5:30)
 */
export function getISTDateTime(): { 
  weekday: string; 
  hours: number; 
  minutes: number; 
  seconds: number; 
  timeString: string;
  isWeekend: boolean;
  fullDateString: string;
} {
  const now = new Date();
  
  try {
    // Elegant standard formatter for Asia/Kolkata
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      weekday: 'short'
    });
    
    const parts = formatter.formatToParts(now);
    const getVal = (type: string) => parts.find(p => p.type === type)?.value || '';
    
    const weekday = getVal('weekday'); // Sat, Sun, Mon, Tue, etc.
    const hours = parseInt(getVal('hour'), 10);
    const minutes = parseInt(getVal('minute'), 10);
    const seconds = parseInt(getVal('second'), 10);
    const month = getVal('month');
    const day = getVal('day');
    const year = getVal('year');

    const isWeekend = weekday === 'Sat' || weekday === 'Sun';
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const fullDateString = `${weekday}, ${day} ${month} ${year}`;

    return {
      weekday,
      hours,
      minutes,
      seconds,
      timeString,
      isWeekend,
      fullDateString
    };
  } catch (error) {
    // Safe manual ISO-conversion fallback in case Intl.DateTimeFormat fails
    // IST is UTC + 5:30
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utcTime + (3600000 * 5.5));
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = days[istTime.getDay()];
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const seconds = istTime.getSeconds();
    const isWeekend = istTime.getDay() === 0 || istTime.getDay() === 6;
    
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const fullDateString = `${weekday}, ${istTime.getDate()}/${istTime.getMonth() + 1}/${istTime.getFullYear()}`;

    return {
      weekday,
      hours,
      minutes,
      seconds,
      timeString,
      isWeekend,
      fullDateString
    };
  }
}

/**
 * Checks whether the market is currently open according to Indian Standard Time (IST)
 */
export function isMarketOpen(): boolean {
  const { weekday, hours, minutes, isWeekend } = getISTDateTime();
  
  if (isWeekend) {
    return false;
  }
  
  const minutesSinceMidnight = hours * 60 + minutes;
  const openTimeMinutes = 9 * 60 + 15;  // 09:15
  const closeTimeMinutes = 15 * 60 + 30; // 15:30
  
  return minutesSinceMidnight >= openTimeMinutes && minutesSinceMidnight <= closeTimeMinutes;
}

/**
 * Helpful helper to explain status
 */
export function getMarketStatusExplanation(): {
  isOpen: boolean;
  reason: string;
  nextSession: string;
} {
  const { weekday, hours, minutes, isWeekend, timeString } = getISTDateTime();
  const isOpen = isMarketOpen();

  if (isWeekend) {
    return {
      isOpen: false,
      reason: `Weekend Closed (${weekday})`,
      nextSession: 'Monday 09:15 AM IST'
    };
  }

  const minutesSinceMidnight = hours * 60 + minutes;
  const openTimeMinutes = 9 * 60 + 15;
  const closeTimeMinutes = 15 * 60 + 30;

  if (minutesSinceMidnight < openTimeMinutes) {
    return {
      isOpen: false,
      reason: `Pre-Market Closed (${timeString} IST)`,
      nextSession: 'Today 09:15 AM IST'
    };
  } else if (minutesSinceMidnight > closeTimeMinutes) {
    const isFriday = weekday === 'Fri';
    return {
      isOpen: false,
      reason: `Post-Market Closed (${timeString} IST)`,
      nextSession: isFriday ? 'Monday 09:15 AM IST' : 'Tomorrow 09:15 AM IST'
    };
  }

  return {
    isOpen: true,
    reason: 'NSE Market is open & active',
    nextSession: 'Closes at 03:30 PM IST'
  };
}
