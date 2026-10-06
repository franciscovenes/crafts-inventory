import PageLayout from "../../layouts/PageLayout/PageLayout";
import styles from "./MasterData.module.css";
import { useLoaderData } from "react-router-dom";
import MasterDataSection from "../../features/master-data/components/MasterDataSection/MasterDataSection";
import CategoriesMenu from "../../features/master-data/components/CategoriesMenu/CategoriesMenu";

export default function MasterData() {
  const { masterData } = useLoaderData();

  return (
    <PageLayout title="Manage master data">
      <CategoriesMenu />
      <div className={styles.container}>
        <MasterDataSection category="models" masterData={masterData.models} />
        <MasterDataSection category="types" masterData={masterData.types} />
        <MasterDataSection
          category="artisans"
          masterData={masterData.artisans}
        />
        <MasterDataSection category="states" masterData={masterData.states} />
        <MasterDataSection
          category="conditions"
          masterData={masterData.conditions}
        />
      </div>
      <CategoriesMenu />
    </PageLayout>
  );
}
