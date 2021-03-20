import { DataTypes, Model, Sequelize } from "sequelize";
import { Term } from "./Term";

export class Goal extends Model {
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
