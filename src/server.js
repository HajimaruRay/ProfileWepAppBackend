import app from './app.js';
import healthController from './controllers/healthController.js';

const PORT = process.env.PORT || 3000;
const HEALTH_CHECK_INTERVAL_MS = 60 * 60 * 1000;

async function callHealthCheck() {
  const healthStatus = await healthController.getHealthStatus();

  if (healthStatus.status === 'success') {
    console.log('Health check completed successfully.');
    return;
  }

  console.error(`Health check failed with status ${healthStatus.httpStatus}`);
}

function startHourlyHealthCheck() {
  callHealthCheck();
  return setInterval(callHealthCheck, HEALTH_CHECK_INTERVAL_MS);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);

  if (process.env.ENABLE_HOURLY_HEALTH_CHECK === 'true') {
    startHourlyHealthCheck();
  }
});
