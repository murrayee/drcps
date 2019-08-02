const Koa = require("koa");
const mysql = require("mysql");
const app = new Koa();

const MYSQL_CONFIG = {
  user: "root",
  password: "iop123...",
  database: "murray",
  host: process.env.DATABASE_HOST || "localhost",
  port: 3306,
  insecureAuth: true
};

const pool = mysql.createPool(MYSQL_CONFIG);

const query = (sql, val) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        connection.query(sql, val, (err, fields) => {
          if (err) reject(err);
          else resolve(fields);
          connection.release();
        });
      }
    });
  });
};

const QUERY_TABLE = tableName => `SELECT * FROM ${tableName}`;

const INSERT_TABLE = (tableName, { key, val }) =>
  `INSERT INTO ${tableName}(${key}) VALUES (${val})`;
const TABLE = "users";

async function route(url) {
  if (url === "/") {
    return "hello node server !!";
  }
  if (url === "/users") {
    const rows = await query(QUERY_TABLE(TABLE));
    return rows;
  }
}

app.use(async ctx => {
  const data = await route(ctx.request.url);
  ctx.body = data;
});

app.listen(5000);
