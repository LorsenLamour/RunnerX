import React from 'react';
import './ComponentsCss/CountdownTimer.css';

const CountdownTimer = ({ timeLeft }) => {
  return (
    <div className="countdown-timer">
      Temps restant : {timeLeft}s
    </div>
  );
};

export default CountdownTimer;
