import type { ContactInfosContent } from "@/types";

interface ContactInfoProps {
  content: ContactInfosContent;
}

export function ContactInfo({ content }: ContactInfoProps) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Informations pratiques</h2>
      <p className="mt-4 text-gray-600">{content.address.street}</p>
      <p className="text-gray-600">{content.address.city}</p>
      <p className="mt-4 text-gray-600">Tel: {content.phone}</p>
      <p className="text-gray-600">Email: {content.email}</p>
      {content.hours?.length ? (
        <ul className="mt-4 space-y-2 text-gray-600">
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
