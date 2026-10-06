import { CircleOff, CircleCheck } from "lucide-react";
import styles from "./MasterDataSection.module.css";
import { useState, useRef, useCallback } from "react";
import { useRevalidator } from "react-router-dom";
import AddBtn from "../AddBtn/AddBtn";
import CheckExistence from "../CheckExistence/CheckExistence";
import { CATEGORY_TO_DISPLAY } from "../../constants";
import { normalizeMasterDataValue } from "../../masterDataUtils";
import {
  insertMasterData,
  toggleMasterDataActivation,
} from "../../masterDataService";

export default function MasterDataSection({ masterData, category }) {
  const revalidator = useRevalidator();

  const hasEditedSinceSubmit = useRef(false);

  const [formValue, setFormValue] = useState("");
  //console.log("Form value: ", formValue);

  const [existence, setExistence] = useState(null);
  // console.log("Existence: ", existence);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeactivating, setIsDeactivating] = useState(false);

  const [submitMsg, setSubmitMsg] = useState({ success: false, message: "" });

  const handleInputValues = (event) => {
    const { value } = event.target;

    if (!hasEditedSinceSubmit.current) {
      setSubmitMsg({ success: false, message: "" });
    }

    hasEditedSinceSubmit.current = true;

    setExistence(null);

    setFormValue(value);
  };

  const onExistenceChange = useCallback((existenceValue) => {
    setExistence(existenceValue);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let payload = normalizeMasterDataValue(formValue);

    if (!payload || existence !== "available") {
      return;
    }

    setIsSubmitting(true);

    switch (category) {
      case "models":
      case "types":
        payload = payload
          .split(" ")
          .map((word) => {
            return word[0].toUpperCase() + word.substring(1).toLowerCase();
          })
          .join(" ");
        break;
      case "conditions":
      case "states":
        payload = payload[0].toUpperCase() + payload.substring(1).toLowerCase();
        break;
    }

    try {
      const result = await insertMasterData(category, payload);
      if (result) {
        setFormValue("");

        setExistence(null);

        setSubmitMsg({
          success: true,
          message: `${payload} successfully added.`,
        });

        revalidator.revalidate();
      }
    } catch (error) {
      console.error(error);
      setSubmitMsg({
        success: false,
        message: `${payload} wasn't submitted. Please try again.`,
      });
    } finally {
      hasEditedSinceSubmit.current = false;
      setIsSubmitting(false);
    }
  };

  const handleActivation = async (id) => {
    setIsDeactivating(true);
    try {
      await toggleMasterDataActivation(category, id);
      revalidator.revalidate();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <section className={styles.container}>
      <h2 id={category}>{CATEGORY_TO_DISPLAY[category]}</h2>
      <form
        className={styles.form}
        onSubmit={(event) => handleSubmit(event, category)}
      >
        <label className={styles.labelField} htmlFor={`${category}-label`}>
          {`
          New ${
            category === "states"
              ? CATEGORY_TO_DISPLAY[category][0].toLowerCase() +
                CATEGORY_TO_DISPLAY[category].slice(1)
              : CATEGORY_TO_DISPLAY[category][0].toLowerCase() +
                CATEGORY_TO_DISPLAY[category].slice(1, -1)
          }
          `}
        </label>
        <input
          type="text"
          id={`${category}-label`}
          name={category}
          onChange={handleInputValues}
          value={formValue}
          disabled={isSubmitting}
        />
        <AddBtn disabled={existence !== "available" || isSubmitting} />
        <CheckExistence
          value={formValue}
          masterData={masterData}
          existence={existence}
          onExistenceChange={onExistenceChange}
        />
        <span
          className={`${styles.submitMsg} ${submitMsg.success ? styles.success : styles.error}`}
        >
          {submitMsg.message}
        </span>
      </form>
      <table className={styles.masterDataList}>
        <thead>
          <tr>
            <th scope="col" aria-label="Name">
              Name
            </th>
            <th scope="col" aria-label="Active">
              Active
            </th>
            <th scope="col" aria-label="Action"></th>
          </tr>
        </thead>
        <tbody>
          {masterData.map(({ id, name, active }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{active ? "Yes" : "No"}</td>
              <td>
                {active ? (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => handleActivation(id)}
                    disabled={isDeactivating}
                  >
                    <CircleOff /> Deactivate
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => handleActivation(id)}
                    disabled={isDeactivating}
                  >
                    <CircleCheck /> Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
