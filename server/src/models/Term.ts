import {
  BelongsToGetAssociationMixin,
  DataTypes,
  Model,
  Op,
  Sequelize,
} from "sequelize";
import { Classroom } from "./Classroom";

export class Term extends Model {
  /**
   * Finds a term using its identifier.
   *
   * @param id Term identifier.
   *
   * @returns The term.
   */
  static async findById(id: string): Promise<Term> {
    return await this.findOne({ where: { id } });
  }

  /**
   * Find the terms between two dates.
   *
   * @param from Period start date.
   * @param to   Period end date.
   *
   * @returns The list of terms overlapping the given period.
   */
  static async findTermsBetween(from: Date, to: Date): Promise<Term[]> {
    return await this.findAll({
      where: { [Op.and]: { start: { [Op.lte]: to }, end: { [Op.gte]: from } } },
    });
  }

  /**
   * Identifier of the term.
   */
  public get id(): string {
    return this.getDataValue("id");
  }

  /**
   * Start date of the term.
   */
  public get start(): Date {
    return this.getDataValue("start");
  }

  /**
   * Sets the start date of the term and check for conflicts.
   *
   * @param date The new start date.
   *
   * @returns True if the date was updated, false otherwise.
   */
  public async setStart(date: Date): Promise<boolean> {
    const conflict = await this.getTermAtDate(date);
    if (conflict && conflict.id !== this.id) {
      return false;
    }

    this.setDataValue("start", date);
    this.save();
    return true;
  }

  /**
   * End date of the term.
   */
  public get end(): Date {
    return this.getDataValue("end");
  }

  /**
   * Sets the end date of the term and check for conflicts.
   *
   * @param date The new start date.
   *
   * @returns True if the date was updated, false otherwise.
   */
  public async setEnd(date: Date): Promise<boolean> {
    const conflict = await this.getTermAtDate(date);
    if (conflict && conflict.id !== this.id) {
      return false;
    }

    this.setDataValue("end", date);
    this.save();
    return true;
  }

  /**
   * List of allowed week days of this term.
   */
  public get days(): string[] {
    const days: string[] = [];

    if (this.getDataValue("sunday")) {
      days.push("sunday");
    }
    if (this.getDataValue("monday")) {
      days.push("monday");
    }
    if (this.getDataValue("tuesday")) {
      days.push("tuesday");
    }
    if (this.getDataValue("wednesday")) {
      days.push("wednesday");
    }
    if (this.getDataValue("thursday")) {
      days.push("thursday");
    }
    if (this.getDataValue("friday")) {
      days.push("friday");
    }
    if (this.getDataValue("saturday")) {
      days.push("saturday");
    }

    return days;
  }

  /**
   * Gets the classroom associated to this term.
   */
  public getClassroom!: BelongsToGetAssociationMixin<Classroom>;

  /**
   * Checks if a date is allowed in this term.
   *
   * @param date The date to check.
   *
   * @returns True if the date is between the start and the end date.
   */
  public isDateAllowed(date: Date): boolean {
    return (
      date >= this.start && date <= this.end && this.isDayAllowed(date.getDay())
    );
  }

  /**
   * Checks if a day is allowed.
   *
   * @param day Day of the week (0 = sunday, 1 = monday, etc.). Can also be the
   *            name of the day in lower case.
   *
   * @returns True if the day is allowed, false otherwise.
   */
  public isDayAllowed(day: number | string): boolean {
    switch (day) {
      case 0:
      case "sunday":
        return this.getDataValue("sunday");
      case 1:
      case "monday":
        return this.getDataValue("monday");
      case 2:
      case "tuesday":
        return this.getDataValue("tuesday");
      case 3:
      case "wednesday":
        return this.getDataValue("wednesday");
      case 4:
      case "thursday":
        return this.getDataValue("thursday");
      case 5:
      case "friday":
        return this.getDataValue("friday");
      case 6:
      case "saturday":
        return this.getDataValue("saturday");
      default:
        return false;
    }
  }

  /**
   * Returns the number of weeks in this term.
   *
   * @returns Number of weeks.
   */
  public numberOfWeeks(): number {
    const timeDiff = this.end.getTime() - this.start.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    return daysDiff > 0 ? 1 + Math.floor(daysDiff / 7) + 1 : 0;
  }

  /**
   * Sets the list of allowed days.
   *
   * @param days List of allowed days.
   */
  public setAllowedDays(days: string[] | number[]): void {
    // Reset days.
    for (let day = 0; day < 7; day++) {
      this.setDayIsAllowed(day, false);
    }

    // Set the values.
    days.forEach((day: string | number) => {
      this.setDayIsAllowed(day, true);
    });
  }

  /**
   * Returns the term at a given date.
   *
   * @param date Date to check.
   *
   * @returns The term at the given date.
   */
  public async getTermAtDate(date: Date): Promise<Term> {
    return await Term.findOne({
      where: {
        [Op.and]: {
          start: { [Op.lte]: date },
          end: { [Op.gte]: date },
        },
      },
    });
  }

  /**
   * Sets whether a day of the week is allowed or not.
   *
   * @param day     Day of the week (0 = sunday, 1 = monday, etc.). Can also be the
   *                name of the day in lower case.
   * @param allowed New value.
   */
  private setDayIsAllowed(day: number | string, allowed: boolean): void {
    switch (day) {
      case 0:
      case "sunday":
        this.setDataValue("sunday", allowed);
        break;
      case 1:
      case "monday":
        this.setDataValue("monday", allowed);
        break;
      case 2:
      case "tuesday":
        this.setDataValue("tuesday", allowed);
        break;
      case 3:
      case "wednesday":
        this.setDataValue("wednesday", allowed);
        break;
      case 4:
      case "thursday":
        this.setDataValue("thursday", allowed);
        break;
      case 5:
      case "friday":
        this.setDataValue("friday", allowed);
        break;
      case 6:
      case "saturday":
        this.setDataValue("saturday", allowed);
        break;
      default:
        return;
    }

    this.save();
  }
}

export function termSchema(sequelize: Sequelize): void {
  Term.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sunday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      monday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      tuesday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      wednesday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      thursday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      friday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      saturday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: Term.name,
    }
  );
}

export function termAssociations(): void {
  Term.belongsTo(Classroom);
}
