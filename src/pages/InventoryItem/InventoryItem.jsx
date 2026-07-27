import { Await, useLoaderData, useParams } from "react-router-dom";
import styles from "./InventoryItem.module.css";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import { useState, Suspense } from "react";
import InventoryItemDetails from "../../features/inventory/components/InventoryItemDetails/InventoryItemDetails";

export default function InventoryItem() {
  const { itemPromise } = useLoaderData();
  const { id } = useParams();

  const [editableItem, setEditableItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <PageLayout title={`Item ${id}`}>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={itemPromise}>
          {(item) =>
            isEditing ? (
              <div>Editable Form</div>
            ) : (
              <InventoryItemDetails item={item} />
            )
          }
        </Await>
      </Suspense>
    </PageLayout>
  );
}
