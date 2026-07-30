import {
  Await,
  useLoaderData,
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

export default function InventoryItem() {
  const { itemPromise, masterDataPromise } = useLoaderData();
  const revalidator = useRevalidator();
  const { id } = useParams();
  const emptyItem = {
    model_id: null,
    type_id: null,
    artisan_id: null,
    colors: [],
    condition_id: null,
    state_id: null,
    price: null,
    length_cm: null,
    width_cm: null,
    production_hours: null,
    location: null,
  };
  const [draftItem, setDraftItem] = useState(emptyItem);
  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState(null);

  const handleStartEdit = (item) => {
    setIsEditing(true);
    setDraftItem(structuredClone(item));
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
              {isEditing ? (
                <EditControls
                  formId="inventory-form"
                  onCancel={handleCancelEdit}
                />
              ) : (
                <ActionBtn
                  onClick={() => handleStartEdit(item)}
                  variant={ACTION_BTN_VARIANT.SECONDARY}
                >
                  <Form />
                  Edit
                </ActionBtn>
              )}

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

              {isEditing && (
                <EditControls
                  formId="inventory-form"
                  onCancel={handleCancelEdit}
                  mobile
                />
              )}
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
