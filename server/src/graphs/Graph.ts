/**
 * Callback function returning the value of a point or null if this point isn't
 * defined.
 */
export interface IGetPointCallback {
  /**
   * Get point callback.
   *
   * @param label Label of the point.
   * @param index Index of the label in the list of labels of the x-axis.
   *
   * @returns The value of the point or null if this point isn't defined.
   */
  (label: string, index: number): Promise<number | null>;
}

/**
 * JSON representation of a graph.
 */
export interface IGraphJSON {
  type: string;
  data: {
    labels: string[];
    datasets: IDatasetJSON[];
  };
}

/**
 * JSON representation of a dataset.
 */
export interface IDatasetJSON {
  label: string;
  data: number[];
  fill: boolean;
}

/**
 * Graph class.
 */
export class Graph {
  /**
   * List of datasets.
   */
  private _datasets: Dataset[];

  /**
   * Labels of the x-axis.
   */
  private _labels: string[];

  /**
   * Builds a new graph.
   *
   * @param labels Labels of the x-axis.
   */
  constructor(labels: string[]) {
    this._datasets = [];
    this._labels = labels;
  }

  /**
   * Returns the JSON representation of the graph.
   *
   * @returns JSON representation of this graph.
   */
  public async toJSON(): Promise<IGraphJSON> {
    return {
      type: "line",
      data: {
        labels: this._labels,
        datasets: await Promise.all(
          this._datasets.map((dataset) => dataset.toJSON(this._labels))
        ),
      },
    };
  }

  /**
   * Adds a bew dataset.
   *
   * @param dataset Dataset to add.
   *
   * @returns This dataset.
   */
  public dataset(dataset: Dataset): Graph {
    this._datasets.push(dataset);
    return this;
  }
}

/**
 * Class representing a dataset.
 */
export class Dataset {
  /**
   * Label of this dataset.
   */
  private _label: string;

  /**
   * "Get point" callback function.
   */
  private _getPoint: IGetPointCallback;

  /**
   * Builds a new dataset.
   *
   * @param label    Label of the dataset.
   * @param getPoint Callback function used to get the value of a point.
   */
  constructor(label: string, getPoint: IGetPointCallback) {
    this._label = label;
    this._getPoint = getPoint;
  }

  /**
   * Returns the JSON representation of this dataset.
   *
   * @param labels Labels of the x-axis.
   *
   * @returns JSON representation of the dataset.
   */
  public async toJSON(labels: string[]): Promise<IDatasetJSON> {
    return {
      label: this._label,
      data: await this.getPoints(labels),
      fill: false,
    };
  }

  /**
   * Returns the points of the dataset.
   *
   * @param labels Labels of the x-axis.
   *
   * @returns The list of points.
   */
  private async getPoints(labels: string[]): Promise<(number | null)[]> {
    return new Interpolator(
      await Promise.all(
        labels.map(async (label, i) => this._getPoint(label, i))
      )
    ).points;
  }
}

/**
 * Class used to interpolate the missing values of a graph.
 */
export class Interpolator {
  /**
   * List of initial points.
   */
  private _initialPts: number[];

  /**
   * List of points to interpolate.
   */
  private _interpolatedPts: number[];

  /**
   * Builds the interpolator.
   *
   * @param points List of points to interpolate.
   */
  constructor(points: number[]) {
    this._initialPts = points;
    this._interpolatedPts = points;

    // Interpolate the missing points.
    for (let i = 0; i < this._interpolatedPts.length; i++) {
      this.interpolate(i);
    }
  }

  /**
   * List of points.
   */
  public get points(): number[] {
    return this._interpolatedPts;
  }

  /**
   * Interpolates a point.
   *
   * @param index Index of the point.
   */
  private interpolate(index: number): void {
    if (this.isDefined(index)) return;

    // Get the previous defined value.
    const x1 = this.getPrevDefinedPointX(index);
    const y1 = this.isDefined(x1) ? this._interpolatedPts[x1] : 0;

    // Get the next defined value.
    const x2 = this.getNextDefinedPointX(index);
    const y2 = this.isDefined(x2) ? this._interpolatedPts[x2] : 0;

    // Interpolate the value.
    this._interpolatedPts[index] = Math.ceil(
      y1 + (index - x1) * ((y2 - y1) / (x2 - x1))
    );
  }

  /**
   * Gets the index of the previous defined point.
   *
   * @param index Index of the point.
   *
   * @returns Index of the previous defined point.
   */
  private getPrevDefinedPointX(index: number): number {
    for (let i = index; i >= 0; i--) {
      if (this.isDefined(i)) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Gets the index of the next defined point.
   *
   * @param index Index of the point.
   *
   * @returns Index of the next defined point.
   */
  private getNextDefinedPointX(index: number): number {
    for (let i = index; i < this._initialPts.length; i++) {
      if (this.isDefined(i)) {
        return i;
      }
    }
    return this._initialPts.length - 1;
  }

  /**
   * Checks if a point is defined or not.
   *
   * @param index Index of the point.
   *
   * @returns True if the point is defined, false otherwise.
   */
  private isDefined(index: number): boolean {
    if (index < 0 || index >= this._initialPts.length) {
      return false;
    }

    const value = this._initialPts[index];
    return typeof value === "number" && isFinite(value);
  }
}
