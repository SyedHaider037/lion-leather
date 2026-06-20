import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-espresso px-6 text-center">
      <p className="font-serif text-display font-light leading-none text-ink">
        404
      </p>
      <p className="mt-6 text-body font-light text-stone">
        This page doesn’t exist or has moved.
      </p>
      <div className="mt-10">
        <ButtonLink href="/" variant="outline">
          Return to Home
        </ButtonLink>
      </div>
    </div>
  );
}
