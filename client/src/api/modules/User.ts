import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IUserUpdate, IUserSignIn, IUserSignUp } from 'types';

/**
 * Registers a user.
 *
 * @param {{
 *  email: string,
 *  firstName: string,
 *  lastName: string,
 *  password: string,
 *  role: string
 * }} body The request body
 *
 * @returns {Promise<void>}
 */

export const register = async (body: IUserSignUp): Promise<void> => {
  try {
    const response = await axios.post(`${_apiUrl}/api/users/sign-up`, body);

    return response.data;
  } catch (error) {
    console.log('error', error);
  }
};

/**
 * User login.
 *
 * @param {{
 *  email: string,
 *  password: string,
 * }} body The request body
 *
 * @returns {Promise<void>}
 */
export const login = async (body: IUserSignIn): Promise<any> => {
  try {
    const response = await axios.post(`${_apiUrl}/api/users/sign-in`, body, { withCredentials: true });
    console.log('login response', response);

    return response.data;
  } catch (error) {
    console.log('error', `${error.response.data} (${error.response.status})`);
  }
};

/**
 * User sign-out.
 *
 * @returns Redirect.
 */
export const logout = async (): Promise<any> => {
  try {
    const response = await axios.get(`${_apiUrl}/api/users/sign-out`, { withCredentials: true });
    console.log('logout response', response);
    return response.data;
  } catch (error) {
    console.log('error', `${error.response.data} (${error.response.status})`);
  }
};

/**
 * Get the profile of a user
 *
 * @returns {Promise<{
 *  firstName: string,
 *  lastName: string,
 *  email: string,
 *  role: string
 * }>} data.
 */
export const get = async (): Promise<any> => {
  try {
    const response = await axios.get(`${_apiUrl}/api/users/profile`, { withCredentials: true });
    console.log('response user', response.data);
    return response.data;
  } catch (error) {
    console.log('error', error);
  }
};

/**
 * Get the user's profile
 *
 * @method  PUT
 *
 * @param {string} body.email       New email address.
 * @param {string} body.firstName   New first name.
 * @param {string} body.lastName    New last name.
 * @param {string} body.oldPassword Old password
 * @param {string} body.password    New password.
 *
 * @returns 200, 400, 500
 */
export const updateUser = async (body: IUserUpdate): Promise<any> => {
  try {
    const response = await axios.put(`${_apiUrl}/api/users/profile`, body, { withCredentials: true });
    console.log('response user update', response.data);

    return response.data;
  } catch (error) {
    console.log('error', `${error.response.data} (${error.response.status})`);
  }
};
