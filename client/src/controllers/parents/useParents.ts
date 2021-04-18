import { ParentsAPI } from 'api';
import { useMessages, useUsers } from 'controllers';
import React from 'react';
import { useGlobalStore } from 'store';
import parentsReducer from 'store/parents';
import {
  IParentAddChild,
  IParentConfirmRelationship,
  IParentGetChildren,
  IParentRemoveChild,
} from 'store/parents/types';

const { actions } = parentsReducer;

const useParents = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of controllers
  const Messages = useMessages();
  const Users = useUsers();

  // List of states
  const { parents } = state;

  // List of actions
  const { setChildren } = actions;

  // List of thunks

  /**
   * Get a parent's children
   *
   * @param {String} payload.parentId The identifier of the parent
   *
   * @returns void
   */
  const getChildren = (payload: IParentGetChildren) => {
    ParentsAPI.getChildren(payload)
      .then((response) => {
        const { data } = response;

        dispatch(setChildren(data));
      })
      .catch((e) => {
        const { msg } = e.response.data.errors[0];

        Messages.add({
          type: 'error',
          text: `${msg}`,
        });
      });
  };

  /**
   * Add a child to a parent.
   *
   * @param   {string} payload.parentId  The identifier of the parent.
   * @param   {string} payload.email     The email of the child.
   *
   * @returns Promise
   */
  const addChild = (payload: IParentAddChild): Promise<any> => {
    const { parentId } = payload;

    return new Promise((resolve) => {
      ParentsAPI.addChild(payload)
        .then((response) => {
          const { data } = response;

          getChildren({ parentId });

          Messages.add({
            type: 'success',
            text: `Child added.`,
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
   * Remove a child
   *
   * @param   {string} payload.parentId  The identifier of the parent.
   * @param   {string} payload.studentId The identifier of the child.
   *
   * @returns Promise
   */
  const removeChild = (payload: IParentRemoveChild): Promise<any> => {
    const { parentId } = payload;

    return new Promise((resolve) => {
      ParentsAPI.removeChild(payload)
        .then((response) => {
          const { data } = response;

          getChildren({ parentId });

          Messages.add({
            type: 'success',
            text: `Child removed.`,
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
   * Confirm the relationship between a parent and his/her child
   *
   * @param   {string} payload.parentId  The identifier of the parent.
   * @param   {string} payload.studentId The identifier of the child.
   *
   * @returns Promise
   */
  const confirmRelationship = (payload: IParentConfirmRelationship): Promise<any> => {
    const { parentId } = payload;

    return new Promise((resolve) => {
      ParentsAPI.confirmRelationship(payload)
        .then((response) => {
          const { data } = response;

          getChildren({ parentId });

          Messages.add({
            type: 'success',
            text: `Confirmed`,
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

  React.useEffect(() => {
    Users.current.id && getChildren({ parentId: Users.current.id });
  }, [Users.current]);

  return {
    ...parents,

    getChildren,
    addChild,
    removeChild,
    confirmRelationship,
  };
};

export default useParents;
