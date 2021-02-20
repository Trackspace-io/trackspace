import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import shortid from "shortid";
import { Subject } from "../models/Subject";
import user from "../validators/user";

const subjects = Router();

/**
 * Get the list of subjects associated to a classroom.
 *
 * @method GET
 * @url    /classrooms/:id/subjects
 *
 * @param res.id   {string} Identifier of the subject.
 * @param res.name {string} Name of the subject.
 *
 * @returns 200, 400, 401, 500
 */
subjects.get(
  "/",
  user().isA("teacher"),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(
        (await req.classroom.getSubjects()).map((subject) => {
          return { id: subject.id, name: subject.name };
        })
      );
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Adds a subject to a classroom.
 *
 * @method POST
 * @url    /classrooms/:id/subjects/add
 *
 * @param req.name {string} Name of the subject.
 *
 * @returns 200, 400, 401, 500
 */
subjects.post(
  "/add",
  user().isA("teacher"),

  body("name").not().isEmpty().trim().escape(),
  body("name").custom(async (value: string, { req }) => {
    const subject = await Subject.findOne({
      where: { ClassroomId: req.classroom.id, name: value },
    });

    if (subject) {
      return Promise.reject("A subject with the same name already exists.");
    }
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create the subject.
    try {
      await Subject.create({
        id: shortid.generate(),
        name: req.body.name,
        ClassroomId: req.classroom.id,
      });
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Edits a subject.
 *
 * @method PUT
 * @url    /classrooms/:id/subjects/:id/edit
 *
 * @returns 200, 400, 401, 404, 500
 */
subjects.put(
  "/:subjectId/edit",
  user().isA("teacher"),

  body("name").optional().trim().escape(),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      const subject = await Subject.findById(req.params.subjectId);
      if (!subject) return res.sendStatus(404);

      if (req.body.name) {
        subject.setDataValue("name", req.body.name);
      }

      subject.save();
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Removes a subject from a classroom.
 *
 * @method DELETE
 * @url    /classrooms/:id/subjects/:id/remove
 *
 * @returns 200, 400, 401, 500
 */
subjects.delete(
  "/:subjectId/remove",
  user().isA("teacher"),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      const subject = await Subject.findOne({
        where: { id: req.params.subjectId },
      });

      if (!subject || subject.classroomId !== req.classroom.id) {
        return res.sendStatus(400);
      }

      await subject.destroy();
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default subjects;
