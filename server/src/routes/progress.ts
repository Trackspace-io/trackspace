import { Request, Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import date from "date-and-time";
import user from "../validators/user";
import { Subject } from "../models/Subject";
import { User } from "../models/User";
import { Progress } from "../models/Progress";
import { Term } from "../models/Term";
import ProgressGraph from "../graphs/ProgressGraph";
import { Classroom } from "../models/Classroom";
import student from "../validators/student";

const progress = Router();

/**
 * Registers a progress.
 *
 * @method POST
 * @url    /progress
 *
 * @param req.subjectId    {string}  Identifier of the subject.
 * @param req.studentId    {string}  Identifier of the student.
 * @param req.date         {date}    Date of the progress (yyyy-mm-dd).
 * @param req.pageFrom     {number}  (Optional) Number of the starting page.
 * @param req.pageSet      {number}  (Optional) Number of the page that the
 *                                   student wants to reach.
 * @param req.pageDone     {number}  (Optional) Number of the page reached by
 *                                   the student at the end of the day.
 * @param req.homeworkDone {boolean} Indicates if the homework was done.
 *
 * @returns 200, 400, 401, 500
 */
progress.post(
  "/",
  user().isA(["teacher", "student", "parent"]),

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

    const dateObj = date.parse(value, "YYYY-MM-DD");
    if (isNaN(dateObj.valueOf())) {
      return Promise.reject("Invalid date.");
    }

    return true;
  }),

  body("pageFrom").optional({ nullable: true }).isInt(),
  body("pageSet").optional({ nullable: true }).isInt(),
  body("pageDone").optional({ nullable: true }).isInt(),

  body("homeworkDone")
    .optional({ nullable: true })
    .isBoolean()
    .custom((value, { req }) => {
      if (!value) return true;

      const user = <User>req.user;
      return user.role === "student"
        ? Promise.reject("You are not allowed to validate your own homework.")
        : true;
    }),

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
    const dateObj = date.parse(req.body.date, "YYYY-MM-DD");

    if (!Progress.isUserAuthorized(user, subjectId, studentId)) {
      return res.sendStatus(401);
    }

    try {
      // Find or create the progress in the database.
      const { progress, error } = await Progress.findOrCreateByKey(
        subjectId,
        studentId,
        dateObj
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
      progress.set({
        pageFrom: req.body.pageFrom,
        pageSet: req.body.pageSet,
        pageDone: req.body.pageDone,
        homeworkDone: req.body.homeworkDone === true,
      });

      // Validate the new values.
      const errors = [];

      const [pageFromValid, pageFromMsg] = await progress.validatePageFrom();
      const [pageSetValid, pageSetMsg] = await progress.validatePageSet();
      const [pageDoneValid, pageDoneMsg] = await progress.validatePageDone();

      if (errors.length === 0 && !pageFromValid) {
        errors.push({
          value: req.body.pageFrom,
          msg: pageFromMsg,
          param: "pageFrom",
          location: "body",
        });
      }

      if (errors.length === 0 && !pageSetValid) {
        errors.push({
          value: req.body.pageSet,
          msg: pageSetMsg,
          param: "pageSet",
          location: "body",
        });
      }

      if (errors.length === 0 && !pageDoneValid) {
        errors.push({
          value: req.body.pageDone,
          msg: pageDoneMsg,
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

/**
 * Get the progress values.
 *
 * @method GET
 * @url    /progress/student/:id/terms/:id/weeks/:number
 *
 * @param params.studentId  The student identifier.
 * @param params.termId     Identifier of the term.
 * @param params.weekNumber Number of the week (1-n).
 *
 * @returns 200, 400, 401, 500
 */
progress.get(
  "/terms/:termId/student/:studentId/weeks/:weekNumber",
  user().isA(["teacher", "student", "parent"]),
  student().exists(),

  param("termId").custom(async (value, { req }) => {
    const user = <User>req.user;
    const term = await Term.findById(value);
    const classroom = term ? await term.getClassroom() : null;

    const invalid = !term || !classroom || !user.isInClassroom(classroom);
    return invalid ? Promise.reject("Invalid term.") : true;
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const term = await Term.findById(req.params.termId);
      const classroom = await term.getClassroom();

      // Get the start and end date of the week.
      const weekNumber = parseInt(req.params.weekNumber);
      const [weekStart, weekEnd] = term.getWeekDates(weekNumber);

      if (!weekStart || !weekEnd) {
        return res.status(400).json({
          errors: [
            {
              value: weekNumber,
              msg: "Invalid week number.",
              param: "weekNumber",
              location: "params",
            },
          ],
        });
      }

      // Get the list of subjects.
      const subjects = await classroom.getSubjects({
        order: [["name", "ASC"]],
      });

      // Build the response.
      return res.status(200).json({
        days: term.days,
        dates: [
          date.format(weekStart, "YYYY-MM-DD"),
          date.format(weekEnd, "YYYY-MM-DD"),
        ],
        progress: await Promise.all(
          subjects.map(async (subject) => {
            return {
              subject: {
                id: subject.id,
                name: subject.name,
              },
              values: await Promise.all(
                term.days.map(async (day) => {
                  const currentDate = term.getDate(weekNumber, day);
                  if (currentDate === null) return undefined;

                  const values = await Progress.valuesAtDate(
                    req.student.id,
                    subject.id,
                    currentDate
                  );

                  return {
                    day,
                    progressKey: {
                      subjectId: subject.id,
                      studentId: req.student.id,
                      date: date.format(currentDate, "YYYY-MM-DD"),
                    },
                    pageFrom: values.pageFrom,
                    pageSet: values.pageSet,
                    pageDone: values.pageDone,
                    homework: values.homework,
                    homeworkDone: values.homeworkDone,
                  };
                })
              ),
            };
          })
        ),
      });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Gets the progress graph of a student.
 *
 * @method POST
 * @url    /progress/terms/:id/students/:id/graph
 *
 * @param query.color Color of the line (Hex code).
 * @param query.width Width of the line (Pixels).
 *
 * @returns 200, 400, 401, 500
 */
progress.get(
  "/terms/:termId/students/:studentId/graph",
  user().isA(["teacher", "student", "parent"]),

  param("termId").custom(async (value, { req }) => {
    const user = <User>req.user;
    const term = await Term.findById(value);
    const classroom = term ? await term.getClassroom() : null;

    const invalid = !term || !classroom || !user.isInClassroom(classroom);
    return invalid ? Promise.reject("Invalid term.") : true;
  }),

  query("progressColor")
    .optional()
    .isHexColor()
    .withMessage("The color must be a hex code."),

  query("progressWidth").optional().isInt(),

  query("goalsColor")
    .optional()
    .isHexColor()
    .withMessage("The color must be a hex code."),

  query("goalsWidth").optional().isInt(),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const term = await Term.findById(req.params.termId);
      const student = await User.findById(req.params.studentId);

      const graph = new ProgressGraph(
        term,
        `${req.query.goalsColor}`,
        parseInt(`${req.query.goalsWidth}`)
      );

      graph.addStudent(
        student,
        `${req.query.progressColor}`,
        parseInt(`${req.query.progressWidth}`)
      );

      return res.status(200).json(await graph.config());
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Gets the progress of a student at a date.
 *
 * @method GET
 * @url    /progress/classrooms/:id/students/:id?date={date}
 *
 * @param query.date The date (YYY-MM-DD).
 *
 * @returns 200, 400, 401, 500
 */
progress.get(
  "/classrooms/:classroomId/students/:studentId",
  user().isA(["teacher", "student", "parent"]).isInClassroom(),
  student().exists().senderIsAuthorized(),

  query("date").custom(async (value, { req }) => {
    if (!value) {
      return Promise.reject("Missing value.");
    }

    const dateObj = date.parse(value, "YYYY-MM-DD");
    if (isNaN(dateObj.valueOf())) {
      return Promise.reject("Invalid date format.");
    }

    const classroom: Classroom = req.classroom;
    const term = await classroom.getTermAtDate(dateObj);

    if (!term || !term.isDateAllowed(dateObj)) {
      return Promise.reject("There are no courses on this date.");
    }

    return true;
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const dateObj = date.parse(`${req.query.date}`, "YYYY-MM-DD");
      const subjects = await req.classroom.getSubjects({
        order: [["name", "ASC"]],
      });

      const term = await req.classroom.getTermAtDate(dateObj);

      return res.status(200).json({
        termNumber: await term.getNumber(),
        weekNumber: term.getWeekNumber(dateObj),
        subjects: await Promise.all(
          subjects.map(async (subject) => {
            const values = await Progress.valuesAtDate(
              req.student.id,
              subject.id,
              dateObj
            );

            return {
              subject: {
                id: subject.id,
                name: subject.name,
              },
              progressKey: {
                subjectId: subject.id,
                studentId: req.params.studentId,
                date: date.format(dateObj, "YYYY-MM-DD"),
              },
              values: {
                pageFrom: values.pageFrom,
                pageSet: values.pageSet,
                pageDone: values.pageDone,
                homework: values.homework,
                homeworkDone: values.homeworkDone,
              },
            };
          })
        ),
      });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default progress;
