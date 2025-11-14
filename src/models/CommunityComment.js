import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class CommunityComment extends Model {}

CommunityComment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    postId: { type: DataTypes.INTEGER, allowNull: false },
    authorName: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true }, // puede venir vacío si solo hay imagen
    imageBase64: { type: DataTypes.TEXT("long"), allowNull: true },
    status: {
      type: DataTypes.ENUM("visible", "hidden"),
      allowNull: false,
      defaultValue: "visible",
    },
  },
  {
    sequelize,
    modelName: "CommunityComment",
    tableName: "CommunityComments",
    timestamps: true,
  }
);

export default CommunityComment;
