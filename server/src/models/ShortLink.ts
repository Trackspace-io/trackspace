import { DataTypes, Model, Op, Sequelize } from "sequelize";
import shortid from "shortid";

export class ShortLink extends Model {
  /**
   * Destroy all the expired links from the table.
   */
  public static async cleanUp(): Promise<void> {
    await this.destroy({ where: { expirationDate: { [Op.lte]: new Date() } } });
  }

  /**
   * Shortens a URL.
   *
   * @param url       The URL to shorten.
   * @param expiresIn (Optional) Number of seconds after which the link
   *                  expires. If not specified, the link never expires.
   *
   * @returns The short link.
   */
  public static async shorten(
    url: string,
    expiresIn?: number
  ): Promise<string> {
    // Do a cleanup before creating a new link.
    this.cleanUp();

    // Check if the link already exists.
    const existing = await this.findOne({ where: { url } });
    if (existing) return existing.shortUrl;

    // Compute the expiration date.
    let expirationDate = undefined;
    if (expiresIn) {
      expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    }

    // Create a new link.
    const shortLink = await this.create({
      id: shortid.generate(),
      url,
      expirationDate,
    });
    return shortLink.shortUrl;
  }

  /**
   * The full URL.
   */
  public get fullUrl(): string {
    return this.getDataValue("url");
  }

  /**
   * Expiration date of the link.
   */
  public get expirationDate(): Date {
    return new Date(this.getDataValue("expirationDate"));
  }

  /**
   * The shortened URL.
   */
  private get shortUrl(): string {
    const serverUrl = process.env.SERVER_URL;
    return `${serverUrl}/l/${this.getDataValue("id")}`;
  }
}

export function shortLinkSchema(sequelize: Sequelize): void {
  ShortLink.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expirationDate: DataTypes.DATE,
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: ShortLink.name,
    }
  );
}
