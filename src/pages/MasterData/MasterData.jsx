import { useState, useCallback, useRef } from "react";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import styles from "./MasterData.module.css";
import { useLoaderData, useRevalidator } from "react-router-dom";
import CheckExistence from "../../features/master-data/components/CheckExistence/CheckExistence";
import AddBtn from "../../features/master-data/components/AddBtn/AddBtn";
import { insertMasterData } from "../../features/master-data/masterDataService";
import { normalizeMasterDataValue } from "../../features/master-data/masterDataUtils";

export default function MasterData() {
  const { masterData } = useLoaderData();
  const revalidator = useRevalidator();

  const hasEditedSinceSubmit = useRef({
    models: false,
    types: false,
    artisans: false,
    conditions: false,
    states: false,
  });

  const [formValues, setFormValues] = useState({
    models: "",
    types: "",
    artisans: "",
    states: "",
    conditions: "",
  });

  //console.log("Form values: ", formValues);

  const [existence, setExistence] = useState({
    models: null,
    types: null,
    artisans: null,
    states: null,
    conditions: null,
  });

  // console.log("Existence: ", existence);

  const [isSubmitting, setIsSubmitting] = useState({
    models: false,
    types: false,
    artisans: false,
    states: false,
    conditions: false,
  });

  const [submitMsg, setSubmitMsg] = useState({
    models: { success: false, message: "" },
    types: { success: false, message: "" },
    artisans: { success: false, message: "" },
    states: { success: false, message: "" },
    conditions: { success: false, message: "" },
  });

  const handleInputValues = (event) => {
    const { name, value } = event.target;

    if (!hasEditedSinceSubmit.current[name]) {
      setSubmitMsg((prevState) => ({
        ...prevState,
        [name]: { success: false, message: "" },
      }));
    }

    hasEditedSinceSubmit.current[name] = true;

    setExistence((prevState) => ({
      ...prevState,
      [name]: null,
    }));

    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onExistenceChange = useCallback((category, existenceValue) => {
    setExistence((prevState) => ({
      ...prevState,
      [category]: existenceValue,
    }));
  }, []);

  const handleSubmit = async (event, category) => {
    event.preventDefault();
    let payload = normalizeMasterDataValue(formValues[category]);

    if (!payload || existence[category] !== "available") {
      return;
    }

    setIsSubmitting((prevState) => ({
      ...prevState,
      [category]: true,
    }));

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
        setFormValues((prevState) => ({
          ...prevState,
          [category]: "",
        }));

        setExistence((prevState) => ({
          ...prevState,
          [category]: null,
        }));

        setSubmitMsg((prevState) => ({
          ...prevState,
          [category]: {
            success: true,
            message: `${payload} successfully added.`,
          },
        }));

        revalidator.revalidate();
      }
    } catch (error) {
      console.error(error);
      setSubmitMsg((prevState) => ({
        ...prevState,
        [category]: {
          success: false,
          message: `${payload} wasn't submitted. Please try again.`,
        },
      }));
    } finally {
      hasEditedSinceSubmit.current[category] = false;
      setIsSubmitting((prevState) => ({
        ...prevState,
        [category]: false,
      }));
    }
  };

  return (
    <PageLayout title="Manage master data">
      <section className={styles.addMasterData}>
        <h2>Add master data</h2>
        <div className={styles.formsBox}>
          {/* Models form */}
          <form
            className={styles.form}
            onSubmit={(event) => handleSubmit(event, "models")}
          >
            <label className={styles.labelField} htmlFor="models">
              Model:
            </label>
            <input
              type="text"
              id="models"
              name="models"
              onChange={handleInputValues}
              value={formValues.models}
              disabled={isSubmitting.models}
            />
            <AddBtn
              disabled={existence.models !== "available" || isSubmitting.models}
            />
            <CheckExistence
              category="models"
              value={formValues.models}
              masterData={masterData.models}
              existence={existence.models}
              onExistenceChange={onExistenceChange}
            />
            <span
              className={`${styles.submitMsg} ${submitMsg.models.success ? styles.success : styles.error}`}
            >
              {submitMsg.models.message}
            </span>
          </form>
          {/* Types form */}
          <form
            className={styles.form}
            onSubmit={(event) => handleSubmit(event, "types")}
          >
            <label className={styles.labelField} htmlFor="types">
              Type:
            </label>
            <input
              type="text"
              id="types"
              name="types"
              onChange={handleInputValues}
              value={formValues.types}
              disabled={isSubmitting.types}
            />
            <AddBtn
              disabled={existence.types !== "available" || isSubmitting.types}
            />
            <CheckExistence
              category="types"
              value={formValues.types}
              masterData={masterData.types}
              existence={existence.types}
              onExistenceChange={onExistenceChange}
            />
            <span
              className={`${styles.submitMsg} ${submitMsg.types.success ? styles.success : styles.error}`}
            >
              {submitMsg.types.message}
            </span>
          </form>
          {/* Artisans form */}
          <form
            className={styles.form}
            onSubmit={(event) => handleSubmit(event, "artisans")}
          >
            <label className={styles.labelField} htmlFor="artisans">
              Artisan:
            </label>
            <input
              type="text"
              id="artisans"
              name="artisans"
              onChange={handleInputValues}
              value={formValues.artisans}
              disabled={isSubmitting.artisans}
            />
            <AddBtn
              disabled={
                existence.artisans !== "available" || isSubmitting.artisans
              }
            />
            <CheckExistence
              category="artisans"
              value={formValues.artisans}
              masterData={masterData.artisans}
              existence={existence.artisans}
              onExistenceChange={onExistenceChange}
            />
            <span
              className={`${styles.submitMsg} ${submitMsg.artisans.success ? styles.success : styles.error}`}
            >
              {submitMsg.artisans.message}
            </span>
          </form>
          {/* States form */}
          <form
            className={styles.form}
            onSubmit={(event) => handleSubmit(event, "states")}
          >
            <label className={styles.labelField} htmlFor="states">
              State:
            </label>
            <input
              type="text"
              id="states"
              name="states"
              onChange={handleInputValues}
              value={formValues.states}
              disabled={isSubmitting.states}
            />
            <AddBtn
              disabled={existence.states !== "available" || isSubmitting.states}
            />
            <CheckExistence
              category="states"
              value={formValues.states}
              masterData={masterData.states}
              existence={existence.states}
              onExistenceChange={onExistenceChange}
            />
            <span
              className={`${styles.submitMsg} ${submitMsg.states.success ? styles.success : styles.error}`}
            >
              {submitMsg.states.message}
            </span>
          </form>
          {/* Conditions form */}
          <form
            className={styles.form}
            onSubmit={(event) => handleSubmit(event, "conditions")}
          >
            <label className={styles.labelField} htmlFor="conditions">
              Condition:
            </label>
            <input
              type="text"
              id="conditions"
              name="conditions"
              onChange={handleInputValues}
              value={formValues.conditions}
              disabled={isSubmitting.conditions}
            />
            <AddBtn
              disabled={
                existence.conditions !== "available" || isSubmitting.conditions
              }
            />
            <CheckExistence
              category="conditions"
              value={formValues.conditions}
              masterData={masterData.conditions}
              existence={existence.conditions}
              onExistenceChange={onExistenceChange}
            />
            <span
              className={`${styles.submitMsg} ${submitMsg.conditions.success ? styles.success : styles.error}`}
            >
              {submitMsg.conditions.message}
            </span>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}
