# Restaurant App

## Features
- Database of users, restaurants, reviews, and review photos
    - Restaurant data from [restaurants-near-me-usa.p.rapidapi.com](restaurants-near-me-usa.p.rapidapi.com)
- Add review
- Get recommendations
    - Enter a username (yourself or a friend), to find restaurants that users who like the same restaurants as them also like
- Account management
    - Sign up
    - Update your profile
    - Delete your account
    - Claim a business 

## Setup
1. [Install Node.js](https://nodejs.org/en/download/package-manager)
1. Clone this repo
1. Place the provided `.env` file in `restaurant-app/node-postgress/backend`
1. Open a terminal to `restaurant-app/node-postgress/backend` and run:
    ```
    npm i
    node index
    ```
1. Open another terminal to `restaurant-app/node-postgress/frontend` and run:
    ```
    npm i
    npm run dev
    ```
1. Go to http://localhost:5173/ to open the frontend in your browser.

## Developing
### Backend
- The backend is a server that interacts with the remote database.
- `restaurant-app/node-postgress/backend/userModel.js` and `restaurant-app/node-postgress/backend/index.js` have functions that can interact with the database.
    - Use `insertMultipleRestaurants(data)` to add multiple businesses from a JSON file.
- http://localhost:3001/ opens the backend in your browser, which currently shows the list of Users.
- To reload the backend after making changes, go to your backend terminal that shows `App running on port 3001` and `Ctrl+C`, `Up Arrow`, `Enter`.
### Frontend
- `restaurant-app/node-postgress/frontend/src/App.jsx` is the frontend app that calls the backend  functions.
- To reload the frontend after making changes, go to your frontend `VITE` terminal and `Ctrl+C`, `Up Arrow`, `Enter`