import bcrypt from "bcrypt";
import { DataTypes, Model, Sequelize } from "sequelize";

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

      const hash = user.getDataValue("password");
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
