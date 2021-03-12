// Week days names and shortnames
export const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Current day
export const today = new Date(Date.now()).getDay();

/**
 * Returns the field value of a date.
 *
 * @param {string} dateString The string of the date.
 *
 * @returns {string} The input value.
 */
export const dateValue = (dateString: string | Date): string | undefined => {
  if (!dateString) return;

  const date = new Date(dateString).toISOString().slice(0, 10);

  return date;
};
