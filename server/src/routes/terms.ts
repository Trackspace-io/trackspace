import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import user from "../validators/user";
import { Term } from "../models/Term";
import shortid from "shortid";
import term from "../validators/term";

const terms = Router();

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
    const start = new Date(req.body.start);
    const end = new Date(req.body.end);

    if (isNaN(start.valueOf()) || isNaN(end.valueOf())) {
      return Promise.reject("Invalid date.");
    }

    if (start > end) {
      return Promise.reject("The start date must be before the end date.");
    }

    const overlappingTerms = await Term.findTermsBetween(start, end);
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
        start: req.body.start,
        end: req.body.end,
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
              start: term.start,
              end: term.end,
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
 * Modifies a term
 *
 * @method  POST
 * @url     /classrooms/:id/terms/:id/modify
 *
 * @param req.start {Date}     Start date (yyyy-mm-dd).
 * @param req.end   {Date}     End date (yyyy-mm-dd)..
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
      return isNaN(new Date(value).valueOf())
        ? Promise.reject("Invalid date.")
        : true;
    })
    .custom((value, { req }) => {
      return value && new Date(value) > req.term.end
        ? Promise.reject("The start date must be before the end date")
        : true;
    }),

  body("end")
    .optional()
    .custom((value) => {
      return isNaN(new Date(value).valueOf())
        ? Promise.reject("Invalid date.")
        : true;
    })
    .custom((value, { req }) => {
      return value && new Date(value) < req.term.start
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
        const success = await req.term.setStart(new Date(req.body.start));
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
        const success = await req.term.setEnd(new Date(req.body.end));
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
      await Term.destroy({ where: { id: req.params.id } });
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default terms;
