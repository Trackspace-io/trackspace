import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { Classroom } from "../models/Classroom";
import isAuthenticated from "../middlewares/isAuthenticated";
import { User } from "../models/User";
import shortid from "shortid";

const classrooms = Router();

/**
 * Create a classroom.
 *
 * @method  POST
 * @url     /classrooms/create
 *
 * @param req.name {string} Name of the classroom.
 *
 * @returns 200, 400, 500
 */
classrooms.post(
  "/create",
  isAuthenticated("teacher"),

  body("name").not().isEmpty(),
  body("name").custom(async (value: string, { req }) => {
    if (!value) return;

    if (await Classroom.findByTeacherAndName((<User>req.user).id, value)) {
      return Promise.reject("The name is already taken.");
    }
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate an identifier and associated the classroom to the teacher.
    req.body.id = shortid.generate();
    req.body.teacherId = (<User>req.user).id;

    try {
      await Classroom.create(req.body);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  }
);

/**
 * Delete a classroom.
 *
 * @method  POST
 * @url     /classrooms/:id/delete
 *
 * @returns 200, 401, 404, 500
 */
classrooms.delete(
  "/:id/delete",
  isAuthenticated("teacher"),

  async (req: Request, res: Response): Promise<Response> => {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.sendStatus(404);

    if (classroom.teacherId !== (<User>req.user).id) {
      return res
        .status(401)
        .json({ msg: "You are not allowed to delete this classroom." });
    }

    try {
      await classroom.destroy();
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Modify a classroom.
 *
 * @method  POST
 * @url     /classrooms/:id/modify
 *
 * @param req.name The new name of the classroom.
 *
 * @returns 200, 400, 401, 404, 500
 */
classrooms.put(
  "/:id/modify",
  isAuthenticated("teacher"),

  body("name").trim().escape(),
  body("name").custom(async (value: string, { req }) => {
    if (!value) return;

    const userId = (<User>req.user).id;
    const classroom = await Classroom.findByTeacherAndName(userId, value);

    if (classroom && classroom.id !== req.params.id) {
      return Promise.reject("The name is already taken.");
    }
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the classroom.
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.sendStatus(404);

    if (classroom.teacherId !== (<User>req.user).id) {
      return res
        .status(401)
        .json({ msg: "You are not allowed to modify this classroom." });
    }

    // Set the values.
    try {
      if (req.body.name) {
        classroom.setDataValue("name", req.body.name);
      }

      await classroom.save();
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default classrooms;
