import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Modal = ({ title, description, onClose, children, size = "medium" }) => {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const focusableSelector = "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]";
    const safeButton = dialogRef.current?.querySelector("[data-dialog-safe]");
    const firstField = dialogRef.current?.querySelector("[autofocus], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)");
    (safeButton || firstField || dialogRef.current)?.focus();

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll(focusableSelector)];
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, []);

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} tabIndex={-1} className={`${styles.dialog} ${size === "large" ? styles.large : ""}`} role="dialog" aria-modal="true" aria-labelledby="atlas-dialog-title" aria-describedby={description ? "atlas-dialog-description" : undefined}>
        <header className={styles.header}>
          <div>
            <h2 id="atlas-dialog-title">{title}</h2>
            {description && <p id="atlas-dialog-description">{description}</p>}
          </div>
          <button className={styles.closeButton} type="button" aria-label="Close dialog" onClick={onClose}><FiX aria-hidden="true" /></button>
        </header>
        <div className={styles.body}>{children}</div>
      </section>
    </div>
  );
};

export const ConfirmDialog = ({ title, description, confirmLabel = "Remove", cancelLabel = "Keep it", onConfirm, onClose, danger = true }) => (
  <Modal title={title} description={description} onClose={onClose}>
    <div className={styles.confirmation}>
      <span className={styles.warningIcon}><FiAlertTriangle aria-hidden="true" /></span>
      <div className={styles.actions}>
        <button type="button" data-dialog-safe="true" autoFocus onClick={onClose}>{cancelLabel}</button>
        <button type="button" className={danger ? styles.dangerButton : styles.primaryButton} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </Modal>
);

export default Modal;
