const UserController = require('../../../src/adapters/inbound/http/controllers/UserController');
const { UserModel } = require('../../../src/adapters/outbound/cognito/repositories/UserModel');

jest.mock('../../../src/adapters/outbound/cognito/repositories/UserModel', () => ({
  UserModel: {
    findOne: jest.fn(),
  },
}));

const mockReqRes = (params = {}) => {
  const req = { params };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res };
};

describe('UserController', () => {
  describe('buscarPorEmail', () => {
    it('deve retornar usuário por email com sucesso', async () => {
      const userMock = { id: 1, email: 'erik@email.com' };
      UserModel.findOne.mockResolvedValueOnce(userMock);

      const { req, res } = mockReqRes({ email: 'erik@email.com' });

      await UserController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(userMock);
    });

    it('deve retornar 404 se email não for encontrado', async () => {
      UserModel.findOne.mockResolvedValueOnce(null);

      const { req, res } = mockReqRes({ email: 'inexistente@email.com' });

      await UserController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });
  });

  describe('buscarPorCpf', () => {
    it('deve retornar usuário por cpf com sucesso', async () => {
      const userMock = { id: 2, cpf: '12345678900' };
      UserModel.findOne.mockResolvedValueOnce(userMock);

      const { req, res } = mockReqRes({ cpf: '12345678900' });

      await UserController.getUserByCpf(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(userMock);
    });

    it('deve retornar 404 se cpf não for encontrado', async () => {
      UserModel.findOne.mockResolvedValueOnce(null);

      const { req, res } = mockReqRes({ cpf: '00000000000' });

      await UserController.getUserByCpf(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });
  });
});
