const AuthController = require('../../../src/adapters/inbound/http/controllers/AuthController');
const { UserModel } = require('../../../src/adapters/outbound/cognito/repositories/UserModel');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
  const mockPromise = jest.fn();

  const mockCognito = {
    adminCreateUser: jest.fn(() => ({ promise: mockPromise })),
    initiateAuth: jest.fn(() => ({ promise: mockPromise })),
    respondToAuthChallenge: jest.fn(() => ({ promise: mockPromise })),
    forgotPassword: jest.fn(() => ({ promise: mockPromise })),
    confirmForgotPassword: jest.fn(() => ({ promise: mockPromise })),
  };

  return {
    CognitoIdentityServiceProvider: jest.fn(() => mockCognito),
  };
});

jest.mock('../../../src/adapters/outbound/cognito/repositories/UserModel', () => ({
  UserModel: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

const mockReqRes = (body = {}) => {
  const req = { body };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res };
};

describe('AuthController', () => {
  const { CognitoIdentityServiceProvider } = require('aws-sdk');
  const mockCognito = new CognitoIdentityServiceProvider();

  describe('register', () => {
    it('deve criar usuário no Cognito e banco com sucesso', async () => {
      const { req, res } = mockReqRes({
        email: 'teste@email.com',
        senha: 'Senha123!',
        nome: 'Test User',
        cpf: '12345678900',
      });

      mockCognito.adminCreateUser().promise.mockResolvedValueOnce({ User: { Username: 'cognito-id-123' } });
      UserModel.create.mockResolvedValueOnce({});

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    it('deve retornar 400 se faltar campos', async () => {
      const { req, res } = mockReqRes({});
      await AuthController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('confirmarSenha', () => {
    it('deve confirmar senha com sucesso', async () => {
      const { req, res } = mockReqRes({
        email: 'teste@email.com',
        senhaTemporaria: 'tempPass',
        novaSenha: 'SenhaNova123',
      });

      mockCognito.initiateAuth().promise.mockResolvedValueOnce({
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        Session: 'abc123',
      });

      mockCognito.respondToAuthChallenge().promise.mockResolvedValueOnce({
        AuthenticationResult: { token: 'xyz' },
      });

      await AuthController.confirmarSenha(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar erro se faltar campos', async () => {
      const { req, res } = mockReqRes({});
      await AuthController.confirmarSenha(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('deve retornar tokens se login for bem-sucedido', async () => {
      const { req, res } = mockReqRes({ email: 'teste@email.com', senha: 'Senha123!' });

      mockCognito.initiateAuth().promise.mockResolvedValueOnce({
        AuthenticationResult: {
          AccessToken: 'access',
          IdToken: 'id',
          RefreshToken: 'refresh',
        },
      });

      await AuthController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ accessToken: 'access' }));
    });

    it('deve retornar 400 se faltar email ou senha', async () => {
      const { req, res } = mockReqRes({});
      await AuthController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('recuperarSenha', () => {
    it('deve enviar código de recuperação com sucesso', async () => {
      const { req, res } = mockReqRes({ email: 'teste@email.com' });
      mockCognito.forgotPassword().promise.mockResolvedValueOnce({});
      await AuthController.recuperarSenha(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar 400 se email não for enviado', async () => {
      const { req, res } = mockReqRes({});
      await AuthController.recuperarSenha(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('confirmarRecuperacao', () => {
    it('deve confirmar nova senha com sucesso', async () => {
      const { req, res } = mockReqRes({
        email: 'teste@email.com',
        codigo: '123456',
        novaSenha: 'NovaSenha123!',
      });

      mockCognito.confirmForgotPassword().promise.mockResolvedValueOnce({});

      await AuthController.confirmarRecuperacao(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar erro 400 se dados estiverem incompletos', async () => {
      const { req, res } = mockReqRes({});
      await AuthController.confirmarRecuperacao(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validarToken', () => {
    it('deve retornar os dados do usuário se o token for válido', async () => {
      const { res } = mockReqRes();
      const req = {
        user: { sub: 'cognito-123' },
      };

      UserModel.findOne.mockResolvedValueOnce({
        id: 1,
        name: 'Test User',
        email: 'teste@email.com',
        cpf: '12345678900',
      });

      await AuthController.validarToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token válido',
        user: {
          id: 1,
          nome: 'Test User',
          email: 'teste@email.com',
          cpf: '12345678900',
        },
      });
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      const { res } = mockReqRes();
      const req = { user: { sub: 'nao-existe' } };

      UserModel.findOne.mockResolvedValueOnce(null);

      await AuthController.validarToken(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado no banco' });
    });
  });
});
