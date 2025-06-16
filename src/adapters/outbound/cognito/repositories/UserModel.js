const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../config/sequelize');

const UserModel = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  cognitoId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { UserModel };
