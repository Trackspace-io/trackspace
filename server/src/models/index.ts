import { Sequelize } from "sequelize/types";
import { classroomAssociations, classroomSchema } from "./Classroom";
import { goalAssociations, goalSchema } from "./Goal";
import { notificationAssociations, notificationSchema } from "./Notification";
import { progressAssociations, progressSchema } from "./Progress";
import { shortLinkSchema } from "./ShortLink";
import { subjectAssociations, subjectSchema } from "./Subject";
import { termAssociations, termSchema } from "./Term";
import { userAssociations, userSchema } from "./User";
import { userRelationAssociations, userRelationSchema } from "./UserRelation";

export function registerModels(sequelize: Sequelize): void {
  // Register the schemas.
  classroomSchema(sequelize);
  goalSchema(sequelize);
  notificationSchema(sequelize);
  progressSchema(sequelize);
  shortLinkSchema(sequelize);
  subjectSchema(sequelize);
  termSchema(sequelize);
  userSchema(sequelize);
  userRelationSchema(sequelize);

  // Initialize the associations.
  classroomAssociations();
  goalAssociations();
  notificationAssociations();
  progressAssociations();
  subjectAssociations();
  termAssociations();
  userAssociations();
  userRelationAssociations();
}
