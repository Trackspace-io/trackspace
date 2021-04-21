import { useGlobalStore } from 'store';
import menuReducer from 'store/menu';

const { actions } = menuReducer;

const useMenu = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of state;
  const { menu } = state;

  const setDate = (date: moment.Moment | null) => {
    console.log('date', date);

    dispatch(actions.setDate(date));
  };

  return {
    ...menu,

    setDate,
  };
};

export default useMenu;
