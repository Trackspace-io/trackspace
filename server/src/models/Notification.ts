import {
  BelongsToGetAssociationMixin,
  DataTypes,
  Model,
  Sequelize,
} from "sequelize";
import shortid from "shortid";
import { User } from "./User";

export interface INotificationInfo {
  text: string;
  actions: string[];
}

/**
 * Notification type. P is the interface that must be supported by the parame-
 * ters of this type of notification.
 */
export interface INotificationType<P> {
  /**
   * Text to display with the notification.
   */
  info:
    | ((params: P) => INotificationInfo)
    | ((params: P) => Promise<INotificationInfo>);

  /**
   * Function called when the user selects an action.
   */
  process:
    | ((action: string, params: P, notif: Notification) => void)
    | ((action: string, params: P, notif: Notification) => Promise<void>);

  /**
   * Serializes the parameters of a notification of this type.
   */
  serializeParams: (params: P) => string;

  /**
   * Deserializes the parameters of a notification of this type.
   */
  deserializeParams: (params: string) => P;
}

export class Notification extends Model {
  /**
   * Map of registered notification types.
   */
  private static types: { [name: string]: INotificationType<unknown> } = {};

  /**
   * Registers a notification type.
   *
   * @param name Name of the type of notification.
   * @param type Notification type object.
   */
  public static registerType(
    name: string,
    type: INotificationType<unknown>
  ): void {
    Notification.types[name] = type;
  }

  /**
   * Finds a notification using its identifier.
   *
   * @param id The identifier.
   *
   * @returns The notification.
   */
  public static async findById(id: string): Promise<Notification> {
    return this.findOne({ where: { id } });
  }

  /**
   * Finds the notifications addressed to the given user.
   *
   * @param recipient  The recipient.
   *
   * @returns List of notifications.
   */
  public static async findByRecipient(
    recipient: User
  ): Promise<Notification[]> {
    return await this.findAll({
      where: { RecipientId: recipient.id },
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Sends a notification to a user.
   *
   * @param recipient Recipient of the notification.
   * @param type      Notification type.
   * @param params    Parameters of notification.
   *
   * @returns The sent notification or null if the notification wasn't sent.
   */
  public static async sendNotification(
    recipient: User,
    type: string,
    params: unknown
  ): Promise<Notification | null> {
    if (!Notification.types[type]) {
      throw new Error("Unknown notification type.");
    }

    return await this.create({
      id: shortid.generate(),
      RecipientId: recipient.id,
      type: type,
      params: Notification.types[type].serializeParams(params),
    });
  }

  /**
   * Identifier of the notification.
   */
  public get id(): string {
    return this.getDataValue("id");
  }

  /**
   * Date at which this notification was sent.
   */
  public get date(): Date {
    return this.getDataValue("createdAt");
  }

  /**
   * Returns the recipient of this notification.
   */
  public getRecipient!: BelongsToGetAssociationMixin<User>;

  /**
   * Processes this notification.
   *
   * @param action Selected action.
   */
  public async process(action: string): Promise<void> {
    if (!this.typeObj) return;

    try {
      await this.typeObj.process(action, this.deserializedParams, this);
    } finally {
      await this.destroy();
    }
  }

  /**
   * Returns the actions of the notification.
   *
   * @returns Text of the notification.
   */
  public async getActions(): Promise<string[]> {
    if (!this.typeObj) return [];
    const { actions } = await this.typeObj.info(this.deserializedParams);
    return actions;
  }

  /**
   * Returns the text of the notification.
   *
   * @returns Text of the notification.
   */
  public async getText(): Promise<string> {
    if (!this.typeObj) return "";
    const { text } = await this.typeObj.info(this.deserializedParams);
    return text;
  }

  /**
   * Notification type object.
   */
  private get typeObj(): INotificationType<unknown> | null {
    const name = this.getDataValue("type");
    return Notification.types[name] ? Notification.types[name] : null;
  }

  /**
   * The parameters of this notification.
   */
  private get deserializedParams(): unknown {
    return this.typeObj
      ? this.typeObj.deserializeParams(this.getDataValue("params"))
      : null;
  }
}

export function notificationSchema(sequelize: Sequelize): void {
  Notification.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      params: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: true,
      modelName: Notification.name,
    }
  );
}

export function notificationAssociations(): void {
  Notification.belongsTo(User, {
    as: "Recipient",
  });
}
