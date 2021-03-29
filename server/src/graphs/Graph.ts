import { ChartConfiguration, ChartDataSets } from "chart.js";

/**
 * Callback function returning the value of a point or null if this point isn't
 * defined.
 */
export interface IGetPointCallback {
  /**
   * Get point callback.
   *
   * @param label Label of the point.
   *
   * @returns The value of the point or null if this point isn't defined.
   */
  (label: string): Promise<number | null>;
}

/**
 * Graph options.
 */
export interface IGraphOptions {
  yAxis?: { min?: number; max?: number; stepSize?: number };
}

export interface IDatasetOptions {
  color?: string;
  width?: number;
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

  private _options: IGraphOptions;

  /**
   * Initializaes the graph.
   *
   * @param options Graph options.
   */
  constructor(options: IGraphOptions = {}) {
    this._datasets = [];
    this._labels = [];
    this._options = options;
  }

  /**
   * Returns the Chart.js configuration of this graph.
   *
   * @returns Chart.js configuration.
   */
  public async config(): Promise<ChartConfiguration> {
    return {
      type: "line",
      data: {
        labels: this._labels,
        datasets: await Promise.all(
          this._datasets.map((dataset) =>
            dataset.getChartJsConfig(this._labels)
          )
        ),
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: this._options.yAxis.min,
                max: this._options.yAxis.max,
                stepSize: this._options.yAxis.stepSize,
              },
            },
          ],
        },
      },
    };
  }

  /**
   * Adds a new dataset.
   *
   * @param dataset Dataset to add.
   */
  protected addDataset(
    label: string,
    getPoint: IGetPointCallback,
    options: IDatasetOptions = {}
  ): void {
    this._datasets.push(new Dataset(label, getPoint, options));
  }

  /**
   * Sets the labels of the x-axis.
   *
   * @param labels Labels of the x-axis.
   */
  protected setLabels(labels: string[]): void {
    this._labels = labels;
  }
}

/**
 * Class representing a dataset.
 */
class Dataset {
  /**
   * Label of this dataset.
   */
  private _label: string;

  /**
   * "Get point" callback function.
   */
  private _getPoint: IGetPointCallback;

  /**
   * Dataset options.
   */
  private _options: IDatasetOptions;

  /**
   * Builds a new dataset.
   *
   * @param label    Label of the dataset.
   * @param getPoint Callback function used to get the value of a point.
   */
  constructor(
    label: string,
    getPoint: IGetPointCallback,
    options: IDatasetOptions = {}
  ) {
    this._label = label;
    this._getPoint = getPoint;
    this._options = options;
  }

  /**
   * Returns the Chart.js representation of this dataset.
   *
   * @param labels Labels of the x-axis.
   *
   * @returns Chart.js configuration.
   */
  public async getChartJsConfig(labels: string[]): Promise<ChartDataSets> {
    return {
      label: this._label,
      data: await this.getPoints(labels),
      fill: false,
      borderColor: this._options.color,
      backgroundColor: this._options.color,
      borderWidth: this._options.width,
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
    const points: number[] = [];

    for (let i = 0; i < labels.length; i++) {
      points.push(await this._getPoint(labels[i]));
    }

    return new Interpolator(points).points;
  }
}

/**
 * Class used to interpolate the missing values of a graph.
 */
class Interpolator {
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
    if (x1 < 0) return null;

    // Get the next defined value.
    const x2 = this.getNextDefinedPointX(index);
    if (x2 < 0) return null;

    const y1 = this.isDefined(x1) ? this._interpolatedPts[x1] : 0;
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
    return -1;
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
    return -1;
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
