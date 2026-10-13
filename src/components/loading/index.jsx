import { FiBox } from "react-icons/fi";
import styles from "./styles.module.css";

const Loading = ({ label = "Preparing your buyer workspace" }) => (
  <div className={styles.loading} role="status" aria-live="polite">
    <span className={styles.mark}><FiBox aria-hidden="true" /></span>
    <span>{label}</span>
    <span className={styles.track}><i /></span>
  </div>
);

export default Loading;
