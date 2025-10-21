/**
 * Formats a Unix timestamp to a readable date string
 * @param timestamp - Unix timestamp in seconds
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 */
export const formatDate = (
  timestamp: number, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Date(timestamp * 1000).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Formats a Unix timestamp to a readable date and time string
 * @param timestamp - Unix timestamp in seconds
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  timestamp: number,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Date(timestamp * 1000).toLocaleString('en-US', defaultOptions);
};

/**
 * Formats a Unix timestamp to a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param timestamp - Unix timestamp in seconds
 * @returns Relative time string
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const targetTime = timestamp * 1000;
  const diffInSeconds = Math.floor((targetTime - now) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      const label = count === 1 ? interval.label : `${interval.label}s`;
      return diffInSeconds < 0 ? `${count} ${label} ago` : `in ${count} ${label}`;
    }
  }
  
  return 'just now';
};

/**
 * Formats a Unix timestamp to show days remaining
 * @param timestamp - Unix timestamp in seconds
 * @returns Days remaining string
 */
export const formatDaysRemaining = (timestamp: number): string => {
  const now = Date.now();
  const targetTime = timestamp * 1000;
  const diffInDays = Math.ceil((targetTime - now) / (1000 * 60 * 60 * 24));
  
  if (diffInDays <= 0) {
    return 'Expired';
  } else if (diffInDays === 1) {
    return '1 day left';
  } else {
    return `${diffInDays} days left`;
  }
};

/**
 * Formats a Unix timestamp to a short date string (e.g., "Dec 25, 2024")
 * @param timestamp - Unix timestamp in seconds
 * @returns Short date string
 */
export const formatShortDate = (timestamp: number): string => {
  return formatDate(timestamp, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats a Unix timestamp to a long date string (e.g., "December 25, 2024")
 * @param timestamp - Unix timestamp in seconds
 * @returns Long date string
 */
export const formatLongDate = (timestamp: number): string => {
  return formatDate(timestamp, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Checks if a timestamp is in the past
 * @param timestamp - Unix timestamp in seconds
 * @returns True if timestamp is in the past
 */
export const isPast = (timestamp: number): boolean => {
  return timestamp * 1000 < Date.now();
};

/**
 * Checks if a timestamp is in the future
 * @param timestamp - Unix timestamp in seconds
 * @returns True if timestamp is in the future
 */
export const isFuture = (timestamp: number): boolean => {
  return timestamp * 1000 > Date.now();
};

