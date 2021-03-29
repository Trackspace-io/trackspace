import { Term } from "../models/Term";
import { Graph } from "./Graph";
import { Goal } from "../models/Goal";

/**
 * Goals graph.
 */
class GoalsGraph extends Graph {
  /**
   * Builds a new progress graph.
   *
   * @param term Term to represent.
   */
  constructor(term: Term, color?: string, width?: number) {
    super({ yAxis: { min: 0, stepSize: 1 } });

    // Set the week labels.
    const labels = [];
    for (let i = 1; i <= term.numberOfWeeks; i++) {
      labels.push(`Week ${i}`);
    }

    this.setLabels(labels);

    // Add the line.
    this.addDataset(
      "Goals",
      (label) => {
        const weekNumber = this.parseWeekLabel(label);
        if (weekNumber < 0) return null;

        return Goal.getTermPageGoal(term, weekNumber);
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

export default GoalsGraph;
