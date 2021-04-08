import date from "date-and-time";
import { Request, Response, Router } from "express";
import { UserRelation } from "../models/UserRelation";
import student from "../validators/student";
import { User } from "../models/User";
import parent from "../validators/parent";
import user from "../validators/user";
import { body, validationResult } from "express-validator";

const parents = Router();

/**
 * Get the list of children of a parent.
 *
 * @method POST
 * @url    /users/parents/:id/children
 *
 * @returns 200, 400, 401, 404, 500
 */
parents.get(
  "/:parentId/children",
  user().isA("parent"),
  parent().exists(),

  async (req: Request, res: Response): Promise<Response> => {
    try {
      const children = await req.parent.getRelatedUsers(["student"]);
      return res.status(200).json(
        children.map(([user, relation]) => {
          const pendingDate = relation.pendingSince;
          const isConfirmed = relation.confirmed;
          const isInitiator = req.parent.id === relation.user1Id;

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            invitationPendingSince: pendingDate
              ? date.format(pendingDate, "YYYY-MM-DD")
              : null,
            mustConfirm: !isConfirmed && !isInitiator,
          };
        })
      );
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

parents.post(
  "/:parentId/children/add",
  user().isA("parent"),
  parent().exists(),

  body("email")
    .not()
    .isEmpty()
    .isEmail()
    .custom(async (value) => {
      if (!value) return true;

      const user = await User.findByEmail(value);
      if (!user) {
        return Promise.reject("No account with this email address was found.");
      }

      return user.role !== "student"
        ? Promise.reject(
            "An parent or teacher account is already associated with this " +
              "email address."
          )
        : true;
    }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // The sender must be the parent himself.
    const user = <User>req.user;
    if (user.id !== req.parent.id) {
      return res.sendStatus(401);
    }

    try {
      const student = await User.findByEmail(req.body.email);
      await req.parent.addRelatedUser(student);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Remove a child student.
 *
 * @method DELETE
 * @url    /users/parents/:id/children/:id/remove
 *
 * @returns 200, 400, 401, 404, 500
 */
parents.delete(
  "/:parentId/children/:studentId/remove",
  user().isA("parent"),

  parent().exists(),
  student().exists(),

  async (req: Request, res: Response): Promise<Response> => {
    // The sender must be the parent himself.
    const user = <User>req.user;
    if (user.id !== req.parent.id) return res.sendStatus(401);

    try {
      // There must be a relation between the parent and the student.
      const areRelated = await UserRelation.areRelated(req.parent, req.student);
      if (!areRelated) return res.sendStatus(404);

      const success = await req.parent.removeRelatedUser(req.student);
      return res.sendStatus(success ? 200 : 400);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Confirms the relation between a parent and a student.
 *
 * @method POST
 * @url    /users/parents/:id/children/:id/confirm
 *
 * @returns 200, 400, 401, 404, 500
 */
parents.post(
  "/:parentId/children/:studentId/confirm",
  user().isA("parent"),

  parent().exists(),
  student().exists(),

  async (req: Request, res: Response): Promise<Response> => {
    // The sender must be the parent himself.
    const user = <User>req.user;
    if (user.id !== req.parent.id) return res.sendStatus(401);

    try {
      // There must be a relation between the parent and the student.
      const areRelated = await UserRelation.areRelated(req.parent, req.student);
      if (!areRelated) return res.sendStatus(404);

      await req.parent.confirmRelationWith(req.student);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default parents;
