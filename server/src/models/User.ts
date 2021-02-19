import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  BelongsToManyGetAssociationsMixin,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from "sequelize";
import Server from "../Server";
import { Classroom, IClassroomInvitation } from "./Classroom";
import { Notification } from "./Notification";

export interface IResetPasswordToken {
  userId: string;
  oldPassword: string;
}

export class User extends Model {
  /**
   * Authenticates a user. This method can be used as a verify function for
   * Passport.js.
   *
   * @param email    Email address.
   * @param password Password.
   * @param done     Verify callback.
   */
  public static async authenticate(
    email: string,
    password: string,
    done: (error: unknown, user?: User | boolean) => void
  ): Promise<void> {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return done(null, false);
      }

      const hash = user.passwordHash;
      if (!bcrypt.compareSync(password, hash)) {
        return done(null, false);
      }

      return done(null, user);
    } catch (e) {
      done(e);
    }
  }

  /**
   * Finds a user using an email address.
   *
   * @param email The email address.
   *
   * @returns The user or null.
   */
  public static async findByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  /**
   * Finds a user using an identifier.
   *
   * @param id The identifier.
   *
   * @returns The user or null.
   */
  public static async findById(id: string): Promise<User> {
    return this.findOne({ where: { id } });
  }

  /**
   * Identifier of the user.
   */
  public get id(): string {
    return this.getDataValue("id");
  }

  /**
   * Email address of the user.
   */
  public get email(): string {
    return this.getDataValue("email");
  }

  /**
   * First name of the user.
   */
  public get firstName(): string {
    return this.getDataValue("firstName");
  }

  /**
   * Last name of the user.
   */
  public get lastName(): string {
    return this.getDataValue("lastName");
  }

  /**
   * (Hashed) password of the user.
   */
  public get passwordHash(): string {
    return this.getDataValue("password");
  }

  /**
   * Role address of the user.
   */
  public get role(): "teacher" | "student" | "parent" {
    return this.getDataValue("role");
  }

  /**
   * Accepts an invitation to join a classroom.
   *
   * @param token Invitation token.
   *
   * @returns True on success, false otherwise.
   */
  public async acceptStudentInvitation(token: string): Promise<boolean> {
    if (this.role !== "student") return false;

    try {
      const data = jwt.verify(token, process.env.CLASSROOM_INVITATION_SECRET);
      const classroomId = (<IClassroomInvitation>data).classroomId;
      const classroom = await Classroom.findById(classroomId);

      if (!classroom) return false;

      await classroom.addStudent(this);
      await classroom.save();

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns the list of classrooms associated to the user.
   *
   * @returns A list of associated classrooms.
   */
  public async getClassrooms(): Promise<Classroom[]> {
    if (this.role === "teacher") {
      return await this.getTeacherClassrooms();
    }

    if (this.role === "student") {
      return await this.getStudentClassrooms();
    }

    return [];
  }

  /**
   * Sends an email containing a link to reset the user's password.
   *
   * @returns True if the email was sent, false otherwise.
   */
  public async sendResetPasswordEmail(): Promise<boolean> {
    const serverUrl = process.env.SERVER_URL;
    const clientUrl = process.env.CLIENT_URL;

    const tokenData: IResetPasswordToken = {
      userId: this.id,
      oldPassword: this.passwordHash,
    };

    const tokenSecret: string = process.env.RESET_PASSWORD_TOKEN_SECRET;
    const token = jwt.sign(tokenData, tokenSecret, {
      expiresIn: "1h",
    });

    let success = false;

    await Server.get()
      .email.send({
        template: "reset",
        message: {
          to: this.email,
        },
        locals: {
          firstName: this.firstName,
          assetsUrl: `${serverUrl}/assets`,
          link: `${clientUrl}/reset-password/confirm?t=${token}`,
          year: new Date().getFullYear(),
        },
      })
      .then(() => {
        success = true;
      })
      .catch((e) => {
        console.error(e);
        success = false;
      });

    return success;
  }

  /**
   * If the user is a teacher, returns the classrooms taught by him or her.
   */
  private getTeacherClassrooms!: HasManyGetAssociationsMixin<Classroom>;

  /**
   * If this user is a student, returns the list of classroom in which he or
   * she is enrolled.
   */
  private getStudentClassrooms!: BelongsToManyGetAssociationsMixin<Classroom>;
}

export function userSchema(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: User.name,
    }
  );
}

export function userAssociations(): void {
  User.hasMany(Classroom, {
    foreignKey: "TeacherId",
    as: { singular: "TeacherClassroom", plural: "TeacherClassrooms" },
  });

  User.hasMany(Notification, {
    foreignKey: "RecipientId",
    as: { singular: "Notification", plural: "Notifications" },
  });

  User.belongsToMany(Classroom, {
    through: "Classroom_Student",
    as: { singular: "StudentClassroom", plural: "StudentClassrooms" },
  });
}
