import { Request, Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import date from "date-and-time";
import user from "../validators/user";
import { Term } from "../models/Term";
import shortid from "shortid";
import term from "../validators/term";
import goals from "./goals";

const terms = Router();

terms.use("/:termId/goals", term().exists(), goals);

/**
 * Validates if the elements of a list are valid days.
 *
 * @param list List to check.
 */
function isValidDayList(list: string[]): boolean | Promise<never> {
  if (!list) return true;

  const DAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  for (let i = 0; i < list.length; i++) {
    if (!DAYS.includes(list[i])) {
      return Promise.reject(`${list[i]} is not a valid day.`);
    }
  }

  return true;
}

/**
 * Creates a new term
 *
 * @method  POST
 * @url     /classrooms/:id/terms/add
 *
 * @param req.start {Date}     Start date.
 * @param req.end   {Date}     End date.
 * @param req.days  {string[]} List of allowed days of the week in lower-case
 *                             (e.g. sunday, monday, etc.)
 *
 * @returns 200, 400, 401, 500
 */
terms.post(
  "/add",
  user().isA("teacher"),

  body(["from", "to"]).custom(async (value, { req }) => {
    const start = date.parse(req.body.start, "YYYY-MM-DD");
    const end = date.parse(req.body.end, "YYYY-MM-DD");

    if (isNaN(start.valueOf()) || isNaN(end.valueOf())) {
      return Promise.reject("Invalid date format.");
    }

    if (start > end) {
      return Promise.reject("The start date must be before the end date.");
    }

    const overlappingTerms = await Term.findTermsBetween(
      req.classroom.id,
      start,
      end
    );
    if (overlappingTerms.length > 0) {
      return Promise.reject("There is at least one overlapping term.");
    }

    return true;
  }),

  body("days").isArray().custom(isValidDayList),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await Term.create({
        id: shortid.generate(),
        start: date.parse(req.body.start, "YYYY-MM-DD"),
        end: date.parse(req.body.end, "YYYY-MM-DD"),
        sunday: req.body.days.includes("sunday"),
        monday: req.body.days.includes("monday"),
        tuesday: req.body.days.includes("tuesday"),
        wednesday: req.body.days.includes("wednesday"),
        thursday: req.body.days.includes("thursday"),
        friday: req.body.days.includes("friday"),
        saturday: req.body.days.includes("saturday"),
        ClassroomId: req.classroom.id,
      });

      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Gets the list of terms.
 *
 * @method  GET
 * @url     /classrooms/:id/terms
 *
 * @param res.start {Date}     Start date (yyyy-mm-dd).
 * @param res.end   {Date}     End date (yyyy-mm-dd).
 * @param res.days  {string[]} List of allowed days of the week in lower-case
 *                             (e.g. sunday, monday, etc.)
 *
 * @returns 200, 400, 401, 500
 */
terms.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(
        (await req.classroom.getTerms({ order: [["start", "ASC"]] })).map(
          (term) => {
            return {
              id: term.id,
              start: date.format(term.start, "YYYY-MM-DD"),
              end: date.format(term.end, "YYYY-MM-DD"),
              days: term.days,
              numberOfWeeks: term.numberOfWeeks,
            };
          }
        )
      );
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get the term at a given date.
 *
 * @method  GET
 * @url     /classrooms/:id/terms/get-at-date?date={date}
 *
 * @param query.date {Date} The date (YYYY-MM-DD).
 *
 * @returns 200, 400, 401, 500
 */
terms.get(
  "/get-at-date",
  user().isA(["teacher", "student", "parent"]),

  query("date").custom((value) => {
    return !value || !date.isValid(value, "YYYY-MM-DD")
      ? Promise.reject("Invalid date format")
      : true;
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const dateObj = date.parse(`${req.query.date}`, "YYYY-MM-DD");
      const term = await req.classroom.getTermAtDate(dateObj);

      if (!term) return res.status(200).json(null);

      return res.status(200).json({
        id: term.id,
        number: await term.getNumber(),
        start: date.format(term.start, "YYYY-MM-DD"),
        end: date.format(term.end, "YYYY-MM-DD"),
        days: term.days,
        numberOfWeeks: term.numberOfWeeks,
        currentWeek: term.getWeekNumber(dateObj),
      });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get a specific term.
 *
 * @method  GET
 * @url     /classrooms/:id/terms/:id
 *
 * @param query.date {Date} The date (YYYY-MM-DD).
 *
 * @returns 200, 400, 401, 500
 */
terms.get(
  "/:termId",
  user().isA(["teacher", "student", "parent"]),
  term().exists(),

  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      id: req.term.id,
      number: await req.term.getNumber(),
      start: date.format(req.term.start, "YYYY-MM-DD"),
      end: date.format(req.term.end, "YYYY-MM-DD"),
      days: req.term.days,
      numberOfWeeks: req.term.numberOfWeeks,
    });
  }
);

/**
 * Modifies a term
 *
 * @method  POST
 * @url     /classrooms/:id/terms/:id/modify
 *
 * @param req.start {Date}     Start date (YYYY-MM-DD).
 * @param req.end   {Date}     End date (YYYY-MM-DD).
 * @param req.days  {string[]} List of allowed days of the week in lower-case
 *                             (e.g. sunday, monday, etc.)
 *
 * @returns 200, 400, 401, 500
 */
terms.put(
  "/:termId/modify",
  user().isA("teacher"),
  term().exists(),

  body("start")
    .optional()
    .custom((value) => {
      return !date.isValid(value, "YYYY-MM-DD")
        ? Promise.reject("Invalid date.")
        : true;
    })
    .custom((value, { req }) => {
      return value && date.parse(value, "YYYY-MM-DD") > req.term.end
        ? Promise.reject("The start date must be before the end date")
        : true;
    }),

  body("end")
    .optional()
    .custom((value) => {
      return !date.isValid(value, "YYYY-MM-DD")
        ? Promise.reject("Invalid date.")
        : true;
    })
    .custom((value, { req }) => {
      return value && date.parse(value, "YYYY-MM-DD") < req.term.start
        ? Promise.reject("The end date must be after the start date")
        : true;
    }),

  body("days").optional().isArray().custom(isValidDayList),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.body.start) {
        const success = await req.term.setStart(
          date.parse(req.body.start, "YYYY-MM-DD")
        );

        if (!success) {
          return res.status(400).json({
            errors: [
              {
                value: req.body.start,
                msg: "There is at least one overlapping term.",
                param: "start",
                location: "body",
              },
            ],
          });
        }
      }

      if (req.body.end) {
        const success = await req.term.setEnd(
          date.parse(req.body.end, "YYYY-MM-DD")
        );

        if (!success) {
          return res.status(400).json({
            errors: [
              {
                value: req.body.end,
                msg: "There is at least one overlapping term.",
                param: "end",
                location: "body",
              },
            ],
          });
        }
      }

      if (req.body.days || req.body.days === []) {
        req.term.setAllowedDays(req.body.days);
      }

      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Removes a term.
 *
 * @method  DELETE
 * @url     /classrooms/:id/terms/:id/remove
 *
 * @returns 200, 400, 401, 500
 */
terms.delete(
  "/:termId/remove",
  user().isA("teacher"),
  term().exists(),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await Term.destroy({ where: { id: req.params.termId } });
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default terms;
