// Formats a timestamp based on whether it is from today or not
const formatDateOrTime = (isoString) => {
  // Convert ISO string (e.g., 2025-11-24T22:03:38Z) into JS Date
  const date = new Date(isoString);

  // Get current date/time for comparison
  const now = new Date();

  // Check if the given date is the same day as today
  const isToday =
    date.getDate() === now.getDate() &&          // same day of the month
    date.getMonth() === now.getMonth() &&        // same month
    date.getFullYear() === now.getFullYear();    // same year

  // If it's today → show time in 12-hour format
  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // If it's NOT today → show a clean formatted date
  return date.toLocaleDateString("en-US", {
    month: "short",   // e.g., "Nov"
    day: "numeric",   // e.g., "24"
    year: "numeric",  // e.g., "2025"
  });
};

export default formatDateOrTime;