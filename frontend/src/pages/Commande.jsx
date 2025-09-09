import NavBar from "../composant/NavBar";

import TopBarre from "../composant/TopBarre";
import TopHeader from "../composant/TopHeader";
import MegaMartFooter from "../composant/MegaMartFooter";
import CartPage from "../composant/CartPage";
import OrderConfirmation from "../composant/OrderConfirmation";



const Commande = () => {
    return (
        <div>
            <TopBarre/>
            <TopHeader/>
            <OrderConfirmation/>
            <MegaMartFooter/>
            
        </div>
    );
};

export default Commande;