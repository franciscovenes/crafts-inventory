import { Await, useLoaderData, useParams } from "react-router-dom";
import styles from "./InventoryItem.module.css";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import { useState, Suspense } from "react";
import InventoryItemDetails from "../../features/inventory/components/InventoryItemDetails/InventoryItemDetails";
import InventoryItemForm from "../../features/inventory/components/InventoryItemForm/InventoryItemForm";

export default function InventoryItem() {
  const { itemPromise, masterDataPromise } = useLoaderData();
  const { id } = useParams();

  const [draftItem, setDraftItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  function handleStartEdit(item) {
    setIsEditing((prevState) => {
      setIsEditing(true);
      setDraftItem(structuredClone(item));
    });
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setDraftItem(null);
  }

  return (
    <PageLayout title={`Item ${id}`}>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={itemPromise}>
          {(item) =>
            isEditing ? (
              <Await resolve={masterDataPromise}>
                {(masterData) => (
                  <>
                    <button type="submit" form="inventory-form">
                      Update Item
                    </button>
                    <button type="button" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                    <InventoryItemForm
                      item={draftItem}
                      setItem={setDraftItem}
                      masterData={masterData}
                    />
                  </>
                )}
              </Await>
            ) : (
              <>
                <button type="button" onClick={() => handleStartEdit(item)}>
                  Edit
                </button>
                <InventoryItemDetails item={item} />
              </>
            )
          }
        </Await>
      </Suspense>
    </PageLayout>
  );
}

{
  /* <>
              <button type="button" onClick={() => handleEditClick(item)}>
                {isEditing ? "Close edit" : "Edit item"}
              </button>
              {isEditing ? (
                <InventoryItemForm item={draftItem} />
              ) : (
                <InventoryItemDetails item={item} />
              )}
            </> */
}
