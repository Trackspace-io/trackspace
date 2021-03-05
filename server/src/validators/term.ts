import { Term } from "../models/Term";
import { baseValidator, IValidator } from "./validator";

interface ITermValidator extends IValidator {
  /**
   * Checks if the term specified by the 'termId' parameter (req.params.termId)
   * exists.
   */
  exists: () => ITermValidator;
}

export default (): ITermValidator => {
  const validator = baseValidator() as ITermValidator;

  validator.exists = () => {
    validator._add(async (req, res, next) => {
      const term = await Term.findById(req.params.termId);
      if (!term) {
        return res.sendStatus(404);
      }

      req.term = term;
      return next();
    });

    return validator;
  };

  return validator;
};
