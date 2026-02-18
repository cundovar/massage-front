import { ContactCTA } from "@/components/sections/ContactCTA";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { HeroCompact } from "@/components/sections/HeroCompact";
import { getImageUrl, getPage, getSectionContent, getSettings } from "@/lib/api";
import { DEFAULT_CONTACT } from "@/lib/defaultContent";
import type { ContactHeroContent, ContactInfosContent } from "@/lib/api";

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("contact"), getSettings()]);
  const heroContent = getSectionContent<ContactHeroContent>(page, "hero", DEFAULT_CONTACT.hero);
  const pageInfos = getSectionContent<ContactInfosContent>(page, "infos", DEFAULT_CONTACT.infos);
  const infosContent: ContactInfosContent = {
    address: {
      street: settings.contact.address.street || pageInfos.address?.street || DEFAULT_CONTACT.infos.address.street,
      city:
        [settings.contact.address.postalCode, settings.contact.address.city].filter(Boolean).join(" ") ||
        pageInfos.address?.city ||
        DEFAULT_CONTACT.infos.address.city,
    },
    phone: settings.contact.phone || pageInfos.phone || DEFAULT_CONTACT.infos.phone,
    email: settings.contact.email || pageInfos.email || DEFAULT_CONTACT.infos.email,
    hours: settings.hours.schedule.length > 0 ? settings.hours.schedule : pageInfos.hours || DEFAULT_CONTACT.infos.hours,
  };
  const heroImageUrl = getImageUrl(heroContent.image);
  const mapEmbed = settings.contact.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999457739055!2d2.3509873!3d48.856614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fdf2e4b5f3b%3A0x2b6f8e3c4a5b2f1b!2sParis!5e0!3m2!1sfr!2sfr!4v1710000000000";

  return (
    <main className="page-transition">
      <HeroCompact title={heroContent.title} imageUrl={heroImageUrl} />

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-2" data-animate="section">
        <ContactInfo content={infosContent} />
        <ContactForm />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20" data-animate="section">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
          <iframe
            title="Map"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapEmbed}
          />
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}
