import { Router } from "express";
import { Sequelize } from "sequelize";
import { initUser } from "./models/User";
import users from "./routes/users";

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
   * Server express router.
   */
  private _router: Router;

  /**
   * Builds the server.
   */
  private constructor() {
    this._router = Router();
    this._sequelize = new Sequelize(process.env.DATABASE_URL, {
      logging: false,
    });

    // Register the models.
    initUser(this._sequelize);

    // Register the routes.
    this._router.use("/users", users);
  }

  /**
   * Express router containing the routes of the server.
   */
  public get router(): Router {
    return this._router;
  }
}

export default Server;
