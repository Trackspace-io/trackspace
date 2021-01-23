import { UserAPI } from 'api';
import * as React from 'react';
import { IUser } from 'types';

// export const UserContext = React.createContext(null);

// const UserProvider: React.FC = ({ children }) => {
//   const [user, setUser] = React.useState<IUser>({
//     id: 'abc',
//     email: 'spiderman@avengers.com',
//     firstName: 'Peter',
//     lastName: 'Parker',
//     role: 'teacher',
//   });
// };

interface IUserState {
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

const useUser = (id: string): IUserState => {
  const [user, setUser] = React.useState<IUser>();

  React.useEffect(() => {
    UserAPI.get(id).then((response) => {
      setUser(response);
    });
  }, [user]);

  return {
    user,
    setUser,
  };
};

export default useUser;
