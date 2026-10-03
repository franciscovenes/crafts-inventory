import styles from "./CreateItem.module.css";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import { useLoaderData, useNavigate } from "react-router-dom";
import ItemForm from "../../features/inventory/components/ItemForm/ItemForm";
import { useState } from "react";
import ActionBtn from "../../components/ActionBtn/ActionBtn";
import { ACTION_BTN_VARIANT } from "../../components/ActionBtn/constants";
import { Save } from "lucide-react";
import { createEmptyItem } from "../../features/inventory/inventoryUtils";
import EditControls from "../../features/inventory/components/EditControls/EditControls";
import { insertItem } from "../../features/inventory/inventoryService";
import StatusMessage from "../../components/StatusMessage/StatusMessage";

export default function CreateItem() {
  let navigate = useNavigate();
  const { masterData } = useLoaderData();
  // console.log("Master data: ", masterData);

  const [draftItem, setDraftItem] = useState(() => createEmptyItem(masterData));
  const [message, setMessage] = useState(null);

  const handleInsertItem = async (validatedData) => {
    setMessage(null);

    try {
      const insertedId = await insertItem(validatedData);

      navigate(`/inventory/${insertedId}`, {
        state: {
          message: {
            type: "success",
            text: `Item created successfully.`,
          },
        },
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Unable to create item. Please try again",
      });
    }
  };
  return (
    <PageLayout title="Add new item">
      <EditControls>
        <ActionBtn
          type="submit"
          form="add-item-form"
          variant={ACTION_BTN_VARIANT.PRIMARY}
        >
          <Save />
          Save item
        </ActionBtn>
      </EditControls>
      {message && (
        <StatusMessage variant={message.type}>{message.text}</StatusMessage>
      )}
      <ItemForm
        onSave={handleInsertItem}
        formId="add-item-form"
        masterData={masterData}
        item={draftItem}
        setItem={setDraftItem}
      />
      {/* {The EditControls must be refactored to receive its buttons as children and serve only for styling} */}
      <EditControls mobile>
        <ActionBtn
          type="submit"
          form="add-item-form"
          variant={ACTION_BTN_VARIANT.PRIMARY}
        >
          <Save />
          Save item
        </ActionBtn>
      </EditControls>
      {message && (
        <StatusMessage variant={message.type} mobile>
          {message.text}
        </StatusMessage>
      )}
    </PageLayout>
  );
}
