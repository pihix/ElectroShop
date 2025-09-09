import React from "react";
import "../assets/css/HeroBanner.css";

import { useState, useEffect } from 'react';

const HeroBanner = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="smart-watch-promo-full">
      <div className="promo-container">
        <div className="promo-text">
          <div className="main-text">Meilleures offres en ligne sur des appareils electroniques</div>
          <div className="sub-text">APPAREIL PORTABLE & ACCESSOIRES.</div>
          <div className="discount-text">Jusqu'à 80 % de réduction</div>
        </div>
        
        <div className="promo-display">
          <div className="time-display">{formatTime(currentTime)}</div>
          <div className="indicators">
            <span className="indicator active">D</span>
            <span className="separator">/</span>
            <span className="indicator">A</span>
            <span className="separator">/</span>
            <san className="indicator">T</san>
            <span className="separator">/</span>
            <span className="indicator">E</span>
            <span className="separator">/</span>
            <span className="indicator">L</span>
            <span className="separator">/</span>
            <span className="indicator">I</span>
            <span className="separator">/</span>
            <span className="indicator">N</span>
            <span className="separator">/</span>
            <span className="indicator">E</span>
          </div>
          <div className="progress-section">
            <div className="progress-text">20/09/25</div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
          <div className="product-count">Code reduction : 234</div>
        </div>
      </div>
    </div>
  );
};


export default HeroBanner;
