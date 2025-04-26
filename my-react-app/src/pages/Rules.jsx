import React from "react";
import Navbar from "../components/Navbar";

export default function Rules() {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold mb-3">Game Rules</h1>
          <p className="lead">
            Learn how to play different game modes in Battleship
          </p>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">General Rules</h2>
          </div>
          <div className="card-body">
            <p>
              Battleship is a strategy type guessing game for two players. It is
              played on ruled grids on which each player's fleet of warships are
              marked. The locations of the fleets are concealed from the other
              player. Players alternate turns calling "shots" at the other
              player's ships, and the objective of the game is to destroy the
              opposing player's fleet.
            </p>

            <h4 className="mt-3">Website Structure</h4>
            <p>
              Our Battleship website offers multiple game modes and features.
              The homepage provides access to all game types. The navigation bar
              allows you to access game modes, view high scores, check active
              games, and read rules. You can play solo against the computer or
              challenge other players in multiplayer mode. Your game history and
              statistics are tracked for completed games, and you can spectate
              other players' games.
            </p>

            <h4 className="mt-3">Ship Placement</h4>
            <ul>
              <li>Each player has a fleet of 5 ships of different sizes</li>
              <li>
                Carrier (5 spaces), Battleship (4 spaces), Cruiser (3 spaces),
                Submarine (3 spaces), and Destroyer (2 spaces)
              </li>
              <li>
                Ships can be placed horizontally or vertically on the grid
              </li>
              <li>Ships cannot overlap or be placed diagonally</li>
              <li>Once placed, ships cannot be moved</li>
            </ul>

            <h4 className="mt-3">Game Play</h4>
            <ul>
              <li>Players take turns firing at their opponent's grid</li>
              <li>If a shot hits a ship, it's marked as a "hit"</li>
              <li>If a shot misses, it's marked as a "miss"</li>
              <li>A ship is sunk when all of its spaces have been hit</li>
              <li>
                The game ends when all of one player's ships have been sunk
              </li>
            </ul>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <h2 className="mb-0">Freeplay Mode</h2>
          </div>
          <div className="card-body">
            <p>
              Freeplay is a single-player practice mode where you can hone your
              skills against the computer.
            </p>

            <h4>Rules Specific to Freeplay:</h4>
            <ul>
              <li>Ships are randomly placed on the board</li>
              <li>You only see the opponent's board and take shots at it</li>
              <li>Your score is based on how quickly you can sink all ships</li>
              <li>The timer tracks how long it takes you to find all ships</li>
              <li>
                You can restart the game at any time using the refresh button
              </li>
              <li>
                This mode is perfect for beginners to learn the game mechanics
              </li>
              <li>There is no ship placement phase - just start firing!</li>
            </ul>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-info text-white">
            <h2 className="mb-0">Normal Mode</h2>
          </div>
          <div className="card-body">
            <p>
              Normal mode is a single-player game against the computer with more
              strategic gameplay.
            </p>

            <h4>Rules Specific to Normal Mode:</h4>
            <ul>
              <li>
                You place your ships manually or can use the "Random" button
              </li>
              <li>The computer places its ships randomly</li>
              <li>
                You and the computer take turns firing at each other's boards
              </li>
              <li>You can see both your board and the opponent's board</li>
              <li>The first player to sink all of the opponent's ships wins</li>
              <li>The timer tracks how long the game takes</li>
              <li>
                A popup will appear when the game ends declaring the winner
              </li>
              <li>You must place all your ships before the game begins</li>
            </ul>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-warning text-dark">
            <h2 className="mb-0">Multiplayer Mode</h2>
          </div>
          <div className="card-body">
            <p>
              Multiplayer mode lets you play against other real players online.
            </p>

            <h4>Rules Specific to Multiplayer:</h4>
            <ul>
              <li>You can create a new game or join an existing open game</li>
              <li>Both players place their ships before the game begins</li>
              <li>Players take turns making shots at the opponent's board</li>
              <li>You must wait for your opponent to make their move</li>
              <li>Games are saved and can be resumed if disconnected</li>
              <li>The first player to sink all opponent's ships wins</li>
              <li>Wins and losses are recorded in your player profile</li>
            </ul>

            <h4 className="mt-3">Game Management:</h4>
            <ul>
              <li>
                <strong>Create Multiplayer Game</strong> - Start a new game and
                wait for an opponent
              </li>
              <li>
                <strong>Open Games</strong> - View and join games created by
                other players
              </li>
              <li>
                <strong>My Open Games</strong> - View games you've created that
                are waiting for opponents
              </li>
              <li>
                <strong>My Active Games</strong> - View and continue your
                ongoing games
              </li>
              <li>
                <strong>My Completed Games</strong> - Review your finished games
                and results
              </li>
              <li>
                <strong>Other Games</strong> - Spectate games between other
                players
              </li>
            </ul>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-danger text-white">
            <h2 className="mb-0">Tips & Strategies</h2>
          </div>
          <div className="card-body">
            <ul>
              <li>
                <strong>Ship Placement:</strong> Try to avoid placing ships in
                predictable patterns
              </li>
              <li>
                <strong>Hunting Strategy:</strong> When you get a hit, try shots
                in adjacent squares to find the rest of the ship
              </li>
              <li>
                <strong>Checkerboard Pattern:</strong> Since the smallest ship
                is 2 units long, you can use a checkerboard pattern to
                efficiently search the board
              </li>
              <li>
                <strong>Corner Placement:</strong> Placing ships in corners can
                make them harder to find
              </li>
              <li>
                <strong>Probability Thinking:</strong> Consider where larger
                ships are more likely to fit on the remaining board
              </li>
              <li>
                <strong>Watch the Timer:</strong> In timed modes, balance
                between making quick decisions and strategic planning
              </li>
            </ul>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">
            <h2 className="mb-0">High Scores</h2>
          </div>
          <div className="card-body">
            <p>
              The High Scores page displays the top players based on their
              performance.
            </p>
            <ul>
              <li>Players are ranked by their win/loss record</li>
              <li>You can see your own ranking compared to other players</li>
              <li>Scores are updated after each completed game</li>
              <li>
                Both multiplayer and normal mode games contribute to your score
              </li>
              <li>
                Your personal best times in Freeplay mode are also recorded
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
