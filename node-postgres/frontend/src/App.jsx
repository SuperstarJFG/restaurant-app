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

  function deleteUser() {
    let id = prompt('Enter User id');
    fetch(`http://localhost:3001/Users/${id}`, {
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

  function updateUser() {
    let id = prompt('Enter User id');
    let username = prompt('Enter new User name');
    let email = prompt('Enter new User email');
    fetch(`http://localhost:3001/Users/${id}`, {
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

  function addReview() {
    let username = prompt('Enter username');
    let pass = prompt('Enter password');
    fetch('http://localhost:3001/LogIn', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, pass }),
    })
    .then(response => {
      return response.text();
    })
    .then(data => {
      alert(data);
    });
    // let rating = prompt('Enter rating');
    // let text = prompt('Enter review text');
    // let review_date = prompt('Enter review date');
    // let business_name = prompt('Enter business name');
    // let photo_url = prompt('Enter photo URL');
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
      <button onClick={deleteUser}>Delete User</button>
      <br />
      <button onClick={updateUser}>Update User</button>
      <br />
      <button onClick={addReview}>Add Review</button> {/* Added button for adding reviews */}
    </div>
  );
}
export default App;
