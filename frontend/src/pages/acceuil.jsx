import NavBar from "../composant/NavBar";
import SmartphoneDeals from "../composant/SmartphoneDeals";
import TopBarre from "../composant/TopBarre";
import TopHeader from "../composant/TopHeader";
import HeroBanner from "../composant/HeroBanner";
import MegaMartFooter from "../composant/MegaMartFooter";



const Acceuil = () => {
    return (
        <div>
            <TopBarre/>
            <TopHeader/>
            <NavBar/>
            <HeroBanner/>
            <SmartphoneDeals/>
            <MegaMartFooter/>
            
        </div>
    );
};

export default Acceuil;