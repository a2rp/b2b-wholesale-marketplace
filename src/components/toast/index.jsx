import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };

const Toast = ({ message, tone = "success", onDismiss }) => {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, 4400);
    return () => window.clearTimeout(timeout);
  }, [message, onDismiss]);

  if (!message) return null;
  const Icon = icons[tone] || icons.success;

  return (
    <div className={`${styles.toast} ${styles[tone] || styles.success}`} role={tone === "error" ? "alert" : "status"} aria-live={tone === "error" ? "assertive" : "polite"}>
      <Icon aria-hidden="true" />
      <p>{message}</p>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss}><FiX aria-hidden="true" /></button>
    </div>
  );
};

export default Toast;
