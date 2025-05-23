import React from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ timeLeft }) => {
  return (
    <div className="countdown-timer">
      Temps restant : {timeLeft}s
    </div>
  );
};

export default CountdownTimer;
