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

    const prevProgress = await Progress.findOne({
      where: { StudentId: studentId, SubjectId: subjectId, date: prevDate },
    });

    if (!prevProgress) return null;

    return prevProgress.getDataValue("homeworkDone")
      ? prevProgress.getDataValue("pageSet")
      : prevProgress.getDataValue("pageDone");
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

    const pageSet = progress && progress.getDataValue("pageSet");
    if (pageSet || pageSet === 0) {
      return pageSet;
    }

    return null;
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

    const pageDone = progress && progress.getDataValue("pageDone");
    if (pageDone || pageDone === 0) {
      return pageDone;
    }

    return null;
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
    const pageSet = await this.pageSetAtDate(studentId, subjectId, date);
    if (!pageSet && pageSet !== 0) {
      return null;
    }

    const pageDone = await this.pageDoneAtDate(studentId, subjectId, date);
    if (!pageDone && pageDone !== 0) {
      return null;
    }

    return pageSet - pageDone;
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
  public get date(): Date {
    return this.getDataValue("date");
  }

  /**
   * Checks if the pageFrom value is valid.
   *
   * @returns True if it is valid, false otherwise.
   */
  public async validatePageFrom(): Promise<boolean> {
    const pageFrom = this.getDataValue("pageFrom");
    const pageSet = this.getDataValue("pageSet");
    const pageDone = this.getDataValue("pageDone");

    if (pageFrom === null) {
      return pageSet === null && pageDone === null;
    }

    if (pageSet !== null && pageFrom > pageSet) {
      return false;
    }

    if (pageDone !== null && pageFrom > pageDone) {
      return false;
    }

    const classroom = await this.getClassroom();
    const term = await classroom.getTermAtDate(this.date);
    const prevDate = term.previousValidDate(this.date);

    if (prevDate === null) {
      return true;
    }

    const prevProgress = await Progress.findOne({
      where: {
        StudentId: this.studentId,
        SubjectId: this.subjectId,
        date: prevDate,
      },
    });

    if (!prevProgress) {
      return false;
    }

    if (prevProgress.getDataValue("homeworkDone")) {
      const prevPageSet = prevProgress.getDataValue("pageSet");
      return prevPageSet !== null && pageFrom >= prevPageSet;
    }

    const prevPageDone = prevProgress.getDataValue("pageDone");
    return prevPageDone !== null && pageFrom >= prevPageDone;
  }

  /**
   * Checks if the pageSet value is valid.
   *
   * @returns True if it is valid, false otherwise.
   */
  public async validatePageSet(): Promise<boolean> {
    const pageDone = this.getDataValue("pageDone");
    const pageSet = this.getDataValue("pageSet");

    if (pageSet === null) {
      return pageDone === null;
    }

    if (pageDone !== null && pageSet < pageDone) {
      return false;
    }

    const pageFrom = this.getDataValue("pageFrom");
    return pageFrom !== null && pageSet >= pageFrom;
  }

  /**
   * Checks if the pageDone value is valid.
   *
   * @returns True if it is valid, false otherwise.
   */
  public async validatePageDone(): Promise<boolean> {
    const pageDone = this.getDataValue("pageDone");
    if (pageDone === null) {
      return true;
    }

    const pageFrom = this.getDataValue("pageFrom");
    const pageSet = this.getDataValue("pageSet");

    return pageDone >= pageFrom && pageDone <= pageSet;
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
