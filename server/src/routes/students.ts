import { Request, Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import date from "date-and-time";
import jwt from "jsonwebtoken";
import passport from "passport";
import shortid from "shortid";
import { User } from "../models/User";
import user from "../validators/user";
import { IClassroomInvitation } from "../models/Classroom";
import { Classroom } from "../models/Classroom";
import student from "../validators/student";
import parent from "../validators/parent";
import { UserRelation } from "../models/UserRelation";

const students = Router();

/**
 * Sends information about an invitation.
 *
 * @method GET
 * @url    /users/students/invitations/info?t={token}
 *
 * @param query.token An invitation token.
 *
 * @returns 200, 400, 500
 */
students.get(
  "/invitations/info",
  query("t").not().isEmpty().withMessage("Missing invitation token."),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      const secret = process.env.CLASSROOM_INVITATION_SECRET;
      const data = jwt.verify(`${req.query.t}`, secret);
      const classroomId = (<IClassroomInvitation>data).classroomId;

      const classroom = await Classroom.findById(classroomId);
      if (!classroom) res.sendStatus(400);

      const teacher = await classroom.getTeacher();
      if (!teacher) res.sendStatus(400);

      return res.status(200).json({
        classroomName: classroom.name,
        teacherFirstName: teacher.firstName,
        teacherLastName: teacher.lastName,
      });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Accept an invitation. This route must be used if the student is already
 * authenticated.
 *
 * @method POST
 * @url    /users/students/invitations/accept?t={token}
 *
 * @returns 200, 400, 401, 404, 500
 */
students.post(
  "/invitations/accept",
  user().isA("student"),

  query("t").not().isEmpty().withMessage("Missing invitation token."),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = <User>req.user;
      const success = await user.acceptStudentInvitation(`${req.query.t}`);
      return res.sendStatus(success ? 200 : 400);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Sign-in and accept an invitation. This route must be used if the student has
 * an account.
 *
 * @method POST
 * @url    /users/students/invitations/accept/sign-in?t={token}
 *
 * @param req.username {string} User email address.
 * @param req.password {string} User password.
 *
 * @returns 200, 400, 401, 404, 500
 */
students.post(
  "/invitations/accept/sign-in",
  passport.authenticate("local"),

  query("t").not().isEmpty().withMessage("Missing invitation token."),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check that the user is a student.
    const user: User = <User>req.user;
    if (user.role !== "student") {
      return res.sendStatus(400);
    }

    try {
      if (!(await user.acceptStudentInvitation(`${req.query.t}`)))
        return res.sendStatus(400);

      return res.status(200).json({ redirect: `/${user.role}` });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Sign-up and accept an invitation. This route must be used if the student
 * doesn't have an account yet.
 *
 * @method POST
 * @url    /users/students/invitations/accept/sign-up?t={token}
 *
 * @param req.email     {string} Student email address.
 * @param req.firstName {string} Student's first name.
 * @param req.lastName  {string} Student's last name.
 * @param req.password  {string} Student password.
 *
 * @returns 200, 400, 401, 404, 500
 */
students.post(
  "/invitations/accept/sign-up",

  query("t").not().isEmpty().withMessage("Missing invitation token."),

  body("email").isEmail().normalizeEmail(),
  body("firstName").not().isEmpty().trim().escape(),
  body("lastName").not().isEmpty().trim().escape(),
  body("password").not().isEmpty(),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("The passwords do not match"),

  body("confirmPassword").custom((value: string, { req }) => {
    if (req.body.confirmPassword && value !== req.body.password) {
      return Promise.reject("The passwords do not match");
    }

    return true;
  }),

  body("email").custom(async (value: string) => {
    if (await User.findByEmail(value)) {
      return Promise.reject("E-mail already in use");
    }
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate the identifier and hash the password.
    req.body.id = shortid.generate();
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    req.body.role = "student";

    // Create the user and accept the invitation.
    try {
      const user = await User.create(req.body);
      const success = await user.acceptStudentInvitation(`${req.query.t}`);
      return res.sendStatus(success ? 200 : 400);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get the details of a student.
 *
 * @method  GET
 * @url     /users/students/:id/details
 *
 * @returns 200, 401, 500
 */
students.get(
  "/:studentId/details",
  user().isA(["teacher", "student", "parent"]),
  student().senderIsAuthorized(),

  async (req: Request, res: Response): Promise<Response> => {
    const parentRelations = await req.student.getRelatedUsers(["parent"]);

    return res.status(200).json({
      firstName: req.student.firstName,
      lastname: req.student.lastName,
      email: req.student.email,
      parents: parentRelations.map((pair) => {
        const [parent, relation] = pair;
        return {
          id: parent.id,
          firstName: parent.firstName,
          lastName: parent.lastName,
          email: parent.email,
          confirmed: relation.confirmed,
        };
      }),
    });
  }
);

/**
 * Get classrooms in which a student is enrolled.
 *
 * @method  GET
 * @url     /users/students/:id/classrooms
 *
 * @returns 200, 500
 */
students.get(
  "/:studentId/classrooms",
  user().isA(["student", "parent"]),
  student().senderIsAuthorized(),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(
        (await req.student.getClassrooms()).map((classroom) => {
          return { id: classroom.id, name: classroom.name };
        })
      );
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get the list of parents of a student.
 *
 * @method  GET
 * @url     /users/students/:id/parents
 *
 * @returns 200, 401, 500
 */
students.get(
  "/:studentId/parents/",
  user().isA(["teacher", "student", "parent"]),
  student().senderIsAuthorized(),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      const parents = await req.student.getRelatedUsers(["parent"]);
      return res.status(200).json(
        parents.map(([user, relation]) => {
          const pendingDate = relation.pendingSince;
          const isConfirmed = relation.confirmed;
          const isInitiator = req.student.id === relation.user1Id;

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            invitationPendingSince: pendingDate
              ? date.format(pendingDate, "YYYY-MM-DD")
              : null,
            mustConfirm: !isConfirmed && !isInitiator,
          };
        })
      );
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Confirms the relation between a student and a parent.
 *
 * @method POST
 * @url    /users/students/:id/parents/:id/confirm
 *
 * @returns 200, 400, 401, 404, 500
 */
students.post(
  "/:studentId/parents/:parentId/confirm",
  user().isA("student"),
  student().senderIsAuthorized(),

  parent().exists(),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      // There must be a relation between the student and the parent.
      const areRelated = await UserRelation.areRelated(req.parent, req.student);
      if (!areRelated) return res.sendStatus(404);

      await req.student.confirmRelationWith(req.parent);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Add a parent to the student.
 *
 * @method  POST
 * @url     /users/students/:id/parent/add
 *
 * @param req.email {string} The parent's email address.
 *
 * @returns 200, 500
 */
students.post(
  "/:studentId/parents/add",
  user().isA("student"),
  student().senderIsAuthorized(),

  body("email")
    .not()
    .isEmpty()
    .isEmail()
    .custom(async (value) => {
      if (!value) return true;

      const user = await User.findByEmail(value);
      if (!user) {
        return Promise.reject("No account with this email address was found.");
      }

      return user.role !== "parent"
        ? Promise.reject(
            "An student or teacher account is already associated with this " +
              "email address."
          )
        : true;
    }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const parent = await User.findByEmail(req.body.email);
      await req.student.addRelatedUser(parent);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Remove a parent.
 *
 * @method DELETE
 * @url    /users/students/:id/parents/:id/remove
 *
 * @returns 200, 400, 401, 404, 500
 */
students.delete(
  "/:studentId/parents/:parentId/remove",
  user().isA("student"),
  student().senderIsAuthorized(),

  student().exists(),
  parent().exists(),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      // There must be a relation between the parent and the student.
      const areRelated = await UserRelation.areRelated(req.parent, req.student);
      if (!areRelated) return res.sendStatus(404);

      const success = await req.student.removeRelatedUser(req.parent);
      return res.sendStatus(success ? 200 : 400);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default students;
