import { getConnection } from '../database.js';

class LogoutController {
  async logout(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          status: 'error',
          message: 'User ID is required',
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE users SET isNowLogin = 0 WHERE userId = ?',
        [userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Logout successful',
        user: {
          id: userId,
          isNowLogin: 0,
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Logout failed',
        error: error.message,
      });
    }
  }
}

export default new LogoutController();
