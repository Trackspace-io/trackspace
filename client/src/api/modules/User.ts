import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IUser, IUserSignIn, IUserSignUp } from 'types';

/**
 * Registers a user.
 *
 * @param {{
 *  email:string,
 *  firstName:string,
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
 * @param {string} email    The email address.
 * @param {string} password The password.
 *
 * @returns {Promise<void>}
 */
export const login = async (body: IUserSignIn): Promise<void> => {
  try {
    const response = await axios.post(`http://localhost:8000/api/users/sign-in`, body);
    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log('error', `${error.response.data} (${error.response.status})`);
  }
};

/**
 * Get the profile of a user by id.
 *
 * @param {string} id The identifier of the user.
 *
 * @returns {Promise<{
 *  id: string,
 *  firstName: string,
 *  lastName: string,
 *  email: string,
 *  role: string
 * }>} data.
 */
export const get = async (id: string): Promise<IUser | undefined> => {
  try {
    const response = await axios.get(`http://localhost:8000/get/:${id}`);

    return response.data;
  } catch (error) {
    console.log('error', error);
  }
};
