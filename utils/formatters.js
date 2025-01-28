/**
 * Formats a number according to Costa Rican standards
 * @param {number} number - The number to format
 * @param {boolean} includeSymbol - Whether to include the colón symbol (₡)
 * @returns {string} The formatted number
 *
 * Examples:
 * formatCurrency(1000) => "₡1,000"
 * formatCurrency(1000.50) => "₡1,000.50"
 * formatCurrency(1000, false) => "1,000"
 */
export function formatCurrency(number, includeSymbol = true) {
  try {
    // Handle invalid input
    if (number === null || number === undefined || isNaN(number)) {
      return includeSymbol ? "₡0" : "0";
    }

    // Format the number with thousand separators and 2 decimal places if needed
    const formatted = new Intl.NumberFormat("es-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);

    // Add colón symbol if requested
    return includeSymbol ? `₡${formatted}` : formatted;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return includeSymbol ? "₡0" : "0";
  }
}

/**
 * Formats an integer with thousand separators
 * @param {number|string} number - The integer to format
 * @returns {string} The formatted integer
 *
 * Examples:
 * formatNumber(1000) => "1,000"
 * formatNumber("1000") => "1,000"
 * formatNumber(1000.50) => "1,000"
 */
export function formatNumber(number) {
  // Convert string to integer if needed
  const num =
    typeof number === "string" ? parseInt(number) : Math.floor(number);
  return formatCurrency(num, false);
}
