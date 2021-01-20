import * as React from 'react';
import { userAPI } from '../api/api';
import { IUserProfile } from 'types';

interface IUserState {
  user: IUserProfile | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUserProfile | undefined>>;
}

const useUser = (id: string): IUserState => {
  const [user, setUser] = React.useState<IUserProfile>();

  React.useEffect(() => {
    userAPI.get(id).then((response) => {
      setUser(response);
    });
  }, [user]);

  return {
    user,
    setUser,
  };
};

export default useUser;
