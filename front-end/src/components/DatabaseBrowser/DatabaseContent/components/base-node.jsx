import React from "react";
import { cn }  from "./lib/utils";

export const BaseNode = React.forwardRef(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border bg-card p-5 text-card-foreground",
      className,
      selected ? "border-muted-foreground shadow-lg" : "",
      "hover:ring-1"
    )}
    tabIndex={0}
    {...props} />
));
BaseNode.displayName = "BaseNode";
