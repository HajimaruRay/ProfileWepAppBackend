import crypto from 'crypto';
import { getConnection } from '../database.js';

class LoginController {
  hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username and password are required',
        });
      }

      const usernameHash = this.hashValue(username);
      const passwordHash = this.hashValue(password);
      const connection = await getConnection();
      const [users] = await connection.execute(
        'SELECT userId, user_name_hash FROM users WHERE user_name_hash = ? AND password_hash = ? LIMIT 1',
        [usernameHash, passwordHash]
      );
      const user = users[0];

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid username or password',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        user: {
          id: user.userId,
          usernameHash: user.userNameHash,
        },
      });
    } catch (error) {
      console.error('Login failed:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Login failed',
        error: error.message,
      });
    }
  }
}

export default new LoginController();
