const mysql = require('mysql2/promise');

class MysqlUserRepository {
  constructor() {
    this.pool = mysql.createPool({
      host:     process.env.MYSQL_HOST,
      port:     process.env.MYSQL_PORT,
      user:     process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit:    10,
      queueLimit:         0
    });
  }

async save(user) {
  const conn = await this.pool.getConnection();
  try {
    const [result] = await conn.execute(
      `INSERT INTO users (nome, email, cpf, cognito_id, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [user.nome, user.email, user.cpf, user.cognitoId, new Date()]
    );
    return { id: result.insertId }; 
  } finally {
    conn.release();
  }
}


  async findByEmail(email) {
    const conn = await this.pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      return rows[0] || null;
    } finally {
      conn.release();
    }
  }

  async findByCpf(cpf) {
    const conn = await this.pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM users WHERE cpf = ? LIMIT 1',
        [cpf]
      );
      return rows[0] || null;
    } finally {
      conn.release();
    }
  }
}

module.exports = MysqlUserRepository;
