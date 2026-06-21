import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-serif text-display font-light leading-none text-ink">
        404
      </p>
      <p className="mt-6 text-body font-light text-taupe">
        This page doesn’t exist or has moved.
      </p>
      <div className="mt-10">
        <ButtonLink href="/" variant="solid">
          Return to Home
        </ButtonLink>
      </div>
    </div>
  );
}
