export function ContactForm() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>Envoyer un message</h2>
      <form className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-gray-600" htmlFor="name">Nom</label>
          <input id="name" name="name" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3" />
        </div>
        <div>
          <label className="text-sm text-gray-600" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3" />
        </div>
        <div>
          <label className="text-sm text-gray-600" htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={5} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3" />
        </div>
        <button
          type="submit"
          className="button-lift inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffce67] to-[#f67e54] px-6 py-3 text-sm font-medium text-white"
        >
          Envoyer
        </button>
      </form>
    </section>
  );
}
