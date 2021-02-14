import { Request, Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";
import shortid from "shortid";
import { User } from "../models/User";
import user from "../validators/user";

const students = Router();

/**
 * Accept an invitation. This route must be used if the student is already
 * authenticated.
 *
 * @method POST
 * @url    /users/students/invitations/accept?t={token}
 *
 * @returns 200, 400, 401, 404, 500
 */
students.post(
  "/invitations/accept",
  user().isA("student"),

  query("t").not().isEmpty().withMessage("Missing invitation token."),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = <User>req.user;
      const success = await user.acceptStudentInvitation(`${req.query.t}`);
      return res.sendStatus(success ? 200 : 400);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Sign-in and accept an invitation. This route must be used if the student has
 * an account.
 *
 * @method POST
 * @url    /users/students/invitations/accept/sign-in?t={token}
 *
 * @param req.username {string} User email address.
 * @param req.password {string} User password.
 *
 * @returns 200, 400, 401, 404, 500
 */
students.post(
  "/invitations/accept/sign-in",
  passport.authenticate("local"),

  query("t").not().isEmpty().withMessage("Missing invitation token."),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check that the user is a student.
    const user: User = <User>req.user;
    if (user.role !== "student") {
      return res.sendStatus(400);
    }

    try {
      const success = await user.acceptStudentInvitation(`${req.query.t}`);
      return res.sendStatus(success ? 200 : 400);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Sign-up and accept an invitation. This route must be used if the student
 * doesn't have an account yet.
 *
 * @method POST
 * @url    /users/students/invitations/accept/sign-up?t={token}
 *
 * @param req.email     {string} Student email address.
 * @param req.firstName {string} Student's first name.
 * @param req.lastName  {string} Student's last name.
 * @param req.password  {string} Student password.
 *
 * @returns 200, 400, 401, 404, 500
 */
students.post(
  "/invitations/accept/sign-up",
  passport.authenticate("local"),

  query("t").not().isEmpty().withMessage("Missing invitation token."),

  body("email").isEmail().normalizeEmail(),
  body("firstName").not().isEmpty().trim().escape(),
  body("lastName").not().isEmpty().trim().escape(),
  body("password").not().isEmpty(),

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
    req.body.role = "student";

    // Create the user and accept the invitation.
    try {
      const user = await User.create(req.body);
      const success = await user.acceptStudentInvitation(`${req.query.t}`);
      return res.sendStatus(success ? 200 : 400);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default students;