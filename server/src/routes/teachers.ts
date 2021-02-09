import { Request, Response, Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../models/User";
import user from "../validators/user";

const teachers = Router();

/**
 * Get classroom list.
 *
 * @method  GET
 * @url     /users/teachers/classrooms
 *
 * @param res.id   {string} Identifier of the classroom.
 * @param res.name {string} Name of the classroom.
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
 * @url    /users/teachers/classrooms/:id/invitations/link
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
    .withMessage("ExpiresAfter must be a duration in seconds."),

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

export default teachers;
