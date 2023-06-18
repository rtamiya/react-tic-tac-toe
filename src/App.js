import { useState } from 'react';

const Square = (props) => {
  const { value, onSquareClick } = props
  // const [value, setValue] = useState(null); -> Board
  // make Board know state of squares to decide the winner
  // const handleClick = () => {
  //   setValue("X");
  // }; -> Board
  return <button className="square" onClick={onSquareClick}>{value}</button> ;
}

const Board = (props) => {
  const { xIsNext, squares, onPlay } = props;
  // Board helds state as an array (not each square), then have each square render state with props
  // make a new Array, set default value null ("O", "X", or null)

  // const [squares, setSquares] = useState(Array(9).fill(null));
  // const [xIsNext, setXIsNext] = useState(true);
  // -> uplifted to App

  const calculateWinner = squares => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    let winner = null;

    lines.forEach(([a, b, c]) => {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        winner = squares[a];
      }
    });

    return winner;
  }



  // create copy of state(squares) and store into nextSquares
  /* stay immutable to...
    1. keep history of state,
    2. enable to avoid the cost of re-render */
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    xIsNext ? nextSquares[i] = "X" : nextSquares[i] = "O";
    onPlay(nextSquares)
  };

  const winner = calculateWinner(squares);
  let status;
  winner ? status = `Winner: ${winner}` : status = `Next player: ${xIsNext ? "X" : "O"}`

  /* what if...
    <Square value={squares[0]} onSquareClick={handleClick(0)}/>
    -> call handleClick(0) -> call setSquares, renew state(squares) -> re-render Board
    -> call handleClick(0)... infinite loop!
  */
  return (<>
    <div className="status">{status}</div>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
      <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
      <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
      <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
      <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
      <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
      <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
    </div>
  </>);
};

const App = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); // which board/move user is seeing
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  // squares: placeholder for each element(array) in history
  // move: index of the element
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = `Go to game start`
    };
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default App;
