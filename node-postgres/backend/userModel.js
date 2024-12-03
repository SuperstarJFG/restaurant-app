require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//get all Users in our database
const getUsers = async () => {
    try {
      return await new Promise(function (resolve, reject) {
        pool.query("SELECT * FROM Users", (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            reject(new Error("No results found"));
          }
        });
      });
    } catch (error_1) {
      console.error(error_1);
      throw new Error("Internal server error");
    }
  };

//create a new Users record in the databsse
const createUser = (body) => {
    return new Promise(function (resolve, reject) {
      const { username, email } = body;
      pool.query(
        "INSERT INTO Users (username, email) VALUES ($1, $2) RETURNING *",
        [username, email],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(
              `A new merchant has been added: ${JSON.stringify(results.rows[0])}`
            );
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  };

  //delete a Users record
  const deleteUser = (user_id) => {
    return new Promise(function (resolve, reject) {
      pool.query(
        "DELETE FROM Users WHERE user_id = $1",
        [user_id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(`User deleted with user_id: ${user_id}`);
        }
      );
    });
  };

  //update a Users record
  const updateUser = (user_id, body) => {
    return new Promise(function (resolve, reject) {
      const { username, email } = body;
      pool.query(
        "UPDATE Users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *",
        [username, email, user_id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(`User updated: ${JSON.stringify(results.rows[0])}`);
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  };
  module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updateUser
  };
