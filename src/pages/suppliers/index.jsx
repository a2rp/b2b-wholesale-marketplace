import { useMemo, useState } from "react";
import { FiArrowRight, FiCheck, FiChevronDown, FiMapPin, FiMessageCircle, FiPackage, FiSearch, FiShield, FiStar, FiUsers } from "react-icons/fi";
import styles from "./styles.module.css";

const Suppliers = ({ suppliers, followed, onToggleFollow, onViewSupplier, onBrowseSupplier }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const visible = useMemo(() => {
    const terms = query.trim().toLowerCase();
    const result = suppliers.filter((supplier) => {
      const matches = (supplier.name + " " + supplier.location + " " + supplier.specialty).toLowerCase().includes(terms);
      return matches && (!verifiedOnly || supplier.verified);
    });
    if (sort === "rating") return [...result].sort((a, b) => b.rating - a.rating);
    if (sort === "response") return [...result].sort((a, b) => a.response.localeCompare(b.response));
    return result;
  }, [suppliers, query, sort, verifiedOnly]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}><span className={styles.eyebrow}>THE PEOPLE BEHIND YOUR SUPPLY</span><h1>Good partners make<br />good business.</h1><p>Build dependable relationships with the makers who keep your shelves stocked.</p></div>
        <div className={styles.network}>
          <div className={styles.networkOrbit + " " + styles.orbitOne} /><div className={styles.networkOrbit + " " + styles.orbitTwo} />
          <span className={styles.networkNode + " " + styles.nodeMain}><FiUsers /></span><span className={styles.networkNode + " " + styles.nodeA}>PL</span><span className={styles.networkNode + " " + styles.nodeB}>RR</span><span className={styles.networkNode + " " + styles.nodeC}>NH</span>
          <span className={styles.networkCount}><strong>{suppliers.length}</strong><small>trusted partners</small></span>
        </div>
      </section>

      <div className={styles.sectionHead}><div><span className={styles.sectionLabel}>YOUR SUPPLIER NETWORK</span><h2>Find a partner</h2><p>{visible.length} supplier{visible.length === 1 ? "" : "s"} fit your sourcing needs</p></div><div className={styles.networkBadge}><FiShield /> Verified network</div></div>
      <section className={styles.filters} aria-label="Supplier filters">
        <label className={styles.search}><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search suppliers, locations, or specialties" aria-label="Search suppliers" /></label>
        <label className={styles.sort}>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort suppliers"><option value="recommended">Recommended</option><option value="rating">Highest rated</option><option value="response">Fastest response</option></select><FiChevronDown /></label>
        <label className={styles.verifiedFilter}><input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} /><span><FiCheck /> Verified only</span></label>
      </section>

      {visible.length ? <section className={styles.grid} aria-label="Supplier directory">{visible.map((supplier, index) => <article key={supplier.id} className={styles.card}>
        <div className={styles.cardTop}><span className={styles.cardNumber}>PARTNER {String(index + 1).padStart(2, "0")}</span><button type="button" className={followed.includes(supplier.id) ? styles.following : styles.follow} onClick={() => onToggleFollow(supplier)} aria-pressed={followed.includes(supplier.id)}>{followed.includes(supplier.id) ? <><FiCheck /> Following</> : <><span>+</span> Follow</>}</button></div>
        <div className={styles.supplierIdentity}><span className={styles.avatar + " " + styles[supplier.color]}>{supplier.initials}</span><div><h3>{supplier.name}</h3><span className={styles.verifiedTag}><FiShield /> Verified supplier</span></div><span className={styles.rating}><FiStar /> {supplier.rating}</span></div>
        <p className={styles.specialty}>{supplier.specialty}</p>
        <span className={styles.location}><FiMapPin /> {supplier.location}</span>
        <div className={styles.metrics}><span><strong>{supplier.years} yrs</strong><small>in business</small></span><i /><span><strong>{supplier.products}</strong><small>catalog items</small></span><i /><span><strong>{supplier.onTime.split(" ")[0]}</strong><small>on-time</small></span></div>
        <div className={styles.response}><span><FiMessageCircle /> Response time</span><strong>{supplier.response.replace("Usually replies in ", "").replace("Usually replies ", "")}</strong></div>
        <div className={styles.cardActions}><button type="button" onClick={() => onViewSupplier(supplier)}>View profile <FiArrowRight /></button><button type="button" onClick={() => onBrowseSupplier(supplier)}><FiPackage /> Browse catalog</button></div>
      </article>)}</section> : <div className={styles.empty}><span><FiUsers /></span><strong>No suppliers found</strong><p>Try another supplier, location, or specialty.</p><button type="button" onClick={() => { setQuery(""); setVerifiedOnly(false); }}>Clear filters</button></div>}

      <aside className={styles.networkNote}><span className={styles.noteIcon}><FiShield /></span><div><strong>Supplier information is ready for your review</strong><small>Profiles and performance notes are sample workspace data. Reach out to verify current terms before ordering.</small></div><span className={styles.noteCount}>{suppliers.length} profiles</span></aside>
    </div>
  );
};

export default Suppliers;
