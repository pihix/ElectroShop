import React from "react";
import "../assets/css/MegaMartFooter.css";

const MegaMartFooter = () => {
  return (
    <footer className="megamart-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Section Contact & Appli */}
          <div className="footer-top">
            <div className="contact-section">
              <h2>Contactez-nous</h2>
              <div className="contact-item">
                <strong>WhatsApp</strong>
                <span>  +33 1 23 45 67 89</span>
              </div>
              <div className="contact-item">
                <strong>Appelez-nous</strong>
                <span>  +33 7 12 34 56 78</span>
              </div>
            </div>

            <div className="download-section">
              <h2>Télécharger l’application</h2>
              <div className="app-buttons">
                <div className="app-button app-store">
                  <span>Disponible sur l’App Store</span>
                </div>
                <div className="app-button google-play">
                  <div className="get-it-on">DISPONIBLE SUR</div>
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
                <div className="service-item">Ordinateurs</div>
                <div className="service-item">Téléphones</div>
                <div className="service-item">Tablettes</div>
                <div className="service-item">Accessoires</div>
              </div>

              <div className="services-column">
                <h2>Service Client</h2>
                <div className="service-item">À propos</div>
                <div className="service-item">Conditions générales</div>
                <div className="service-item">FAQ</div>
                <div className="service-item">Politique de confidentialité</div>
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
