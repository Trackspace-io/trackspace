/**
 * Returns the URL of the API.
 *
 * @returns The URL of the API.
 */
export const apiUrl = (): string => {
  return trimUrl(process.env.REACT_APP_API_URL ?? 'http://localhost:8000/api');
};

/**
 * Returns the full version of a relative URL (API URL + relative URL).
 *
 * @param relUrl Relative URL (e.g. /users/sign-in).
 * @returns The full URL.
 */
export const fullUrl = (relUrl: string): string => {
  return `${apiUrl()}/${trimUrl(relUrl)}`;
};

/**
 * Remove the trailing slashes of a URL.
 *
 * @param url URL to trim.
 * @returns The trimmed URL.
 */
export const trimUrl = (url: string): string => {
  const trimL = url[0] === '/';
  const trimR = url[-1] === '/';
  return url.substring(trimL ? 1 : 0, url.length - (trimR ? 1 : 0));
};
