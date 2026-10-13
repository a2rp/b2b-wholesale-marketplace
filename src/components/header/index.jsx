import { useState } from "react";
import { FiBox, FiFileText, FiGrid, FiMenu, FiPackage, FiSearch, FiShoppingBag, FiTruck, FiUsers, FiX } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const navigation = [
  { label: "Overview", path: "/overview", Icon: FiGrid },
  { label: "Marketplace", path: "/marketplace", Icon: FiPackage },
  { label: "Quote desk", path: "/quotes", Icon: FiFileText },
  { label: "Orders", path: "/orders", Icon: FiShoppingBag },
  { label: "Suppliers", path: "/suppliers", Icon: FiUsers },
];

const Header = ({ shortlistCount, onNewRfq, onSearch }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchCatalog = (event) => {
    event.preventDefault();
    onSearch(query.trim());
    navigate("/marketplace");
    setMenuOpen(false);
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <NavLink to="/overview" className={styles.brand} aria-label="Atlas Supply overview" onClick={() => setMenuOpen(false)}>
          <span className={styles.brandMark}><FiBox aria-hidden="true" /></span>
          <span className={styles.brandName}>atlas<span>.</span><small>SUPPLY NETWORK</small></span>
        </NavLink>
        <p className={styles.navLabel}>BUYER WORKSPACE</p>
        <nav className={styles.navigation} aria-label="Main navigation">
          {navigation.map(({ label, path, Icon }) => (
            <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>
              <Icon aria-hidden="true" /><span>{label}</span>
              {label === "Quote desk" && shortlistCount > 0 && <span className={styles.navCount}>{shortlistCount}</span>}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <span className={styles.sidebarBadge}><FiTruck aria-hidden="true" /></span>
          <div><strong>Supply, in sync</strong><span>Buyer workspace</span></div>
          <span className={styles.statusDot} aria-label="Workspace active" />
        </div>
      </aside>
      {menuOpen && <button className={styles.backdrop} type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
      <header className={styles.header}>
        <button type="button" className={styles.menuButton} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
        <form className={styles.search} onSubmit={searchCatalog} role="search">
          <FiSearch aria-hidden="true" />
          <input aria-label="Search wholesale products" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, suppliers, or materials" />
          <kbd>Enter</kbd>
        </form>
        <div className={styles.headerActions}>
          <NavLink to="/marketplace" className={styles.shortlistLink} aria-label={`Marketplace shortlist, ${shortlistCount} products`}>
            <FiPackage aria-hidden="true" /><span>Shortlist</span>{shortlistCount > 0 && <b>{shortlistCount}</b>}
          </NavLink>
          <button className={styles.newRfqButton} type="button" onClick={onNewRfq}><span>+</span> New RFQ</button>
          <div className={styles.buyerProfile}><span className={styles.avatar}>ME</span><span><strong>Morgan Ellis</strong><small>Procurement</small></span></div>
        </div>
      </header>
    </>
  );
};

export default Header;
