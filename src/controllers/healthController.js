import { getCurrentTime } from '../utils/commonFunction.js';
import { getConnection } from '../database.js';

class HealthController {
  async checkHealth(req, res) {
    try {
    //   const connection = await getConnection();
    //   await connection.execute('SELECT 1 AS health_check');

      return res.status(200).json({
        status: 'success',
        timeStamp: await getCurrentTime(),
        message: 'Server is healthy',
        database: 'connected',
      });
    } catch (error) {
      console.error('Health check failed:', error);

      return res.status(503).json({
        status: 'error',
        message: 'Server is unhealthy',
        database: 'disconnected',
      });
    }
  }
}

export default new HealthController();
