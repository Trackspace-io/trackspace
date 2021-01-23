import { NextFunction, Request, Response } from "express";

/**
 * Middleware that checks if the user is authenticated or not.
 */
export default function (): (
  req: Request,
  res: Response,
  next: NextFunction
) => Response | void {
  return (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ redirect: `${process.env.CLIENT_URL}/` });
    }
    next();
  };
}
