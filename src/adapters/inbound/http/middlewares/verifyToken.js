require('dotenv').config();

const ENV = process.env.NODE_ENV || 'local';
const headerError = { error: 'Token de autenticação ausente ou inválido' };
const invalidError = { error: 'Token inválido ou expirado' };

let verifier;
if (ENV !== 'local') {
  const { CognitoJwtVerifier } = require('aws-jwt-verify');
  verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: 'access',
    clientId: process.env.COGNITO_CLIENT_ID,
  });
}

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json(headerError);
  }

  const token = auth.split(' ')[1];
  if (!token) {
    return res.status(401).json(headerError);
  }

  if (ENV !== 'local') {
    try {
      await verifier.verify(token);
    } catch (err) {
      console.error('Erro na verificação do token:', err.message);
      return res.status(403).json(invalidError);
    }
  }

  next();
};
