import React from 'react';
import './ComponentsCss/CountdownTimer.css';

const CountdownTimer = ({ timeLeft, alertColor }) => {
  return (
    <div className="countdown-timer" style={{color: alertColor}}>
      Temps restant : {timeLeft}s
    </div>
  );
};

export default CountdownTimer;
