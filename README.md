README - Battleship 3
=====================

🎮 Project: Battleship 3 — Fullstack Multiplayer Battleship Game

📚 Overview:
Battleship 3 is a full-stack web application that lets users play the classic game of Battleship online with others. It includes full account management, persistent game state tracking, and an interactive UI for gameplay. The game is built using the MERN stack (MongoDB, Express, React, Node.js) with RESTful APIs and cookie-based authentication.

⚙️ Tech Stack:
- Frontend: React, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: HTTP-only cookies
- Hosting: Render / Any static + dynamic host

✅ Features:
- Register/Login with password confirmation
- Create new games and wait for opponents
- Join open games from a global pool
- Play turn-based Battleship with auto-randomized boards
- All Games page: categorized into Open, Active, Completed, and Others
- High Scores page sorted by win/loss ratio
- Secure API access based on user session
- Conditional UI based on login state (NavBar + Page Behavior)
- Game history and stats per user

🧠 Bonus (Optional) Implementations:
- Password encryption (bcrypt)
- AI opponents (back-end logic only)
- Manual ship placement via drag and drop
- Early submission bonus
- Clean modular code with helper functions and proper RESTful endpoints

🛠️ Setup Instructions: [COPY]
-----------------------------
1. Clone the repository:
   git clone https://github.com/yourusername/battleship3.git

2. Navigate to the project folder:
   cd battleship3

3. Install backend and frontend dependencies:
   cd server && npm install
   cd ../client && npm install

4. Create a `.env` file in the server directory:
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000

5. Run the backend:
   cd server
   npm start

6. Run the frontend in a separate terminal:
   cd client
   npm start

7. Access the app at:
   http://localhost:3000

🌐 Deployed App:
- Live URL: [your_render_or_vercel_link]
- GitHub: https://github.com/yourusername/battleship3

📂 Folder Structure:
- /client              → React frontend
  - /components        → React UI components
  - /pages             → Route pages (Login, Register, GamePage, Scores, etc.)
  - /services          → Axios calls and helper methods
- /server              → Express backend
  - /models            → Mongoose models (User, Game, etc.)
  - /routes            → RESTful API routes
  - /middleware        → Auth middlewares
  - /controllers       → Logic handlers

📜 Core Pages:
- `/`                  → Landing page
- `/login`, `/register`→ Auth pages
- `/games`             → View and manage all game types
- `/game/:game_id`     → Gameplay view
- `/high-scores`       → Leaderboard
- `Navbar`             → Conditional UI based on login state

🧪 API Design:
- `POST /api/auth/register`       → Register a user
- `POST /api/auth/login`          → Log in user and set cookie
- `POST /api/auth/logout`         → Log out and clear session
- `POST /api/games`               → Create new game
- `PUT /api/games/:id/join`       → Join a game
- `PUT /api/games/:id/play`       → Play a move
- `GET /api/games`                → Fetch game listings
- `GET /api/scores`               → Fetch leaderboard

🔐 Security:
- User authentication using cookies
- Passwords encrypted using bcrypt
- Backend authorization middleware for protected routes
- Game actions restricted to valid players only

📝 Writeup Guidelines:
Include answers to:
- Challenges you faced building the app
- Features you’d add with more time
- Assumptions made
- Time spent
- Names of collaborators (if any)

🎥 Submission Requirements:
- GitHub repo with correct naming format
- Deployed live version
- Walkthrough video showing:
  - Login/Register
  - Creating/joining games
  - Viewing scoreboards
  - Playing a full game
  - Logged-out behavior

-----------------------------
