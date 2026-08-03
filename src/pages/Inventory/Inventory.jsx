import { Await, useLoaderData, useNavigation } from "react-router-dom";
import styles from "./Inventory.module.css";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import InventoryTable from "../../features/inventory/components/InventoryTable/InventoryTable";
import { Suspense } from "react";
import InventoryCards from "../../features/inventory/components/InventoryCards/InventoryCards";
import Pagination from "../../features/inventory/components/Pagination/Pagination";
import SearchItems from "../../features/inventory/components/SearchItems/SearchItems";
export default function Inventory() {
  const { pageSize, dataPromise, masterDataPromise } = useLoaderData();

  const navigation = useNavigation();

  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === "/inventory";

  return (
    <PageLayout title="Inventory">
      <section className={styles.section}>
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={masterDataPromise}>
            {(masterData) => <SearchItems masterData={masterData} />}
          </Await>
          <Await resolve={dataPromise}>
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
