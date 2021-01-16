import { Sequelize } from "sequelize";
import { initUser } from "./models/User";

class Server {
  /**
   * Singleton instance of the server.
   */
  private static _instance: Server;

  /**
   * Returns the singleton instance of the server.
   */
  public static get(): Server {
    if (!Server._instance) {
      Server._instance = new Server();
    }
    return Server._instance;
  }

  /**
   * Instance of Sequelize.
   */
  private _sequelize: Sequelize;

  /**
   * Builds the server.
   */
  private constructor() {
    // Configure Sequelize
    this._sequelize = new Sequelize(process.env.DATABASE_URL);

    // Initialize the models
    initUser(this._sequelize);
  }

  /**
   * Sequelize instance.
   */
  public get sequelize(): Sequelize {
    return this._sequelize;
  }
}

export default Server;
