import { Link } from "react-router-dom";
import { FiArrowDownRight, FiArrowRight, FiArrowUpRight, FiBox, FiClock, FiFileText, FiPackage, FiPlus, FiShoppingBag, FiTruck } from "react-icons/fi";
import { formatMoney } from "../../data";
import styles from "./styles.module.css";

const Overview = ({ products, suppliers, rfqs, orders, onNewRfq, onProduct }) => {
  const openQuotes = rfqs.filter((item) => item.status === "Awaiting quote");
  const reviewQuotes = rfqs.filter((item) => item.status === "Under review");
  const activeQuotes = rfqs.filter((item) => item.status !== "Ordered" && item.status !== "Declined");
  const activeOrders = orders.filter((item) => item.status !== "Delivered");
  const committed = orders.reduce((sum, item) => sum + item.total, 0);
  const featured = products.slice(0, 4);
  const stats = [
    { label: "Open purchase orders", value: activeOrders.length, note: `${orders.length} orders in this cycle`, Icon: FiShoppingBag, tone: "violet", direction: "up" },
    { label: "Awaiting supplier quotes", value: openQuotes.length, note: reviewQuotes.length + " need your review", Icon: FiFileText, tone: "amber", direction: "down" },
    { label: "Committed this month", value: formatMoney(committed), note: "Across active orders", Icon: FiPackage, tone: "blue", direction: "up" },
    { label: "Verified suppliers", value: suppliers.length, note: "Across " + new Set(products.map((product) => product.category)).size + " categories", Icon: FiTruck, tone: "green", direction: "up" },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>TUESDAY, OCTOBER 13, 2026 <i /></span>
          <h1>Good morning, Morgan.</h1>
          <p>Your supply network is moving. Here is what needs your attention today.</p>
        </div>
        <div className={styles.heroActions}>
          <Link to="/marketplace" className={styles.secondaryAction}><FiBox /> Browse products</Link>
          <button type="button" className={styles.primaryAction} onClick={onNewRfq}><FiPlus /> Create an RFQ</button>
        </div>
        <div className={styles.heroFoot}><span className={styles.wave}>↗</span><span><strong>Supplier response rate is up 8%</strong><small>Your last 5 requests received a reply within 1 day</small></span><Link to="/quotes">View quote desk <FiArrowRight /></Link></div>
      </section>

      <section className={styles.stats} aria-label="Procurement summary">
        {stats.map(({ label, value, note, Icon, tone, direction }) => (
          <article key={label} className={styles.statCard}>
            <div className={styles.statTop}><span className={`${styles.statIcon} ${styles[tone]}`}><Icon /></span><span className={direction === "up" ? styles.trendUp : styles.trendDown}>{direction === "up" ? <FiArrowUpRight /> : <FiArrowDownRight />}{direction === "up" ? "On track" : "Review"}</span></div>
            <p>{label}</p><strong>{value}</strong><small>{note}</small>
          </article>
        ))}
      </section>

      <div className={styles.columns}>
        <section className={styles.panel}>
          <header className={styles.panelHeader}><div><span className={styles.kicker}>KEEP THINGS MOVING</span><h2>Orders in motion</h2></div><Link to="/orders">All orders <FiArrowRight /></Link></header>
          <div className={styles.orderList}>
            {orders.slice(0, 3).map((order, index) => <article className={styles.orderRow} key={order.id}>
              <span className={`${styles.orderIcon} ${styles[`orderTone${index}`]}`}><FiTruck /></span>
              <div className={styles.orderInfo}><strong>{order.title}</strong><small>{order.id} <i /> {order.supplier}</small></div>
              <div className={styles.orderMeta}><strong>{formatMoney(order.total)}</strong><span className={styles[`status${order.status.replaceAll(" ", "")}`]}><i />{order.status}</span></div>
            </article>)}
          </div>
          <div className={styles.deliveryNote}><span><FiClock /></span><p><strong>Next delivery window</strong><small>Paper Lane Co. · Wednesday, Oct 22</small></p><span className={styles.noteBadge}>2 days</span></div>
        </section>

        <section className={styles.panel}>
          <header className={styles.panelHeader}><div><span className={styles.kicker}>SUPPLIER RESPONSES</span><h2>Quotes to review</h2></div><Link to="/quotes">Open quote desk <FiArrowRight /></Link></header>
          <div className={styles.quoteList}>
            {rfqs.slice(0, 3).map((rfq) => <article className={styles.quoteRow} key={rfq.id}>
              <span className={styles.quoteAvatar}>{rfq.supplier.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
              <div><strong>{rfq.title}</strong><small>{rfq.supplier} <i /> Due {rfq.due}</small></div>
              <span className={`${styles.quoteStatus} ${rfq.status === "Approved" ? styles.quoteReady : ""}`}>{rfq.status}</span>
            </article>)}
          </div>
          <div className={styles.quoteFooter}><span><strong>{activeQuotes.length}</strong> requests still open</span><Link to="/quotes">Review responses <FiArrowRight /></Link></div>
        </section>
      </div>

      <section className={styles.productSection}>
        <header className={styles.panelHeader}><div><span className={styles.kicker}>SOURCED FOR YOUR BUSINESS</span><h2>Popular with buyers like you</h2></div><Link to="/marketplace">Explore marketplace <FiArrowRight /></Link></header>
        <div className={styles.productGrid}>{featured.map((product) => <button type="button" className={styles.productCard} key={product.id} onClick={() => onProduct(product)}>
          <span className={`${styles.productVisual} ${styles[`product${product.color}`]}`}><img src={product.image} alt="" /><span>{product.tag}</span></span>
          <span className={styles.productCopy}><strong>{product.name}</strong><small>{product.supplier}</small><span>{formatMoney(product.price)} <i>{product.unit}</i></span></span>
          <FiArrowRight className={styles.productArrow} />
        </button>)}</div>
      </section>
    </div>
  );
};

export default Overview;
