import { useAuth } from "react-oidc-context";

export const Logout = () => {
  const auth = useAuth();
  return (
    <button
      onClick={() => {
        auth.signoutSilent();
        localStorage.clear();
        window.location.href = "/";
      }}
    >
      Logout
    </button>
  );
};
