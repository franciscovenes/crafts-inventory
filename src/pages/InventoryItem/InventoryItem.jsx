import { Await, useLoaderData, useParams } from "react-router-dom";
// import styles from "./InventoryItem.module.css";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import { useState, Suspense } from "react";
import InventoryItemDetails from "../../features/inventory/components/InventoryItemDetails/InventoryItemDetails";
import { Form } from "lucide-react";
import ActionBtn from "../../components/ActionBtn/ActionBtn";
import { ACTION_BTN_VARIANT } from "../../components/ActionBtn/constants";
import EditControls from "../../features/inventory/components/EditControls/EditControls";
import ItemForm from "../../features/inventory/components/ItemForm/ItemForm";

export default function InventoryItem() {
  const { itemPromise, masterDataPromise } = useLoaderData();
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

  function handleStartEdit(item) {
    setIsEditing(true);
    setDraftItem(structuredClone(item));
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setDraftItem(emptyItem);
  }

  function handleUpdateItem(validatedData) {
    console.log("Save clicked!");
    console.log("Validated data: ", validatedData);
  }

  console.log("Draft Item: ", draftItem);

  return (
    <PageLayout title={`Item ${id}`}>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={itemPromise}>
          {(item) =>
            isEditing ? (
              <>
                <EditControls
                  formId="inventory-form"
                  onCancel={handleCancelEdit}
                />
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
                <EditControls
                  formId="inventory-form"
                  onCancel={handleCancelEdit}
                  mobile
                />
              </>
            ) : (
              <>
                <ActionBtn
                  onClick={() => handleStartEdit(item)}
                  variant={ACTION_BTN_VARIANT.SECONDARY}
                >
                  <Form />
                  Edit
                </ActionBtn>
                <InventoryItemDetails item={item} />
              </>
            )
          }
        </Await>
      </Suspense>
    </PageLayout>
  );
}
