require('dotenv').config();
const {
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    CRON_TIME,
    GZIPPED,
    REMOVE_PAST_BACKUP,
    DB_AUTHENTICATION_MECHANISM
} = process.env;
module.exports = {
    dbOptions: {
        user: DB_USER ?? '',
        pass: DB_PASS ?? '',
        host: DB_HOST ?? 'localhost',
        port: DB_PORT ?? 27017,
        database: DB_NAME ?? "",
        autoBackup: true,
        removeOldBackup: String(REMOVE_PAST_BACKUP).toLowerCase() === 'true',
        keepLastDaysBackup: 7,
        autoBackupPath: process.cwd() + '/backups', // i.e. /let/database-backup/
        gzipped: String(GZIPPED).toLowerCase() === "true",
        authenticationMechanism: DB_AUTHENTICATION_MECHANISM ?? 'SCRAM-SHA-256'
    },
    cronTime: CRON_TIME
};