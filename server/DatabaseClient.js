const { Client } = require('pg');
const fs = require('fs');

class DatabaseClient {
  constructor() {
    const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
    const sslmode = process.env.NODE_ENV === 'production' ? '?sslmode=require' : '';
    this.config = {
      connectionString: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`,
    };
    if (process.env.NODE_ENV === 'production') {
      this.config.ssl = {
        rejectUnauthorized: false,
        ca: process.env.CA_CERT
      }
    }
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