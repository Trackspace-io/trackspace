import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./User";
import { Classroom } from "./Classroom";
import { Term } from "./Term";

export class Goal extends Model {

  public static async createGoal(
    weekNumber: number,
    pages: number,
    ): Promise<{
      goal: Goal | null;
      error: { param: string, msg: string } | null;
    }> {
      return {
        goal,
        error: null,
      }
  }
}

export function goalSchema(sequelize: Sequelize): void {
  Goal.init (
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
      }
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

