import { getCurrentTime } from '../utils/commonFunction.js';
import { getConnection } from '../database.js';

class HealthController {
  async checkDatabaseConnection() {
    const connection = await getConnection();
    await connection.execute('SELECT 1 AS health_check');
  }

  async getHealthStatus() {
    try {
      await this.checkDatabaseConnection();

      return {
        httpStatus: 200,
        status: 'success',
        timestamp: await getCurrentTime(),
        message: 'Server is healthy',
        database: 'connected',
      };
    } catch (error) {
      console.error('Health check failed:', error);

      return {
        httpStatus: 503,
        status: 'error',
        timestamp: await getCurrentTime(),
        message: 'Server is unhealthy',
        database: 'disconnected',
      };
    }
  }

  async checkHealth(req, res) {
    const { httpStatus, ...healthStatus } = await this.getHealthStatus();
    return res.status(httpStatus).json(healthStatus);
  }
}

export default new HealthController();
