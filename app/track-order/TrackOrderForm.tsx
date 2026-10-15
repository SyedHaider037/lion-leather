"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

const WHATSAPP_URL = "https://wa.me/923000000000";

export function TrackOrderForm() {
  const [order, setOrder] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = `Hi Lion Leather, I'd like to track my order ${order}.`.trim();
    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      <label htmlFor="order" className="text-eyebrow uppercase text-ink">
        Order number
      </label>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <input
          id="order"
          name="order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          placeholder="e.g. #1024"
          className="w-full border-b border-ink/30 bg-transparent py-3 text-body font-light text-ink placeholder:text-taupe transition-colors duration-200 ease-luxe focus:border-cognac focus:outline-none"
        />
        <Button type="submit" className="sm:shrink-0">
          Track
        </Button>
      </div>
    </form>
  );
}
