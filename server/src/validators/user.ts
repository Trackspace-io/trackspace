import { Classroom } from "../models/Classroom";
import { User } from "../models/User";
import { baseValidator, IValidator } from "./validator";

interface IUserValidator extends IValidator {
  /**
   * Checks that the user is authenticated.
   */
  isAuthenticated: () => IUserValidator;

  /**
   * Checks if the user has a particular role. Assumes that the user is
   * authenticated.
   *
   * @param role The role or the list of allowed roles.
   */
  isA: (role: string | string[]) => IUserValidator;

  /**
   * Checks if the user is associated to the classroom specified by the
   * 'classroomId' parameter (req.params.classroomId).
   */
  isInClassroom: () => IUserValidator;
}

export default (): IUserValidator => {
  const validator = baseValidator() as IUserValidator;

  validator.isAuthenticated = () => {
    validator._add(async (req, res, next) => {
      if (req.user) return next();

      if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
      }

      return res.status(401).json({ redirect: `${process.env.CLIENT_URL}/` });
    });

    return validator;
  };

  validator.isA = (role: string | string[]): IUserValidator => {
    validator._add(async (req, res, next) => {
      if (!Array.isArray(role)) role = [role];

      const user = <User>req.user;
      if (user && role.includes(user.role)) return next();

      return res.sendStatus(401);
    });

    return validator;
  };

  validator.isInClassroom = () => {
    validator._add(async (req, res, next) => {
      // Check if the user is authenticated.
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ redirect: `${process.env.CLIENT_URL}/` });
      }

      // Get the classrooms associated to the user.
      const user = <User>req.user;
      const associatedClassrooms = await user.getClassrooms();

      // Check if the requested classroom is associated to the user.
      const classroom = associatedClassrooms.find(
        (c: Classroom) => c.id === req.params.classroomId
      );

      if (!classroom) {
        return res.sendStatus(401);
      }

      // Save the classroom in the request and go to the next step.
      req.classroom = classroom;
      next();
    });

    return validator;
  };

  return validator.isAuthenticated();
};
