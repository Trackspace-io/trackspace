import { DataTypes, Model, Op, Sequelize } from "sequelize";
import { Term } from "./Term";

export class Goal extends Model {
  /**
   * Returns the number of pages that the student must do by the end of the
   * given week.
   *
   * @param term       The term.
   * @param weekNumber The week (1-n).
   *
   * @returns Number of pages.
   */
  public static async getTermPageGoal(
    term: Term,
    weekNumber: number
  ): Promise<number> {
    const goal = await this.findOne({
      where: { TermId: term.id, weekNumber },
    });

    return goal ? goal.pages : null;
  }

  /**
   * Week number in the term.
   */
  public get weekNumber(): number {
    return this.getDataValue("weekNumber");
  }

  /**
   * Number of pages to do during the week.
   */
  public get pages(): number {
    return this.getDataValue("pages");
  }
}

export function goalSchema(sequelize: Sequelize): void {
  Goal.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      weekNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: Goal.name,
      indexes: [
        {
          unique: true,
          fields: ["weekNumber"],
        },
      ],
    }
  );
}

export function goalAssociations(): void {
  Goal.belongsTo(Term);
}
