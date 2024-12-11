import React from "react";
import { Handle } from "@xyflow/react";
import { cn } from "./lib/utils";

export const BaseHandle = React.forwardRef(({ className, ...props }, ref) => (
  <Handle ref={ref} className={cn("", className)} {...props} />
));
BaseHandle.displayName = "BaseHandle";
