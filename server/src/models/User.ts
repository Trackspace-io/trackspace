import { DataTypes, Model, Sequelize } from "sequelize";

export class User extends Model {
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
}

export function initUser(sequelize: Sequelize): void {
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
