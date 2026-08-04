import { X } from "lucide-react";
import styles from "./SearchChip.module.css";
export default function SearchChip({ token, onRemove, removalHint }) {
  return (
    <span
      className={`${styles.chip} ${
        token.field === "color"
          ? token.isLight
            ? styles.lightColorChip
            : styles.colorChip
          : ""
      } 
      ${removalHint ? styles.removalHint : ""}`}
      style={
        token.field === "color" ? { "--chip-color": token.hex } : undefined
      }
    >
      <span>
        {token.type === "primitive"
          ? `${token.field} ${token.operator} ${token.value}`
          : `${token.field}: ${token.value}`}
      </span>
      <button
        type="button"
        onClick={() => onRemove(token.id)}
        aria-label={`Remove ${token.field} ${token.value}`}
      >
        <X />
      </button>
    </span>
  );
}
