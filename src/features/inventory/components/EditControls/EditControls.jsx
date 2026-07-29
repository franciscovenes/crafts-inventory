import { ACTION_BTN_VARIANT } from "../../../../components/ActionBtn/constants";
import styles from "./EditControls.module.css";
import ActionBtn from "../../../../components/ActionBtn/ActionBtn";
import { X, SavePen } from "lucide-react";

export default function EditControls({ onCancel, mobile = false, formId }) {
  return (
    <div className={`${styles.container} ${mobile ? styles.mobileOnly : ""}`}>
      <ActionBtn
        type="submit"
        form={formId}
        variant={ACTION_BTN_VARIANT.PRIMARY}
      >
        <SavePen />
        Update
      </ActionBtn>
      <ActionBtn onClick={onCancel} variant={ACTION_BTN_VARIANT.CANCEL}>
        <X />
        Cancel
      </ActionBtn>
    </div>
  );
}
