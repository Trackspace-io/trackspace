import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { Classroom } from "../models/Classroom";
import { User } from "../models/User";
import shortid from "shortid";
import user from "../validators/user";
import subjects from "./subjects";
import terms from "./terms";

const classrooms = Router();

classrooms.use("/:classroomId/subjects", user().isInClassroom(), subjects);
classrooms.use("/:classroomId/terms", user().isInClassroom(), terms);

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
  user().isA("teacher"),

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
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get the details of a classroom.
 *
 * @method  GET
 * @url     /classrooms/:id
 *
 * @returns 200, 400, 401, 500
 */
classrooms.get(
  "/:classroomId",
  user().isA(["teacher", "student"]).isInClassroom(),

  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ name: req.classroom.name });
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
  "/:classroomId/delete",
  user().isA("teacher").isInClassroom(),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      await req.classroom.destroy();
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
  "/:classroomId/modify",
  user().isA("teacher").isInClassroom(),

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

    // Set the values.
    try {
      if (req.body.name) {
        req.classroom.setDataValue("name", req.body.name);
      }

      await req.classroom.save();
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get the list of students enrolled in the classroom.
 *
 * @method  GET
 * @url     /classrooms/:id/students
 *
 * @returns 200, 400, 401, 500
 */
classrooms.get(
  "/:classroomId/students",
  user().isA("teacher").isInClassroom(),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(
        (await req.classroom.getStudents()).map((student) => {
          return {
            id: student.id,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
          };
        })
      );
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Removes a student from this classroom.
 *
 * @method  DELETE
 * @url     /classrooms/:id/students/:id/remove
 *
 * @returns 200, 400, 401, 500
 */
classrooms.delete(
  "/:classroomId/students/:studentId/remove",
  user().isA("teacher").isInClassroom(),

  param("studentId").custom(async (value: string, { req }) => {
    const student = await User.findById(value);

    if (!student || student.role !== "student") {
      return Promise.reject("Invalid student identifier.");
    }

    const classrooms = await student.getClassrooms();
    if (!classrooms.find((c) => c.id === req.params.classroomId)) {
      return Promise.reject("The student is not in the classroom.");
    }
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Remove the student.
    try {
      await req.classroom.removeStudent(`${req.params.studentId}`);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default classrooms;
