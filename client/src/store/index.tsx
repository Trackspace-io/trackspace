import * as React from 'react';

import rootReducer, { initialState, IState } from 'store/reducers';
// import { IMessageActions } from './messages/types';
// import { ITeacherActions } from './teachers/types';
// import { IUserAction } from './users/types';

export interface IContextProps {
  state: IState;
  dispatch: any;
}

const GlobalStore = React.createContext({} as IContextProps);

export const useGlobalStore = () => React.useContext(GlobalStore);

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);

  // const dispatch = React.useCallback(asyncer(dispatchBase, state), []);
  // pass in the returned value of useReducer
  const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <GlobalStore.Provider value={contextValue}> {children} </GlobalStore.Provider>;
};

export default Provider;
