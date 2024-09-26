import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  console.log(baseUrl)
  const gridSize = 20;

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const [obstacles, setObstacles] = useState();
  const [noPath, setNoPath] = useState(false);

  useEffect(() => {
    generateRandomObstacles();
  }, []);

  const generateRandomObstacles = () => {
    const newObstacles = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        newObstacles[i][j] = Math.random() < 0.3;
      }
    }
    setObstacles(newObstacles);
  };

  const getData = async (endX, endY) => {
    const data = {
      startX : start[0], 
      startY : start[1], 
      endX : endX, 
      endY : endY,
      obstacles : obstacles
    }

    const response = await fetch(`${baseUrl}/api/find-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if(result.length === 0 ){
      setNoPath(true)
    }else{
      setPath(result);
    }
  };

  console.log(noPath);

  const handleClick = (row, col) => {
    !start
    ? setStart([row, col])
    : !end && (setEnd([row, col]), getData(row, col));
  };

 

  const handleReset = () => {
    setStart(null)
    setEnd(null)
    setPath([])
    setNoPath(false)
  }

  console.log(path)

  return (
    <>
    <div className="grid">
        {Array(gridSize).fill(null).map(() => Array(gridSize).fill(false))
        .map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((_, colIndex) => (
              <div
                key={colIndex}
                className={`tile ${start && start[0] === rowIndex && start[1] === colIndex ? 'start' : ''} 
                           ${end && end[0] === rowIndex && end[1] === colIndex ? 'end' : ''} 
                           ${obstacles && obstacles[rowIndex][colIndex] ? 'obstacle' : ''}
                           ${path.some(p => p[0] === rowIndex && p[1] === colIndex) ? 'path' : ''}`}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {
              start && start[0] === rowIndex && start[1] === colIndex ? <b>S</b> 
              : end && end[0] === rowIndex && end[1] === colIndex && <b>E</b>
            }
                </div>
            ))}
            
          </div>
        ))}
      </div>

      {
        noPath && <b style={{color:"white", backgroundColor:"red",display:'flex',justifyContent:'center',marginTop:'10px'}}>There is no path</b>
      }
      <p className="values">
        <span><b>Start:</b> {start && <span>{start[0]},{start[1]}</span>}</span> 
        <span><b>End:</b> {end && <span>{end[0]},{end[1]}</span>}</span>
      </p>
      <button onClick={handleReset}>Reset</button>
      </>
  );
}

export default App;
