import { Classroom } from "../../models/Classroom";

declare global {
  namespace Express {
    export interface Request {
      classroom: Classroom;
    }
  }
}
