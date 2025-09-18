import NavBar from "../composant/NavBar";
import SmartphoneDeals from "../composant/SmartphoneDeals";
import TopBarre from "../composant/TopBarre";
import TopHeader from "../composant/TopHeader";
import HeroBanner from "../composant/HeroBanner";
import MegaMartFooter from "../composant/MegaMartFooter";
import SmartphoneCategorie from "../composant/Ecommerce";
import Ecommerce from "../composant/Ecommerce";
import { useState } from "react";



const EcoommercePage = () => {
      const [searchTerm, setSearchTerm] = useState("");
    
    return (
        <div>
            <TopBarre/>
            <TopHeader onSearch={setSearchTerm}/>
           
            <HeroBanner/>
            <Ecommerce searchTerm={searchTerm} />
            <MegaMartFooter/>
            
        </div>
    );
};

export default EcoommercePage;