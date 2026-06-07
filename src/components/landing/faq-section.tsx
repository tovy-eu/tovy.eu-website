import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import type { Dictionary } from '@/lib/get-dictionary';
import { SectionHeader } from './section-header';
import { ScrollReveal } from '../scroll-reveal';
import { JsonLd, getFaqSchema } from '@/components/layout/json-ld';

const FaqSection = ({ dict }: { dict: Dictionary }) => {
    return (
        <section className="relative w-full flex flex-col justify-center bg-gradient-to-b from-background to-accent/5 py-24 overflow-hidden scroll-mt-16 md:scroll-mt-20">
            <JsonLd type="FAQPage" data={getFaqSchema(dict)} />
            <div className="relative mx-auto max-w-4xl px-4 md:px-8 z-10 w-full">
                <SectionHeader 
                  index="04"
                  badge={dict.faq.badge}
                  title={dict.faq.title}
                  className="mb-16"
                />

                <ScrollReveal delay="duration-700" className="flex">
                    <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
                        <div className="relative h-full w-full bg-card rounded-[calc(1.5rem-1px)] p-5 md:p-10 flex flex-col transition-all duration-300 shadow-2xl border border-white/10 group-hover:border-transparent overflow-hidden">
                            <Accordion type="single" collapsible className="w-full">
                                {dict.faq.categories.flatMap((category: { name: string; questions: { question: string; answer: string }[] }, catIndex: number) => 
                                    category.questions.map((item: { question: string; answer: string }, qIndex: number) => (
                                        <AccordionItem key={`${catIndex}-${qIndex}`} value={`item-${catIndex}-${qIndex}`} className="border-white/5">
                                            <AccordionTrigger className="text-left text-[13px] md:text-base font-bold text-white/80 hover:text-white transition-colors py-4 md:py-5 tracking-tight">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div 
                                                    className="prose prose-invert prose-sm max-w-none text-white/50 leading-[1.6] tracking-tight pb-2 md:pb-4" 
                                                    dangerouslySetInnerHTML={{ __html: item.answer }} 
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))
                                )}
                            </Accordion>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default FaqSection;