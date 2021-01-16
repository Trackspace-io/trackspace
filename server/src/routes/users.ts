import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import shortid from "shortid";
import { User } from "../models/User";

const users = Router();

/**
 * Sign-up.
 *
 * @method  POST
 * @url     /users/sign-up
 *
 * @param req.email     {string}                  User email address.
 * @param req.firstName {string}                  User's first name.
 * @param req.lastName  {string}                  User's last name.
 * @param req.password  {string}                  User password.
 * @param req.role      {teacher|teacher|student} User's role.
 *
 * @returns 200, 400
 */
users.post(
  "/sign-up",

  body("email").isEmail().normalizeEmail(),
  body("firstName").not().isEmpty().trim().escape(),
  body("lastName").not().isEmpty().trim().escape(),
  body("password").not().isEmpty(),
  body("role").toLowerCase().isIn(["teacher", "student", "parent"]),

  body("email").custom(async (value: string) => {
    if (await User.findByEmail(value)) {
      return Promise.reject("E-mail already in use");
    }
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Hash the password.
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    // Generate the identifier.
    req.body.id = shortid.generate();

    // Create the user.
    try {
      await User.create(req.body);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  }
);

export default users;
