import {useState, useEffect} from 'react';
import "./App.css";

function App() {
  const [Users, setUsers] = useState([]);
  const [Recommendations, setRecommendations] = useState(null);

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

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>
      {/* Main Container */}
      <div className="user-app-container">
        {/* App Functions Section */}
        <div className="app-functions-section">
          <h3>App Functions</h3>
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
          <h3>Account Management</h3>
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
          </div>
        </div>
      </div>

      {/* Reccomendations Section */}
      {Recommendations && (
        <div className="recommendations-section">
          <h3>Recommendations for {Recommendations.username}</h3>
          {Recommendations.restaurants.length > 0 ? (
            <ul>
              {Recommendations.restaurants.map((restaurant, index) => (
                <li key={index}>{restaurant.business_name}</li>
              ))}
            </ul>
          ) : (
            <p>No recommendations found.</p>
          )}
        </div>
      )}
  
      {/* User Data Section */}
      <div className="user-data-section">
        <h3>Existing Users</h3>
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
    </div>
  );
  
}
export default App;
