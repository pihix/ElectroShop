import { FaBell, FaSearch, FaUserCircle, FaCog } from 'react-icons/fa';
import "../../assets/css/Admin/Topbar.css";


export default function Topbar() {
  return (
    <div className="topbar">
      <a href="/" className="topbar-brand">ElectroShop</a>

      <form className="search-box">
        <input type="text" placeholder="Rechercher..." />
        <button type="submit"><FaSearch /></button>
      </form>

      <div className="topbar-actions">
        {/* Notification */}
        <div className="icon-btn">
          <FaBell />
          <span className="badge">3</span>
        </div>

        <div className="user-menu">
          <img 
            src="https://ui-avatars.com/api/?name=Admin&background=3498db&color=fff" 
            alt="Admin" 
          />
          <span>Administrateur</span>
        </div>
      </div>
    </div>
  );
}
