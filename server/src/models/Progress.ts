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
import { Term } from "./Term";
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
      const progress = await this.findAll({
        where: {
          StudentId: student.id,
          date: { [Op.and]: [{ [Op.gte]: from }, { [Op.lte]: to }] },
        },
        order: [["date", "ASC"]],
      });

      // Compute the number of pages done by the student during the week.
      let pagesDone = 0;
      await Promise.all(
        progress.map(async (p) => {
          const pageFrom = await p.getDataValue("pageFrom");
          const pageDone = await p.getDataValue("pageDone");
          if (pageFrom && pageDone) pagesDone += pageDone - pageFrom;
        })
      );

      return pagesDone;
    } catch (e) {
      return null;
    }
  }

  /**
   * Gets the progress values by date.
   *
   * @param studentId The student.
   * @param subjectId The subject.
   * @param date    Date.
   *
   * @returns Progress values.
   */
  public static async valuesAtDate(
    studentId: string,
    subjectId: string,
    date: Date
  ): Promise<{
    pageFrom: number;
    pageSet: number;
    pageDone: number;
    homework: number;
    homeworkDone: boolean;
  }> {
    return {
      pageFrom: await this.pageFromAtDate(studentId, subjectId, date),
      pageSet: await this.pageSetAtDate(studentId, subjectId, date),
      pageDone: await this.pageDoneAtDate(studentId, subjectId, date),
      homework: await this.homeworkAtDate(studentId, subjectId, date),
      homeworkDone: await this.homeworkDoneAtDate(studentId, subjectId, date),
    };
  }

  /**
   * Get the "Page from" value at a date.
   *
   * @param studentId The student identifier.
   * @param subjectId The subject identifier.
   * @param date      Date.
   *
   * @returns The value at the given date.
   */
  private static async pageFromAtDate(
    studentId: string,
    subjectId: string,
    date: Date
  ): Promise<number> {
    // Check if the value is defined.
    const progress = await Progress.findOne({
      where: { StudentId: studentId, SubjectId: subjectId, date },
    });

    const pageFrom = progress && progress.getDataValue("pageFrom");
    if (pageFrom || pageFrom === 0) {
      return pageFrom;
    }

    const subject = await Subject.findById(subjectId);
    const term = await Term.findByDate(subject.classroomId, date);

    const prevDate = term.previousValidDate(date);
    if (prevDate === null) return 1;

    const prev = await Progress.findOne({
      where: { StudentId: studentId, SubjectId: subjectId, date: prevDate },
    });

    if (!prev) return null;
    return prev._homeworkDone ? prev._pageSet : prev._pageDone;
  }

  /**
   * Get the "Page set" value at a date.
   *
   * @param studentId The student identifier.
   * @param subjectId The subject identifier.
   * @param date      Date.
   *
   * @returns The value at the given date.
   */
  private static async pageSetAtDate(
    studentId: string,
    subjectId: string,
    date: Date
  ): Promise<number> {
    // Check if the value is defined.
    const progress = await Progress.findOne({
      where: { StudentId: studentId, SubjectId: subjectId, date },
    });

    if (!progress) return null;
    return progress._pageSet !== null ? progress._pageSet : null;
  }

  /**
   * Get the "Page done" value at a date.
   *
   * @param studentId The student identifier.
   * @param subjectId The subject identifier.
   * @param date      Date.
   *
   * @returns The value at the given date.
   */
  private static async pageDoneAtDate(
    studentId: string,
    subjectId: string,
    date: Date
  ): Promise<number> {
    // Check if the value is defined.
    const progress = await Progress.findOne({
      where: { StudentId: studentId, SubjectId: subjectId, date },
    });

    if (!progress) return null;
    return progress._pageDone !== null ? progress._pageDone : null;
  }

  /**
   * Get the "Homework" value at a date.
   *
   * @param studentId The student identifier.
   * @param subjectId The subject identifier.
   * @param date      Date.
   *
   * @returns The value at the given date.
   */
  private static async homeworkAtDate(
    studentId: string,
    subjectId: string,
    date: Date
  ): Promise<number> {
    // Check if the value is defined.
    const progress = await Progress.findOne({
      where: { StudentId: studentId, SubjectId: subjectId, date },
    });

    if (!progress) return null;

    return progress._pageSet !== null && progress._pageDone
      ? progress._pageSet - progress._pageDone
      : null;
  }

  /**
   * Get the "homework done" value at a date.
   *
   * @param studentId The student identifier.
   * @param subjectId The subject identifier.
   * @param date      Date.
   *
   * @returns The value at the given date.
   */
  private static async homeworkDoneAtDate(
    studentId: string,
    subjectId: string,
    date: Date
  ): Promise<boolean> {
    // Check if the value is defined.
    const progress = await Progress.findOne({
      where: { StudentId: studentId, SubjectId: subjectId, date },
    });

    return progress ? progress.getDataValue("homeworkDone") : null;
  }

  /**
   * Subject identifier.
   */
  private get subjectId(): string {
    return this.getDataValue("SubjectId");
  }

  /**
   * Student identifier.
   */
  private get studentId(): string {
    return this.getDataValue("StudentId");
  }

  /**
   * Date of the progress.
   */
  public get _date(): Date {
    return this.getDataValue("date");
  }

  /**
   * Start page.
   */
  private get _pageFrom(): number {
    return parseInt(this.getDataValue("pageFrom"));
  }

  /**
   * Number of pages to do.
   */
  private get _pageSet(): number {
    return parseInt(this.getDataValue("pageSet"));
  }

  /**
   * Number of pages done by the student.
   */
  private get _pageDone(): number {
    return parseInt(this.getDataValue("pageDone"));
  }

  /**
   * Flag indicating if the student did the homework.
   */
  private get _homeworkDone(): number {
    return this.getDataValue("homeworkDone");
  }

  /**
   * Checks if the pageFrom value is valid.
   *
   * @returns True if it is valid, false otherwise.
   */
  public async validatePageFrom(): Promise<[boolean, string]> {
    if (this._pageFrom === null) {
      return this._pageSet !== null || this._pageDone !== null
        ? [false, "You must also erase the Page Set and the Got To."]
        : [true, null];
    }

    if (this._pageSet !== null && this._pageFrom > this._pageSet) {
      return [false, "The Page From must be before the Page Set."];
    }

    if (this._pageDone !== null && this._pageFrom > this._pageDone) {
      return [false, "The Page From must be before the Page Done."];
    }

    const prev = await this.prevProgress();
    if (!prev) {
      return (await this.isFirstProgress())
        ? [true, null]
        : [false, "You must fill the values of the previous days."];
    }

    if (prev._homeworkDone) {
      return prev._pageSet !== null && this._pageFrom >= prev._pageSet
        ? [true, null]
        : [false, `You already did page ${this._pageFrom}.`];
    }

    return prev._pageDone !== null && this._pageFrom >= prev._pageDone
      ? [true, null]
      : [false, `You already did page ${this._pageFrom}.`];
  }

  /**
   * Checks if the pageSet value is valid.
   *
   * @returns True if it is valid, false otherwise.
   */
  public async validatePageSet(): Promise<[boolean, string]> {
    if (this._pageSet === null) {
      const errorMsg =
        "You cannot erase the page set value, if the Got to value is set.";
      return this._pageDone === null ? [true, null] : [false, errorMsg];
    }

    if (this._pageDone !== null && this._pageSet < this._pageDone) {
      return [false, "The Page Set must be after the Got To."];
    }

    if (this._pageFrom !== null && this._pageSet < this._pageFrom) {
      return [false, "The Page Set must be after the Start page."];
    }

    return [true, null];
  }

  /**
   * Checks if the pageDone value is valid.
   *
   * @returns True if it is valid, false otherwise.
   */
  public async validatePageDone(): Promise<[boolean, string]> {
    if (this._pageDone === null) return [true, null];
    return this._pageDone >= this._pageFrom && this._pageDone <= this._pageSet
      ? [true, null]
      : [false, "The Page Done must be before the Page Set."];
  }

  /**
   * Gets the associated subject.
   */
  public getSubject!: BelongsToGetAssociationMixin<Subject>;

  /**
   * Gets the associated student.
   */
  public getStudent!: BelongsToGetAssociationMixin<User>;

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

  /**
   * Method called after this progress was saved.
   */
  public async afterSave(): Promise<void> {
    const next = await this.nextProgress();
    if (!next) return;

    let save = false;
    const pagesDoneByStudent = this._homeworkDone
      ? this._pageSet
      : this._pageDone;

    if (next._pageFrom !== null && next._pageFrom != pagesDoneByStudent) {
      save = true;
      next.setDataValue("pageFrom", pagesDoneByStudent);
    }

    if (next._pageSet !== null && next._pageSet < next._pageFrom) {
      save = true;
      next.setDataValue("pageSet", next._pageFrom);
    }

    if (next._pageDone !== null && next._pageDone < next._pageFrom) {
      save = true;
      next.setDataValue("pageDone", next._pageFrom);
    }

    if (save) await next.save();
  }

  /**
   * Checks if this progress is the first in the term.
   *
   * @returns True if it's the first, false otherwise
   */
  private async isFirstProgress(): Promise<boolean> {
    const classroom = await this.getClassroom();
    if (!classroom) return false;

    const term = await classroom.getTermAtDate(this._date);
    if (!term) return false;

    return term.previousValidDate(this._date) === null;
  }

  /**
   * Returns the progress of the previous day.
   *
   * @returns Progress of the previous day.
   */
  private async prevProgress(): Promise<Progress> {
    const classroom = await this.getClassroom();
    if (!classroom) return null;

    const term = await classroom.getTermAtDate(this._date);
    if (!term) return null;

    const prevDate = term.previousValidDate(this._date);
    if (prevDate === null) return null;

    return await Progress.findOne({
      where: {
        StudentId: this.studentId,
        SubjectId: this.subjectId,
        date: prevDate,
      },
    });
  }

  /**
   * Returns the progress of the next day.
   *
   * @returns Progress of the next day.
   */
  private async nextProgress(): Promise<Progress> {
    const classroom = await this.getClassroom();
    if (!classroom) return null;

    const term = await classroom.getTermAtDate(this._date);
    if (!term) return null;

    const nextDate = term.nextValidDate(this._date);
    if (nextDate === null) return null;

    return await Progress.findOne({
      where: {
        StudentId: this.studentId,
        SubjectId: this.subjectId,
        date: nextDate,
      },
    });
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
      hooks: {
        afterSave: async (instance) => {
          await instance.afterSave();
        },
      },
    }
  );
}

export function progressAssociations(): void {
  Progress.belongsTo(User, { foreignKey: "StudentId", as: "Student" });
  Progress.belongsTo(Subject);
}
