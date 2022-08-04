const CronJob = require('cron').CronJob;
const Cron = require('./autoBackup.js');
console.log("Database Backup job started");
Cron.dbAutoBackUp();
new CronJob('0 0 0 * * *', () => {
    console.log("Database Backup job started");
    Cron.dbAutoBackUp();
}, null, true, 'America/New_York');