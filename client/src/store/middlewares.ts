export const asyncer = (dispatch: any, state: any) => (action: any) =>
  typeof action === 'function' ? action(dispatch, state) : dispatch(action);

export const logger = (action: any, prevState: any, currentState: any) => {
  console.groupCollapsed('Logger');
  console.log('%c Action:', 'color: blue', action);
  console.log('%c Previous State:', 'color: red', prevState);
  console.log('%c Current State:', 'color: green', currentState);
  console.groupEnd();
};
