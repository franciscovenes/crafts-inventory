import { redirect } from "react-router-dom";
import { authContext } from "./routerContext";

export function requireActiveUser(context) {
  const user = context.get(authContext);

  if (!user?.active) {
    throw redirect("/login");
  }

  return user;
}
