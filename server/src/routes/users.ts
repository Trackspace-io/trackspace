import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import shortid from "shortid";
import { IResetPasswordToken, User } from "../models/User";
import passport from "passport";
import teachers from "./teachers";
import user from "../validators/user";
import students from "./students";
import parents from "./parents";
import notifications from "./notifications";

const users = Router();

users.use("/teachers", teachers);
users.use("/students", students);
users.use("/parents", parents);

users.use("/notifications", user().isAuthenticated(), notifications);

/**
 * Get the current user.
 *
 * @method  GET
 * @url     /users/current
 *
 * @returns 200, 400
 */
users.get(
  "/current",

  (req, res, next) => {
    req.isAuthenticated && req.isAuthenticated();
    next();
  },

  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      loggedIn: req.user ? true : false,
      id: req.user ? (<User>req.user).id : null,
      role: req.user ? (<User>req.user).role : null,
      firstName: req.user ? (<User>req.user).firstName : null,
      lastName: req.user ? (<User>req.user).lastName : null,
      email: req.user ? (<User>req.user).email : null,
    });
  }
);

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
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("The passwords do not match"),

  body("confirmPassword").custom((value: string, { req }) => {
    if (req.body.confirmPassword && value !== req.body.password) {
      return Promise.reject("The passwords do not match");
    }

    return true;
  }),

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
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Google authentication callback route. This route is called by Google
 * when the user signs in using his/her Google credentials.
 *
 * @method GET
 * @url    /users/auth/google/callback
 */
users.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}`,
  }),

  async (req: Request, res: Response): Promise<void> => {
    const user: User = <User>req.user;
    res.redirect(`${process.env.CLIENT_URL}/${user.role}`);
  }
);

/**
 * Google authentication. Calling this route will redirect the user to the
 * Google sign-in page.
 *
 * @method GET
 * @url    /users/auth/google
 */
users.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

/**
 * Sign-in. On success, redirects users to their role's home page (/<role>).
 * Otherwise, returns 401.
 *
 * @method  POST
 * @url     /users/sign-in
 *
 * @param req.username  {string}  User email address.
 * @param req.password  {string}  User password.
 *
 * @returns 200, 401, 500
 */
users.post(
  "/sign-in",
  passport.authenticate("local"),
  async (req: Request, res: Response): Promise<void> => {
    const user: User = <User>req.user;
    res.status(200).json({ redirect: `/${user.role}` });
  }
);

/**
 * Sign-out.
 *
 * @returns Redirect.
 */
users.get("/sign-out", async (req: Request, res: Response): Promise<void> => {
  req.logout();
  res.status(200).json({ redirect: `/` });
});

/**
 * Send an email to reset the password of a user.
 *
 * @method  POST
 * @url     /users/reset/send
 *
 * @param req.email {string}  User email address.
 *
 * @returns 200, 400, 500
 */
users.post(
  "/reset/send",

  body("email").not().isEmpty().isEmail().normalizeEmail(),
  body("email").custom(async (value: string) => {
    const user = await User.findByEmail(value);
    if (!user) {
      return Promise.reject("Account not found.");
    }
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Send the email.
    const user = await User.findByEmail(req.body.email);
    const success = await user.sendResetPasswordEmail();

    return res.sendStatus(success ? 200 : 500);
  }
);

/**
 * Reset the password of a user.
 *
 * @method  POST
 * @url     /users/reset/confirm
 *
 * @param req.token           {string} The token received in the reset email.
 * @param req.password        {string} The new password.
 * @param req.confirmPassword {string} Confirm password.
 *
 * @returns Redirect, 400 (if token is expired), 500
 */
users.post(
  "/reset/confirm",

  body("token").not().isEmpty(),
  body("password").not().isEmpty(),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("The passwords do not match"),

  body("confirmPassword").custom((value: string, { req }) => {
    if (req.body.confirmPassword && value !== req.body.password) {
      return Promise.reject("The passwords do not match");
    }

    return true;
  }),

  async (req: Request, res: Response): Promise<Response | void> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Decode the token to get the user identifier.
    let userId = undefined;
    let oldPassword = undefined;

    try {
      const data = jwt.verify(
        req.body.token,
        process.env.RESET_PASSWORD_TOKEN_SECRET
      );

      userId = (<IResetPasswordToken>data).userId;
      oldPassword = (<IResetPasswordToken>data).oldPassword;
    } catch (e) {
      return res.status(400).json({
        errors: [{ msg: "The request is expired. Please try again." }],
      });
    }

    // Set the password.
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.sendStatus(500);
      }

      // If the current hash is different, it means that the password has been set
      // in the meantime. Therefore the token has expired.
      if (user.passwordHash !== oldPassword) {
        return res.status(400).json({
          errors: [{ msg: "The request is expired. Please try again." }],
        });
      }

      user.setDataValue("password", bcrypt.hashSync(req.body.password, 10));
      user.save();

      res.status(200).json({ redirect: `/` });
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get the profile of the user.
 *
 * @method  POST
 * @url     /users/profile
 *
 * @param res.email     {string} Email address of the user.
 * @param res.firstName {string} First name of the user.
 * @param res.lastName  {string} Last name of the user.
 * @param res.role      {string} Role of the user.
 *
 * @returns Redirect, 400 (if token is expired), 500
 */
users.get(
  "/profile",
  user().isAuthenticated(),
  async (req: Request, res: Response): Promise<Response> => {
    const user: User = <User>req.user;

    return res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  }
);

/**
 * Updates the profile of the user.
 *
 * @method PUT
 * @url    /users/profile
 *
 * @param req.email           {string | undefined} New email address.
 * @param req.firstName       {string | undefined} New first name.
 * @param req.lastName        {string | undefined} New last name.
 * @param req.role            {string | undefined} Role of the user. This para-
 *                                                 meter is only considered if
 *                                                 the role of the user is cur-
 *                                                 rently unknown.
 * @param req.oldPassword     {string | undefined} Old password. Required to
 *                                                 set a new password.
 * @param req.newPassword     {string | undefined} New password.
 * @param req.confirmPassword {string | undefined} Confirm password.
 *
 * @returns 200, 400, 500
 */
users.put(
  "/profile",
  user().isAuthenticated(),

  body("role").custom((value: string, { req }) => {
    const user = <User>req.user;
    if (user.role !== "unknown") {
      return value
        ? Promise.reject("You cannot modify your current role.")
        : true;
    }

    return !["teacher", "student", "parent"].includes(value)
      ? Promise.reject("Invalid value.")
      : true;
  }),

  body("oldPassword").custom((value: string, { req }) => {
    if (!req.body.password) return true;

    const user = <User>req.user;
    if (user.role === "unknown") return true;

    const passwordIsOk: boolean = bcrypt.compareSync(
      req.body.oldPassword,
      user.passwordHash
    );

    if (!passwordIsOk) {
      return Promise.reject("Invalid password");
    }

    return true;
  }),

  body("newPassword").custom((value, { req }) => {
    const user = <User>req.user;
    if (!value && user.role === "unknown") {
      return Promise.reject("The password is required.");
    }

    return true;
  }),

  body("confirmPassword").custom((value: string, { req }) => {
    if (req.body.newPassword && value !== req.body.newPassword) {
      return Promise.reject("The passwords do not match");
    }

    return true;
  }),

  async (req: Request, res: Response): Promise<Response> => {
    // Check if the request is valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set the values.
    try {
      const user: User = <User>req.user;

      if (req.body.email) {
        user.setDataValue("email", req.body.email);
      }
      if (req.body.firstName) {
        user.setDataValue("firstName", req.body.firstName);
      }
      if (req.body.lastName) {
        user.setDataValue("lastName", req.body.lastName);
      }
      if (req.body.role) {
        user.setDataValue("role", req.body.role);
      }
      if (req.body.newPassword) {
        user.setDataValue(
          "password",
          bcrypt.hashSync(req.body.newPassword, 10)
        );
      }

      user.save();
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
);

export default users;
