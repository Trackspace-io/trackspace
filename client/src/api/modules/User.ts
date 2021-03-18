import { _apiUrl } from 'api/api';
import axios from 'axios';
import {
  IUserSignIn,
  IUserSignUp,
  IUserUpdate,
  IUserSendResetPassword,
  IUserConfirmResetPassword,
} from 'store/users/types';

/**
 * Registers a user.
 *
 * @method POST
 *
 * @param {string} body.email     Email address of the user.
 * @param {string} body.firstName First name of the user.
 * @param {string} body.lastName  Last name of the user.
 * @param {string} body.password  Password of the user.
 * @param {string} body.role      Role of the user
 *
 * @returns 200, 400, 500
 */

export const register = async (body: IUserSignUp): Promise<any> => {
  const response = await axios.post(`${_apiUrl}/api/users/sign-up`, body, { withCredentials: true });

  return response;
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
  const response = await axios.post(`${_apiUrl}/api/users/sign-in`, body, { withCredentials: true });

  return response;
};

/**
 * User sign-out.
 *
 * @returns Redirect.
 */
export const logout = async (): Promise<any> => {
  const response = await axios.get(`${_apiUrl}/api/users/sign-out`, { withCredentials: true });

  return response;
};

/**
 * Get the profile of a user
 *
 * @method GET
 *
 * @returns {Promise<{
 *  firstName: string,
 *  lastName: string,
 *  email: string,
 *  role: string
 * }>} data.
 */
export const get = async (): Promise<any> => {
  const response = await axios.get(`${_apiUrl}/api/users/profile`, { withCredentials: true });

  return response;
};

/**
 * Update the profile of a user
 *
 * @method  PUT
 *
 * @param {string} body.email           New email address.
 * @param {string} body.firstName       New first name.
 * @param {string} body.lastName        New last name.
 * @param {string} body.oldPassword     Old password
 * @param {string} body.password        New password.
 * @param {string} body.confirmPassword Confirm new password.
 *
 * @returns 200, 400, 500
 */
export const update = async (body: IUserUpdate): Promise<any> => {
  const response = await axios.put(`${_apiUrl}/api/users/profile`, body, { withCredentials: true });

  return response;
};

/**
 * Send a reset password email.
 *
 * @method  POST
 *
 * @param {string} body.email       New email address.
 *
 * @returns 200, 400, 500
 */
export const sendResetPassword = async (body: IUserSendResetPassword): Promise<any> => {
  const response = await axios.post(`${_apiUrl}/api/users/reset/send`, body, { withCredentials: true });

  return response;
};

/**
 * Send a reset password email.
 *
 * @method  POST
 *
 * @param {string} body.token       The received token.
 * @param {string} body.password    New password.
 *
 * @returns 200, 400, 500
 */
export const confirmResetPassword = async (body: IUserConfirmResetPassword): Promise<any> => {
  const response = await axios.post(`${_apiUrl}/api/users/reset/confirm`, body, { withCredentials: true });
  console.log('response', response);
  return response;
};
