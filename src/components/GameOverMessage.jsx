import React from 'react';
import './ComponentsCss/GameOverMessage.css'; 
const GameOverMessage = ({ restartGame }) => {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'  }}>
      <h1 style={{color: 'red'}}>Vous êtes mort !</h1>
      <button style={{width: '150px', height: '50px', fontSize: '20px',backgroundColor: 'greenyellow'}} onClick={restartGame}>Recommencer</button>
    </div>
  );
};

export default GameOverMessage;
