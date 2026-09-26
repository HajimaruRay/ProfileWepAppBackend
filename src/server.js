import app from './app.js';

const PORT = process.env.PORT || 3000;
const HEALTH_CHECK_INTERVAL_MS = 60 * 60 * 1000;

async function callHealthCheck() {
  const healthCheckUrl = process.env.HEALTH_CHECK_URL || `http://localhost:${PORT}/api/v1.0/healthCheck`;

  try {
    const response = await fetch(healthCheckUrl);

    if (!response.ok) {
      console.error(`Health check request failed with status ${response.status}`);
      return;
    }

    console.log('Health check request completed successfully.');
  } catch (error) {
    console.error('Health check request failed:', error);
  }
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
