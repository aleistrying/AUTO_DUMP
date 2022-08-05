require('dotenv').config();
const {
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    CRON_TIME } = process.env;
module.exports = {
    dbOptions: {
        user: DB_USER,
        pass: DB_PASS,
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        autoBackup: true,
        removeOldBackup: true,
        keepLastDaysBackup: 7,
        autoBackupPath: process.cwd() + '/backups' // i.e. /let/database-backup/
    },
    cronTime: CRON_TIME
};