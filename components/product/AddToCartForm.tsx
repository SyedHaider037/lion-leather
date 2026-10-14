"use client";

import { useActionState } from "react";

export type AddToCartState = { error: string | null };

/**
 * Wraps the product form so a failed add-to-cart shows a short message in
 * place instead of the generic error page. The server action returns the
 * state on failure and redirects to the cart on success.
 */
export function AddToCartForm({
  action,
  id,
  children,
}: {
  action: (
    prev: AddToCartState,
    formData: FormData,
  ) => Promise<AddToCartState>;
  id: string;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, { error: null });

  return (
    <form action={formAction} id={id} className="mt-12">
      {children}
      {state.error ? (
        <p role="alert" className="mt-4 text-center text-caption text-cognac">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
