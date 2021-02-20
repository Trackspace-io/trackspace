import { Sequelize } from "sequelize/types";
import { classroomAssociations, classroomSchema } from "./Classroom";
import { notificationAssociations, notificationSchema } from "./Notification";
import { shortLinkSchema } from "./ShortLink";
import { subjectAssociations, subjectSchema } from "./Subject";
import { userAssociations, userSchema } from "./User";

export function registerModels(sequelize: Sequelize): void {
  // Register the schemas.
  classroomSchema(sequelize);
  notificationSchema(sequelize);
  shortLinkSchema(sequelize);
  subjectSchema(sequelize);
  userSchema(sequelize);

  // Initialize the associations.
  classroomAssociations();
  notificationAssociations();
  subjectAssociations();
  userAssociations();
}
