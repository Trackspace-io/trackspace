import date from "date-and-time";
import { Request, Response, Router } from "express";
import { UserRelation } from "../models/UserRelation";
import student from "../validators/student";
import { User } from "../models/User";
import parent from "../validators/parent";
import user from "../validators/user";

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
    if (user.id !== req.parent.id) {
      return res.sendStatus(401);
    }

    try {
      // There must be a relation between the parent and the student.
      const areRelated = await UserRelation.areRelated(req.parent, req.student);
      if (!areRelated) {
        return res.sendStatus(404);
      }

      await req.parent.confirmRelationWith(req.student);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default parents;
