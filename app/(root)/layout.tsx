import { UserButton } from "@clerk/nextjs";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-7xl px-4">
        <UserButton />
      {children}
    </div>
  );
};

export default RootLayout;