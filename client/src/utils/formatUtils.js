/**
 * Formats a date string from YYYY-MM-DD to DD-MM-YYYY.
 * If the input is empty or invalid, it returns the input as is.
 * 
 * @param {string} dateStr - The date string from a date input (YYYY-MM-DD)
 * @returns {string} - Formatted date string (DD-MM-YYYY)
 */
export const formatDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return dateStr || "";
  
  // Check if it's already in DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;

  // Expect YYYY-MM-DD
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  
  return dateStr;
};

/**
 * Truncates an address to only the first 3 words.
 * 
 * @param {string} address - The full address string
 * @returns {string} - Truncated address (first 3 words)
 */
export const formatAddress = (address) => {
  if (!address || typeof address !== "string") return "";
  const words = address.trim().split(/\s+/);
  return words.length > 3 ? words.slice(0, 3).join(" ") : address;
};
