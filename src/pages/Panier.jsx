import NavBar from "../composant/NavBar";

import TopBarre from "../composant/TopBarre";
import TopHeader from "../composant/TopHeader";
import MegaMartFooter from "../composant/MegaMartFooter";
import CartPage from "../composant/CartPage";



const Panier = () => {
    return (
        <div>
            <TopBarre/>
            <TopHeader/>
            <CartPage/>
            <MegaMartFooter/>
            
        </div>
    );
};

export default Panier;