const express = require('express');
const router = express.Router();
const {
  getUserByEmail,
  getUserByCpf,
} = require('../controllers/UserController');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Consultas de usuários registrados no sistema
 */

/**
 * @swagger
 * /usuarios/email/{email}:
 *   get:
 *     summary: Buscar usuário por e-mail
 *     tags: [Usuários]
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/email/:email', getUserByEmail);

/**
 * @swagger
 * /usuarios/cpf/{cpf}:
 *   get:
 *     summary: Buscar usuário por CPF
 *     tags: [Usuários]
 *     parameters:
 *       - name: cpf
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/cpf/:cpf', getUserByCpf);

module.exports = router;
