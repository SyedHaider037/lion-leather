"use client";

import { useEffect } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-paper px-6 text-center">
      <h1 className="font-serif text-h1 font-light leading-none text-ink">
        Oops
      </h1>
      <p className="mt-6 text-body font-light text-taupe">
        Something went wrong on our side. Please try again.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <ButtonLink href="/" variant="outline">
          Return to Home
        </ButtonLink>
      </div>
    </div>
  );
}
