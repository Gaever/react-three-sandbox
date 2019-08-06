import React from 'react';
import ReactDOM from 'react-dom'
import Sandbox from './components/Sandbox';

function App() {
  return (
    <div className="main">
      <Sandbox />
    </div>
  );

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)