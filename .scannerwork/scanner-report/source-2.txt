const { UserModel } = require('../../../outbound/cognito/repositories/UserModel');

// Buscar por e-mail
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { email: req.params.email },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Erro ao buscar por e-mail:', err.message);
    return res.status(500).json({ error: 'Erro interno', detalhes: err.message });
  }
};

// Buscar por CPF
exports.getUserByCpf = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { cpf: req.params.cpf },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Erro ao buscar por CPF:', err.message);
    return res.status(500).json({ error: 'Erro interno', detalhes: err.message });
  }
};
