require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// get all Users in our database
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

// return if there is a match for a login
const checkLogin = async (username, pass) => {
  try {
    return await new Promise(function (resolve, reject) {
      const { username, pass } = body;
      pool.query("SELECT * FROM Users where username = $1 AND pass = $2", [username, pass], (error, results) => {
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

// create a new Users record in the databsse
const createUser = (body) => {
  return new Promise(function (resolve, reject) {
    const { email, location_x, location_y, username, pass } = body;
    pool.query(
      "INSERT INTO Users (email, location_x, location_y, username, pass, restaurants_visited) VALUES ($1, $2, $3, $4, $5, 0) RETURNING *",
      [email, location_x, location_y, username, pass],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            // `A new merchant has been added: ${JSON.stringify(results.rows[0])}`
            `Welcome ${username}!`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

// delete a Users record
const deleteUser = (user_id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "DELETE FROM Users WHERE user_id = $1 RETURNING *",
      [user_id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`User deleted with user_id: ${user_id}, error: ${error}, results: ${results}`);
      }
    );
  });
};

// update a Users record
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

// add a review with user inputs: username, pass, rating, text, review_date, business_name, photo url
const addReview = (body) => {
  return new Promise(function (resolve, reject) {
    const { username, pass, rating, text, review_date, business_name, photo_url } = body;
    
    pool.query(
      "SELECT * FROM Users WHERE username = $1 AND pass = $2",
      [username, pass],
      (error, userResults) => {
        if (error) {
          resolve("User not found");
          return reject(error);
        }
        if (userResults.rows.length === 0) {
          resolve("User not found");
          return reject(new Error("Invalid username or password"));
        }
        resolve("User found");

      //   pool.query(
      //     "SELECT * FROM Businesses WHERE business_name = $1",
      //     [business_name],
      //     (error, businessResults) => {
      //       if (error) {
      //         return reject(error);
      //       }
      //       if (businessResults.rows.length === 0) {
      //         return reject(new Error("Business not found"));
      //       }

      //       pool.query(
      //         "INSERT INTO Reviews (rating, text, review_date) VALUES ($1, $2, $3) RETURNING *",
      //         [rating, text, review_date, business_name],
      //         (error, reviewResults) => {
      //           if (error) {
      //             return reject(error);
      //           }

      //           pool.query(
      //             "UPDATE Users SET restaurants_visited = restaurants_visited + 1 WHERE username = $1",
      //             [username],
      //             (error) => {
      //               if (error) {
      //                 return reject(error);
      //               }
      //               resolve("Thank you for leaving a review!");
      //             }
      //           );
      //         }
      //       );
      //     }
      //   );
      }
    );
  });
};


module.exports = {
  getUsers,
  checkLogin,
  createUser,
  deleteUser,
  updateUser,
  addReview // Added export for addReview
};
