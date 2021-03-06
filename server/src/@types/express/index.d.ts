import { Term } from "../../models/Term";
import { Classroom } from "../../models/Classroom";

declare global {
  namespace Express {
    export interface Request {
      classroom: Classroom;
      term: Term;
    }
  }
}
