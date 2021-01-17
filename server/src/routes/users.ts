import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import shortid from "shortid";
import { User } from "../models/User";
import passport from "passport";

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
 * @returns 200, 400, 500
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

    // Generate the identifier and hash the password.
    req.body.id = shortid.generate();
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    // Create the user.
    try {
      await User.create(req.body);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  }
);

/**
 * Sign-in. On success, redirects users to their role's home page (/<role>).
 * Otherwise, returns 401.
 *
 * @method  POST
 * @url     /users/sign-in
 *
 * @param req.email     {string}  User email address.
 * @param req.password  {string}  User password.
 *
 * @returns 200, 401, 500
 */
users.post(
  "/sign-in",
  passport.authenticate("local"),
  async (req: Request, res: Response): Promise<void> => {
    const user: User = <User>req.user;
    res.redirect(`${process.env.CLIENT_URL}/${user.getDataValue("role")}`);
  }
);

export default users;
