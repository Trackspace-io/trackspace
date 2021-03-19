import { User } from "../models/User";
import { Term } from "../models/Term";
import { Graph } from "./Graph";
import { Progress } from "../models/Progress";

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

    const labels = [];
    for (let i = 1; i <= term.numberOfWeeks; i++) {
      labels.push(`Week ${i}`);
    }

    this.setLabels(labels);
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
        const matches = label.match("Week ([1-9][0-9]*)");
        if (matches === null) return null;

        const [weekStart, weekEnd] = this._term.getWeekDates(
          parseInt(matches[1])
        );

        return weekStart !== null && weekEnd !== null
          ? Progress.getNumberPagesDone(student, this._term.start, weekEnd)
          : null;
      },
      { color, width }
    );
  }
}

export default ProgressGraph;
