import React from "react";
import "../assets/css/MegaMartFooter.css";

import { Link } from "react-router-dom";

const MegaMartFooter = () => {

  const handleClick = (targetId) => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <footer className="megamart-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Section Contact & Appli */}
          <div className="footer-top">
            <div className="contact-section">
              <h2>Contactez-nous</h2>
              <div className="contact-item">
                <strong>WhatsApp : </strong>
                <span>+33 744633480</span>
              </div>
              <div className="contact-item">
                <strong>Appelez-nous : </strong>
                <span>+33 609765436</span>
              </div>
            </div>

            <div className="download-section">
              <h2>Télécharger l’application</h2>
              <div className="app-buttons">
                <div className="app-button app-store">
                  <span>Disponible sur l’App Store</span>
                </div>
                <div className="app-button google-play">
                  <div className="get-it-on">Disponible sur</div>
                  <div className="store-name">Google Play</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Catégories et Services */}
          <div className="footer-middle1">
            <h2>Catégories Populaires</h2>
            <div className="categories-services-grid1">
              <div className="categories-column">
                <div className="service-item"  onClick={() => handleClick("ordinateurs")}>Ordinateurs</div>
                <div className="service-item" onClick={() => handleClick("smartphones")}>Téléphones</div>
                <div className="service-item" onClick={() => handleClick("tablettes")}>Tablettes</div>
                <div className="service-item" onClick={() => handleClick("accessoires")}>Accessoires</div>
                <div className="service-item" onClick={() => handleClick("electromenager")}>Electromenager</div>
                <div className="service-item" onClick={() => handleClick("peripheriques")}>Périphériques</div>
              </div>


              

              <div className="services-column">
                <h2>Service Client</h2>
                <div className="service-item">À propos</div>
                <div className="service-item">Conditions générales</div>
                <div className="service-item">FAQ</div>
                <div className="service-item">Politique de confidentialité</div>
                <div className="service-item">Politique de recyclage</div>
                <div className="service-item">Politique d’annulation & retour</div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <p>© 2025 Tous droits réservés. ElectroShop.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MegaMartFooter;





