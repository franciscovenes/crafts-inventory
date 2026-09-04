import styles from "./Home.module.css";
import { Await, Link, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
// import { AuthenticationContext } from "../../features/auth/AuthProvider";
import { useCurrentUser } from "../../features/auth/useCurrentUser";
import PageLayout from "../../layouts/PageLayout/PageLayout.jsx";
import InventoryTable from "../../features/inventory/components/InventoryTable/InventoryTable.jsx";
import InventoryCards from "../../features/inventory/components/InventoryCards/InventoryCards.jsx";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // const { currentUser } = useContext(AuthenticationContext);
  const currentUser = useCurrentUser();

  const { recentItemsPromise } = useLoaderData();

  return (
    <PageLayout title="Dashboard">
      <section className={styles.section}>
        <h2>Recent Items</h2>
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={recentItemsPromise}>
            {({ items }) => {
              const mobileRecentItems = items.slice(0, 3);
              return (
                <>
                  <InventoryTable items={items} />
                  <InventoryCards items={mobileRecentItems} />
                </>
              );
            }}
          </Await>
        </Suspense>
        <Link className={styles.allItems} to="/inventory">
          See all items
          <ArrowRight />
        </Link>
      </section>
    </PageLayout>
  );
}
