import { ClassroomContext } from '../contexts';
import * as React from 'react';
import { IClassroom, IClassroomCreate, IClassroomRemove, IClassroomUpdate } from 'types';
import { ClassroomAPI } from 'api';
import useMessage from './useMessage';

interface IClassroomController {
  classrooms: IClassroom[];
  create: (input: IClassroomCreate) => void;
  update: (input: IClassroomUpdate) => void;
  remove: (input: IClassroomRemove) => void;
}

const useClassroom = (): IClassroomController => {
  const context = React.useContext(ClassroomContext.Ctx);

  // Notification
  const Message = useMessage();

  if (context === undefined) {
    throw new Error('MessageContext  must be used within a Provider');
  }

  // Fetch the list of classrooms.
  React.useEffect(() => {
    get();
  }, []);

  /**
   * Get the list of classroom
   */
  const get = () => {
    // context.dispatch({ type: 'GET_CLASSROOM', payload: [] });
  };

  /**
   * Create a new classroom.
   *
   * @param {string} input.name The name of the classroom.
   *
   * @returns void
   */
  const create = (input: IClassroomCreate) => {
    ClassroomAPI.create(input)
      .then(() => {
        get();

        Message.update({
          type: 'success',
          text: `Classroom added.`,
        });
      })
      .catch((e) => {
        const { msg } = e.response.data.errors[0];

        Message.update({
          type: 'error',
          text: `${msg}`,
        });
      });
  };

  /**
   * Update the name of a classroom by its id.
   *
   * @param {string} input.id   The id of the classroom.
   * @param {string} input.name The name of the classroom.
   *
   * @returns void
   */
  const update = (input: IClassroomUpdate) => {
    ClassroomAPI.update(input)
      .then(() => {
        get();

        Message.update({
          type: 'success',
          text: `Classroom's name updated.`,
        });
      })
      .catch((e) => {
        const { msg } = e.response.data.errors[0];

        Message.update({
          type: 'error',
          text: `${msg}`,
        });
      });
  };

  /**
   * Delete a classroom by its id
   *
   * @param {string} input.id The id of the classroom.
   *
   * @returns void
   */
  const remove = (input: IClassroomRemove) => {
    ClassroomAPI.remove(input)
      .then(() => {
        get();

        Message.update({
          type: 'success',
          text: `Classroom removed.`,
        });
      })
      .catch((e) => {
        const { msg } = e.response.data.errors[0];

        Message.update({
          type: 'error',
          text: `${msg}`,
        });
      });
  };

  const { classrooms } = context.state;

  return {
    classrooms,

    create,
    update,
    remove,
  };
};

export default useClassroom;
