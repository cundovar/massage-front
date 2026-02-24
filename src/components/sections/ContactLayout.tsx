"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ContactForm } from "./ContactForm";
import type { ContactInfosContent } from "@/types";

interface ContactLayoutProps {
  content: ContactInfosContent;
}

export function ContactLayout({ content }: ContactLayoutProps) {
  const street = content?.address?.street ?? "";
  const city = content?.address?.city ?? "";
  const phone = content?.phone ?? "";
  const email = content?.email ?? "";
  const hours = content?.hours ?? [];

  return (
    <section className="mx-auto max-w-6xl px-6 py-12" data-animate="section">
      {/* Layout flex : Info à gauche, Form à droite sur desktop */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Colonne gauche : Informations pratiques */}
        <div className="lg:w-2/5">
          <ScrollReveal>
            <div
              className="h-full rounded-2xl p-8"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
              }}
            >
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-title)" }}
              >
                Informations pratiques
              </h2>

              <div className="mt-8 space-y-8">
                {/* Adresse */}
                {(street || city) && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-[var(--text-primary)]">
                      <svg className="h-5 w-5 text-[var(--primary-start)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Adresse
                    </h3>
                    <p className="text-[var(--text-secondary)]">{street}</p>
                    <p className="text-[var(--text-secondary)]">{city}</p>
                  </div>
                )}

                {/* Contact */}
                {(phone || email) && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-[var(--text-primary)]">
                      <svg className="h-5 w-5 text-[var(--primary-start)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact
                    </h3>
                    {phone && <p className="text-[var(--text-secondary)]">Tel : {phone}</p>}
                    {email && (
                      <p className="text-[var(--text-secondary)]">
                        <a href={`mailto:${email}`} className="transition-colors hover:text-[var(--primary-start)]">
                          {email}
                        </a>
                      </p>
                    )}
                  </div>
                )}

                {/* Horaires */}
                {hours.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-[var(--text-primary)]">
                      <svg className="h-5 w-5 text-[var(--primary-start)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Horaires
                    </h3>
                    <ul className="space-y-2 text-[var(--text-secondary)]">
                      {hours.map((row) => (
                        <li key={row.days} className="flex justify-between">
                          <span>{row.days}</span>
                          <span className="font-medium">{row.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Colonne droite : Formulaire de contact */}
        <div className="lg:w-3/5">
          <ScrollReveal delay={0.1}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
