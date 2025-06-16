const UserModel = require('./UserModel');
const User = require('../../../domain/entities/User');

class UserRepository {
  async create(user) {
    const created = await UserModel.create(user);
    return new User(created.dataValues);
  }

  async findByCpf(cpf) {
    const found = await UserModel.findOne({ where: { cpf } });
    return found ? new User(found.dataValues) : null;
  }

  async findByEmail(email) {
    const found = await UserModel.findOne({ where: { email } });
    return found ? new User(found.dataValues) : null;
  }
}

module.exports = UserRepository;
