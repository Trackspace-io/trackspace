import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./User";

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

  public get teacherId(): string {
    return this.getDataValue("teacherId");
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
      timestamps: false,
      modelName: Classroom.name,
    }
  );
}

export function classroomAssociations(): void {
  Classroom.belongsTo(User, {
    foreignKey: "teacherId",
    as: "teacher",
  });
}
