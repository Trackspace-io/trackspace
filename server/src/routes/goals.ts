import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import shortid from "shortid";
import user from "../validators/user";
import { Goal } from "../models/Goal";
import { Term } from "../models/Term";
import { User } from "../models/User";
import { Classroom } from "../models/Classroom";

const goals = Router();

/**
 * @todo Associate a subject with the goal? 
 * 
 * Creates a goal
 * 
 * @method POST
 * @url /terms/:id/goals/create
 *
 * @param req.date    {string}  Date of the goal (yyyy-mm-dd)
 * @param req.pages   {number}  Set number of pages for the week
 * @param req.classroomId {string} The identifier of the classroom
 *
 * @returns 200, 400, 401, 500
 */
goals.post(
  "/",
  user().isA("teacher"),

  body("date")
  .custom(async (value) => {
    if (!value) {
      return Promise.reject("Missing value.");
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return Promise.reject("Invalid date.");
    }

    return true;
  }),

  body("pages").optional({ nullable: true }).isInt(),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
     
    const date = new Date(req.body.date);
    const classroomId = req.body.classroomId;
    const pages = req.body.pages;

    try {
      const term = req.term.id;

      if (!term) {
        return res.status(400).json({
          errors: [
            {
              value: date,
              msg: "Date is not associated to a term",
              param: "date",
              location: "params",
            },
          ],
        });
      }

      // Get the week number of the given date in the term.
      const weekNumber = term.getWeekNumber(date);

      // Build the response.
      
       // Return the errors.
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
      }

      // Save the values.
      await goals.save();
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }

)
/**
 * Get the goals associated to a classroom.
 *
 * @method GET
 * @url    /terms/:id/date/goals
 *
 * @param res.id   {string} Identifier of the subject.
 * @param res.name {string} Name of the subject.
 *
 * @returns 200, 400, 401, 500
 */
 goals.get(
  "/",
  user().isA("teacher"),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json()
    } catch (e) {
      return res.sendStatus(500);
    }
  }
)