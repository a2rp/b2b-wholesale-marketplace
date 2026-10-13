import { useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiCheck, FiChevronDown, FiClock, FiFileText, FiMoreHorizontal, FiPlus, FiSearch, FiShield, FiTrash2 } from "react-icons/fi";
import { formatMoney } from "../../data";
import styles from "./styles.module.css";

const statuses = ["All requests", "Awaiting quote", "Under review", "Approved", "Declined"];

const Quotes = ({ rfqs, onNewRfq, onUpdateRfq, onViewRfq, onDeleteRfq, onCreateOrder }) => {
  const [filter, setFilter] = useState("All requests");
  const [query, setQuery] = useState("");
  const [menuId, setMenuId] = useState(null);
  const filtered = useMemo(() => rfqs.filter((item) => {
    const matchesStatus = filter === "All requests" || item.status === filter;
    const matchesQuery = (item.title + " " + item.supplier + " " + item.id).toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  }), [rfqs, filter, query]);
  const counts = statuses.slice(1).map((status) => ({ status, count: rfqs.filter((item) => item.status === status).length }));
  const nextStatus = (status) => status === "Awaiting quote" ? "Under review" : status === "Under review" ? "Approved" : status;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div><span className={styles.eyebrow}>SUPPLIER CONVERSATIONS</span><h1>Quote desk</h1><p>Keep every request, response, and decision moving in one clear place.</p></div>
        <div className={styles.heroAside}><span className={styles.heroMark}><FiFileText /></span><span><strong>{rfqs.length} active requests</strong><small>Across your supplier network</small></span></div>
      </section>

      <section className={styles.metrics} aria-label="Quote request counts">
        {counts.slice(0, 3).map(({ status, count }, index) => <article key={status} className={styles.metric}><span className={styles.metricIcon + " " + styles["metric" + index]}>{index === 0 ? <FiClock /> : index === 1 ? <FiFileText /> : <FiCheck />}</span><span><small>{status}</small><strong>{count}</strong></span><i /></article>)}
        <button type="button" className={styles.createTile} onClick={onNewRfq}><span><FiPlus /></span><strong>Start a new request</strong><small>Invite a supplier to quote</small><FiArrowRight /></button>
      </section>

      <section className={styles.board}>
        <header className={styles.boardHeader}><div><span className={styles.sectionLabel}>YOUR SOURCING PIPELINE</span><h2>Requests for quotation <span>{filtered.length}</span></h2></div><label className={styles.search}><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requests" aria-label="Search quote requests" /></label></header>
        <nav className={styles.filters} aria-label="Filter quote requests">{statuses.map((status) => <button type="button" key={status} className={filter === status ? styles.activeFilter : ""} onClick={() => setFilter(status)}>{status}<span>{status === "All requests" ? rfqs.length : rfqs.filter((item) => item.status === status).length}</span></button>)}</nav>

        {filtered.length ? <div className={styles.list}>{filtered.map((rfq) => <article className={styles.row} key={rfq.id}>
          <div className={styles.requestIdentity}><span className={styles.requestIcon}><FiFileText /></span><div><div className={styles.requestTitle}><strong>{rfq.title}</strong><span>{rfq.id}</span></div><p>{rfq.products.map((product) => product.quantity.toLocaleString() + " " + product.unit + " " + product.name).join(" + ")}</p></div></div>
          <div className={styles.supplierCell}><span className={styles.supplierInitial}>{rfq.supplier.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>{rfq.supplier}</strong><small><FiShield /> Verified supplier</small></span></div>
          <div className={styles.dateCell}><small><FiCalendar /> RESPONSE DUE</small><strong>{rfq.due}</strong></div>
          <div className={styles.budgetCell}><small>Target budget</small><strong>{formatMoney(rfq.budget)}</strong></div>
          <div className={styles.statusCell}><span className={styles.status + " " + styles["status" + rfq.status.replaceAll(" ", "")]}><i />{rfq.status}</span></div>
          <div className={styles.rowActions}>
            {rfq.status === "Approved" ? <button className={styles.convertButton} type="button" onClick={() => onCreateOrder(rfq)}>Create PO <FiArrowRight /></button> : <button className={styles.reviewButton} type="button" onClick={() => onUpdateRfq(rfq.id, nextStatus(rfq.status))}>{rfq.status === "Awaiting quote" ? "Review" : "Approve"} <FiArrowRight /></button>}
            <button type="button" className={styles.moreButton} aria-label={"More actions for " + rfq.id} aria-expanded={menuId === rfq.id} onClick={() => setMenuId(menuId === rfq.id ? null : rfq.id)}><FiMoreHorizontal /></button>
            {menuId === rfq.id && <div className={styles.menu}>
              <button type="button" onClick={() => { onViewRfq(rfq); setMenuId(null); }}>View request details</button>
              <label>Change status <select value={rfq.status} onChange={(event) => { onUpdateRfq(rfq.id, event.target.value); setMenuId(null); }}><option>Awaiting quote</option><option>Under review</option><option>Approved</option><option>Declined</option></select><FiChevronDown /></label>
              <button type="button" className={styles.deleteAction} onClick={() => { onDeleteRfq(rfq); setMenuId(null); }}><FiTrash2 /> Remove request</button>
            </div>}
          </div>
        </article>)}</div> : <div className={styles.empty}><span><FiSearch /></span><strong>No requests match this view.</strong><p>Change the search or filter, or create a new supplier request.</p><button type="button" onClick={onNewRfq}><FiPlus /> Create an RFQ</button></div>}
        <footer className={styles.boardFoot}><span>Showing <strong>{filtered.length}</strong> of <strong>{rfqs.length}</strong> requests</span><span><FiShield /> Supplier and buyer details stay in this workspace</span></footer>
      </section>
    </div>
  );
};

export default Quotes;
