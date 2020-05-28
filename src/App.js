import React from 'react';
import Game from './Components/Game';
import About from './Components/About';
import Rules from './Components/Rules';

function App() {
  return (
    <div className="App">
    <h1>Game of Life</h1>
    <About/>
    <Rules/>
    <Game/>
    </div>
  );
}

export default App;
