import React, { useState, useEffect } from "react";
import "../assets/css/HeroBanner.css";
import smartWatch from "../assets/images/smartwatch.png"; // adapte le chemin

// Slide 1 : ton HeroBanner original
const SlideOne = ({ currentTime, formatTime }) => (
  <div className="promo-container">
    <div className="promo-text">
      <div className="main-text">
        Meilleures offres en ligne sur des appareils electroniques
      </div>
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
        <span className="indicator">T</span>
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
);

// Slide 2 : ton Banner
const SlideTwo = () => (
  <section className="promo-container">
    <div className="hero-text">
      <p className="subtitle">
        Les meilleures offres en ligne sur les appareils connectées!
      </p>
      <h1 className="title">PORTABLE & MONTRE INTELLIGENT.</h1>
      <p className="offer">JUSQU'À 80% DE RÉDUCTION</p>
    </div>
    <div className="hero-img">
      <img src={smartWatch} alt="Smart Watch" />
    </div>
  </section>
);

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mise à jour de l'heure pour le SlideOne
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // Changement automatique des slides toutes les 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-carousel">
      <div
        className="carousel-inner"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        <div className="carousel-item">
          <SlideOne currentTime={currentTime} formatTime={formatTime} />
        </div>
        <div className="carousel-item">
          <SlideTwo />
        </div>
      </div>

      {/* Indicateurs */}
      <div className="carousel-indicators">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`dot ${currentSlide === i ? "active" : ""}`}
            onClick={() => setCurrentSlide(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
