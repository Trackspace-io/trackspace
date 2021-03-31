import { Request, Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import shortid from "shortid";
import { Goal } from "../models/Goal";
import GoalsGraph from "../graphs/GoalsGraph";
import user from "../validators/user";
import { Op } from "sequelize";

const goals = Router();

/**
 * Sets a goal.
 *
 * @method POST
 * @url /classrooms/:id/terms/:id/goals/weeks/:number/set
 *
 * @param req.pages {number} Cumulated number of pages that must be completed
 *                           in total at the end of the week.
 *
 * @returns 200, 400, 401, 500
 */
goals.post(
  "/weeks/:weekNumber/set",
  user().isA("teacher"),

  param("weekNumber")
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
    })
    .custom(async (value, { req }) => {
      if (!value && value !== 0) return true;

      const prevGoal = await Goal.findOne({
        where: {
          TermId: req.term.id,
          weekNumber: { [Op.lt]: req.params.weekNumber },
        },
        order: [["weekNumber", "DESC"]],
      });

      return prevGoal && prevGoal.pages > value
        ? Promise.reject(
            "The number of pages must be equal or greater than the " +
              "previous goal set for this term."
          )
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
          weekNumber: req.params.weekNumber,
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
 * @url    /classrooms/:id/terms/:id/goals/weeks/:number/unset
 *
 * @returns 200, 400, 401, 500
 */
goals.delete(
  "/weeks/:weekNumber/unset",
  user().isA("teacher"),

  param("weekNumber")
    .isInt()
    .custom((value) => {
      return value === 1
        ? Promise.reject("You cannot unset the goal of the first week.")
        : true;
    }),

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
      const nbGoals = goals.length;

      return res.status(200).json(
        goals.map((goal, i) => {
          const goalWeekNb = goal.weekNumber;

          // Get the list of weeks between this week and the next for which a
          // goal was set.
          let nextGoalWeek = goalWeekNb;
          if (i < nbGoals - 1) nextGoalWeek = goals[i + 1].weekNumber;

          const nextWeeks = [];
          for (let weekNb = goalWeekNb + 1; weekNb < nextGoalWeek; weekNb++) {
            nextWeeks.push(weekNb);
          }

          // Get the list of weeks between this week and the previous for which
          // a goal was set.
          let prevGoalWeek = goalWeekNb;
          if (i > 0) prevGoalWeek = goals[i - 1].weekNumber;

          const prevWeeks = [];
          for (let weekNb = goalWeekNb - 1; weekNb > prevGoalWeek; weekNb--) {
            prevWeeks.push(weekNb);
          }

          return {
            weekNumber: goal.weekNumber,
            pages: goal.pages,
            prevWeeks: prevWeeks,
            nextWeeks: nextWeeks,
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
