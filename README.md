# Restaurant App

## Setup
1. Clone the repo
1. Place the provided `.env` file in `restaurant-app/node-postgress/backend`
1. Open a terminal to `restaurant-app/node-postgress/backend` and run `node index`
1. Open another terminal to `restaurant-app/node-postgress/frontend` and run `npm run dev`
1. Go to http://localhost:5173/ to open the frontend in your browser.

## Developing
### Backend
- `restaurant-app/node-postgress/backend/userModel.js` and `restaurant-app/node-postgress/backend/index.js` have functions that can interact with the database.
- http://localhost:3001/ opens the backend in your browser, which currently shows the list of Users.
- To reload the backend after making changes, go to the `App running on port 3001.` terminal and `Ctrl+C`, `Up Arrow`, `Enter`
### Frontend
- `restaurant-app/node-postgress/frontend/src/App.jsx` is the app that calls the backend server functions.
- To reload the frontend after making changes, go to the `VITE` terminal and `Ctrl+C`, `Up Arrow`, `Enter`