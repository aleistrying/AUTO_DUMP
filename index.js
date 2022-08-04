const CronJob = require('cron').CronJob;
const Cron = require('./autoBackup.js');
console.log("Started db cron");

// Cron.dbAutoBackUp();
let timesRun = 0;
const job = new CronJob('0 0 0 * * *', () => {
    console.log(new Date().toISOString() + " Jobs ran time:", ++timesRun);
    Cron.dbAutoBackUp();
}, null, false, 'America/New_York', this, true);
job.start();