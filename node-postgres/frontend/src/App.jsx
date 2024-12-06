import {useState, useEffect} from 'react';
import "./App.css";
import axios from 'axios';

function App() {
  const debugMode = true;

  const [Users, setUsers] = useState([]);
  const [Restaurants, setRestaurants] = useState([]);
  const [Recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    // One time use to insert restaurants into the database:

    // let page = 0;
    // while (page < 25) {
    //   // Define the API request options
    //   const options = {
    //     method: 'GET',
    //     url: `https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/state/AZ/city/Tempe/${page}`,
    //     headers: {
    //       'x-rapidapi-key': '7d178f39b8msh61e1bb0dedd9cb9p121167jsn450a5063589e',
    //       'x-rapidapi-host': 'restaurants-near-me-usa.p.rapidapi.com',
    //     },
    //   };

    //   // Call the API
    //   const fetchData = async () => {
    //     try {
    //       const response = await axios.request(options);
    //       console.log('API Response:', response.data); // Log the JSON data
    //     } catch (error) {
    //       console.error('API Error:', error);
    //     }
    //   };

    //   fetchData(); // Trigger the API call

    //   page++;
    // }

    getUser();
    getRestaurants();
  }, []);

  function getUser() {
    fetch('http://localhost:3001')
      .then(response => response.json()) // Parse JSON response
      .then(data => {
        setUsers(data); // Set parsed data to Users
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setUsers([]); // Default to empty array on error
      });
  }

  function getRestaurants() {
    fetch('http://localhost:3001/Restaurants')
      .then(response => response.json()) // Parse JSON response
      .then(data => {
        setRestaurants(data); // Set parsed data to Restaurants
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        setRestaurants([]); // Default to empty array on error
      });
  }

  function insertRestaurants(restaurants) {
    fetch('http://localhost:3001/Restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurants),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        console.log(data);
      });
    
  }

  function createUser() {
    let email = prompt('Enter email');
    let location_x = prompt('Enter your location\'s x coordinate');
    let location_y = prompt('Enter your location\'s y coordinate');
    let username = prompt('Enter username');
    let pass = prompt('Enter password');
    fetch('http://localhost:3001/Users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, location_x, location_y, username, pass}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getUser();
      });
  }

  async function claimBusiness() {
    const user_id = await loginUser();
    if (!user_id) {return;}

    const business_id = await getBusiness();
    if (!business_id) {return;}

    fetch('http://localhost:3001/ClaimBusiness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user_id, business_id}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
      });
  }

  async function addReview() {
    const user_id = await loginUser();
    if (!user_id) {return;}

    const business_id = await getBusiness();
    if (!business_id) {return;}

    let rating;
    do {
      rating = parseInt(prompt('Enter rating, whole number 1-5'), 10);
    } while (isNaN(rating) || rating < 1 || rating > 5);
    let text = prompt('Enter review');
    let review_date = new Date().toISOString();
    let photo_url = prompt('Enter a URL for a photo to add to your review');
    fetch('http://localhost:3001/Review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user_id, business_id, rating, text, review_date, photo_url}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        incrementRestaurantsVisited(user_id); // Increment restaurants_visited
      });
  }

  function incrementRestaurantsVisited(user_id) {
    fetch(`http://localhost:3001/Users/${user_id}/increment`, {
      method: 'PUT',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        console.log(data);
        getUser();
      });
  }

  async function deleteUser() {
    const user_id = await loginUser();
    if (!user_id) {return;}

    fetch(`http://localhost:3001/Users/${user_id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getUser();
      });
  }

  async function updateUser() {
    const user_id = await loginUser();
    if (!user_id) {return;}

    let username = prompt('Enter new username');
    let email = prompt('Enter new email');
    fetch(`http://localhost:3001/Users/${user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, email}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getUser();
      });
  }

  async function loginUser() {
    let username = prompt('Enter username');
    let pass = prompt('Enter password');
    return fetch('http://localhost:3001/LogIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, pass}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        let user_id = parseInt(data);
        if (user_id > -1) {
          alert(`Welcome back, ${username}`);
        } else {
          alert(`Invalid username or password`);
        }
        return user_id;
      });
  }

  async function getBusiness() {
    let business_name = prompt('Enter business name');
    return fetch('http://localhost:3001/Business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({business_name}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        let business_id = parseInt(data);
        if (business_id > -1) {
        } else {
          alert(`No business found`);
        }
        return business_id;
      });
  }

  async function getRecommendations() {
    let username = prompt('Enter a username to get recommendations for, this can be you or a friend');
    fetch(`http://localhost:3001/Recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setRecommendations({ username, restaurants: data }); // Save the recommendations
        } else {
          setRecommendations({ username, restaurants: [] }); // No recommendations
        }
      })
      .catch(error => console.error('Error fetching recommendations:', error));
  }  

  return (
    <div>
      <h1>Tempe Restaurant App</h1>
      { /* Debug Mode */ }
      {debugMode ? (
        <div className="debug-mode">
          <h2>Debug Mode</h2>
          <p>Debug mode is enabled. To disable, set <code>debugMode</code> to <code>false</code> in the <code>App.jsx</code> file.</p>
        </div>
      ) : null}
      {/* Main Container */}
      <div className="user-app-container">
        {/* App Functions Section */}
        <div className="app-functions-section">
          <h2>App Functions</h2>
          <div className="button-group">
            <button className="btn btn-add-review" onClick={addReview}>
              Add Review
            </button>
            <button className="btn btn-recommendations" onClick={getRecommendations}>
              Get Recommendations
            </button>
          </div>
        </div>
  
        {/* Account Management Section */}
        <div className="account-management-section">
          <h2>Account Management</h2>
          <div className="button-group">
            <button className="btn btn-signup" onClick={createUser}>
              Sign Up
            </button>
            <button className="btn btn-update" onClick={updateUser}>
              Update Profile
            </button>
            <button className="btn btn-delete" onClick={deleteUser}>
              Delete Account
            </button>
            <button className="btn btn-claim" onClick={claimBusiness}>
              Claim Business
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {Recommendations && (
        <div className="recommendations-section">
          <h2>Recommendations for <i>{Recommendations.username}</i></h2>
          {Recommendations.restaurants.length > 0 ? (
            <ul>
              {Recommendations.restaurants.map((restaurant, index) => (
                <li key={index}>{restaurant.business_name}</li>
              ))}
            </ul>
          ) : (
            <p>No recommendations found. Make sure you entered a valid username of a user who likes the same restaurants as some others.</p>
          )}
        </div>
      )}
  
      {/* User Data Section */}
      {debugMode ? (
        <div className="user-data-section">
          <h2>Existing Users</h2>
          <div className="user-data-grid">
            {Users && Array.isArray(Users) && Users.length > 0 ? (
              Users.map((user, index) => (
                <div className="user-card" key={index}>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Password:</strong> {user.pass}
                  </p>
                  <p>
                    <strong>Location:</strong> ({user.location_x}, {user.location_y})
                  </p>
                  <p>
                    <strong>Restaurants Visited:</strong> {user.restaurants_visited}
                  </p>
                </div>
              ))
            ) : (
              <p>No user data available.</p>
            )}
          </div>
        </div> 
      ) : null}

      {/* Restaurant Data Section */}
      <div className="user-data-section">
        <h2>Tempe Restaurant Directory</h2>
        <div className="user-data-grid">
          {Restaurants && Array.isArray(Restaurants) && Restaurants.length > 0 ? (
            Restaurants.map((restaurant, index) => (
              <div className="user-card" key={index}>
                <p>
                  <b>
                    {restaurant.website ? (
                      <a href={restaurant.website}>{restaurant.business_name}</a>
                    ) : (
                      restaurant.business_name
                    )}
                  </b>
                </p>
                <p>
                  <i> {restaurant.category} </i>
                </p>
                <p>
                  {restaurant.hours}
                </p>
                <p>
                  {restaurant.address}
                </p>
                <i>
                  {restaurant.owner_id ? (
                    <p>Claimed by owner</p>
                  ) : (
                    <p>Unclaimed</p>
                  )}
                </i>
              </div>
            ))
          ) : (
            <p>No restaurant data available.</p>
          )}
        </div>
      </div>
    </div>
  );
  
}
export default App;
