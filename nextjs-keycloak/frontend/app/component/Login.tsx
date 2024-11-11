"use client";

import { redirect } from "next/dist/client/components/redirect";

export const Login = () => {
  return (
    <button
      onClick={() => {
        redirect("/welcome");
      }}
    >
      Login
    </button>
  );
};
