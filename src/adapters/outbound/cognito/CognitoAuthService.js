const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  ForgotPasswordCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

class CognitoAuthService {
  constructor() {
    this.client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
    this.userPoolId = process.env.COGNITO_USER_POOL_ID;
    this.clientId = process.env.COGNITO_CLIENT_ID;
  }

  async register(email, password) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
    });

    try {
      await this.client.send(command);
      return { message: 'Usuário cadastrado com sucesso.' };
    } catch (err) {
      throw new Error(`Erro ao cadastrar usuário: ${err.message}`);
    }
  }

  async login(email, password) {
    const command = new AdminInitiateAuthCommand({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const response = await this.client.send(command);
      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        return {
          challenge: 'NEW_PASSWORD_REQUIRED',
          session: response.Session,
        };
      }

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
      };
    } catch (err) {
      throw new Error(`Erro ao autenticar usuário: ${err.message}`);
    }
  }

  async confirmPassword(email, temporaryPassword, newPassword) {
    try {
      const initCommand = new AdminInitiateAuthCommand({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: temporaryPassword,
        },
      });

      const initResponse = await this.client.send(initCommand);

      const respondCommand = new AdminRespondToAuthChallengeCommand({
        ClientId: this.clientId,
        UserPoolId: this.userPoolId,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: newPassword,
        },
        Session: initResponse.Session,
      });

      await this.client.send(respondCommand);
      return { message: 'Senha alterada com sucesso.' };
    } catch (err) {
      throw new Error(`Erro ao confirmar senha: ${err.message}`);
    }
  }

  async sendPasswordResetCode(email) {
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
    });

    try {
      await this.client.send(command);
      return { message: 'Código de recuperação enviado com sucesso.' };
    } catch (err) {
      throw new Error(`Erro ao enviar código de recuperação: ${err.message}`);
    }
  }
}

module.exports = CognitoAuthService;
