import { Plus } from "lucide-react";
import styles from "./AddBtn.module.css";
export default function AddBtn({ disabled }) {
  return (
    <button className={styles.addBtn} type="submit" disabled={disabled}>
      <Plus /> Add
    </button>
  );
}
