require('dotenv').config();
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const headerError = { error: 'Token de autenticação ausente ou inválido' };
const invalidError = { error: 'Token inválido ou expirado' };

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json(headerError);
  }

  const token = auth.split(' ')[1];
  if (!token) {
    return res.status(401).json(headerError);
  }

  try {
    const payload = await verifier.verify(token);
    req.user = payload;
    next();
  } catch (err) {
    console.error('Erro na verificação do token:', err.message);
    return res.status(403).json(invalidError);
  }
};
