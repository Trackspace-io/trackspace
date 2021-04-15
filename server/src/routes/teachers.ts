import { Request, Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import user from "../validators/user";

const teachers = Router();

/**
 * Get th list of classrooms taught by a teacher.
 *
 * @method  GET
 * @url     /users/teachers/classrooms
 *
 * @returns 200, 500
 */
teachers.get(
  "/classrooms",
  user().isA("teacher"),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(
        (await (<User>req.user).getClassrooms()).map((classroom) => {
          return { id: classroom.id, name: classroom.name };
        })
      );
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Generates an invitation link for a classroom.
 *
 * @method GET
 * @url    /users/teachers/classrooms/:id/invitations/link?expiresIn={expiresIn}
 *
 * @param query.expiresIn {int} Number of seconds after which the link will
 *                         expire. If empty, the link will never expire.
 *
 * @param res.link {string} The invitation link.
 *
 * @returns 200, 400, 401, 404, 500
 */
teachers.get(
  "/classrooms/:classroomId/invitations/link",
  user().isA("teacher").isInClassroom(),

  query("expiresIn")
    .optional()
    .isInt()
    .withMessage("ExpiresIn must be a duration in seconds."),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate the link
    try {
      let expiresIn: number | undefined = undefined;
      if (req.query.expiresIn) {
        expiresIn = parseInt(`${req.query.expiresIn}`);
      }

      const link = await req.classroom.generateLink(true, expiresIn);
      return res.status(200).json({ link });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Sends an invitation to a student.
 *
 * @method POST
 * @url    /users/teachers/classrooms/:id/invitations/send
 *
 * @param req.studentEmail {string} Email address of the student to invite.
 *
 * @returns 200, 400, 401, 404, 500
 */
teachers.post(
  "/classrooms/:classroomId/invitations/send",
  user().isA("teacher").isInClassroom(),

  body("studentEmail").not().isEmpty(),
  body("studentEmail").custom(async (value) => {
    if (!value) return true;

    const student = await User.findByEmail(value);
    if (!student || student.role != "student") {
      return Promise.reject("Invalid student identifier.");
    }

    return true;
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Send the invitation.
    try {
      const student = await User.findByEmail(req.body.studentEmail);

      await Notification.sendNotification(student, "studentInvitation", {
        clasroomId: req.classroom.id,
        studentId: student.id,
      });

      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default teachers;
