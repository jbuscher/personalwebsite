const { Client } = require('pg');

class DatabaseClient {
  constructor() {
    const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
    this.client = new Client({
      host: PGHOST,
      port: PGPORT,
      database: PGDATABASE,
      user: PGUSER,
      password: PGPASSWORD
    });
    this.client = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client = new Client(this.config);
      this.client.connect(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.client.query(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      });
    });
  }
}

module.exports = DatabaseClient;