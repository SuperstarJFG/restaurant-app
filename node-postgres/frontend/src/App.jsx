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
    let name = prompt('Enter User name');
    let email = prompt('Enter User email');
    fetch('http://localhost:3001/Users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email}),
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

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>
      {Users ? Users : 'There is no User data available'}
      <br />
      <button onClick={createUser}>Add User</button>
      <br />
      <button onClick={deleteUser}>Delete User</button>
      <br />
      <button onClick={updateUser}>Update User</button>
    </div>
  );
}
export default App;
