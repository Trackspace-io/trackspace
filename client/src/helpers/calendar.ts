// import moment from 'moment';

// Week days names and shortnames
export const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Current day
export const today = new Date(Date.now()).getDay();

/**
 * Returns the field value of a date. YYYY-MM-DD
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

/**
 * Format the date to date string.
 *
 * @param {string} dateString The string of the date.
 *
 * @returns {string} date.
 */
export const dateString = (dateString: string | Date | undefined): string | undefined => {
  if (!dateString) return;

  // const date = moment(dateString).format('ddd MMM DD YYYY');

  const date = new Date(dateString).toUTCString().slice(0, 16);

  return date;
};
