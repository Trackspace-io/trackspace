import { Request, Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import shortid from "shortid";
import { Goal } from "../models/Goal";
import GoalsGraph from "../graphs/GoalsGraph";
import user from "../validators/user";

const goals = Router();

/**
 * Registers a goal.
 *
 * @method POST
 * @url /classrooms/:id/terms/:id/goals/create
 *
 * @param req.weekNumber {number} Week number.
 * @param req.pages      {number} Cumulated number of pages that must be com-
 *                                pleted in total at the end of the week.
 *
 * @returns 200, 400, 401, 500
 */
goals.post(
  "/create",
  user().isA("teacher"),

  body("weekNumber")
    .isInt()
    .custom((value, { req }) => {
      return !value || value <= 0 || value > req.term.numberOfWeeks
        ? Promise.reject("Invalid week number.")
        : true;
    }),

  body("pages")
    .isInt()
    .custom((value) => {
      return value < 0
        ? Promise.reject("The number of pages must be grater than 0.")
        : true;
    }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [goal] = await Goal.findOrCreate({
        where: {
          TermId: req.term.id,
          weekNumber: req.body.weekNumber,
        },
        defaults: { id: shortid.generate(), pages: 0 },
      });

      goal.set({ pages: req.body.pages });
      goal.save();

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Unsets a goal.
 *
 * @method DELETE
 * @url    /classrooms/:id/terms/:id/goals/weeks/:number/remove
 *
 * @returns 200, 400, 401, 500
 */
goals.delete(
  "/weeks/:weekNumber/remove",
  user().isA("teacher"),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      await Goal.destroy({
        where: {
          TermId: req.term.id,
          weekNumber: req.params.weekNumber,
        },
      });
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get the goals associated to a term.
 *
 * @method GET
 * @url    /classrooms/:id/terms/:id/goals
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
      const goals = await req.term.getGoals({ order: [["weekNumber", "ASC"]] });
      return res.status(200).json(
        goals.map((goal) => {
          return {
            weekNumber: goal.weekNumber,
            pages: goal.pages,
          };
        })
      );
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Gets the goal graph of a term.
 *
 * @method GET
 * @url    /classrooms/:id/terms/:id/goals/graph
 *
 * @param query.color Color of the line (Hex code).
 * @param query.width Width of the line (Pixels).
 *
 * @returns 200, 400, 401, 500
 */
goals.get(
  "/graph",
  user().isA("teacher"),

  query("color")
    .optional()
    .isHexColor()
    .withMessage("The color must be a hex code."),

  query("width").optional().isInt(),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const graph = new GoalsGraph(
        req.term,
        `${req.query.color}`,
        parseInt(`${req.query.width}`)
      );

      return res.status(200).json(await graph.config());
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default goals;
