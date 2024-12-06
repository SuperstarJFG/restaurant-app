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

// get all Businesses in our database
const getRestaurants = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM Businesses ORDER BY business_name", (error, results) => {
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

const insertRestaurants = (body) => {
  console.log(body);
  return new Promise(function (resolve, reject) {
    const { restaurantName, address, website, latitude, longitude, hoursInterval, cuisineType } = body;
    pool.query(
      "INSERT INTO Businesses (business_name, address, website, location_x, location_y, hours, category) VALUES ($1, $2, $3, $4, $5, $6::varchar(100), $7::varchar(50)) RETURNING *",
      [restaurantName, address, website, parseFloat(latitude), parseFloat(longitude), hoursInterval, cuisineType],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            // `A new merchant has been added: ${JSON.stringify(results.rows[0])}`
            `Welcome ${restaurantName}!`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const insertMultipleRestaurants = async (data) => {
  const { restaurants } = data;
  for (const restaurant of restaurants) {
    await insertRestaurants({
      restaurantName: restaurant.restaurantName,
      address: restaurant.address,
      website: restaurant.website,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      hoursInterval: restaurant.hoursInterval,
      cuisineType: restaurant.cuisineType,
    });
  }
};

// leave a review for a business
const addReview = (body) => {
  return new Promise(function (resolve, reject) {
    const { user_id, business_id, rating, text, review_date, photo_url } = body;
    pool.query(
      "INSERT INTO Reviews (user_id, business_id, rating, text, review_date) VALUES ($1, $2, $3, $4, $5) RETURNING review_id",
      [user_id, business_id, rating, text, review_date],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          const review_id = results.rows[0].review_id;
          if (photo_url) {
            pool.query(
              "INSERT INTO Photos (url, review_id) VALUES ($1, $2)",
              [photo_url, review_id],
              (photoError, photoResults) => {
                if (photoError) {
                  reject(photoError);
                }
                resolve(`Thank you for your review!`);
              }
            );
          } else {
            resolve(`Thank you for your review!`);
          }
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
      "DELETE FROM Users WHERE user_id = $1",
      [user_id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`User deleted`);
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

const loginUser = (body) => {
  return new Promise(function (resolve, reject) {
    const { username, pass } = body;
    pool.query(
      "SELECT * FROM Users WHERE username = $1 AND pass = $2",
      [username, pass],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows.length > 0) {
          resolve(`${results.rows[0].user_id}`); // return user_id
        } else {
          resolve("Invalid username or password");
        }
      }
    );
  });
};

const getBusiness = (body) => {
  return new Promise(function (resolve, reject) {
    const { business_name } = body;
    pool.query(
      "SELECT * FROM Businesses WHERE business_name = $1",
      [business_name],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows.length > 0) {
          resolve(`${results.rows[0].business_id}`); // return business_id
        } else {
          resolve("No business found");
        }
      }
    );
  });
};

const incrementRestaurantsVisited = (user_id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "UPDATE Users SET restaurants_visited = restaurants_visited + 1 WHERE user_id = $1 RETURNING *",
      [user_id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(`User's restaurants_visited incremented`);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const getRecommendations = (body) => {
  return new Promise(function (resolve, reject) {
    const { username } = body;
    pool.query(
      `SELECT DISTINCT
          BUSINESSES.BUSINESS_NAME,
          LOCATION_X,
          LOCATION_Y
      FROM
          REVIEWS
          JOIN BUSINESSES ON BUSINESSES.BUSINESS_ID = REVIEWS.BUSINESS_ID
      WHERE
          USER_ID IN (
              SELECT
                  USER_ID
              FROM
                  REVIEWS
              WHERE
                  BUSINESS_ID IN (
                      SELECT
                          BUSINESS_ID
                      FROM
                          REVIEWS
                      WHERE
                          USER_ID = (
                              SELECT
                                  USER_ID
                              FROM
                                  USERS
                              WHERE
                                  USERNAME = $1
                          )
                          AND RATING >= 4
                  )
                  AND RATING >= 4
          )
          AND RATING >= 4`,
      [username],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows.length > 0) {
          resolve(results.rows);
        } else {
          resolve([]);
        }
      }
    );
  });
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
  getBusiness,
  addReview,
  incrementRestaurantsVisited,
  getRecommendations,
  insertRestaurants,
  insertMultipleRestaurants,
  getRestaurants,
};
