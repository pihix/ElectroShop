import NavBar from "../composant/NavBar";
import SmartphoneDeals from "../composant/SmartphoneDeals";
import TopBarre from "../composant/TopBarre";
import TopHeader from "../composant/TopHeader";
import HeroBanner from "../composant/HeroBanner";
import MegaMartFooter from "../composant/MegaMartFooter";
import SmartphoneCategorie from "../composant/Ecommerce";
import Ecommerce from "../composant/Ecommerce";



const EcoommercePage = () => {
    return (
        <div>
            <TopBarre/>
            <TopHeader/>
            {/* <NavBar/> */}
            <HeroBanner/>
            <Ecommerce/>
            <MegaMartFooter/>
            
        </div>
    );
};

export default EcoommercePage;