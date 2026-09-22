import { getCurrentTime } from '../utils/commonFunction.js';
import { getConnection } from '../database.js';

class HealthController {
  async checkDatabaseConnection() {
    const connection = await getConnection();
    await connection.execute('SELECT 1 AS health_check');
  }

  async checkHealth(req, res) {
    try {
      await this.checkDatabaseConnection();

      return res.status(200).json({
        status: 'success',
        timestamp: await getCurrentTime(),
        message: 'Server is healthy',
        database: 'connected',
      });
    } catch (error) {
      console.error('Health check failed:', error);

      return res.status(503).json({
        status: 'error',
        timestamp: await getCurrentTime(),
        message: 'Server is unhealthy',
        database: 'disconnected',
      });
    }
  }
}

export default new HealthController();
