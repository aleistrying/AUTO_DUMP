const CronJob = require('cron').CronJob;
const Cron = require('./autoBackup.js');
const config = require('./config');
console.log("Started db cron");

// Cron.dbAutoBackUp();
let timesRun = 0;
const job = new CronJob(config.cronTime, () => {
    console.log(new Date().toISOString() + " Jobs ran time:", ++timesRun);
    Cron.dbAutoBackUp();
}, null, false, 'America/New_York', this, true);
job.start();