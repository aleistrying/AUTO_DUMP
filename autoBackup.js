const fs = require('fs');
const _ = require('lodash');
const config = require('./config');
const exec = require('child_process').exec;
const { dbOptions } = config;

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
    console.log("Database Backup job started");
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
    let cmd = "mongodump".concat(` --host ${dbOptions.host}`,
        ` --port ${dbOptions.port}`,
        ` -d ${dbOptions.database}`,
        `${dbOptions.database ? ` --authenticationDatabase=${dbOptions.database}` : ""}`,
        `${dbOptions.user ? ` --authenticationMechanism=${dbOptions.authenticationMechanism}` : ""}`,
        `${dbOptions.user ? ' -u=' + dbOptions.user : ""}`,
        `${dbOptions.pass ? ' -p=' + dbOptions.pass : ""}`,
        ` --dumpDbUsersAndRoles${dbOptions.gzipped ? " --gzip" : ""} --out ${newBackupPath}`); // Command for mongodb dump process

    console.time("Database Backup Took:")
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            console.timeEnd("Database Backup Took:");
            return;
        }
        console.log(`Database Backup Successfully Completed`);
        console.timeEnd("Database Backup Took:");
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup) {
            // check for old backup directory exists or not
            // console.log(oldBackupPath, fs.existsSync(oldBackupPath));
            if (fs.existsSync(oldBackupPath)) {
                console.log(`Removing old backup directory: ${oldBackupPath}`);
                // remove old backup directory
                fs.rmSync(oldBackupPath, { recursive: true });
            }
        }
    });
}