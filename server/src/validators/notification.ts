import { Notification } from "../models/Notification";
import { baseValidator, IValidator } from "./validator";

interface INotificationValidator extends IValidator {
  /**
   * Checks if the term specified by the 'notificationId' parameter
   * (req.params.notificationId) exists.
   */
  exists: () => INotificationValidator;
}

export default (): INotificationValidator => {
  const validator = baseValidator() as INotificationValidator;

  validator.exists = () => {
    validator._add(async (req, res, next) => {
      if (req.notification) return next();

      const notification = await Notification.findById(
        req.params.notificationId
      );

      if (!notification) return res.sendStatus(404);

      req.notification = notification;
      return next();
    });

    return validator;
  };

  return validator.exists();
};
