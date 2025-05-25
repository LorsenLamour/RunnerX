import React from 'react';
import './ComponentsCss/GameOverMessage.css'; 
const GameOverMessage = ({ restartGame }) => {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'  }}>
      <h1>Vous êtes mort !</h1>
      <button onClick={restartGame}>Recommencer</button>
    </div>
  );
};

export default GameOverMessage;
