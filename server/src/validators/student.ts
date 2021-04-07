import { User } from "../models/User";
import { baseValidator, IValidator } from "./validator";

interface IStudentValidator extends IValidator {
  /**
   * Checks if the term specified by the 'studentId' parameter
   * (req.params.studentId) exists.
   */
  exists: () => IStudentValidator;

  /**
   * Checks if the request sender is authorized to modify the student's
   * profile.
   */
  senderIsAuthorized: () => IStudentValidator;
}

export default (): IStudentValidator => {
  const validator = baseValidator() as IStudentValidator;

  validator.exists = () => {
    validator._add(async (req, res, next) => {
      const student = await User.findById(req.params.studentId);
      if (!student || student.role !== "student") {
        return res.sendStatus(404);
      }

      req.student = student;
      return next();
    });

    return validator;
  };

  validator.senderIsAuthorized = () => {
    validator._add(async (req, res, next) => {
      const student = req.student;
      if (!student) return res.sendStatus(401);

      const sender = <User>req.user;
      if (!sender) return res.sendStatus(401);

      switch (sender.role) {
        // If the sender is a teacher, he must teach one of the classrooms in
        //  which the student is enrolled.
        case "teacher": {
          const teacherCls = await sender.getClassrooms();
          const studentCls = await student.getClassrooms();

          for (let i = 0; i < teacherCls.length; i++) {
            if (studentCls.find((c) => c.id === teacherCls[i].id)) {
              return next();
            }
          }
          break;
        }

        // If the sender is a student, he must be the student himself. A
        // student can only modify his own profile.
        case "student": {
          if (sender.id === student.id) return next();
          break;
        }

        // If the sender is a parent, the student must be one of his children.
        case "parent": {
          const children = await sender.getRelatedUsers(["student"]);
          const isParent = children.find(
            ([user, relation]) => relation.confirmed && user.id === student.id
          );

          if (isParent) return next();
          break;
        }
        default:
          break;
      }

      return res.sendStatus(401);
    });

    return validator;
  };

  return validator.exists();
};
