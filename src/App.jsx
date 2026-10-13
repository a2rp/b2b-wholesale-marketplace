import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiCheck, FiClock, FiFileText, FiMapPin, FiShield, FiStar, FiTruck } from "react-icons/fi";
import { initialOrders, initialRfqs, products, suppliers, formatMoney, formatQuantity } from "./data";
import Header from "./components/header";
import Footer from "./components/footer";
import Loading from "./components/loading";
import Modal, { ConfirmDialog } from "./components/modal";
import RfqForm from "./components/rfqform";
import Toast from "./components/toast";
import styles from "./App.module.css";

const Overview = lazy(() => import("./pages/overview"));
const Marketplace = lazy(() => import("./pages/marketplace"));
const Quotes = lazy(() => import("./pages/quotes"));
const Orders = lazy(() => import("./pages/orders"));
const Suppliers = lazy(() => import("./pages/suppliers"));

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState(initialRfqs);
  const [orders, setOrders] = useState(initialOrders);
  const [shortlist, setShortlist] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  const dismissToast = useCallback(() => setToast(null), []);
  const notify = (message, tone = "success") => setToast({ message, tone, id: Date.now() });
  const closeModal = () => setModal(null);
  const startRfq = (product = null) => setModal({ type: "rfq", product });
  const openProduct = (product) => setModal({ type: "product", product });
  const openSearch = (query) => {
    setSearchQuery(query);
    navigate("/marketplace");
  };

  const toggleShortlist = (product) => {
    const isSaved = shortlist.includes(product.id);
    setShortlist((current) => isSaved ? current.filter((id) => id !== product.id) : [...current, product.id]);
    notify(isSaved ? product.name + " removed from your shortlist." : product.name + " added to your shortlist.");
  };

  const toggleFollow = (supplier) => {
    const isFollowed = followed.includes(supplier.id);
    setFollowed((current) => isFollowed ? current.filter((id) => id !== supplier.id) : [...current, supplier.id]);
    notify(isFollowed ? "You unfollowed " + supplier.name + "." : "You are now following " + supplier.name + ".");
  };

  const createRfq = (details) => {
    const rfq = { ...details, id: "RFQ-" + Date.now().toString().slice(-7) };
    setRfqs((current) => [rfq, ...current]);
    setModal(null);
    notify("Your request was added to the quote desk.");
    navigate("/quotes");
  };

  const updateRfqDetails = (details) => {
    setRfqs((current) => current.map((rfq) => rfq.id === details.id ? { ...rfq, ...details } : rfq));
    setModal(null);
    notify("Your quote request was updated.");
  };

  const updateRfq = (id, status) => {
    setRfqs((current) => current.map((rfq) => rfq.id === id ? { ...rfq, status } : rfq));
    notify("Request status updated to " + status + ".");
  };

  const createOrder = (rfq) => {
    const order = {
      id: "PO-" + Date.now().toString().slice(-7),
      supplierId: rfq.supplierId,
      supplier: rfq.supplier,
      title: rfq.title,
      items: rfq.products.length,
      total: rfq.budget,
      placed: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      eta: rfq.due,
      status: "Processing",
    };
    setOrders((current) => [order, ...current]);
    setRfqs((current) => current.map((item) => item.id === rfq.id ? { ...item, status: "Ordered" } : item));
    setModal(null);
    notify("Purchase order " + order.id + " was created.");
    navigate("/orders");
  };

  const updateOrder = (id, status) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    notify("Purchase order status updated to " + status + ".");
  };

  const askRemoveRfq = (rfq) => setPendingRemoval({ type: "rfq", item: rfq });
  const askRemoveOrder = (order) => setPendingRemoval({ type: "order", item: order });
  const confirmRemoval = () => {
    if (pendingRemoval?.type === "rfq") {
      setRfqs((current) => current.filter((item) => item.id !== pendingRemoval.item.id));
      notify("Request " + pendingRemoval.item.id + " was removed.");
    }
    if (pendingRemoval?.type === "order") {
      setOrders((current) => current.filter((item) => item.id !== pendingRemoval.item.id));
      notify("Purchase order " + pendingRemoval.item.id + " was canceled.");
    }
    setPendingRemoval(null);
  };

  const browseSupplier = (supplier) => {
    setSearchQuery(supplier.name);
    navigate("/marketplace");
  };

  return (
    <div className={styles.app}>
      <Header shortlistCount={shortlist.length} onNewRfq={() => startRfq()} onSearch={openSearch} />
      <div className={styles.workspace}>
        <main className={styles.main}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview products={products} suppliers={suppliers} rfqs={rfqs} orders={orders} onNewRfq={() => startRfq()} onProduct={openProduct} />} />
              <Route path="/marketplace" element={<Marketplace products={products} query={searchQuery} shortlist={shortlist} onQueryChange={setSearchQuery} onToggleShortlist={toggleShortlist} onProduct={openProduct} onRfq={startRfq} />} />
              <Route path="/quotes" element={<Quotes rfqs={rfqs} onNewRfq={() => startRfq()} onUpdateRfq={updateRfq} onViewRfq={(rfq) => setModal({ type: "rfq-details", rfq })} onEditRfq={(rfq) => setModal({ type: "edit-rfq", rfq })} onDeleteRfq={askRemoveRfq} onCreateOrder={createOrder} />} />
              <Route path="/orders" element={<Orders orders={orders} onUpdateOrder={updateOrder} onViewOrder={(order) => setModal({ type: "order", order })} onDeleteOrder={askRemoveOrder} />} />
              <Route path="/suppliers" element={<Suppliers suppliers={suppliers} followed={followed} onToggleFollow={toggleFollow} onViewSupplier={(supplier) => setModal({ type: "supplier", supplier })} onBrowseSupplier={browseSupplier} />} />
              <Route path="*" element={<Navigate to="/overview" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>

      {modal?.type === "rfq" && <Modal title="Create a request for quotation" description="Share the details suppliers need to send you a useful quote." onClose={closeModal} size="large"><RfqForm products={products} suppliers={suppliers} defaultProduct={modal.product} onSubmit={createRfq} onCancel={closeModal} /></Modal>}

      {modal?.type === "edit-rfq" && <Modal title="Edit quote request" description={"Update the details for " + modal.rfq.id + "."} onClose={closeModal} size="large"><RfqForm products={products} suppliers={suppliers} initialRfq={modal.rfq} onSubmit={updateRfqDetails} onCancel={closeModal} /></Modal>}

      {modal?.type === "product" && <Modal title={modal.product.name} description={modal.product.category + " · " + modal.product.supplier} onClose={closeModal} size="large">
        <div className={styles.productDetails}><img src={modal.product.image} alt="" /><div className={styles.detailCopy}><span className={styles.detailPill}><FiCheck /> {modal.product.tag}</span><p>{modal.product.detail}</p><div className={styles.detailPrice}><strong>{formatMoney(modal.product.price)}</strong><span>{modal.product.unit}</span></div><div className={styles.detailFacts}><span><small>Minimum order</small><strong>{formatQuantity(modal.product.moq, modal.product.unit)}</strong></span><span><small>Lead time</small><strong>{modal.product.lead}</strong></span><span><small>Supplier rating</small><strong><FiStar /> {modal.product.rating}</strong></span></div><div className={styles.detailSupplier}><span className={styles.supplierInitial}>{modal.product.supplier.slice(0, 1)}</span><span><strong>{modal.product.supplier}</strong><small><FiShield /> Verified supplier</small></span><button type="button" onClick={() => { const supplier = suppliers.find((item) => item.id === modal.product.supplierId); closeModal(); if (supplier) setModal({ type: "supplier", supplier }); }}>Supplier profile</button></div><div className={styles.detailActions}><button type="button" onClick={() => toggleShortlist(modal.product)}>{shortlist.includes(modal.product.id) ? "Remove from shortlist" : "Add to shortlist"}</button><button type="button" onClick={() => startRfq(modal.product)}>Request a quote <FiArrowRight /></button></div></div></div>
      </Modal>}

      {modal?.type === "supplier" && <Modal title={modal.supplier.name} description={modal.supplier.specialty} onClose={closeModal}>
        <div className={styles.supplierDetails}><div className={styles.supplierBanner}><span>{modal.supplier.initials}</span><div><strong><FiShield /> Verified supplier</strong><small><FiMapPin /> {modal.supplier.location}</small></div></div><p className={styles.detailNotice}>Supplier profile and performance notes are sample workspace data. Confirm current capabilities, pricing, and delivery terms directly before placing an order.</p><div className={styles.supplierFacts}><span><small>Buyer rating</small><strong><FiStar /> {modal.supplier.rating} / 5</strong></span><span><small>On-time record</small><strong>{modal.supplier.onTime}</strong></span><span><small>Response time</small><strong>{modal.supplier.response}</strong></span><span><small>In business</small><strong>{modal.supplier.years} years</strong></span><span><small>Catalog</small><strong>{modal.supplier.products} products</strong></span></div><div className={styles.detailActions}><button type="button" onClick={() => toggleFollow(modal.supplier)}>{followed.includes(modal.supplier.id) ? "Unfollow supplier" : "Follow supplier"}</button><button type="button" onClick={() => { browseSupplier(modal.supplier); closeModal(); }}>Browse catalog <FiArrowRight /></button></div></div>
      </Modal>}

      {modal?.type === "rfq-details" && <Modal title={modal.rfq.title} description={"Request " + modal.rfq.id + " · " + modal.rfq.supplier} onClose={closeModal}>
        <div className={styles.requestDetails}><div className={styles.detailStatus}><span><FiFileText /> {modal.rfq.status}</span><span>Response due {modal.rfq.due}</span></div><div className={styles.requestProductList}>{modal.rfq.products.map((item, index) => <div key={item.productId || index}><span>{item.name}</span><strong>{item.quantity.toLocaleString()} {item.unit}</strong></div>)}</div><div className={styles.supplierFacts}><span><small>Buyer</small><strong>{modal.rfq.buyer || "Morgan Ellis"}</strong></span><span><small>Target budget</small><strong>{formatMoney(modal.rfq.budget)}</strong></span><span><small>Created</small><strong>{modal.rfq.created}</strong></span></div><div className={styles.detailNote}><strong>Supplier notes</strong><p>{modal.rfq.note || "No extra instructions were added."}</p></div><div className={styles.detailActions}>{modal.rfq.status === "Approved" ? <button type="button" onClick={() => createOrder(modal.rfq)}>Create purchase order <FiArrowRight /></button> : modal.rfq.status !== "Ordered" && <button type="button" onClick={() => { updateRfq(modal.rfq.id, "Approved"); closeModal(); }}>Approve request <FiCheck /></button>}</div></div>
      </Modal>}

      {modal?.type === "order" && <Modal title={modal.order.title} description={"Purchase order " + modal.order.id + " · " + modal.order.supplier} onClose={closeModal}>
        <div className={styles.orderDetails}><div className={styles.orderSummary}><span className={styles.orderBadge}><FiTruck /></span><div><small>ORDER TOTAL</small><strong>{formatMoney(modal.order.total)}</strong><span>{modal.order.items} line items</span></div><span className={styles.orderState}>{modal.order.status}</span></div><div className={styles.orderDates}><span><FiCalendar /> Placed <strong>{modal.order.placed}</strong></span><span><FiClock /> Expected <strong>{modal.order.eta}</strong></span></div><div className={styles.timeline}>{["Processing", "Ready to ship", "In transit", "Delivered"].map((step, index) => { const activeIndex = ["Processing", "Ready to ship", "In transit", "Delivered"].indexOf(modal.order.status); return <span key={step} className={index <= activeIndex ? styles.timelineDone : ""}><i /><strong>{step}</strong></span>; })}</div><p className={styles.detailNotice}><FiShield /> Order tracking is a front-end demonstration. Confirm shipment and delivery details with the supplier.</p><div className={styles.detailActions}>{modal.order.status !== "Delivered" && <button type="button" onClick={() => { const sequence = ["Processing", "Ready to ship", "In transit", "Delivered"]; const next = sequence[sequence.indexOf(modal.order.status) + 1]; if (next) updateOrder(modal.order.id, next); closeModal(); }}>Advance order status <FiArrowRight /></button>}</div></div>
      </Modal>}

      {pendingRemoval && <ConfirmDialog title={pendingRemoval.type === "rfq" ? "Remove this quote request?" : "Cancel this purchase order?"} description={pendingRemoval.type === "rfq" ? pendingRemoval.item.title + " will be removed from your quote desk." : pendingRemoval.item.id + " will be removed from this order register."} confirmLabel={pendingRemoval.type === "rfq" ? "Remove request" : "Cancel order"} cancelLabel="Keep it" onClose={() => setPendingRemoval(null)} onConfirm={confirmRemoval} />}
      <Toast key={toast?.id} message={toast?.message} tone={toast?.tone} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
