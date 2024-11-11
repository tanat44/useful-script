import { ReactNode } from "react";
import { useAuth } from "react-oidc-context";
import { Logout } from "./Logout";

type Props = {
  children: ReactNode;
};

export function AuthTemplate({ children }: Props) {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        Hello {`${auth.user?.profile.name}`}
        <Logout />
      </div>
    );
  } else {
    auth.signinRedirect();
  }

  return <>{children}</>;
}
