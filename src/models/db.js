const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./src/main.db");

exports.query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
