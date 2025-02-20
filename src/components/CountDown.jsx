import React, { useState, useEffect } from "react";
import "./CountdownTimer.css"; // Import the CSS file

const CountdownTimer = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2024-12-29T18:00:00+01:00"); // Set your target date and time here.

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <h2 className="countdown-title">Presale Starts In:</h2>
      <div className="countdown-timer">
        <div className="time-box">
          <div className="time-value">{countdown.days}</div>
          <div className="time-label">Days</div>
        </div>
        <div className="time-box">
          <div className="time-value">{countdown.hours}</div>
          <div className="time-label">Hours</div>
        </div>
        <div className="time-box">
          <div className="time-value">{countdown.minutes}</div>
          <div className="time-label">Minutes</div>
        </div>
        <div className="time-box">
          <div className="time-value">{countdown.seconds}</div>
          <div className="time-label">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
