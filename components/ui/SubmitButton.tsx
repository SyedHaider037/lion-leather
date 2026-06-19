"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";

export function SubmitButton({
  children,
  pendingText = "…",
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & {
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  // Let listeners (e.g. the header cart count) know a cart form settled.
  useEffect(() => {
    if (wasPending.current && !pending) {
      window.dispatchEvent(new Event("cart:updated"));
    }
    wasPending.current = pending;
  }, [pending]);

  return (
    <Button type="submit" disabled={disabled || pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
