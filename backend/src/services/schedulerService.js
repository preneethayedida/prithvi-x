const cron = require('node-cron');
const env = require('../config/env');
const ingestionService = require('./ingestionService');

class SchedulerService {
  constructor() {
    this.cronTask = null;
  }

  start() {
    if (!env.ENABLE_AUTO_INGESTION) {
      console.log('[SchedulerService] Background ingestion cron is disabled by config.');
      return;
    }

    const schedulePattern = env.INGESTION_INTERVAL_CRON || '0 */3 * * *';
    console.log(`[SchedulerService] Scheduling automated data ingestion with cron pattern: "${schedulePattern}"`);

    this.cronTask = cron.schedule(schedulePattern, async () => {
      console.log(`[SchedulerService] Cron trigger: Starting periodic regional environmental sync...`);
      try {
        await ingestionService.ingestAll();
      } catch (err) {
        console.error(`[SchedulerService] Error during scheduled sync:`, err.message);
      }
    });
  }

  stop() {
    if (this.cronTask) {
      this.cronTask.stop();
      console.log('[SchedulerService] Background ingestion cron stopped.');
    }
  }
}

module.exports = new SchedulerService();
