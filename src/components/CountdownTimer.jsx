import React from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ timeLeft }) => {
  return (
    <div className="countdown-timer">
      Temps restant : {timeLeft}s
           <div>V1.1.0.1</div>
      <div>Pour avancer cliquer sur la fleche droit</div>
  
      <div>Reculer cliquer sur la fleche gauche</div>
      <div>Sauter cliquer sur la fleche haut</div>
 

    </div>
  );
};

export default CountdownTimer;
