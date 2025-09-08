import React from "react";
import "../assets/css/Banner.css";
import smartWatch from "../assets/images/smartWatch.png";

function Banner() {
  return (
    <section className="hero-banner">
      <div className="hero-text">
        <p className="subtitle">
Meilleure offre en ligne sur les montres connectées</p>
        <h1 className="title">PORTABLE INTELLIGENT.</h1>
        <p className="offer">JUSQU'À 80% DE RÉDUCTION</p>
      </div>
      <div className="hero-img">
        <img src={smartWatch} alt="Smart Watch" />
      </div>
    </section>
  );
}

export default Banner;
