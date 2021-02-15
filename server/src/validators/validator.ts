import { NextFunction, Request, Response } from "express";

/**
 * Represents a validation. If the validation passes, it must call the
 * next() callback.
 */
export interface IValidation {
  (req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

/**
 * Represents a validator. A validator is a chain of validations that can be
 * used as an Express middleware to validate the input before executing a
 * request.
 */
export interface IValidator {
  (req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  /**
   * Adds a new validation.
   *
   * @param validation The validation.
   */
  _add: (validation: IValidation) => void;
}

/**
 * Builds a basic validator.
 */
export function baseValidator(): IValidator {
  const validations: IValidation[] = [];

  const validator = async function (req, res, next) {
    if (validations.length === 0) return next();

    let i = 0;
    const nextValid: NextFunction = async () => {
      if (++i > validations.length - 1) return next();
      await validations[i](req, res, nextValid);
    };

    await validations[0](req, res, nextValid);
  } as IValidator;

  validator._add = (validation) => {
    validations.push(validation);
  };

  return validator;
}
