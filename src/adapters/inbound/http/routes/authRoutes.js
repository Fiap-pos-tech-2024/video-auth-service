const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const {
  login,
  register,
  confirmarSenha,
  recuperarSenha,
  confirmarRecuperacao,
  validarToken,
} = require('../controllers/AuthController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação (Cognito)
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login com Cognito
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: erik.fernandes87@gmail.com
 *               senha:
 *                 type: string
 *                 example: MinhaSenhaNova123!
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Email ou senha inválidos
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastro de usuário no Cognito
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: erik.fernandes87@gmail.com
 *               senha:
 *                 type: string
 *                 example: Senha123!
 *               nome:
 *                 type: string
 *                 example: Erik Amaral
 *               cpf:
 *                 type: string
 *                 example: 34058799811
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       500:
 *         description: Erro ao criar usuário
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/confirmar-senha:
 *   post:
 *     summary: Confirma a troca da senha temporária do Cognito
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: erik.fernandes87@gmail.com
 *               senhaTemporaria:
 *                 type: string
 *                 example: Senha123!
 *               novaSenha:
 *                 type: string
 *                 example: MinhaSenhaNova123!
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       500:
 *         description: Erro ao confirmar senha
 */
router.post('/confirmar-senha', confirmarSenha);

/**
 * @swagger
 * /auth/recuperar-senha:
 *   post:
 *     summary: Inicia o processo de recuperação de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código de verificação enviado
 *       500:
 *         description: Erro ao iniciar recuperação de senha
 */
router.post('/recuperar-senha', recuperarSenha);

/**
 * @swagger
 * /auth/confirmar-recuperacao:
 *   post:
 *     summary: Confirma nova senha com código recebido por e-mail
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               codigo:
 *                 type: string
 *               novaSenha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       500:
 *         description: Erro ao redefinir senha
 */
router.post('/confirmar-recuperacao', confirmarRecuperacao);

/**
 * @swagger
 * /auth/validate:
 *   get:
 *     summary: Valida se o token JWT do usuário é válido e retorna dados do usuário
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido e dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sub:
 *                   type: string
 *                   description: ID do usuário (Cognito UUID)
 *                   example: "15b0ec13-f2b2-4dd5-bf04-bd73bce3c92f"
 *                 email:
 *                   type: string
 *                   example: "erik.fernandes87@gmail.com"
 *                 exp:
 *                   type: integer
 *                   description: Timestamp da expiração do token
 *                   example: 1718632283
 *                 iat:
 *                   type: integer
 *                   description: Timestamp da emissão do token
 *                   example: 1718628683
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Token expirado ou malformado
 */
router.get('/validate', verifyToken, validarToken);

module.exports = router;
