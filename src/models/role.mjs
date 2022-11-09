import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define("roles", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  });
