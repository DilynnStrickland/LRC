"use strict";
const Database = require('better-sqlite3');
const db = new Database(`./Database/${process.env.DB}`);

// Signal handlers to close the database when the code
// terminates (whether successfully or due to a signal)
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

module.exports = db;