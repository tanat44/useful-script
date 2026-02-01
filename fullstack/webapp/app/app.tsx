"use client"

import React from "react";
import { useAuth, hasAuthParams } from "react-oidc-context";

function App() {
    const auth = useAuth();
    const hasTriedSignin = React.useRef(false);

    // automatically sign-in
    React.useEffect(() => {
        if (!hasAuthParams() &&
            !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
            !hasTriedSignin.current
        ) {
            auth.signinRedirect();
            hasTriedSignin.current = true;
        }
    }, [auth]);

    if (auth.isLoading) {
        return <div>Signing you in/out...</div>;
    }

    if (!auth.isAuthenticated) {
      if (auth.error?.message === "No matching state found in storage")
          auth.signinRedirect()
        return <div>Unable to log in</div>;
    }

    return <button onClick={() => void auth.removeUser()}>Log out</button>;
}

export default App;