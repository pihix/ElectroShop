import React, { useState } from "react";
import "../assets/css/NavBar.css";

const categories = [
  { name: "Ordinateur", target: "pc" },
  { name: "Téléphone", target: "smartphone" },
  { name: "Accesoires", target: "accessoire" },
  { name: "Tablette", target: "tablette" },
];

function NavBar() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (i, targetId) => {
    setActiveIndex(i);

    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="nav-bar">
      {categories.map((cat, i) => (
        <button
          key={i}
          className={`nav-button ${activeIndex === i ? "active" : ""}`}
          onClick={() => handleClick(i, cat.target)}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}

export default NavBar;
