import Email from "email-templates";
import { Router } from "express";
import jsonfile from "jsonfile";
import { Sequelize } from "sequelize";
import { registerModels } from "./models";
import { registerNotifTypes } from "./notifications";
import router from "./routes";

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
   * Email configuration of the server.
   */
  private _email: Email;

  /**
   * Builds the server.
   */
  private constructor() {
    // Get the configuration.
    const env = process.env.NODE_ENV || "development";
    const path = __dirname + "/../config/config.json";
    const config = jsonfile.readFileSync(path)[env];

    // Initialize the Express router.
    this._router = Router();

    // Configure Sequelize.
    if (config.use_env_variable) {
      this._sequelize = new Sequelize(
        process.env[config.use_env_variable],
        config
      );
    } else {
      this._sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );
    }

    // Configure Email-templates.
    this._email = new Email({
      message: { from: "no-reply@trackspace.io" },
      views: {
        root: __dirname + "/../emails",
      },
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: parseInt(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    });

    // Register the models.
    registerModels(this._sequelize);

    // Register the routes.
    this._router.use("/", router);

    // Register the notification types.
    registerNotifTypes();
  }

  /**
   * Object used to send emails.
   */
  public get email(): Email {
    return this._email;
  }

  /**
   * Google settings of the application.
   */
  public get googleSettings(): {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  } {
    return {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/users/auth/google/callback`,
    };
  }

  /**
   * Express router containing the routes of the server.
   */
  public get router(): Router {
    return this._router;
  }
}

export default Server;
