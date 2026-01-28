import * as React from "react";

import { cn } from "../../utils/cn";

export const Header = ({
  withBorder,
  withPadding,
  children,
  customCn,
}: {
  withBorder?: boolean;
  withPadding?: boolean;
  children: React.ReactNode;
  customCn?: string;
}) => {
  return (
    <>
      <h1
        className={cn(
          withBorder && "border-2 border-black",
          withPadding && "p-16",
          "text-8xl font-bold",
          customCn,
        )}
      >
        {children}
      </h1>
    </>
  );
};
