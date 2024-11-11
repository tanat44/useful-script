"use client";

import { AuthProvider } from "react-oidc-context";
import { AuthTemplate } from "../component/AuthTemplate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const oidcConfig = {
  authority: "http://localhost:8080/realms/tanut-company",
  client_id: "webapp",
  redirect_uri: "http://localhost:3000/welcome",
  onSigninCallback: () => {
    window.location.href = "/welcome";
  },
  onSignoutCallback: () => {
    window.location.href = "/";
  },
};

export default function HomePage() {
  return (
    <>
      <AuthProvider {...oidcConfig}>
        <AuthTemplate>welcome</AuthTemplate>
      </AuthProvider>
    </>
  );
}
