import styles from "./Home.module.css";
import { Await, NavLink, useLoaderData } from "react-router-dom";
// import logo from "/img/logo.png";
import RegisterUser from "../../components/RegisterUser";
import Fade from "../../components/Fade";
import { useState, useContext, Suspense } from "react";
import { AuthenticationContext } from "../../features/auth/AuthProvider";
import { useCurrentUser } from "../../features/auth/useCurrentUser";
import RecentItemsTable from "../../components/RecentItemsTable/RecentItemsTable";
import RecentItemsCards from "../../components/RecentItemsCards/RecentItemsCards.jsx";
import PageLayout from "../../layouts/PageLayout/PageLayout.jsx";

export default function Home() {
  // const { currentUser } = useContext(AuthenticationContext);
  const currentUser = useCurrentUser();

  const { recentItems } = useLoaderData();

  return (
    <PageLayout title="Dashboard">
      <section className={styles.section}>
        <h2>Recent Items</h2>
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={recentItems}>
            {(items) => {
              const mobileRecentItems = items.slice(0, 3);
              return (
                <>
                  <RecentItemsTable items={items} />
                  <RecentItemsCards items={mobileRecentItems} />
                </>
              );
            }}
          </Await>
        </Suspense>
      </section>
    </PageLayout>
  );
}
