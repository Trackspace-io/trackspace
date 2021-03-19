import { Sequelize } from "sequelize/types";
import { classroomAssociations, classroomSchema } from "./Classroom";
import { notificationAssociations, notificationSchema } from "./Notification";
import { progressAssociations, progressSchema } from "./Progress";
import { shortLinkSchema } from "./ShortLink";
import { subjectAssociations, subjectSchema } from "./Subject";
import { termAssociations, termSchema } from "./Term";
import { userAssociations, userSchema } from "./User";

export function registerModels(sequelize: Sequelize): void {
  // Register the schemas.
  classroomSchema(sequelize);
  notificationSchema(sequelize);
  progressSchema(sequelize);
  shortLinkSchema(sequelize);
  subjectSchema(sequelize);
  termSchema(sequelize);
  userSchema(sequelize);

  // Initialize the associations.
  classroomAssociations();
  notificationAssociations();
  progressAssociations();
  subjectAssociations();
  termAssociations();
  userAssociations();
}
