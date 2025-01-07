import { Pool } from 'pg';
import { LoginData } from '../types/LoginData';



export default class Login {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async authenticate(loginData: LoginData): Promise<any> {
    const client = await this.db.connect();
    
    try {
      const query = `
        SELECT
          UPPER(nome) AS nome,
          password,
          password = crypt($1, password) AS boolean_
        FROM intra.op_logins
        WHERE UPPER(nome) = $2
        AND password = crypt($1, password)
      `;

      const result = await client.query(query, [loginData.password, loginData.username]);

      if (result.rows.length === 0) {
        return { success: false, message: 'Usuário ou senha incorretos' };
      }

      const user = result.rows[0];
      
      if (user.boolean_) {
        return { success: true, message: 'Login bem-sucedido', user: user };
      } else {
        return { success: false, message: 'Senha incorreta' };
      }
    } catch (error) {
      throw new Error('Erro ao autenticar usuário');
    } finally {
      client.release();
    }
  }
}
