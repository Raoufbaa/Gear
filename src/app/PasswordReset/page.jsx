import ButtomHeader from "@/components/ButtomHeader/ButtomHeader";
import PasswordReset from "@/components/Password Reset/PasswordReset";
import React from "react";
import { Suspense } from "react";

function page() {
  return (
    <div>
      <Suspense>
        <PasswordReset />
      </Suspense>
      <ButtomHeader />
    </div>
  );
}

export default page;
