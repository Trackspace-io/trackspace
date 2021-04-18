import { IStudent } from 'store/students/types';

/**
 * Parent state interface
 */
export interface IParent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  invitationPendingSince?: string;
  mustConfirm?: boolean;
}

/**
 * Reducer's state interface
 */
export interface IParentState {
  // List of children
  children: IStudent[];
}

/**
 * Actions' type
 */
export enum PARENTS {
  SET_CHILDREN = 'SET_CHILDREN',
}

/**
 * Reducer's dispatchers interface
 */
export type IParentActions = { type: PARENTS.SET_CHILDREN; payload: IStudent[] };

export interface IParentGetChildren {
  parentId: string;
}

export interface IParentAddChild {
  parentId: string;
  email: string;
}

export interface IParentRemoveChild {
  parentId: string;
  studentId: string;
}

export interface IParentConfirmRelationship {
  parentId: string;
  studentId: string;
}
