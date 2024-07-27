/**
 * A set of helper functions to manipulate dates end to end
 */

/**
 * Creates a new date in UTC format at midnight.
 *
 * This function generates a Date object set to the start of the current day (midnight) in UTC.
 *
 * @returns {Date} A Date object representing the current day at midnight UTC.
 *
 * @example
 * // if current datetime is '2024-07-27T12:16:06.997Z'
 * const utcMidnight = NewUtcDate();
 * console.log(utcMidnight.toISOString());
 * // Outputs: '2024-07-27T00:00:00.000Z'
 */
export function NewUtcDate(date?: Date) {
  const today = date ?? new Date();
  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
}
