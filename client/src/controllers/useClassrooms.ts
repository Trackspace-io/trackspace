import { IClassroomCreate, IClassroomRemove, IClassroomUpdate } from 'types';
import { ClassroomAPI } from 'api';
import useMessages from './useMessages';
import useTeachers from './useTeachers';

interface IClassroomController {
  create: (input: IClassroomCreate) => Promise<any>;
  update: (input: IClassroomUpdate) => Promise<any>;
  remove: (input: IClassroomRemove) => Promise<any>;
}

const useClassrooms = (): IClassroomController => {
  // Notification
  const Messages = useMessages();
  const Teachers = useTeachers();
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

          Teachers.getClassrooms();

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

          Teachers.getClassrooms();

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

          Teachers.getClassrooms();

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
    // Dispatchers
    create,
    update,
    remove,
  };
};

export default useClassrooms;
