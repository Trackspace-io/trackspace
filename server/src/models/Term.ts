import {
  BelongsToGetAssociationMixin,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Op,
  Sequelize,
} from "sequelize";
import { Classroom } from "./Classroom";
import { Goal } from "./Goal";

export class Term extends Model {
  /**
   * Finds a term using its identifier.
   *
   * @param id Term identifier.
   *
   * @returns The term.
   */
  public static async findById(id: string): Promise<Term> {
    return await this.findOne({ where: { id } });
  }

  /**
   * Find the terms between two dates.
   *
   * @param classroomId Identifier of the classroom.
   * @param from        Period start date.
   * @param to          Period end date.
   *
   * @returns The list of terms overlapping the given period.
   */
  public static async findTermsBetween(
    classroomId: string,
    from: Date,
    to: Date
  ): Promise<Term[]> {
    return await this.findAll({
      where: {
        ClassroomId: classroomId,
        start: { [Op.lte]: to },
        end: { [Op.gte]: from },
      },
    });
  }

  /**
   * Finds the term at a given date.
   *
   * @param classroomId Identifier of the classroom.
   * @param date        Date to check.
   *
   * @returns The term at the given date.
   */
  public static async findByDate(
    classroomId: string,
    date: Date
  ): Promise<Term> {
    return await Term.findOne({
      where: {
        ClassroomId: classroomId,
        start: { [Op.lte]: date },
        end: { [Op.gte]: date },
      },
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
   * Identifier of the associated classroom.
   */
  private get classroomId(): string {
    return this.getDataValue("ClassroomId");
  }

  /**
   * Sets the start date of the term and check for conflicts.
   *
   * @param date The new start date.
   *
   * @returns True if the date was updated, false otherwise.
   */
  public async setStart(date: Date): Promise<boolean> {
    const conflict = await Term.findByDate(this.classroomId, date);
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
   * Number of weeks in this term.
   */
  public get numberOfWeeks(): number {
    const timeDiff = this.end.getTime() - this.start.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff > 0 ? Math.floor(daysDiff / 7) + 1 : 0;
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
   * Calculates the date of one day of one week of this term.
   *
   * @param week Week number (1 → n)
   * @param day  Day string (e.g. monday, tuesday, etc.)
   *
   * @returns The date or null if the date is not valid.
   */
  public getDate(week: number, day: string): Date | null {
    const WEEK_DAYS = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dayInt = WEEK_DAYS.indexOf(day);
    if (dayInt < 0) {
      return null;
    }

    const [weekStart] = this.getWeekDates(week);

    const dateDays =
      Math.floor(weekStart.getTime() / (24 * 3600 * 1000)) -
      weekStart.getDay() +
      dayInt;

    const date = new Date(dateDays * (24 * 3600 * 1000));
    return this.isDateAllowed(date) ? date : null;
  }

  /**
   * Sets the end date of the term and check for conflicts.
   *
   * @param date The new start date.
   *
   * @returns True if the date was updated, false otherwise.
   */
  public async setEnd(date: Date): Promise<boolean> {
    const conflict = await Term.findByDate(this.classroomId, date);
    if (conflict && conflict.id !== this.id) {
      return false;
    }

    this.setDataValue("end", date);
    this.save();
    return true;
  }

  /**
   * Gets the classroom associated to this term.
   */
  public getClassroom!: BelongsToGetAssociationMixin<Classroom>;

  /**
   * Gets the goals associated to this term.
   */
  public getGoals!: HasManyGetAssociationsMixin<Goal>;

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
   * Returns the number of this term (1-n).
   *
   * @returns Number of this term.
   */
  public async getNumber(): Promise<number> {
    const classroom = await this.getClassroom();
    const terms = await classroom.getTerms({ order: [["start", "ASC"]] });

    for (let i = 0; i < terms.length; i++) {
      if (terms[i].id === this.id) {
        return i + 1;
      }
    }

    return -1;
  }

  /**
   * Computes the start and end date of a week.
   *
   * @param week Week number (1 → n).
   *
   * @returns The start and end date of the week.
   */
  public getWeekDates(week: number): [Date | null, Date | null] {
    if (week <= 0 || week > this.numberOfWeeks) {
      return [null, null];
    }

    // Get the time value in days.
    const termStartDays = Math.floor(this.start.getTime() / (24 * 3600 * 1000));

    // Compute the week start date.
    const weekStartDays = termStartDays - this.start.getDay() + 7 * (week - 1);
    const weekStartDate = new Date(weekStartDays * (24 * 3600 * 1000));

    // Compute the week end date.
    const weekEndDays = weekStartDays + 6;
    const weekEndDate = new Date(weekEndDays * (24 * 3600 * 1000));

    return [
      this.start > weekStartDate ? this.start : weekStartDate,
      this.end < weekEndDate ? this.end : weekEndDate,
    ];
  }

  /**
   * Computes the number of the week at the given date.
   *
   * @param date Date to check.
   *
   * @returns The week number (1-n) or null if the date is out of bounds.
   */
  public getWeekNumber(date: Date): number | null {
    if (date < this.start || date > this.end) {
      return null;
    }

    const timeDiff = date.getTime() - this.start.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    return Math.ceil((daysDiff - date.getDay()) / 7) + 1;
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
  Term.hasMany(Goal);
}
