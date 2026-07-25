import styles from "./Home.module.css";
import { Await, useLoaderData } from "react-router-dom";
// import logo from "/img/logo.png";
// import RegisterUser from "../../components/RegisterUser";
// import Fade from "../../components/Fade";
import {
  // useState,
  // useContext,
  Suspense,
} from "react";
// import { AuthenticationContext } from "../../features/auth/AuthProvider";
import { useCurrentUser } from "../../features/auth/useCurrentUser";
import PageLayout from "../../layouts/PageLayout/PageLayout.jsx";
import InventoryTable from "../../features/inventory/InventoryList/InventoryTable.jsx";
import InventoryCards from "../../features/inventory/InventoryList/InventoryCards.jsx";

export default function Home() {
  // const { currentUser } = useContext(AuthenticationContext);
  const currentUser = useCurrentUser();

  const { items } = useLoaderData();

  return (
    <PageLayout title="Dashboard">
      <section className={styles.section}>
        <h2>Recent Items</h2>
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={items}>
            {(items) => {
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
      </section>
    </PageLayout>
  );
}
