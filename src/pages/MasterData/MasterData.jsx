import { useState, useMemo } from "react";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import styles from "./MasterData.module.css";
import { useDebounce } from "../../utils/utils";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { CircleCheck, BadgeAlert } from "lucide-react";

const DELAY = 500;

export default function MasterData() {
  const { masterData } = useLoaderData();
  // console.log(masterData);

  const [formValues, setFormValues] = useState({
    models: "",
  });
  // console.log("Form values: ", formValues);

  const [checkCategory, setCheckCategory] = useState(null);
  // console.log("check category: ", checkCategory);

  const debounceTarget = useMemo(
    () => ({
      category: checkCategory,
      value: checkCategory ? formValues[checkCategory] : null,
    }),
    [checkCategory, formValues[checkCategory]],
  );

  const debounced = useDebounce(debounceTarget, DELAY);

  const [existence, setExistence] = useState({
    models: null,
  });

  useEffect(() => {
    if (debounced.category) {
      if (debounced.value) {
        const valueExists = masterData[debounced.category].some(
          (obj) =>
            obj.name.trim().toLowerCase() ===
            debounced.value.trim().toLowerCase(),
        );
        if (valueExists) {
          setExistence((prevState) => ({
            ...prevState,
            [debounced.category]: "exists",
          }));
        } else {
          setExistence((prevState) => ({
            ...prevState,
            [debounced.category]: "available",
          }));
        }
      } else {
        setExistence((prevState) => ({
          ...prevState,
          [debounced.category]: null,
        }));
      }
    }
  }, [debounced, masterData]);

  const handleInputValues = (event) => {
    const { name, value } = event.target;
    setExistence((prevState) => ({
      ...prevState,
      [name]: null,
    }));
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setCheckCategory(name);
  };
  return (
    <PageLayout title="Manage master data">
      <section className={styles.addMasterData}>
        <h2>Add master data</h2>
        <div className={styles.formsBox}>
          <form className={styles.form}>
            <label htmlFor="model">Model:</label>
            <input
              type="text"
              id="model"
              name="models"
              onChange={handleInputValues}
              value={formValues.models}
            />
            <button type="submit">Add</button>
            <div className={styles.checkExistence}>
              {existence[debounced.category] !== null ? (
                existence[debounced.category] !== "exists" ? (
                  <span
                    className={`${styles.existenceMsg} ${styles.available}`}
                  >
                    <CircleCheck />
                    Available
                  </span>
                ) : (
                  <span className={`${styles.existenceMsg} ${styles.exists}`}>
                    <BadgeAlert />
                    Already exists
                  </span>
                )
              ) : null}
            </div>
            <span>Submit message goes in here...</span>
          </form>
          {/* Remaining forms */}
        </div>
      </section>
    </PageLayout>
  );
}
