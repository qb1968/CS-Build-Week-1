/* eslint-disable no-loop-func */
import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';


// Default rows
let numRows = 25;
let numColumns = 25;

// Operations 
const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [1, 1],
    [1, 0],
    [-1, 0]
]

// Create grid
const resetGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numColumns), () => 0))
    }
    return rows;
}

// Game function
const Game = props => {
    // State 
    const [grid, setGrid] = useState(() => {
        return resetGrid();
    })

    const [running, setRunning] = useState(false);
    const [generation, setGeneration] = useState(0);
    const [speed, setSpeed] = useState(500);
    const [size, setSize] = useState('25x25')

    // Use Ref variables
    const runningRef = useRef(running);
    runningRef.current = running;

    const generationRef = useRef(generation);
    generationRef.current = generation;

    const speedRef = useRef(speed);
    speedRef.current = speed;

    const sizeRef = useRef(size);
    sizeRef.current = size;

    // Start Function
    const runApp = useCallback(() => {
        if (!runningRef.current) {
            return;
        }
        setGrid(g => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++){
                    for (let j = 0; j < numColumns; j++) {
                        let neighbors = 0;
                        // eslint-disable-next-line no-loop-func
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newJ = j + y;
                            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
                                neighbors += g[newI][newJ];
                            }
                        })
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][j] = 0;
                        } else if (g[i][j] === 0 && neighbors === 3) {
                            gridCopy[i][j] = 1;
                        }
                    }
                }
            })
        })
        setTimeout(() => {
            setGeneration(generationRef.current + 1)
            runApp()
        }, speedRef.current)
    }, [])

    // Function for Random
    const randomGrid = () => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
          rows.push(Array.from(Array(numColumns), () => Math.random() > 0.8 ? 1 : 0))
        }
        setGrid(rows);
    }

    // Change size
    const changeSize = e => {
        setSize(e.target.value)
        console.log(size, e.target.value)
        if (e.target.value === '25x25') {
            numRows = 25;
            numColumns = 25;
        } else if (e.target.value === '35x35') {
            numRows = 35;
            numColumns= 35;
        } else if (e.target.value === '45x45') {
            numRows = 45;
            numColumns = 45;
        }
        setGrid(resetGrid)
    }

    // Step Function
    const nextMove = useCallback(() => {
        setGrid(g => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++){
                    for (let j = 0; j < numColumns; j++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newJ = j + y;
                            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
                                neighbors += g[newI][newJ];
                            }
                        })
                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][j] = 0;
                        } else if (g[i][j] === 0 && neighbors === 3) {
                            gridCopy[i][j] = 1;
                        }
                    }
                }
            })
        })
        setGeneration(generationRef.current + 1);
        return nextMove
    }, [])

    return (
        <div className='main'>
            <div className='gameDiv'>
                <select id='size' onChange={changeSize} value={size}>
                    <option>Change size</option>
                    <option value='25x25' name='25x25'> 25 x 25 </option>
                    <option value='35x35' name='35x35'> 35 X 35 </option>
                    <option value='45x45' name='45x45'> 45 X 45 </option>
                </select>
                <div
                    className='gameGrid'
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${numColumns}, 20px)`
                    }}>
                    {grid.map((rows, rowI) => rows.map((columns, colI) => (
                        <div className='gridSquares'
                            key={`${rowI}-${colI}`}
                            onClick={()=> {
                                if (!running) {
                                    const newGrid = produce(grid, gCopy => {
                                        gCopy[rowI][colI] = grid[rowI][colI] ? 0: 1;
                                    })
                                    setGrid(newGrid)
                                }
                            }}
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: grid[rowI][colI] ? 'purple' : undefined,
                                border: 'solid 1px black'
                            }}
                        />
                    )))}
                </div>
            </div>
            <div className='mainRight'>
                
                <div className='buttonsDiv'>
                    <button
                        onClick={()=> {
                            setRunning(!running);
                            if (!running) {
                                runningRef.current = true;
                                runApp();
                            }
                            if (running) {
                            
                            }
                        }}>
                        {running ? 'Stop' : 'Start'}
                    </button>
                    <button
                        onClick={() => {
                            nextMove()
                    }}>
                        Next
                    </button>
                    <button
                        onClick={() => {
                            setGrid(resetGrid());
                            setGeneration(0);
                        }}>
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            randomGrid()
                    }}>
                        Random
                    </button>
                    {running ? (
                        <button
                            onClick={() => {
                                setSpeed(1000)
                        }}>
                        Slow
                        </button>
                    ) : (
                        <button>Slow</button>
                    )}
                    {running ? (
                        <button
                            onClick={() => {
                                setSpeed(500)
                        }}>
                        Normal
                        </button>
                    ) : (
                        <button>Normal</button>
                    )}
                    {running ? (
                        <button
                        onClick={() => {
                            setSpeed(100)
                            runApp()
                    }}>
                        Fast
                    </button>
                    ) : (
                        <button>Fast</button>
                    )}
                </div>
                
                <h3># of Generations: {generation}</h3>
            </div>
        </div>
    )
}

export default Game;