import jwt from "jsonwebtoken";
import {
  BelongsToManyAddAssociationMixin,
  DataTypes,
  Model,
  Sequelize,
} from "sequelize";
import { Notification } from "./Notification";
import { ShortLink } from "./ShortLink";
import { User } from "./User";

export interface IClassroomInvitation {
  classroomId: string;
}

export class Classroom extends Model {
  /**
   * Finds a classroom using its identifier.
   *
   * @param id Identifier of the classroom.
   */
  public static async findById(id: string): Promise<Classroom> {
    return this.findOne({ where: { id } });
  }

  /**
   * Finds a classroom using the identifier of a teacher and a name.
   *
   * @param teacherId Identifier of the teacher.
   * @param name      Name of the classroom.
   *
   * @returns The classroom or null.
   */
  public static async findByTeacherAndName(
    teacherId: string,
    name: string
  ): Promise<Classroom> {
    return this.findOne({ where: { teacherId, name } });
  }

  /**
   * Finds the list of classrooms associated to a teacher.
   *
   * @param teacherId Identifier of the teacher.
   *
   * @returns A list of classrooms.
   */
  public static async findByTeacher(teacherId: string): Promise<Classroom[]> {
    return this.findAll({ where: { teacherId } });
  }

  /**
   * Identifier of the classroom.
   */
  public get id(): string {
    return this.getDataValue("id");
  }

  /**
   * Name of the classroom.
   */
  public get name(): string {
    return this.getDataValue("name");
  }

  /**
   * Teacher identifier.
   */
  public get teacherId(): string {
    return this.getDataValue("teacherId");
  }

  /**
   * Returns the teacher of the classroom.
   *
   * @returns The teacher.
   */
  public async getTeacher(): Promise<User> {
    const teacher = this.getDataValue("teacher");
    return teacher ? teacher : await User.findById(this.teacherId);
  }

  /**
   * Adds a student to this classroom.
   */
  public addStudent!: BelongsToManyAddAssociationMixin<User, string>;

  /**
   * Generate a new invitation link.
   *
   * @param shorten   True if the link must be shortened.
   * @param expiresIn (Optional) Number of seconds after which the link expires.
   */
  public async generateLink(
    shorten?: boolean,
    expiresIn?: number
  ): Promise<string> {
    const secret: string = process.env.CLASSROOM_INVITATION_SECRET;
    const data: IClassroomInvitation = { classroomId: this.id };
    const token: string = jwt.sign(data, secret, {
      expiresIn: expiresIn ? expiresIn : Number.MAX_SAFE_INTEGER,
    });
    const clientUrl: string = process.env.CLIENT_URL;

    let link = `${clientUrl}/students/classrooms/invitations/accept?t=${token}`;
    if (shorten) {
      link = await ShortLink.shorten(link, expiresIn);
    }

    return link;
  }

  /**
   * Invites a student.
   *
   * @param student The student.
   */
  public async inviteStudent(student: User): Promise<void> {
    await Notification.createStudentInvitation(this, student);
  }
}

export function classroomSchema(sequelize: Sequelize): void {
  Classroom.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      teacherId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: Classroom.name,
    }
  );
}

export function classroomAssociations(): void {
  Classroom.belongsTo(User, {
    foreignKey: "teacherId",
    as: "teacher",
  });

  Classroom.belongsToMany(User, {
    through: "Classroom_Student",
    as: { singular: "Student", plural: "Students" },
  });
}
