import { ClassroomContext } from '../contexts';
import * as React from 'react';
import { IClassroom } from 'types';

interface IClassroomController {
  classrooms: IClassroom[];
}

const useClassroom = (): IClassroomController => {
  const context = React.useContext(ClassroomContext.Ctx);

  if (context === undefined) {
    throw new Error('MessageContext  must be used within a Provider');
  }

  // Fetch the list of classrooms.
  React.useEffect(() => {
    // get();
  }, []);

  /**
   * Get the list of classroom
   *
   * @param {string} payload.type
   * @param {string} payload.text
   */
  // const get = () => {
  //   context.dispatch({ type: 'GET_CLASSROOM', payload: [] });
  // };

  const { classrooms } = context.state;

  return {
    classrooms,
  };
};

export default useClassroom;
