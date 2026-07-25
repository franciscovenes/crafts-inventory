import { Await, useLoaderData, useNavigation } from "react-router-dom";
import styles from "./Inventory.module.css";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import InventoryTable from "../../features/inventory/InventoryList/InventoryTable";
import { Suspense } from "react";
import InventoryCards from "../../features/inventory/InventoryList/InventoryCards";
import Pagination from "../../features/inventory/Pagination/Pagination";
export default function Inventory() {
  const { pageSize, data } = useLoaderData();

  const navigation = useNavigation();

  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === "/inventory";

  return (
    <PageLayout title="Inventory">
      <section className={styles.section}>
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={data}>
            {({ items, total }) => (
              <>
                <Pagination total={total} pageSize={pageSize} />
                <div className={isLoading ? styles.loading : ""}>
                  <InventoryCards items={items} />
                  <InventoryTable items={items} />
                </div>
              </>
            )}
          </Await>
        </Suspense>
      </section>
    </PageLayout>
  );
}
