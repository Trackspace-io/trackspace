import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import user from "../validators/user";
import { Subject } from "../models/Subject";
import { User } from "../models/User";
import { Progress } from "../models/Progress";

const progress = Router();

/**
 * Registers a progress.
 *
 * @method POST
 * @url    /progress
 *
 * @param req.subjectId {string} Identifier of the subject.
 * @param req.studentId {string} Identifier of the student.
 * @param req.date      {date}   Date of the progress (yyyy-mm-dd).
 * @param req.pageFrom  {number} (Optional) Number of the starting page.
 * @param req.pageSet   {number} (Optional) Number of the page that the student
 *                               wants to reach.
 * @param req.pageDone  {number} (Optional) Number of the page reached by the
 *                               student at the end of the day.
 *
 * @returns 200, 400, 401, 500
 */
progress.post(
  "/",
  user().isA(["teacher", "student"]),

  body(["subjectId", "studentId"])
    .isString()
    .custom(async (value, { req }) => {
      if (!value) {
        return Promise.reject("Missing value.");
      }

      if (!req.body.subjectId || !req.body.studentId) {
        return true;
      }

      const subject = await Subject.findById(req.body.subjectId);
      const student = await User.findById(req.body.studentId);

      if (!subject || !student || student.role !== "student") {
        return false;
      }

      const classroom = await subject.getClassroom();
      if (!student.isInClassroom(classroom)) {
        return Promise.reject(
          "The student and the subject must be associated to the same classroom."
        );
      }

      return true;
    }),

  body("date").custom(async (value) => {
    if (!value) {
      return Promise.reject("Missing value.");
    }

    const date = new Date(value);
    if (isNaN(date.valueOf())) {
      return Promise.reject("Invalid date.");
    }

    return true;
  }),

  body("pageFrom").optional({ nullable: true }).isInt(),
  body("pageSet").optional({ nullable: true }).isInt(),
  body("pageDone").optional({ nullable: true }).isInt(),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user is allowed to create this progress.
    const user = <User>req.user;
    const subjectId = req.body.subjectId;
    const studentId = req.body.studentId;

    if (!Progress.isUserAuthorized(user, subjectId, studentId)) {
      return res.sendStatus(401);
    }

    try {
      // Find or create the progress in the database.
      const { progress, error } = await Progress.findOrCreateByKey(
        req.body.subjectId,
        req.body.studentId,
        new Date(req.body.date)
      );

      // Progress.findOrCreateByKey returns undefined if the parameters are in-
      // valid (e.g. subject and student not in the same classroom).
      if (!progress) {
        return res.status(400).json({
          errors: [
            {
              value: req.body[error.param],
              msg: error.msg,
              param: error.param,
              location: "body",
            },
          ],
        });
      }

      // Set the values.
      const pageFromSet = "pageFrom" in req.body;
      const pageFromVal = pageFromSet ? req.body.pageFrom : null;

      const pageSetSet = "pageSet" in req.body;
      const pageSetVal = pageSetSet ? req.body.pageSet : null;

      const pageDoneSet = "pageDone" in req.body;
      const pageDoneVal = pageDoneSet ? req.body.pageDone : null;

      progress.set({
        pageFrom: pageFromSet ? pageFromVal : progress.pageFrom,
        pageSet: pageSetSet ? pageSetVal : progress.pageSet,
        pageDone: pageDoneSet ? pageDoneVal : progress.pageDone,
      });

      // Validate the new values.
      const errors = [];

      if (pageFromSet && !progress.isPageFromValid) {
        errors.push({
          value: req.body.pageFrom,
          msg: "Invalid value.",
          param: "pageFrom",
          location: "body",
        });
      }

      if (pageSetSet && !progress.isPageSetValid) {
        errors.push({
          value: req.body.pageSet,
          msg: "Invalid value.",
          param: "pageSet",
          location: "body",
        });
      }

      if (pageDoneSet && !progress.isPageDoneValid) {
        errors.push({
          value: req.body.pageSet,
          msg: "Invalid value.",
          param: "pageDone",
          location: "body",
        });
      }

      // Return the errors.
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
      }

      // Save the values.
      await progress.save();
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default progress;
