import { TransitionLink } from "@/components/transitions/TransitionLink";

export function ContactCTA() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-r from-[#FFCE67] to-[#F67E54] text-white" data-animate="section">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 data-animate="title" className="text-4xl md:text-5xl font-serif mb-6">
          Prêt(e) à vous offrir<br />une pause bien-être ?
        </h2>
        <p data-animate="text" className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Réservez votre séance et découvrez les bienfaits d&apos;un massage personnalisé
        </p>
        <TransitionLink
          href="/contact"
          className="inline-flex px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:shadow-lg transition"
        >
          Prendre rendez-vous
        </TransitionLink>
      </div>
    </section>
  );
}
