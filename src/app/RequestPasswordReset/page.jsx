import ButtomHeader from "@/components/ButtomHeader/ButtomHeader";
import RequestPassword from "@/components/Password Reset/RequestPassword";
import React from "react";

function page() {
  return (
    <div>
      <RequestPassword />
      <ButtomHeader />
    </div>
  );
}

export default page;
