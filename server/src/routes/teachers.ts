import { Request, Response, Router } from "express";
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
      res.sendStatus(500);
    }
  }
);

export default teachers;
