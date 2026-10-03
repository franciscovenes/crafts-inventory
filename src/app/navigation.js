export const navigation = [
  {
    to: "/",
    label: "Home",
    end: true,
  },
  {
    to: "/create",
    label: "Create item",
  },
  {
    to: "/inventory",
    label: "Inventory",
  },
  {
    to: "/admin/master-data",
    label: "Master Data",
    requiredRole: "admin",
  },
];
