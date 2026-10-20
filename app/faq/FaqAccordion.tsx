"use client";

import { useState } from "react";

import { cn } from "@/lib/utils/cn";

type FaqSection = {
  heading: string;
  items: { q: string; a: string }[];
};

const SECTIONS: FaqSection[] = [
  {
    heading: "Ordering & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders are dispatched within two working days. Within Pakistan, delivery arrives in three to five working days; international orders, seven to fourteen.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes — by tracked courier worldwide. Tracking details are shared as soon as your order is on its way.",
      },
      {
        q: "How do I know my order was placed?",
        a: "You receive an email confirmation immediately after checkout, followed by tracking once your order ships.",
      },
    ],
  },
  {
    heading: "Returns & Exchanges",
    items: [
      {
        q: "What is your return window?",
        a: "Unworn pieces may be returned within fourteen days of delivery, in their original condition and packaging.",
      },
      {
        q: "How do I exchange for another size?",
        a: "Return the original piece and place a new order, or message us on WhatsApp and we’ll arrange it with you directly.",
      },
      {
        q: "Who arranges return shipping?",
        a: "Reach out and we’ll guide you through the simplest option for your return or exchange.",
      },
    ],
  },
  {
    heading: "Payment Methods",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "Payment is taken securely at checkout, processed by Shopify. Your card details never touch our servers.",
      },
      {
        q: "Is my payment secure?",
        a: "Yes. All transactions are encrypted and handled by Shopify’s PCI-compliant checkout.",
      },
      {
        q: "Can I arrange another payment method?",
        a: "For alternative payment arrangements, message us on WhatsApp and we’ll do our best to help.",
      },
    ],
  },
];

export function FaqAccordion() {
  // Section-level accordion: only one section is open at a time.
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-14 border-t border-gold/30">
      {SECTIONS.map((section, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;

        return (
          <div key={section.heading} className="border-b border-gold/30">
            <h2>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-eyebrow uppercase text-ink transition-colors duration-200 ease-luxe hover:text-cognac"
              >
                {section.heading}
                <span
                  aria-hidden
                  className={cn(
                    "font-serif text-lg font-light text-taupe transition-[transform,color] duration-200 ease-luxe group-hover:text-cognac",
                    isOpen && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h2>

            <div
              id={panelId}
              inert={!isOpen}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-all duration-[260ms] ease-luxe motion-reduce:transition-none",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <dl className="space-y-6 pb-8">
                  {section.items.map((item) => (
                    <div key={item.q}>
                      <dt className="font-serif text-card font-light text-ink">
                        {item.q}
                      </dt>
                      <dd className="mt-2 text-body font-light text-taupe">
                        {item.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
