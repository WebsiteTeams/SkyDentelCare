"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/types";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="border-t border-border">
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question} className="border-b border-border last:border-b">
          <AccordionTrigger className="rounded-none py-6 font-serif text-xl font-normal text-navy hover:no-underline md:text-2xl [&>svg]:size-5 [&>svg]:text-teal">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-2xl pb-7 text-base leading-relaxed text-charcoal">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
