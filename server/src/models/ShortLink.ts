import { DataTypes, Model, Sequelize } from "sequelize";
import shortid from "shortid";

export class ShortLink extends Model {
  /**
   * Shortens a URL.
   *
   * @param url The URL to shorten.
   *
   * @returns The short link.
   */
  public static async shorten(url: string): Promise<string> {
    // Check if the link already exists.
    const existing = await this.findOne({ where: { url } });
    if (existing) return existing.shortUrl;

    // Create a new link.
    const shortLink = await this.create({ id: shortid.generate(), url });
    return shortLink.shortUrl;
  }

  /**
   * The full URL.
   */
  public get fullUrl(): string {
    return this.getDataValue("url");
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
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: ShortLink.name,
    }
  );
}
