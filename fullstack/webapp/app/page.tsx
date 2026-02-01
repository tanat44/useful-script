"use client"

import { WebStorageStateStore } from "oidc-client-ts";
import App from "./app";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { useEffect } from "react";

const oidcConfig: AuthProviderProps = {
  authority: "http://localhost:9000/application/o/webaoo",
  client_id: "U3kvBTWINMgA18JJkmqdaH6YjYWExGSZvUAsOgOb",
  redirect_uri:
    "http://localhost:3000",
  scope: "openid email profile",
  userStore: typeof window !== "undefined" ? new WebStorageStateStore({ store:  window?.localStorage }) : undefined,
};

export default function Home() {

  useEffect(() => {

  }, [])

  return (
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  );
}
