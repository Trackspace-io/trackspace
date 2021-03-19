import {
  BelongsToGetAssociationMixin,
  DataTypes,
  Model,
  Sequelize,
} from "sequelize";
import { Classroom } from "./Classroom";

export class Subject extends Model {
  /**
   * Finds a subject using its identifier.
   *
   * @param id Subject identifier.
   *
   * @returns The subject.
   */
  public static async findById(id: string): Promise<Subject> {
    return await this.findOne({ where: { id } });
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
   * Returns the identifier of the classroom associated to this subject.
   */
  public get classroomId(): string {
    return this.getDataValue("ClassroomId");
  }

  /**
   * Gets the classroom associated to this subject.
   */
  public getClassroom!: BelongsToGetAssociationMixin<Classroom>;
}

export function subjectSchema(sequelize: Sequelize): void {
  Subject.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: Subject.name,
    }
  );
}

export function subjectAssociations(): void {
  Subject.belongsTo(Classroom);
}
