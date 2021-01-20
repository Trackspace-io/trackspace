import axios from 'axios';
import { IUserProfile, IUserSignIn, IUserSignUp } from 'types';

class User {
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
  register = async (body: IUserSignUp): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:8000/sign-up', body);

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
  login = async (body: IUserSignIn): Promise<void> => {
    try {
      const response = await axios.post('http://localhost:8000/sign-in', body);

      return response.data;
    } catch (error) {
      console.log('error', error);
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
  get = async (id: string): Promise<IUserProfile | undefined> => {
    try {
      const response = await axios.get(`http://localhost:8000/get/:${id}`);

      return response.data;
    } catch (error) {
      console.log('error', error);
    }
  };
}

export default User;
