import { Await, useLoaderData, useParams } from "react-router-dom";
import styles from "./InventoryItem.module.css";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import { useState } from "react";
import { Suspense } from "react";

export default function InventoryItem() {
  const { itemPromise } = useLoaderData();
  console.log(itemPromise);
  const { id } = useParams();

  const [editableItem, setEditableItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <PageLayout title={`Item ${id}`}>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={itemPromise}>
          {(item) =>
            isEditing ? <div>Editable Form</div> : <div>Item details</div>
          }
        </Await>
      </Suspense>
    </PageLayout>
  );
}
