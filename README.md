📌 Overview:
Battleship 3 is a complete fullstack implementation of the classic Battleship game where users can register, log in, and compete with others online in turn-based matches. The app uses RESTful APIs with secure session handling, MongoDB for persistence, and React for an interactive UI.

The game supports multiplayer functionality, detailed score tracking, categorized game listings, and is structured to scale while remaining simple and intuitive.

🧰 Tech Stack:
- Frontend: React, Vite, Tailwind CSS (or your styling lib)
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Authentication: HTTP-only cookies + bcrypt hashing
- Deployment: Render (or similar)

📂 Project Structure:  
.  
├── README.md               → Project overview (you’re reading it!)  
├── Writeup/                → Final submission writeup files  
├── backend/                → Express.js backend (API + DB logic)  
│   ├── controllers/        → Logic for auth and game routes  
│   ├── middleware/         → Token verification and other middleware  
│   ├── models/             → Mongoose schemas (User, Game)  
│   ├── routes/             → API endpoints (authRoutes.js, gameRoutes.js)  
│   ├── server.js           → Entry point for backend server  
│   ├── package.json        → Backend dependencies  
│   └── package-lock.json  
└── my-react-app/           → React + Vite frontend  
    ├── public/             → Static assets and favicon  
    ├── src/                → React components, pages, and routes  
    │   ├── components/     → UI components (Navbar, Board, etc.)  
    │   ├── pages/          → Page-level components (Login, GamePage, etc.)  
    │   ├── routes.jsx      → All frontend route definitions  
    │   └── App.jsx         → Root component  
    ├── index.html          → HTML template  
    ├── vite.config.js      → Vite configuration  
    ├── package.json        → Frontend dependencies  
    ├── package-lock.json  
    ├── eslint.config.js    → Linter config (if used)  
    └── README.md           → Frontend-specific instructions (optional)  

🔐 Auth API Routes:
- `POST /api/auth/signup` → Register user
- `POST /api/auth/login` → Login and set secure cookie
- `POST /api/auth/logout` → Clear session
- `GET /api/auth/user` → Get current user info (protected)

🎮 Game API Routes:
- `GET /api/game/open` → View open games by others
- `GET /api/game/myopen` → Games you've created (awaiting players)
- `GET /api/game/myactive` → Your ongoing games
- `GET /api/game/mycompleted` → Your completed games
- `GET /api/game/othergame` → Active/completed games you're not part of
- `POST /api/game/newgame` → Create a new game
- `GET /api/game/:gameID` → Join a specific game
- `POST /api/game/joingame/:gameID` → Join an open game
- `PUT /api/game/:gameID/move` → Make a move (attack)
- `GET /api/game/highscores` → Leaderboard stats
- `PUT /api/game/reset` → (Admin) Reset all games for testing

🖥️ Frontend Routes:
/ → Landing page
/login → Login
/signup → Register
/scores → High score leaderboard
/rules → Game rules
/game → General game board
/game/freeplay → Optional freeplay mode
/game/normal → Optional normal mode
/game/multiplayer/:id → Play multiplayer game
/game/open-games → Join open games
/game/my-open-games → See your open games
/game/my-active-games → See your active games
/game/my-completed-games → See your completed games
/game/other-games → View other people's games

🚀 Setup Instructions: [COPY]
-----------------------------
1. Clone the repository:
   git clone https://github.com/RonaldRommel/Battleship3.git

2. Backend setup:
   cd battleship3/backend
   npm install
   Create `.env` file with:
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_secret_key
   - PORT=5000

   Run server:
   npm start

3. Frontend setup:
   cd ../my-react-app
   npm install
   npm run dev

4. Visit app at:
   http://localhost:3000

🛡️ Security:
- Passwords hashed with bcrypt
- JWT-based auth, stored in HTTP-only cookies
- Middleware checks for protected routes
- Users can only interact with their own game data

🏆 Scoreboard:
- `/scores` route shows all users sorted by:
  - Wins (desc), Losses (asc), Username (A-Z)
- Current logged-in user is visually highlighted

📌 Completed Features:
✔ RESTful API with MongoDB/Mongoose
✔ Secure login/logout and cookie sessions
✔ Categorized game listings
✔ Random board setup and move logic
✔ UI changes based on auth state
✔ High score system
✔ Deployment-ready structure

💡 Future Enhancements:
- WebSocket-based real-time updates
- Manual drag-and-drop ship placement
- In-game chat
- AI player integration
- UI polish + animations
