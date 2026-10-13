import { useMemo, useState } from "react";
import { FiArrowRight, FiBox, FiCheck, FiChevronDown, FiClock, FiDownload, FiMoreVertical, FiPackage, FiSearch, FiShield, FiTruck } from "react-icons/fi";
import { formatMoney } from "../../data";
import styles from "./styles.module.css";

const statusFlow = ["Processing", "Ready to ship", "In transit", "Delivered"];
const tabs = ["All orders", ...statusFlow];

const Orders = ({ orders, onUpdateOrder, onViewOrder, onDeleteOrder }) => {
  const [filter, setFilter] = useState("All orders");
  const [query, setQuery] = useState("");
  const [menuId, setMenuId] = useState(null);
  const filtered = useMemo(() => orders.filter((order) => {
    const statusMatch = filter === "All orders" || order.status === filter;
    const queryMatch = (order.title + " " + order.id + " " + order.supplier).toLowerCase().includes(query.toLowerCase());
    return statusMatch && queryMatch;
  }), [orders, filter, query]);
  const totals = orders.reduce((sum, order) => sum + order.total, 0);
  const active = orders.filter((order) => order.status !== "Delivered").length;

  const advance = (order) => {
    const index = statusFlow.indexOf(order.status);
    if (index >= 0 && index < statusFlow.length - 1) onUpdateOrder(order.id, statusFlow[index + 1]);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div><span className={styles.eyebrow}>PURCHASE ORDER CONTROL</span><h1>Orders, accounted for.</h1><p>Track the handoff from supplier confirmation to your receiving dock.</p></div>
        <div className={styles.heroStats}><span><strong>{orders.length}</strong><small>purchase orders</small></span><i /><span><strong>{formatMoney(totals)}</strong><small>total committed</small></span></div>
      </section>

      <div className={styles.summary}>
        <div className={styles.activeBanner}><span className={styles.bannerIcon}><FiTruck /></span><div><strong>{active} orders are on their way</strong><small>Next expected delivery: October 17, 2026</small></div><span className={styles.bannerPill}><FiClock /> Tracking live</span></div>
        <button type="button" className={styles.exportButton} onClick={() => {
          const rows = [["PO", "Order", "Supplier", "Placed", "ETA", "Status", "Total"], ...orders.map((order) => [order.id, order.title, order.supplier, order.placed, order.eta, order.status, order.total])];
          const csv = rows.map((row) => row.map((cell) => '"' + String(cell).replaceAll('"', '""') + '"').join(",")).join("\n");
          const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "atlas-purchase-orders.csv";
          anchor.click();
          URL.revokeObjectURL(url);
        }}><FiDownload /> Export CSV</button>
      </div>

      <section className={styles.ordersPanel}>
        <header className={styles.header}><div><span className={styles.sectionLabel}>BUYER PURCHASE ORDERS</span><h2>Order register</h2></div><label className={styles.search}><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search purchase orders" aria-label="Search purchase orders" /></label></header>
        <nav className={styles.tabs} aria-label="Filter by order status">{tabs.map((tab) => <button type="button" key={tab} className={filter === tab ? styles.activeTab : ""} onClick={() => setFilter(tab)}>{tab}<span>{tab === "All orders" ? orders.length : orders.filter((order) => order.status === tab).length}</span></button>)}</nav>
        {filtered.length ? <div className={styles.list}>{filtered.map((order) => {
          const stage = statusFlow.indexOf(order.status);
          return <article key={order.id} className={styles.order}>
            <button type="button" className={styles.orderIcon} onClick={() => onViewOrder(order)} aria-label={"View " + order.id}><FiPackage /></button>
            <div className={styles.orderMain}><button type="button" className={styles.orderTitle} onClick={() => onViewOrder(order)}>{order.title}</button><span>{order.id} <i /> {order.supplier}</span><div className={styles.progress} aria-label={"Delivery progress: " + order.status}>{statusFlow.map((step, index) => <span key={step} className={index <= stage ? styles.progressDone : ""} title={step}><i /></span>)}</div><small className={styles.progressLabel}>{stage < 0 ? order.status : statusFlow[Math.min(stage + 1, statusFlow.length - 1)] === order.status ? "Delivered to receiving" : "Next: " + statusFlow[stage + 1]}</small></div>
            <div className={styles.eta}><small>EXPECTED ARRIVAL</small><strong>{order.eta}</strong><span><FiTruck /> {order.status}</span></div>
            <div className={styles.orderTotal}><small>ORDER TOTAL</small><strong>{formatMoney(order.total)}</strong><span>{order.items} line items</span></div>
            <div className={styles.actions}>{order.status !== "Delivered" ? <button type="button" className={styles.advance} onClick={() => advance(order)}>{order.status === "In transit" ? "Mark received" : "Advance status"} <FiArrowRight /></button> : <span className={styles.delivered}><FiCheck /> Received</span>}<button type="button" className={styles.more} aria-label={"Actions for " + order.id} aria-expanded={menuId === order.id} onClick={() => setMenuId(menuId === order.id ? null : order.id)}><FiMoreVertical /></button>{menuId === order.id && <div className={styles.menu}><button type="button" onClick={() => { onViewOrder(order); setMenuId(null); }}>View order details</button><label>Set status <select value={order.status} onChange={(event) => { onUpdateOrder(order.id, event.target.value); setMenuId(null); }}>{statusFlow.map((status) => <option key={status}>{status}</option>)}</select><FiChevronDown /></label><button type="button" className={styles.delete} onClick={() => { onDeleteOrder(order); setMenuId(null); }}>Cancel order</button></div>}</div>
          </article>;
        })}</div> : <div className={styles.empty}><span><FiBox /></span><strong>No purchase orders in this view</strong><p>Change the filter or search for a different order.</p><button type="button" onClick={() => { setFilter("All orders"); setQuery(""); }}>Show all orders</button></div>}
        <footer className={styles.panelFoot}><span><FiShield /> Order statuses are managed in this buyer workspace.</span><span>{filtered.length} of {orders.length} orders</span></footer>
      </section>
    </div>
  );
};

export default Orders;
