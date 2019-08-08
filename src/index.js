import React from 'react';
import ReactDOM from 'react-dom'
import { Canvas } from 'react-three-fiber'
import Sandbox from './components/Sandbox';

function App() {
  return (
    <div className="main">
      <Canvas camera={{ position: [0, 0, 15] }}>
        <Sandbox />
      </Canvas>
    </div>
  );

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)