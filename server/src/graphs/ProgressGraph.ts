import { User } from "../models/User";
import { Term } from "../models/Term";
import { Graph } from "./Graph";
import { Progress } from "../models/Progress";
import { Goal } from "../models/Goal";

/**
 * Progress graph.
 */
class ProgressGraph extends Graph {
  /**
   * Term represented by this graph.
   */
  private _term: Term;

  /**
   * Builds a new progress graph.
   *
   * @param term Term to represent.
   */
  constructor(term: Term) {
    super({ yAxis: { min: 0, stepSize: 1 } });

    this._term = term;

    // Set the week labels.
    const labels = [];
    for (let i = 1; i <= term.numberOfWeeks; i++) {
      labels.push(`Week ${i}`);
    }

    this.setLabels(labels);

    // Add the goal line.
    this.addDataset("Goals", (label) => {
      const weekNumber = this.parseWeekLabel(label);
      if (weekNumber < 0) return null;

      return Goal.getTermPageGoal(term, weekNumber);
    });
  }

  /**
   * Adds a student to this graph.
   *
   * @param student Student to add.
   * @param color   Color of the line.
   * @param width   Line width.
   */
  public addStudent(student: User, color?: string, width?: number): void {
    this.addDataset(
      student.fullName,
      (label) => {
        const weekNumber = this.parseWeekLabel(label);
        if (weekNumber < 0) return null;

        const [weekStart, weekEnd] = this._term.getWeekDates(weekNumber);
        return weekStart !== null && weekEnd !== null
          ? Progress.getNumberPagesDone(student, this._term.start, weekEnd)
          : null;
      },
      { color, width }
    );
  }

  /**
   * Parses a week label.
   *
   * @param label Week label.
   *
   * @returns Week number.
   */
  private parseWeekLabel(label: string): number {
    const matches = label.match("Week ([1-9][0-9]*)");
    return matches === null ? -1 : parseInt(matches[1]);
  }
}

export default ProgressGraph;
