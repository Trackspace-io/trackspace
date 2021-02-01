import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

/**
 * Middleware that checks if the user is authenticated or not.
 *
 * @param role Role or list of roles of the user.
 */
export default function (
  role?: string | string[]
): (req: Request, res: Response, next: NextFunction) => Response | void {
  return (req, res, next) => {
    // Check if the user is authenticated.
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ redirect: `${process.env.CLIENT_URL}/` });
    }

    if (!role) next();

    // Check the role of the user.
    const isAllowed = Array.isArray(role)
      ? role.includes((<User>req.user).role)
      : (<User>req.user).role === role;

    if (!isAllowed) {
      return res
        .status(401)
        .json({ msg: "You are not allowed to access this route." });
    }

    next();
  };
}
