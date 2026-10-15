import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-paper px-6 text-center">
      <h1 className="font-serif text-h1 font-light leading-none text-ink">
        <span aria-hidden>404</span>
        <span className="sr-only">Page not found</span>
      </h1>
      <p className="mt-6 text-body font-light text-taupe">
        This page doesn’t exist or has moved.
      </p>
      <div className="mt-10">
        <ButtonLink href="/collections" variant="solid">
          Back to shop
        </ButtonLink>
      </div>
    </div>
  );
}
