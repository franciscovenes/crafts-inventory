import { CircleCheck, BadgeAlert } from "lucide-react";
import styles from "./CheckExistence.module.css";
import { useEffect } from "react";
import { useDebounce } from "../../../../utils/utils";
import { normalizeMasterDataValue } from "../../masterDataUtils";

const DELAY = 500;

export default function CheckExistence({
  value,
  masterData,
  existence,
  onExistenceChange,
}) {
  const debounced = useDebounce(value, DELAY);

  useEffect(() => {
    if (debounced !== value) {
      return;
    }
    if (debounced) {
      const valueExists = masterData.some(
        (obj) =>
          obj.name.toLowerCase() ===
          normalizeMasterDataValue(debounced).toLowerCase(),
      );
      if (valueExists) {
        onExistenceChange("exists");
      } else {
        onExistenceChange("available");
      }
    } else {
      onExistenceChange(null);
    }
  }, [debounced, masterData, onExistenceChange, value]);
  return (
    <div className={styles.checkExistence}>
      {existence ? (
        existence !== "exists" ? (
          <span className={`${styles.existenceMsg} ${styles.available}`}>
            <CircleCheck />
            Available
          </span>
        ) : (
          <span className={`${styles.existenceMsg} ${styles.exists}`}>
            <BadgeAlert />
            Already exists. Please chose another name.
          </span>
        )
      ) : null}
    </div>
  );
}
