// import axios from 'axios';

import User from './modules/User';

// class ApplicationAPI {
//   get = async <T>(url: string): Promise<T> => {
//     const { data } = await axios.get(url);

//     return data;
//   };

//   post = async <T>(url: string, body: T): Promise<T> => {
//     const { data } = await axios.post(url, body);

//     return data;
//   };
// }

// // Instanciate the API caller.
// const api = new ApplicationAPI();

const userAPI = new User();

export { userAPI };
