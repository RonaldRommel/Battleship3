import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Rules from "./pages/Rules.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createHashRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound.jsx";
import Highscore from "./pages/HighScores.jsx";
import Game from "./pages/Game.jsx";
import Easy from "./pages/Freeplay.jsx";
import Normal from "./pages/Normal.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Multiplayer from "./pages/Multiplayer.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import OpenGames from "./pages/OpenGames.jsx";
import MyOpenGames from "./pages/MyOpenGames.jsx";
import MyActiveGames from "./pages/MyActiveGames.jsx";
import MyCompletedGames from "./pages/MyCompletedGames.jsx";
import OtherGames from "./pages/OtherGames.jsx";

const BrowserRouter = createHashRouter([
  {
    path: "/", //localhost:8000/
    element: <App />,
    errorElement: <NotFound />,
  },
  { path: "/rules", element: <Rules /> }, //localhost:8000/rules
  { path: "/scores", element: <Highscore /> },
  { path: "/game", element: <Game /> },
  { path: "/game/freeplay", element: <Easy /> },
  { path: "/game/normal", element: <Normal /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/game/multiplayer/:gameID", element: <Multiplayer /> },
  { path: "/game/open-games", element: <OpenGames /> },
  { path: "/game/my-open-games", element: <MyOpenGames /> },
  { path: "/game/my-active-games", element: <MyActiveGames /> },
  { path: "/game/my-completed-games", element: <MyCompletedGames /> },
  { path: "/game/other-games", element: <OtherGames /> },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={BrowserRouter} />
  </AuthProvider>
);
