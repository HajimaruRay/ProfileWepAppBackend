import crypto from 'crypto';
import { getConnection } from '../database.js';

class LoginController {
  hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  async updateLoginTime(userId) {
    const connection = await getConnection();
    await connection.execute(
      'UPDATE users SET lastLogin = ?, isNowLogin = 1 WHERE userId = ?',
      [new Date(), userId]
    );
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
        'SELECT * FROM users WHERE user_name_hash = ? AND password_hash = ? LIMIT 1',
        [usernameHash, passwordHash]
      );
      const user = users[0];

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid username or password',
        });
      }

      await this.updateLoginTime(user.userId);
      let userName;
      if ((user.th_name && user.th_lastName) == null) {
        userName = `${user.en_name} ${user.en_lastName}`
      } else {
        userName = `${user.th_name} ${user.th_lastName}`
      }
      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        user: {
          id: user.userId,
          userName: userName,
          lastlogin: new Date(),
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
