import { DataTypes, Model, Sequelize } from "sequelize";
import shortid from "shortid";
import { Classroom } from "./Classroom";
import { User } from "./User";

interface INotificationAction {
  name: string | ((params: string[]) => string);
  url: string | ((params: string[]) => string);
}

interface INotificationType {
  text?: string | ((params: string[]) => string);
  actions?: INotificationAction[];
}

export class Notification extends Model {
  /**
   * Notification types.
   */
  private static readonly TYPES: Record<string, INotificationType> = {
    studentInvitation: {
      text: (params: string[]): string =>
        `You have received an invitation to join ${params[0]} ${params[1]}'s classroom.`,
      actions: [
        { name: "Accept", url: (params: string[]): string => params[2] },
      ],
    },
  };

  /**
   * Creates a new student invitation notification.
   *
   * @param classroom The classroom.
   * @param student   The student.
   *
   * @returns The created notification.
   */
  public static async createStudentInvitation(
    classroom: Classroom,
    student: User
  ): Promise<Notification | null> {
    if (student.role !== "student") return null;

    // Check if the notification already exists.
    const notif = await this.findOne({
      where: {
        type: "studentInvitation",
        senderId: classroom.teacherId,
        recipientId: student.id,
      },
    });

    if (notif) return null;

    // Get the teacher.
    const teacher: User = await classroom.getTeacher();
    if (!teacher) return null;

    // Create the notification.
    return await this.create({
      id: shortid.generate(),
      type: "studentInvitation",
      senderId: classroom.teacherId,
      recipientId: student.id,
      params: JSON.stringify([teacher.firstName, teacher.lastName]),
      read: false,
    });
  }
}

export function notificationSchema(sequelize: Sequelize): void {
  Notification.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      params: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: true,
      modelName: Notification.name,
    }
  );
}

export function notificationAssociations(): void {
  Notification.belongsTo(User, {
    as: "Recipient",
  });

  Notification.belongsTo(User, {
    as: "Sender",
  });
}
