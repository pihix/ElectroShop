import { useState } from "react";
import NavBar from "../composant/NavBar";
import SmartphoneDeals from "../composant/SmartphoneDeals";
import TopBarre from "../composant/TopBarre";
import TopHeader from "../composant/TopHeader";
import HeroBanner from "../composant/HeroBanner";
import MegaMartFooter from "../composant/MegaMartFooter";

const Acceuil = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <TopBarre />
     
      <TopHeader onSearch={setSearchTerm} />
      <NavBar />
      <HeroBanner />
      <SmartphoneDeals searchTerm={searchTerm} />
      <MegaMartFooter />
    </div>
  );
};

export default Acceuil;