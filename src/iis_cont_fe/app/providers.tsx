import { ClientCookiesProvider } from "./cookies";
import { AuthProvider } from "@/contexts/AuthContext";
import { cookies } from "next/headers";

export async function Providers({ children }: React.PropsWithChildren) {
    const cookieList = (await cookies()).getAll();
  return (
    <ClientCookiesProvider >
      <AuthProvider>{children}</AuthProvider>
    </ClientCookiesProvider>
  );
}