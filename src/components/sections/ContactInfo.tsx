import type { ContactInfosContent } from "@/types";

interface ContactInfoProps {
  content: ContactInfosContent;
}

export function ContactInfo({ content }: ContactInfoProps) {
  const street = content?.address?.street ?? "";
  const city = content?.address?.city ?? "";
  const phone = content?.phone ?? "";
  const email = content?.email ?? "";

  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-sm">
      <h2 className="block-title">Informations pratiques</h2>
      {street || city ? (
        <>
          <p className="block-body mt-4">{street}</p>
          <p className="block-body">{city}</p>
        </>
      ) : null}
      {phone ? <p className="block-body mt-4">Tel: {phone}</p> : null}
      {email ? <p className="block-body">Email: {email}</p> : null}
      {content.hours?.length ? (
        <ul className="block-body mt-4 space-y-2">
          {content.hours.map((row) => (
            <li key={row.days}>
              {row.days}: {row.hours}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
