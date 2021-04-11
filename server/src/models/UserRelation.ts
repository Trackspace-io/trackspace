import {
  BelongsToGetAssociationMixin,
  DataTypes,
  Model,
  Op,
  Sequelize,
} from "sequelize";
import { User } from "./User";

export class UserRelation extends Model {
  /**
   * Checks if there is a relation between two users. Two users are considered
   * as related even if the relation isn't confirmed.
   *
   * @param user1 First user.
   * @param user2 Second user.
   *
   * @returns True if the two users are related, false otherwise.
   */
  public static async areRelated(user1: User, user2: User): Promise<boolean> {
    if (user1.id === user2.id) return true;
    return (await this.findByUsers(user1, user2)) ? true : false;
  }

  /**
   * Finds the relation between two users.
   *
   * @param user1 The first user.
   * @param user2 The second user.
   *
   * @returns The relation or null if it does not exist.
   */
  public static async findByUsers(
    user1: User,
    user2: User
  ): Promise<UserRelation> {
    return this.findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ User1Id: user1.id }, { User2Id: user2.id }] },
          { [Op.and]: [{ User1Id: user2.id }, { User2Id: user1.id }] },
        ],
      },
    });
  }

  /**
   * Finds the users related to a user.
   *
   * @param user          The user.
   * @param confirmedOnly If true, only returns confirmed relations.
   * @param roles         If not empty, only returns relations with users ha-
   *                      ving one of the given roles.
   *
   * @returns A list of related users.
   */
  public static async findRelatedUsers(
    user: User,
    confirmedOnly = false,
    roles: ("teacher" | "student" | "parent")[] = []
  ): Promise<[User, UserRelation][]> {
    // Find the relations.
    const relations = await this.findAll({
      where: { [Op.or]: [{ User1Id: user.id }, { User2Id: user.id }] },
    });

    // Build the result.
    const result: [User, UserRelation][] = [];

    for (let i = 0; i < relations.length; i++) {
      if (confirmedOnly && !relations[i].confirmed) {
        continue;
      }

      const relatedUser =
        relations[i].user1Id !== user.id
          ? await relations[i].getUser1()
          : await relations[i].getUser2();

      if (roles.length == 0 || roles.includes(relatedUser.role)) {
        result.push([relatedUser, relations[i]]);
      }
    }

    // Sort related users by name.
    return result.sort((a, b) => {
      if (a[0].lastName < b[0].lastName) return -1;
      return a[0].firstName < b[0].firstName ? -1 : 1;
    });
  }

  /**
   * Indicates if the relation was confirmed or not.
   */
  public get confirmed(): boolean {
    return this.getDataValue("confirmed");
  }

  /**
   * Date since which confirmation is being waited for.
   */
  public get pendingSince(): Date | null {
    return this.confirmed ? null : this.getDataValue("createdAt");
  }

  /**
   * Identifier of the first user.
   */
  public get user1Id(): string {
    return this.getDataValue("User1Id");
  }

  /**
   * Identifier of the second user.
   */
  public get user2Id(): string {
    return this.getDataValue("User2Id");
  }

  /**
   * Get the first user of this relation.
   */
  public getUser1!: BelongsToGetAssociationMixin<User>;

  /**
   * Get the second user of this relation.
   */
  public getUser2!: BelongsToGetAssociationMixin<User>;
}

export function userRelationSchema(sequelize: Sequelize): void {
  UserRelation.init(
    {
      confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: true,
      modelName: UserRelation.name,
    }
  );
}

export function userRelationAssociations(): void {
  UserRelation.belongsTo(User, { as: "User1" });
  UserRelation.belongsTo(User, { as: "User2" });
}
