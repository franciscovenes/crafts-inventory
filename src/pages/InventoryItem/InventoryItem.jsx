import {
  Await,
  useLoaderData,
  useLocation,
  useParams,
  useRevalidator,
} from "react-router-dom";
import styles from "./InventoryItem.module.css";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import { useState, Suspense } from "react";
import InventoryItemDetails from "../../features/inventory/components/InventoryItemDetails/InventoryItemDetails";
import { Form } from "lucide-react";
import ActionBtn from "../../components/ActionBtn/ActionBtn";
import { ACTION_BTN_VARIANT } from "../../components/ActionBtn/constants";
import EditControls from "../../features/inventory/components/EditControls/EditControls";
import ItemForm from "../../features/inventory/components/ItemForm/ItemForm";
import { updateItemById } from "../../features/inventory/inventoryService";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import { SavePen } from "lucide-react";
import { createEmptyItem } from "../../features/inventory/inventoryUtils";

export default function InventoryItem() {
  const { itemPromise, masterDataPromise } = useLoaderData();
  const revalidator = useRevalidator();
  const location = useLocation();
  const { id } = useParams();

  const emptyItem = createEmptyItem();

  const [draftItem, setDraftItem] = useState(emptyItem);
  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState(location.state?.message ?? null);

  const handleStartEdit = (item) => {
    setMessage(null);
    setDraftItem(structuredClone(item));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraftItem(emptyItem);
  };

  const handleUpdateItem = async (validatedData) => {
    setMessage(null);
    try {
      await updateItemById(id, validatedData);

      setMessage({
        type: "success",
        text: "Item updated successfully.",
      });
      revalidator.revalidate();
      handleCancelEdit();
    } catch (error) {
      console.error("Update item failed:", error);
      setMessage({
        type: "error",
        text: "Unable to update item. Please try again",
      });
    }
  };

  // console.log("Draft Item: ", draftItem);

  return (
    <PageLayout title={`Item ${id}`}>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={itemPromise}>
          {(item) => (
            <>
              {message && (
                <StatusMessage variant={message.type}>
                  {message.text}
                </StatusMessage>
              )}
              <EditControls>
                <ActionBtn
                  hidden={isEditing}
                  onClick={() => {
                    handleStartEdit(item);
                  }}
                >
                  <Form />
                  Edit
                </ActionBtn>
                <ActionBtn
                  hidden={!isEditing}
                  type="submit"
                  form="inventory-form"
                  variant={ACTION_BTN_VARIANT.PRIMARY}
                >
                  <SavePen />
                  Update
                </ActionBtn>
                <ActionBtn
                  hidden={!isEditing}
                  onClick={handleCancelEdit}
                  variant={ACTION_BTN_VARIANT.CANCEL}
                >
                  Cancel
                </ActionBtn>
              </EditControls>
              {/* Item content goes in here */}
              <div key={isEditing ? "edit" : "view"} className={styles.content}>
                {isEditing ? (
                  <Suspense fallback={<p>Loading form...</p>}>
                    <Await resolve={masterDataPromise}>
                      {(masterData) => (
                        <ItemForm
                          item={draftItem}
                          setItem={setDraftItem}
                          masterData={masterData}
                          onSave={handleUpdateItem}
                          formId="inventory-form"
                        />
                      )}
                    </Await>
                  </Suspense>
                ) : (
                  <InventoryItemDetails item={item} />
                )}
              </div>
              <EditControls mobile>
                <ActionBtn
                  hidden={isEditing}
                  onClick={() => {
                    handleStartEdit(item);
                  }}
                >
                  <Form />
                  Edit
                </ActionBtn>
                <ActionBtn
                  hidden={!isEditing}
                  type="submit"
                  form="inventory-form"
                  variant={ACTION_BTN_VARIANT.PRIMARY}
                >
                  <SavePen />
                  Update
                </ActionBtn>
                <ActionBtn
                  hidden={!isEditing}
                  onClick={handleCancelEdit}
                  variant={ACTION_BTN_VARIANT.CANCEL}
                >
                  Cancel
                </ActionBtn>
              </EditControls>
              {message && (
                <StatusMessage variant={message.type} mobile>
                  {message.text}
                </StatusMessage>
              )}
            </>
          )}
        </Await>
      </Suspense>
    </PageLayout>
  );
}
{
}
