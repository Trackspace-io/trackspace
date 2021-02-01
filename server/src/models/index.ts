import { Sequelize } from "sequelize/types";
import { classroomAssociations, classroomSchema } from "./Classroom";
import { userAssociations, userSchema } from "./User";

export function registerModels(sequelize: Sequelize): void {
  // Register the schemas.
  userSchema(sequelize);
  classroomSchema(sequelize);

  // Initialize the associations.
  userAssociations();
  classroomAssociations();
}
