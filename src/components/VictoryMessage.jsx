import React from 'react';
import './VictoryMessage.css';

const VictoryMessage = ({ timeLeft, restartGame }) => {
  const timeTaken = 60 - timeLeft;

  return (
    <div className="victory-message">
      <h1>🎉 Victoire !</h1>
      <p>Temps pour réussir : {timeTaken} secondes</p>
      <button onClick={restartGame}>Rejouer</button>
    </div>
  );
};

export default VictoryMessage;
