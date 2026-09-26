import crypto from 'crypto';
import { getConnection } from '../database.js';

class RegisterController {
  hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  async register(req, res) {
    try {
      const { 
        username, 
        password,
        th_name,
        th_lastname,
        en_name,
        en_lastname
      } = req.body;

      if (!username || !password || !th_name) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid input ',
        });
      }

      const usernameHash = this.hashValue(username);
      const passwordHash = this.hashValue(password);
      const userCreatedAt = new Date();
      const userId = crypto.randomUUID();

      const connection = await getConnection();

      await connection.execute(
        'INSERT INTO users (userId, user_name_hash, password_hash, th_name, th_lastName, en_name, en_lastName, createAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, usernameHash, passwordHash, th_name, th_lastname, en_name, en_lastname, userCreatedAt]
      );

      let name;
      en_name != null ? name = en_name : name = th_name;

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        user: {
          id: userId,
          name: name,
        },
      });

    } catch (error) {
      console.error('Registration failed:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Registration failed',
        error: error.message,
      });
    }
  }
}

export default new RegisterController();
