import { CookiesProvider } from "next-client-cookies/server";

export const ClientCookiesProvider: typeof CookiesProvider = async (props) => (
  <CookiesProvider {...props} />
);