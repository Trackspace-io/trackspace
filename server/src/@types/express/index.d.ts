import { Term } from "../../models/Term";
import { Classroom } from "../../models/Classroom";
import { User as TrackspaceUser } from "../../models/User";

declare global {
  namespace Express {
    export interface Request {
      classroom: Classroom;
      term: Term;
      student: TrackspaceUser;
      parent: TrackspaceUser;
    }
  }
}
