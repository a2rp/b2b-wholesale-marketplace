import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCheck, FiFilter, FiHeart, FiPlus, FiSearch, FiSliders, FiStar, FiX } from "react-icons/fi";
import { categories, formatMoney, formatQuantity } from "../../data";
import styles from "./styles.module.css";

const Marketplace = ({ products, query, shortlist, onQueryChange, onToggleShortlist, onProduct, onRfq }) => {
  const [category, setCategory] = useState("All products");
  const [sort, setSort] = useState("featured");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "All products" || product.category === category;
      const matchesQuery = !normalized || `${product.name} ${product.detail} ${product.supplier} ${product.category}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery && (!onlyAvailable || product.tag !== "Custom print");
    });
    if (sort === "price-low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...filtered].sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [products, query, category, sort, onlyAvailable]);

  const clearFilters = () => { setCategory("All products"); setOnlyAvailable(false); onQueryChange(""); };

  return (
    <div className={styles.page}>
      <section className={styles.banner}>
        <div><span className={styles.eyebrow}>THE BUYER'S MARKET</span><h1>Source with confidence.</h1><p>Thoughtful products from suppliers ready to grow with your business.</p></div>
        <div className={styles.bannerBadge}><span><FiSliders /></span><div><strong>Curated supply</strong><small>Verified partners, clear minimums</small></div></div>
        <div className={styles.bannerCircle} aria-hidden="true" />
      </section>

      <div className={styles.titleRow}><div><span className={styles.sectionLabel}>MARKETPLACE / CATALOG</span><h2>Find your next great supplier</h2><p>{visibleProducts.length} products from {new Set(visibleProducts.map((product) => product.supplierId)).size} suppliers</p></div><div className={styles.confidence}><FiCheck /> Supplier details verified</div></div>

      <section className={styles.filters} aria-label="Catalog filters">
        <label className={styles.search}><FiSearch /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search by product, material, or supplier" aria-label="Search catalog" />{query && <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search"><FiX /></button>}</label>
        <label className={styles.sort}><FiSliders /><span>Sort</span><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></label>
        <label className={styles.available}><input type="checkbox" checked={onlyAvailable} onChange={(event) => setOnlyAvailable(event.target.checked)} /><span><FiFilter /> Ships without customization</span></label>
      </section>

      <nav className={styles.categories} aria-label="Product categories">
        {categories.map((name) => <button type="button" key={name} className={category === name ? styles.selectedCategory : ""} onClick={() => setCategory(name)}>{name}{name === "All products" && <span>{products.length}</span>}</button>)}
      </nav>

      {visibleProducts.length ? <section className={styles.grid} aria-label="Wholesale products">
        {visibleProducts.map((product, index) => <article key={product.id} className={styles.card}>
          <button type="button" className={`${styles.visual} ${styles[`visual${product.color}`]}`} onClick={() => onProduct(product)} aria-label={`View ${product.name}`}><img src={product.image} alt="" /><span className={styles.tag}>{product.tag}</span><span className={styles.quickView}>Quick view <FiArrowUpRight /></span></button>
          <div className={styles.cardBody}>
            <div className={styles.productTop}><span>{product.category}</span><button type="button" className={`${styles.heart} ${shortlist.includes(product.id) ? styles.saved : ""}`} onClick={() => onToggleShortlist(product)} aria-label={shortlist.includes(product.id) ? `Remove ${product.name} from shortlist` : `Add ${product.name} to shortlist`}><FiHeart /></button></div>
            <button type="button" className={styles.productName} onClick={() => onProduct(product)}>{product.name}</button>
            <p className={styles.detail}>{product.detail}</p>
            <button type="button" className={styles.supplier} onClick={() => onProduct(product)}><span className={styles.supplierDot}>{product.supplier.slice(0, 1)}</span>{product.supplier}<span className={styles.verified}><FiCheck /> Verified</span></button>
            <div className={styles.divider} />
            <div className={styles.pricing}><div><strong>{formatMoney(product.price)}</strong><span>{product.unit}</span></div><span className={styles.rating}><FiStar /> {product.rating}</span></div>
            <div className={styles.moq}><span>Minimum order</span><strong>{formatQuantity(product.moq, product.unit)}</strong></div>
            <div className={styles.cardActions}><button type="button" onClick={() => onRfq(product)}><FiPlus /> Request quote</button><span>{product.lead}</span></div>
          </div>
          <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
        </article>)}
      </section> : <div className={styles.empty}><span><FiSearch /></span><h3>No products found</h3><p>Try another search or clear the filters to see the full catalog.</p><button type="button" onClick={clearFilters}>Clear all filters</button></div>}

      <aside className={styles.bottomCallout}><div><span className={styles.calloutIcon}><FiHeart /></span><span><strong>Already have a supplier in mind?</strong><small>Send a request with your own product requirements.</small></span></div><button type="button" onClick={() => onRfq(null)}>Create a custom RFQ <FiArrowUpRight /></button></aside>
    </div>
  );
};

export default Marketplace;
