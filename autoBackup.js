const fs = require('fs');
const _ = require('lodash');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
// const exec = require('child_process').exec;
const dbOptions = {
    user: '',
    pass: '',
    host: 'localhost',
    port: 27017,
    database: 'FACTU',
    autoBackup: true,
    removeOldBackup: false,
    keepLastDaysBackup: 7,
    autoBackupPath: process.cwd() + '/backups' // i.e. /let/database-backup/
};
/* return date object */
// exports.stringToDate = (dateString) => {
//     return new Date(dateString);
// };
/* return if letiable is empty or not. */
const empty = (mixedlet) => {
    let undef, key, i, len;
    let emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedlet === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedlet === 'object') {
        for (key in mixedlet) {
            return false;
        }
        return true;
    }
    return false;
};
exports.empty = empty;
// Auto backup script
exports.dbAutoBackUp = () => {
    // check for auto backup is enabled or disabled
    if (!dbOptions?.autoBackup)
        return;

    const currentDate = new Date();
    let beforeDate, oldBackupDir, oldBackupPath;
    let dateDir = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    let newBackupPath = `${dbOptions.autoBackupPath}/${dateDir}`; // New backup path for current backup process
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup) {
        beforeDate = _.clone(currentDate);
        beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
        oldBackupDir = `${beforeDate.getFullYear()}-${beforeDate.getMonth() + 1}-${beforeDate.getDate()}`;
        oldBackupPath = `${dbOptions.autoBackupPath}/${oldBackupDir}`; // old backup(after keeping # of days)
    }
    let cmd = `mongodump --host ${dbOptions.host} --port ${dbOptions.port} --db ${dbOptions.database}${dbOptions.user ? ' --username ' + dbOptions.user : ""}${dbOptions.pass ? ' --password ' + dbOptions.pass : ""} --out ${newBackupPath} `; // Command for mongodb dump process
    console.time("Database Backup Took:")
    try {

        const result = await exec(cmd)/*, (error, stdout, stderr) => {
        console.timeEnd("Database Backup Took:")
        console.log(error)
        if (empty(error)) {
            // check for remove old backup after keeping # of days given in configuration
            if (dbOptions.removeOldBackup) {
                if (fs.existsSync(oldBackupPath)) {
                    exec("rm -rf " + oldBackupPath, function (err) { });
                }
            }
        }
    });*/
        console.timeEnd("Database Backup Took:")
        console.log(result.error)
        if (empty(result.error)) {
            // check for remove old backup after keeping # of days given in configuration
            if (dbOptions.removeOldBackup) {
                if (fs.existsSync(oldBackupPath)) {
                    exec("rm -rf " + oldBackupPath, function (err) { });
                }
            }
        }
    } catch (e) {
        console.log("backup error", e)
        console.timeEnd("Database Backup Took:")

    }
}