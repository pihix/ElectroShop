import React, { useState, useEffect } from "react";
import "../assets/css/HeroBanner.css";
import smartWatch from "../assets/images/smartWatch.png";
import laptop from "../assets/images/Ordinateur.png";
import phone from "../assets/images/smartPhone.png";

const slides = [
  {
    subtitle: "Les meilleures offres en ligne sur les appareils connectés!",
    title: "PORTABLE & MONTRE INTELLIGENTE.",
    offer: "JUSQU'À 80% DE RÉDUCTION",
    image: smartWatch,
  },
  {
    subtitle: "Profitez des prix incroyables sur les ordinateurs!",
    title: "ORDINATEURS PORTABLES & ACCESSOIRES.",
    offer: "JUSQU'À 60% DE RÉDUCTION",
    image: laptop,
  },
  {
    subtitle: "La nouvelle génération de smartphones est là!",
    title: "SMARTPHONES & GADGETS.",
    offer: "JUSQU'À 70% DE RÉDUCTION",
    image: phone,
  },
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ⏳ changement automatique toutes les 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-banner">
      <div className="hero-text">
        <p className="subtitle">{slides[currentIndex].subtitle}</p>
        <h1 className="title">{slides[currentIndex].title}</h1>
        <p className="offer">{slides[currentIndex].offer}</p>
      </div>

      <div className="hero-img">
        <img
          src={slides[currentIndex].image}
          alt="Promo"
          className="animated-img"
        />
      </div>

      {/* Indicateurs (petits points) */}
      {/* <div className="indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === currentIndex ? "dot active" : "dot"}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div> */}
    </section>
  );
};

export default HeroBanner;
