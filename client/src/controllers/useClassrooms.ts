import { ClassroomContext } from '../contexts';
import * as React from 'react';
import { IClassroom, IClassroomCreate, IClassroomRemove, IClassroomUpdate } from 'types';
import { ClassroomAPI } from 'api';
import useMessages from './useMessages';

interface IClassroomController {
  list: IClassroom[];
  create: (input: IClassroomCreate) => Promise<any>;
  update: (input: IClassroomUpdate) => Promise<any>;
  remove: (input: IClassroomRemove) => Promise<any>;
}

const useClassrooms = (): IClassroomController => {
  const context = React.useContext(ClassroomContext.Ctx);

  // Notification
  const Messages = useMessages();

  if (context === undefined) {
    throw new Error('MessageContext  must be used within a Provider');
  }

  // States
  const { list } = context.state;

  // Fetch the list of classrooms.
  React.useEffect(() => {
    console.log('controller');

    get();
  }, []);

  /**
   * Get the list of classroom
   */
  const get = () => {
    ClassroomAPI.get()
      .then((response) => {
        const { data } = response;

        context.dispatch({ type: 'GET', payload: data });
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  /**
   * Create a new classroom.
   *
   * @param {string} payload.name The name of the classroom.
   *
   * @returns void
   */
  const create = async (payload: IClassroomCreate): Promise<any> => {
    return new Promise((resolve) => {
      ClassroomAPI.create(payload)
        .then((response) => {
          const { data } = response;

          get();

          Messages.add({
            type: 'success',
            text: `Classroom added.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  /**
   * Update the name of a classroom by its id.
   *
   * @param {string} payload.id   The id of the classroom.
   * @param {string} payload.name The name of the classroom.
   *
   * @returns void
   */
  const update = (payload: IClassroomUpdate): Promise<any> => {
    return new Promise((resolve) => {
      ClassroomAPI.update(payload)
        .then((response) => {
          const { data } = response;

          get();

          Messages.add({
            type: 'success',
            text: `Classroom's name updated.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  /**
   * Delete a classroom by its id
   *
   * @param {string} payload.id The id of the classroom.
   *
   * @returns void
   */
  const remove = (payload: IClassroomRemove): Promise<any> => {
    return new Promise((resolve) => {
      ClassroomAPI.remove(payload)
        .then((response) => {
          const { data } = response;

          get();

          Messages.add({
            type: 'success',
            text: `Classroom removed.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  return {
    // States
    list,

    // Dispatchers
    create,
    update,
    remove,
  };
};

export default useClassrooms;
