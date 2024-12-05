import {useState, useEffect} from 'react';

function App() {
  const [Users, setUsers] = useState(false);

  function getUser() {
    fetch('http://localhost:3001')
      .then(response => {
        return response.text();
      })
      .then(data => {
        setUsers(data);
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
      body: JSON.stringify({username}),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          const restaurantNames = data.map(restaurant => restaurant.business_name).join(', ');
          alert(`Recommended restaurants: ${restaurantNames}`);
        } else {
          alert('No recommendations found.');
        }
      })
  }

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>
      {Users ? Users : 'There is no User data available'}
      <br />
      <button onClick={createUser}>Sign Up</button>
      <br />
      <br />
      <button onClick={updateUser}>Update Profile</button>
      <br />
      <button onClick={deleteUser}>Delete Account</button>
      <br />
      <br />
      <button onClick={addReview}>Add Review</button>
      <br />
      <button onClick={getRecommendations}>Get Recommendations</button>
    </div>
  );
}
export default App;
