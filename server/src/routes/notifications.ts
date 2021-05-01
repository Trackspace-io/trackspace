import date from "date-and-time";
import { Request, Response, Router } from "express";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import notification from "../validators/notification";
import { query, validationResult } from "express-validator";

const notifications = Router();

/**
 * Get the notifications of a user.
 *
 * @method GET
 * @url    /users/notifications
 *
 * @returns 200, 400, 401, 500
 */
notifications.get(
  "/",

  async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = <User>req.user;
      const notifications = await Notification.findByRecipient(user);

      return res.status(200).json(
        await Promise.all(
          notifications.map(async (notif) => {
            return {
              id: notif.id,
              type: notif.type,
              text: await notif.getText(),
              actions: await notif.getActions(),
              date: date.format(notif.date, "YYYY-MM-DD"),
            };
          })
        )
      );
    } catch (e) {
      console.log('e', e);
      
      return res.sendStatus(500);
    }
  }
);

/**
 * Process a notifications.
 *
 * @method GET
 * @url    /users/notifications/process?action={action}
 *
 * @param query.action {string} The action selected by the user.
 *
 * @returns 200, 400, 401, 500
 */
notifications.post(
  "/:notificationId/process",
  notification().exists(),

  query("action")
    .not()
    .isEmpty()
    .custom(async (value, { req }) => {
      if (!req.notification) return true;

      const notif: Notification = req.notification;
      const actions = await notif.getActions();

      return !actions.find((a) => a.id === value)
        ? Promise.reject("Invalid action.")
        : true;
    }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // The user must be the recipient of the notification.
      const recipient = await req.notification.getRecipient();
      if (recipient.id !== (<User>req.user).id) return res.sendStatus(401);

      await req.notification.process(`${req.query.action}`);
      return res.sendStatus(200);
    } catch {
      return res.sendStatus(500);
    }
  }
);

export default notifications;
