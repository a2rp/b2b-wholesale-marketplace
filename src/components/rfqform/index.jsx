import { useState } from "react";
import { FiCalendar, FiCheck, FiFileText, FiPackage, FiSend } from "react-icons/fi";
import styles from "./styles.module.css";

const dueDateDefault = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
};

const RfqForm = ({ products, suppliers, defaultProduct, onSubmit, onCancel }) => {
  const [productId, setProductId] = useState(defaultProduct?.id || "");
  const [supplierId, setSupplierId] = useState(defaultProduct?.supplierId || suppliers[0]?.id || "");
  const [title, setTitle] = useState(defaultProduct ? defaultProduct.name + " volume pricing" : "");
  const [quantity, setQuantity] = useState(defaultProduct?.moq || 1000);
  const [budget, setBudget] = useState("");
  const [due, setDue] = useState(dueDateDefault);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const supplier = suppliers.find((item) => item.id === supplierId);
    const product = products.find((item) => item.id === productId);
    if (!supplier || !title.trim() || Number(quantity) < 1 || Number(budget) <= 0 || !due) {
      setError("Add a request title, supplier, quantity, budget, and response date.");
      return;
    }
    onSubmit({
      title: title.trim(),
      supplierId,
      supplier: supplier.name,
      products: product ? [{ productId: product.id, name: product.name, quantity: Number(quantity), unit: product.unit.replace("per ", "") }] : [{ productId: "", name: title.trim(), quantity: Number(quantity), unit: "units" }],
      budget: Number(budget),
      due: new Date(due + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Awaiting quote",
      note: note.trim(),
    });
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.intro}><span><FiFileText /></span><p>Share your volume, timeline, and requirements. This creates a request in your quote desk.</p></div>
      <label>Request title<input autoFocus required maxLength={90} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Holiday packaging order" /></label>
      <div className={styles.twoColumns}>
        <label>Product or requirement<select value={productId} onChange={(event) => setProductId(event.target.value)}><option value="">Custom requirement</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Supplier<select required value={supplierId} onChange={(event) => setSupplierId(event.target.value)}>{suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      </div>
      <div className={styles.twoColumns}>
        <label>Quantity<input type="number" required min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /><small><FiPackage /> Include your expected order volume</small></label>
        <label>Target budget (USD)<input type="number" required min="1" step="0.01" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="e.g. 2500" /></label>
      </div>
      <label>Response requested by<span className={styles.dateInput}><FiCalendar /><input type="date" required value={due} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setDue(event.target.value)} /></span></label>
      <label>Notes for the supplier <span className={styles.optional}>OPTIONAL</span><textarea rows="3" maxLength="500" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add print specs, packaging preferences, or delivery details" /></label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.actions}><button type="button" className={styles.cancel} onClick={onCancel}>Cancel</button><button type="submit" className={styles.submit}><FiSend /> Send request <FiCheck /></button></div>
    </form>
  );
};

export default RfqForm;
