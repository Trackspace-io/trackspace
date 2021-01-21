import Email from "email-templates";
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
   * Email configuration of the server.
   */
  private _email: Email;

  /**
   * Builds the server.
   */
  private constructor() {
    // Initialize the Express router.
    this._router = Router();

    // Configure Sequelize.
    this._sequelize = new Sequelize(process.env.DATABASE_URL, {
      logging: false,
      ssl: true,
    });

    // Configure Email-templates.
    this._email = new Email({
      message: { from: "no-reply@trackspace.io" },
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: parseInt(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
        ignoreTLS: true,
      },
    });

    // Register the models.
    initUser(this._sequelize);

    // Register the routes.
    this._router.use("/users", users);
  }

  /**
   * Object used to send emails.
   */
  public get email(): Email {
    return this._email;
  }

  /**
   * Express router containing the routes of the server.
   */
  public get router(): Router {
    return this._router;
  }
}

export default Server;
