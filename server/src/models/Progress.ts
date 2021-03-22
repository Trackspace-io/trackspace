import {
  BelongsToGetAssociationMixin,
  DataTypes,
  Model,
  Op,
  Sequelize,
} from "sequelize";
import shortid from "shortid";
import { Classroom } from "./Classroom";
import { Subject } from "./Subject";
import { User } from "./User";

export class Progress extends Model {
  /**
   * Finds or creates a progress.
   *
   * @param subjectId Subject identifier.
   * @param studentId Student identifier.
   * @param date      Date of the progress.
   *
   * @returns The progress or undefined if the parameters are invalid.
   */
  public static async findOrCreateByKey(
    subjectId: string,
    studentId: string,
    date: Date
  ): Promise<{
    progress: Progress | null;
    error: { param: string; msg: string } | null;
  }> {
    const student = await User.findById(studentId);
    const subject = await Subject.findById(subjectId);
    if (!student || !subject || student.role !== "student") {
      return {
        progress: null,
        error: { param: "studentId", msg: "Invalid student" },
      };
    }

    const classroom = await subject.getClassroom();
    if (!classroom || !student.isInClassroom(classroom)) {
      return {
        progress: null,
        error: {
          param: "studentId",
          msg:
            "The subject and the student must be associated to " +
            "the same classroom.",
        },
      };
    }

    const term = await classroom.getTermAtDate(date);
    if (!term || !term.isDateAllowed(date)) {
      return {
        progress: null,
        error: {
          param: "date",
          msg: "You cannot register a progress at the given date.",
        },
      };
    }

    const [progress] = await this.findOrCreate({
      where: { SubjectId: subjectId, StudentId: studentId, date },
      defaults: { id: shortid.generate() },
    });

    return { progress, error: null };
  }

  /**
   * Finds the progress values registered in a date interval.
   *
   * @param studentId Student identifier.
   * @param start     Interval start date.
   * @param end       Interval end date.
   *
   * @returns
   */
  public static async findByDateInterval(
    studentId: string,
    start: Date,
    end: Date
  ): Promise<Progress[]> {
    return await this.findAll({
      where: {
        StudentId: studentId,
        date: { [Op.and]: [{ [Op.gte]: start }, { [Op.lte]: end }] },
      },
      order: [["date", "ASC"]],
    });
  }

  /**
   * Finds progress values by student and date.
   *
   * @param studentId Identifier of the student.
   * @param date      Date of the progress.
   *
   * @returns List of registered progress.
   */
  public static async findByStudentAndDate(
    studentId: string,
    date: Date
  ): Promise<Progress[]> {
    return await this.findAll({ where: { StudentId: studentId, date } });
  }

  /**
   * Checks whether a user is allowed to access to a progress object or not.
   *
   * @param user      User who wants to access to the progress.
   * @param subjectId Subject identifier.
   * @param studentId Student identifier.
   *
   * @returns True if the user is allowed, false otherwise.
   */
  public static async isUserAuthorized(
    user: User,
    subjectId: string,
    studentId: string
  ): Promise<boolean> {
    // Get the subject.
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return false;
    }

    // The user must be in the classroom associated to the subject.
    const classroom = await subject.getClassroom();
    if (!classroom || !user.isInClassroom(classroom)) {
      return false;
    }

    // Students can only access to their progress.
    if (user.role == "student" && studentId !== user.id) {
      return false;
    }

    return true;
  }

  /**
   * Returns the number of pages done by a student during a time period.
   *
   * @param student The student.
   * @param term    Term.
   * @param from    Start date of the time period.
   * @param to      End date of the time period.
   *
   * @returns Number of pages done by the student.
   */
  public static async getNumberPagesDone(
    student: User,
    from: Date,
    to: Date
  ): Promise<number | null> {
    try {
      // Get the registered progress values.
      const progress = await Progress.findByDateInterval(student.id, from, to);

      // Compute the number of pages done by the student during the week.
      let pagesDone = 0;
      progress.forEach((p) => {
        const pageFrom = p.pageFrom === null ? 0 : p.pageFrom;
        const pageDone = p.pageDone === null ? 0 : p.pageDone;
        pagesDone += pageDone - pageFrom;
      });

      return pagesDone;
    } catch (e) {
      return null;
    }
  }

  /**
   * Subject identifier.
   */
  public get subjectId(): string {
    return this.getDataValue("SubjectId");
  }

  /**
   * Date of the progress.
   */
  public get date(): Date {
    return this.getDataValue("date");
  }

  /**
   * Week day of the progress.
   */
  public get weekDay(): string {
    switch (this.date.getDay()) {
      case 0:
        return "sunday";
      case 1:
        return "monday";
      case 2:
        return "tuesday";
      case 3:
        return "wednesday";
      case 4:
        return "thursday";
      case 5:
        return "friday";
      case 6:
        return "saturday";
      default:
        return "";
    }
  }

  /**
   * Page number from which the student is starting.
   */
  public get pageFrom(): number {
    return this.getDataValue("pageFrom");
  }

  /**
   * Indicates if the pageFrom value is valid.
   */
  public get isPageFromValid(): boolean {
    if (this.pageFrom == null) {
      return this.pageFrom == null && this.pageSet == null;
    }

    return (
      (this.pageSet == null || this.pageFrom <= this.pageSet) &&
      (this.pageDone == null || this.pageFrom <= this.pageDone)
    );
  }

  /**
   * Number of the page that the student wants to reach by the end of the day.
   */
  public get pageSet(): number {
    return this.getDataValue("pageSet");
  }

  /**
   * Indicates if the pageSet value is valid.
   */
  public get isPageSetValid(): boolean {
    if (this.pageSet == null) {
      return this.pageDone == null;
    }

    return (
      this.pageFrom != null &&
      (this.pageFrom == null || this.pageSet >= this.pageFrom) &&
      (this.pageDone == null || this.pageSet >= this.pageDone)
    );
  }

  /**
   * Number of the page reached by the student at the end of this day.
   */
  public get pageDone(): number {
    return this.getDataValue("pageDone");
  }

  /**
   * Indicates if the pageDone value is valid.
   */
  public get isPageDoneValid(): boolean {
    if (this.pageDone == null) {
      return true;
    }

    return (
      this.pageFrom != null &&
      this.pageSet != null &&
      (this.pageFrom == null || this.pageDone >= this.pageFrom) &&
      (this.pageSet == null || this.pageDone <= this.pageSet)
    );
  }

  /**
   * Number of pages that the student must do as a homework.
   */
  public get homework(): number {
    return this.pageSet !== null && this.pageDone !== null
      ? this.pageSet - this.pageDone
      : null;
  }

  /**
   * Indicates if the homework was done or not.
   */
  public get homeworkDone(): boolean {
    return this.getDataValue("homeworkDone");
  }

  /**
   * Gets the associated subject.
   */
  public getSubject!: BelongsToGetAssociationMixin<Subject>;

  /**
   * Gets the associated student.
   */
  public getStudent!: BelongsToGetAssociationMixin<Subject>;

  /**
   * Gets the associated classroom.
   */
  public async getClassroom(): Promise<Classroom> {
    const subject = await this.getSubject();
    return await subject.getClassroom();
  }

  /**
   * Checks whether a user can modify this progress or not.
   *
   * @param user The user.
   *
   * @returns True if the user is allowed, false otherwise.
   */
  public async canModify(user: User): Promise<boolean> {
    const subjectId = this.getDataValue("SubjectId");
    const studentId = this.getDataValue("StudentId");
    return Progress.isUserAuthorized(user, subjectId, studentId);
  }
}

export function progressSchema(sequelize: Sequelize): void {
  Progress.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      homeworkDone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      pageFrom: DataTypes.INTEGER,
      pageSet: DataTypes.INTEGER,
      pageDone: DataTypes.INTEGER,
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: Progress.name,
      indexes: [
        {
          unique: true,
          fields: ["SubjectId", "StudentId", "date"],
        },
      ],
    }
  );
}

export function progressAssociations(): void {
  Progress.belongsTo(User, { foreignKey: "StudentId", as: "Student" });
  Progress.belongsTo(Subject);
}
