import { User } from "../models/User";
import { baseValidator, IValidator } from "./validator";

interface IParentValidator extends IValidator {
  /**
   * Checks if the term specified by the 'parentId' parameter
   * (req.params.parentId) exists.
   */
  exists: () => IParentValidator;
}

export default (): IParentValidator => {
  const validator = baseValidator() as IParentValidator;

  validator.exists = () => {
    validator._add(async (req, res, next) => {
      const parent = await User.findById(req.params.parentId);
      if (!parent || parent.role !== "parent") {
        return res.sendStatus(404);
      }

      req.parent = parent;
      return next();
    });

    return validator;
  };

  return validator.exists();
};
